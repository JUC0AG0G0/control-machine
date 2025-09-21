# Projet : Contrôle de PC à distance — Proposition d'architecture

Bonjour Jafar 👋

Voici une proposition complète (architecture logique, choix technos, schéma de fichiers, modèle de données et remarques d'implémentation) pour ton projet de contrôle à distance.

---

## Objectifs fonctionnels

* Contrôler des machines via SSH (terminal distant) et transférer des fichiers via SCP/SFTP.
* Fournir un terminal dans le navigateur (comme si tu étais en SSH).
* Exécuter actions sur la machine distante : changer le fond d'écran, ouvrir le bloc-notes, lire une vidéo/MP3, modifier le volume (sur une ou plusieurs machines en même temps).
* Ajouter des machines depuis le front.
* Stocker les machines en BDD : `(id, nom, ip, utilisateur, mot_de_passe)`.
* Pas de système d'authentification utilisateur (tu as demandé pas d'utilisateurs).
* Architecture simple, extensible, conforme aux principes de la Clean Architecture.

---

## Points importants / limites techniques

1. **SSH vs GUI** : SSH permet d'exécuter des commandes et transférer des fichiers. Mais *interagir avec l'interface graphique d'une session utilisateur active* (changer le wallpaper du bureau visible, lancer une fenêtre dans la session graphique d'un utilisateur connecté) est souvent problématique si tu te connectes à un shell non-interactif ou à une session de service. Pour garantir un contrôle GUI fiable, il est recommandé d'installer **un agent léger sur chaque machine** qui tourne dans la session utilisateur (ou en tant que service capable d'utiliser la session interactive) et qui reçoit des commandes (via tunnel SSH, WebSocket, ou autre) et exécute les actions GUI de manière native.

2. **Sécurité des mots de passe** : stocker des mots de passe en clair en base est dangereux. Même si tu veux pas de gestion d'utilisateurs, **il faut chiffrer** les identifiants (par exemple `AES-GCM` avec une key master côté serveur, ou mieux : stocker des clés SSH et préférer l'authentification par clé).

3. **Accès réseau** : Pour gérer des machines derrière NAT/pare-feu, l'approche la plus robuste est que l'agent sur la machine cliente **ouvre une connexion sortante sécurisée** (WebSocket/TCP/SSH reverse tunnel) vers ton serveur central, ainsi le serveur peut envoyer commandes sans ouvrir de port sur la machine cliente.

4. **Pas d'authentification utilisateur** : tu veux pas d'authentification — pas de problème fonctionnel, mais cela réduit la traçabilité et augmente le risque d'accès non désiré. Au minimum, sécurise l'API avec une clé d'API server-side (ou IP whitelist) et chiffre les secrets.

---

## Choix technos (ce que tu as proposé + recommandations)

* **Backend** : NestJS (excellente idée, structure modulaire, DI, bon pour Clean Architecture)
* **Frontend** : React + xterm.js (pour terminal web) + UI simple
* **DB** : **Postgres recommandé** pour ce besoin (schéma simple, recherches, transactions, contraintes). *Mongo* marche aussi si tu préfères documents, mais Postgres te donne plus de garanties (ACID) et facilite joigning/historique. Je fournis les deux modèles.
* **SSH & SFTP** : `ssh2` (Node) pour SSH/SFTP/SCP proxy
* **Terminal browser** : `xterm.js` + WebSocket (backend : proxy entre WebSocket et un client `ssh2` pty)
* **Agent optionnel** : petit agent Node/Python sur chaque machine (recommandé pour GUI actions) qui peut exposer une API locale et/ou s'inscrire auprès du serveur central.

---

## Architecture générale (vue haut-niveau)

Client React (navigateur)
↕ WebSocket / HTTP
API NestJS (gateway) — WebSocket / REST
├─ Terminal proxy (WS ↔ ssh2 pty)
├─ Machines service (CRUD machines en BDD)
├─ SSH service (connectivité, commandes, sftp)
├─ Agent manager (reverse-tunnel & heartbeat)
└─ DB (Postgres)

Agents (optionnel, sur chaque machine)

* Maintiennent connexion sortante au serveur (WS) et exécutent commandes GUI locales.

---

## Flux principaux

1. **Ajouter une machine** (Front -> API)

   * Front envoie (nom, ip, user, password/clés) -> API stocke en BDD (chiffré)
2. **Ouvrir terminal dans le navigateur**

   * Front ouvre WS `ws://server/terminal/:machineId`
   * Backend récupère machine, lance connexion SSH (ssh2) vers ip, alloue un pty et pipe les flux vers xterm.js via WS
3. **Envoyer fichier (SCP/SFTP)**

   * Front upload -> Backend utilise `ssh2.sftp()` vers la machine
4. **Actions GUI (change fond, open notepad, play mp3, régler volume)**

   * Si agent présent : Backend envoie commande via WS au agent -> agent exécute commandes natives (cross-platform)
   * Si pas d'agent : Backend exécute commandes SSH (ex. `gsettings` sur Linux, `powershell` sur Windows) mais fiabilité limitée pour GUI.
5. **Volume sur plusieurs machines**

   * Backend broadcast la commande `set-volume` via SSH (ou via agent) vers la liste de machines sélectionnées.

---

## Schéma de la base de données

### Option Postgres (recommandée)

```sql
CREATE TABLE machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ip inet NOT NULL,
  user text NOT NULL,
  password text NOT NULL,
  has_agent boolean DEFAULT false,
  last_seen timestamptz,
  created_at timestamptz DEFAULT now()
);
```


---

## Clean Architecture — découpage backend (NestJS)

Principe : séparer `entities` (domain), `use-cases` (application), `interfaces` (controllers, DTOs) et `infrastructure` (DB, ssh libs).

Arborescence recommandée (backend):

```
backend/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ common/
│  │  ├─ dto/
│  │  └─ pipes/
│  ├─ domain/
│  │  └─ entities/
│  │     └─ machine.entity.ts
│  ├─ use-cases/
│  │  ├─ add-machine.usecase.ts
│  │  ├─ list-machines.usecase.ts
│  │  ├─ exec-command.usecase.ts
│  │  └─ broadcast.usecase.ts
│  ├─ ports/             # interfaces (Repository ports, SSH port)
│  │  ├─ machine-repo.port.ts
│  │  └─ ssh.port.ts
│  ├─ adapters/          # impl. des ports
│  │  ├─ db/
│  │  │  └─ pg-machine-repo.ts
│  │  └─ ssh/
│  │     └─ ssh2-adapter.ts
│  ├─ modules/
│  │  ├─ machines/
│  │  │  ├─ machines.controller.ts
│  │  │  ├─ machines.service.ts  # orchestration use-cases
│  │  │  └─ machines.module.ts
│  │  ├─ terminal/
│  │  │  └─ terminal.gateway.ts  # WS -> ssh2 proxy
│  │  └─ agent/
│  │     └─ agent.gateway.ts     # WS events to agents
│  └─ infra/
│     ├─ encryption.service.ts   # encrypt/decrypt secrets
│     ├─ ssh-client-factory.ts
│     └─ sftp.service.ts
└─ package.json
```

Commentaires :

* `use-cases` n'importe pas de la technologie.
* `ports` définissent les interfaces que les adaptateurs implémentent.
* `infra/encryption.service` contiendra la logique de chiffrement AES et la gestion de la master-key (ex: stockée dans variable d'environnement ou vault).

---

## Frontend (React) — structure proposée

```
frontend/
├─ src/
│  ├─ App.tsx
│  ├─ index.tsx
│  ├─ pages/
│  │  ├─ MachinesPage/
│  │  │  ├─ MachinesList.tsx
│  │  │  └─ AddMachineForm.tsx
│  │  └─ TerminalPage/
│  │     └─ TerminalView.tsx  # xterm.js wrapper
│  ├─ components/
│  │  ├─ MachineCard.tsx
│  │  ├─ MultiSelectToolbar.tsx
│  │  └─ VolumeControl.tsx
│  ├─ services/
│  │  ├─ api.ts     # fetch wrappers
│  │  └─ ws.ts      # websocket helper
│  └─ styles/
└─ package.json
```

Points clés front :

* Utilise `xterm.js` pour le terminal.
* Pour SFTP upload : uploader au backend (REST) puis backend fait push SFTP.
* Interface d'ajout de machine déclenche appel POST `/machines`.

---

## Endpoints REST / WebSocket (exemples)

* `POST /machines` — ajoute machine (body : {name, ip, user, secret})
* `GET /machines` — liste
* `POST /machines/:id/exec` — exécute commande simple via SSH
* `POST /machines/:id/sftp/upload` — upload un fichier
* `WS /terminal/:id` — terminal proxy (xterm.js <-> WS)
* `WS /agent` — canal pour agents (heartbeat, command dispatch)

---

## Exemples d'implémentation technique (rapide)

* **Terminal proxy** : quand un client WS s'authentifie (par clé serveur), backend crée une connexion `ssh2.Client()` -> `client.shell({term: 'xterm'})` et pipe `stream` ↔ WS messages.
* **SFTP** : `ssh2` expose `sftp()` pour upload/download.
* **Broadcast volume** : use-case `broadcast.setVolume(machineIds[], level)` qui appelle l'adapter SSH ou agent pour chaque machine en parallèle (Promise.all)
* **Agent** : agent Node : connecte en WS au serveur, s'inscrit `machineId`, reçoit `action` (type: CHANGE\_WALLPAPER, PLAY\_AUDIO...), exécute commande locale platform-specific.

Commandes exemples (non exhaustif):

* Windows (PowerShell):

  * changer wallpaper : `powershell -command "Add-Type -TypeDefinition 'using System.Runtime.InteropServices;...'; [User32]::SystemParametersInfo(20,0,'C:\path\img.jpg',3)"`
  * ouvrir notepad : `Start-Process notepad.exe` (dans session interactive)
  * régler volume : via `nircmd` ou PowerShell + COM interop (souvent plus simple d'intégrer un petit utilitaire)
* Linux:

  * changer wallpaper (GNOME): `gsettings set org.gnome.desktop.background picture-uri 'file:///path/to/img.jpg'`
  * play mp3: `ffplay -nodisp -autoexit file.mp3` ou `mpv`
  * volume: `amixer set Master 50%`
* macOS:

  * changer wallpaper: `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "/path/to/img.jpg"'`

---

## Sécurité & bonnes pratiques (fortement recommandées)

* **Chiffrer** tous les secrets en base (ne jamais stocker en clair).
* **Préférer clés SSH** plutôt que mots de passe.
* **Limiter** l'accès à l'API par IP ou clé d'API si pas d'auth utilisateur.
* **Journaliser** toutes les commandes exécutées (audit).
* **Signer / chiffrer** le canal agent-server (wss\:// + TLS).
* Valider côté serveur que les commandes envoyées aux agents sont dans une *liste blanche* d'actions autorisées.

---

## Exemple minimal de *roadmap* d'implémentation

1. PoC : terminal web (xterm.js) ↔ NestJS WS ↔ ssh2 (connecter à une machine Linux)
2. SFTP upload/download via backend
3. CRUD machines + chiffrage secrets en DB (Postgres)
4. Agent minimal (echo / heartbeat) et gestion `has_agent`
5. Implémenter commandes GUI via agent et tests cross-platform
6. Fonctionnalités multi-machine (broadcast)


