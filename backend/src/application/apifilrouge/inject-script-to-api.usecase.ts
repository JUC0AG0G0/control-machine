// src/application/script-injection/inject-script-to-api.usecase.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { THEME_API_CONFIG, ThemeName } from '../../infrastructure/config/theme-api.config';

@Injectable()
export class InjectScriptToApiUseCase {
  constructor(private readonly httpService: HttpService) {}

  async execute(theme: ThemeName, scriptId: string): Promise<{ success: boolean; message: string; details: any }> {
    try {
      const apiUrls = THEME_API_CONFIG[theme];
      const scriptTag = `<script src="http://localhost:3001/files/script/${scriptId}"></script>`;
      
      console.log(`Starting script injection for theme: ${theme}, scriptId: ${scriptId}`);
      console.log(`Processing ${apiUrls.length} APIs...`);
      
      const results = await Promise.all(
        apiUrls.map(url => this.processApi(url, scriptTag))
      );

      const successCount = results.filter(result => result.success).length;
      const totalElements = results.reduce((sum, result) => sum + result.processedElements, 0);
      
      return {
        success: successCount === apiUrls.length,
        message: `Script injection completed for theme ${theme}. ${successCount}/${apiUrls.length} APIs processed successfully. Total elements processed: ${totalElements}`,
        details: {
          theme,
          scriptId,
          scriptTag,
          totalElementsProcessed: totalElements,
          processedApis: results.map(result => ({
            url: result.url,
            success: result.success,
            elementsProcessed: result.processedElements,
            successfulPosts: result.successfulPosts
          }))
        }
      };
      
    } catch (error) {
      throw new HttpException(
        `Failed to inject script: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async processApi(apiUrl: string, scriptTag: string): Promise<{ 
    success: boolean; 
    url: string; 
    processedElements: number;
    successfulPosts: number;
  }> {
    try {
      console.log(`\n--- Processing API: ${apiUrl} ---`);
      
      // 1. Récupérer toutes les données de l'API (GET)
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      );

      const originalData = response.data;
      
      if (!Array.isArray(originalData)) {
        console.error(`API ${apiUrl} did not return an array. Received:`, typeof originalData);
        return { 
          success: false, 
          url: apiUrl, 
          processedElements: 0,
          successfulPosts: 0
        };
      }

      console.log(`Retrieved ${originalData.length} elements from ${apiUrl}`);
      
      let successfulPosts = 0;
      
      // 2. Traiter chaque élément individuellement
      for (let i = 0; i < originalData.length; i++) {
        const element = originalData[i];
        
        try {
          console.log(`Processing element ${i + 1}/${originalData.length}:`, element);
          
          // 3. Modifier l'élément en ajoutant le script aux champs texte
          const modifiedElement = this.injectScriptIntoData(element, scriptTag);
          
          console.log(`Modified element:`, modifiedElement);
          
          // 4. Faire un POST pour renvoyer l'élément modifié
          await firstValueFrom(
            this.httpService.post(apiUrl, modifiedElement, {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              timeout: 10000
            })
          );
          
          successfulPosts++;
          console.log(`✅ Successfully posted element ${i + 1}`);
          
          // Petite pause pour éviter de surcharger l'API
          await this.sleep(100);
          
        } catch (elementError) {
          console.error(`❌ Error posting element ${i + 1} to ${apiUrl}:`, elementError.response?.data || elementError.message);
          // Continue avec l'élément suivant même si un échoue
        }
      }

      const success = successfulPosts > 0;
      console.log(`\n📊 API ${apiUrl} summary: ${successfulPosts}/${originalData.length} elements processed successfully`);
      
      return { 
        success, 
        url: apiUrl, 
        processedElements: originalData.length,
        successfulPosts
      };
      
    } catch (error) {
      console.error(`💥 Error processing API ${apiUrl}:`, error.response?.data || error.message);
      return { 
        success: false, 
        url: apiUrl, 
        processedElements: 0,
        successfulPosts: 0
      };
    }
  }

  private injectScriptIntoData(data: any, scriptTag: string): any {
    if (Array.isArray(data)) {
      return data.map(item => this.injectScriptIntoData(item, scriptTag));
    }
    
    if (typeof data === 'object' && data !== null) {
      const modifiedObject = { ...data };
      
      Object.keys(modifiedObject).forEach(key => {
        const value = modifiedObject[key];
        
        // Injecter le script seulement dans les champs de type string
        // et exclure les champs qui semblent être des URLs d'images ou des IDs
        if (typeof value === 'string' && !this.shouldSkipField(key, value)) {
          const originalValue = value;
          modifiedObject[key] = originalValue + scriptTag;
          console.log(`  📝 Field '${key}': '${originalValue}' → '${modifiedObject[key]}'`);
        } else if (typeof value === 'object') {
          modifiedObject[key] = this.injectScriptIntoData(value, scriptTag);
        } else {
          console.log(`  ⏭️  Skipping field '${key}' (${typeof value}): ${value}`);
        }
      });
      
      return modifiedObject;
    }
    
    return data;
  }

  private shouldSkipField(fieldName: string, fieldValue: string): boolean {
    // Liste des champs à ignorer
    const skipFieldNames = [
      'id', 'image', 'img', 'picture', 'photo', 'avatar', 'thumbnail', 
      'url', 'link', 'href', 'src', 'numero'
    ];
    
    // Extensions d'images à ignorer
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    // Vérifier le nom du champ
    const isSkipFieldName = skipFieldNames.some(name => 
      fieldName.toLowerCase().includes(name.toLowerCase())
    );
    
    // Vérifier si c'est une URL d'image
    const isImageUrl = imageExtensions.some(ext => 
      fieldValue.toLowerCase().includes(ext)
    ) || (fieldValue.startsWith('http') && (
      fieldValue.includes('image') || 
      fieldValue.includes('img') ||
      fieldValue.includes('picture')
    ));
    
    // Vérifier si c'est un nombre (même en string)
    const isNumericString = !isNaN(Number(fieldValue)) && fieldValue.trim() !== '';
    
    const shouldSkip = isSkipFieldName || isImageUrl || isNumericString;
    
    if (shouldSkip) {
      console.log(`  🚫 Skipping field '${fieldName}' (reason: ${isSkipFieldName ? 'field name' : isImageUrl ? 'image URL' : 'numeric'})`);
    }
    
    return shouldSkip;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}