// infrastructure/cron/machine-check.service.ts
import { Injectable, Inject } from '@nestjs/common';
import type { MachinesRepository } from '../../domain/repositories/machines.repository';
import { Client } from 'ssh2';

@Injectable()
export class MachineCheckService {
  private isChecking = false; // Empêche les exécutions simultanées

  constructor(
    @Inject('MachinesRepository')
    private readonly machineRepository: MachinesRepository,
  ) {}

  async checkMachines() {
    // Empêche les exécutions simultanées
    if (this.isChecking) {
      console.log('Vérification déjà en cours, skip...');
      return;
    }

    this.isChecking = true;

    try {
      const machines = await this.machineRepository.findAll();

      console.log('---------------------------------------------');
      console.log(`Démarrage de la vérification de ${machines.length} machines...`);
      console.log(new Date().toISOString());
      console.log('---------------------------------------------');

      // Traitement séquentiel pour éviter la surcharge réseau
      for (const machine of machines) {
        console.log(`Vérification de la machine ${machine.name} (${machine.ip})...`);
        try {
          await this.checkMachine(machine);
          console.log(`✅ Machine ${machine.name} vérifiée`);
        } catch (err) {
          console.error(`❌ Erreur machine ${machine.name}:`, err.message);
        }
      }

      console.log('---------------------------------------------');
      console.log('Vérification terminée.');
      console.log('---------------------------------------------');
    } catch (error) {
      console.error('Erreur globale lors de la vérification:', error);
    } finally {
      this.isChecking = false;
    }
  }

  private checkMachine(machine: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      let isResolved = false;

      // Timeout de sécurité
      const timeout = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          conn.destroy();
          machine.status = 'timeout';
          this.machineRepository.save(machine);
          resolve();
        }
      }, 10000); // 10 secondes max

      conn
        .on('ready', async () => {
          if (isResolved) return;
          isResolved = true;
          clearTimeout(timeout);
          
          machine.status = 'online';
          machine.last_seen = new Date();
          console.log(`Machine ${machine.name} est en ligne.`);
          
          try {
            await this.machineRepository.save(machine);
          } catch (err) {
            console.error(`Erreur sauvegarde ${machine.name}:`, err);
          }
          
          conn.end();
          resolve();
        })
        .on('error', async (err) => {
          if (isResolved) return;
          isResolved = true;
          clearTimeout(timeout);

          if (err.level === 'authentication') {
            machine.status = 'auth fail';
            console.log(`Échec d'authentification pour la machine ${machine.name}.`);
          } else if (err.code === 'ECONNREFUSED') {
            machine.status = 'ssh down';
            console.log(`Connexion refusée pour la machine ${machine.name}.`);
          } else {
            machine.status = 'offline';
            console.log(`Hôte injoignable pour la machine ${machine.name}.`);
          }
          
          try {
            await this.machineRepository.save(machine);
          } catch (saveErr) {
            console.error(`Erreur sauvegarde ${machine.name}:`, saveErr);
          }

          conn.destroy();
          resolve();
        })
        .on('end', () => {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(timeout);
            resolve();
          }
        })
        .connect({
          host: machine.ip,
          username: machine.username,
          password: machine.password,
          readyTimeout: 5000,
          keepaliveInterval: 0,
        });
    });
  }
}