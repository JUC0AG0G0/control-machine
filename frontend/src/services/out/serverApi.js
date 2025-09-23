const API_URL = "http://10.6.251.38:3001";


///////////////////////////////////////////////////////////////// 
//                  Gestion des machines
///////////////////////////////////////////////////////////////// 

// Récupérer tous les serveurs
export async function getServers() {
  const response = await fetch(API_URL+"/servers");
  if (!response.ok) throw new Error("Erreur lors du fetch des serveurs");
  return response.json();
}

// Créer un nouveau serveur
export async function createServer(serverData) {
  const response = await fetch(API_URL+"/servers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serverData),
  });
  if (!response.ok) throw new Error("Erreur lors de la création du serveur");
  return response.json();
}


///////////////////////////////////////////////////////////////// 
//                  Gestion des images
///////////////////////////////////////////////////////////////// 

// Get all pictures
export async function getPictures() {
  const response = await fetch(API_URL+"/pictures");
  if (!response.ok) throw new Error("Erreur lors du fetch des images");
  return response.json();
}

// Create a new picture


///////////////////////////////////////////////////////////////// 
//                  Gestion des sons
///////////////////////////////////////////////////////////////// 

// Get all sounds
export async function getSounds() {
  const response = await fetch(API_URL+"/sounds");
  if (!response.ok) throw new Error("Erreur lors du fetch des sons");
  return response.json();
}

// Create a new sound


///////////////////////////////////////////////////////////////// 
//             Gestion des scripts javascript
///////////////////////////////////////////////////////////////// 

// Get all scripts javascript
export async function getJavascript() {
  const response = await fetch(API_URL+"/javascript");
  if (!response.ok) throw new Error("Erreur lors du fetch des scripts javascript");
  return response.json();
}

// Create a new script javascript

