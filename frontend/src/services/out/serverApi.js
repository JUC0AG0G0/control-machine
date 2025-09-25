const API_URL = "http://0.0.0.0:3001";

/////////////////////////////////////////////////////////////////
//                  Gestion des machines
/////////////////////////////////////////////////////////////////

// Récupérer tous les serveurs
export async function getServers() {
  const response = await fetch(API_URL + "/machines");
  if (!response.ok) throw new Error("Erreur lors du fetch des serveurs");
  return response.json();
}

// Créer un nouveau serveur
export async function createServer(serverData) {
  const response = await fetch(API_URL + "/machines", {
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
  const response = await fetch(API_URL + "/pictures");
  if (!response.ok) throw new Error("Erreur lors du fetch des images");
  return response.json();
}

// Create a new picture
export async function createPictures(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_URL + "/pictures", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Erreur lors de l'upload de l'image");
  return response.json();
}

/////////////////////////////////////////////////////////////////
//                  Gestion des sons
/////////////////////////////////////////////////////////////////

// Get all sounds
export async function getSounds() {
  const response = await fetch(API_URL + "/sounds");
  if (!response.ok) throw new Error("Erreur lors du fetch des sons");
  return response.json();
}

// Create a new sound
export async function createSounds(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_URL + "/sounds", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Erreur lors de l'upload du son");
  return response.json();
}

/////////////////////////////////////////////////////////////////
//             Gestion des scripts javascript
/////////////////////////////////////////////////////////////////

// Get all scripts javascript
export async function getJavascript() {
  const response = await fetch(API_URL + "/javascript");
  if (!response.ok)
    throw new Error("Erreur lors du fetch des scripts javascript");
  return response.json();
}

// Create a new script javascript
export async function createJavascript(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_URL + "/javascript", {
    method: "POST",
    body: formData,
  });

  if (!response.ok)
    throw new Error("Erreur lors de l'upload du script javascript");
  return response.json();
}

/////////////////////////////////////////////////////////////////
//                    Gestion des APIs
/////////////////////////////////////////////////////////////////

// Get uha apis
export async function getUhaApis(theme, api) {
  const response = await fetch(`https://filrouge.uha4point0.fr/V2/${theme}/${api}`);
  if (!response.ok) throw new Error("Erreur lors du fetch des serveurs");
  return response.json();
}

// Reset uha apis
export async function resetUhaApis(theme) {
  const response = await fetch(`https://filrouge.uha4point0.fr/V2/reset/${theme}?`);
  if (!response.ok) throw new Error("Erreur lors du fetch des serveurs");
  return;
}

// Flush uha apis
export async function flushUhaApis(theme) {
  const response = await fetch(`https://filrouge.uha4point0.fr/V2/delete/${theme}?`);
  if (!response.ok) throw new Error("Erreur lors du fetch des serveurs");
  return;
}

// Add script to uha api
export async function addScriptToApi(theme, scriptId) {
  const body = JSON.stringify({
    id: scriptId && scriptId.length > 0 ? scriptId : "random",
  });

  const response = await fetch(API_URL + "/apifilrouge/addscripttoapi/" + theme, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) throw new Error("Erreur lors de l'ajout du script à l'API");
  return response.json();
}

// Add presets to uha api
export async function addPresetsToApi(theme, presetIds) {
  const body = JSON.stringify({ ids: presetIds });

  const response = await fetch(API_URL + "/apifilrouge/addpresetstoapi/" + theme, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) throw new Error("Erreur lors de l'ajout des presets à l'API");
  return response.json();
}
