import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { selectionService } from "../../services/selectionService";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import {
  getJavascript,
  getUhaApis,
  resetUhaApis,
  flushUhaApis,
  addScriptToApi,
  addPresetsToApi,
} from "../../services/out/serverApi";

export default function CategoryFilRouge({ theme, api1, api2 }) {
  const navigate = useNavigate();

  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(() => {
    const saved = selectionService.getSelected();
    return saved && saved.length ? saved[0] : "";
  });

  const defaultPresets = [
    { id: "1", name: "Preset Bizarre A" },
    { id: "2", name: "Preset Bizarre B" },
    { id: "3", name: "Preset Bizarre C" },
  ];
  const presetsStorageKey = `presets_${api1 || "default"}`;
  const [presets, setPresets] = useState(defaultPresets);
  const [checkedPresets, setCheckedPresets] = useState(() => {
    try {
      const saved = localStorage.getItem(presetsStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [openPresetModal, setOpenPresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  const [tabIndex, setTabIndex] = useState(0);
  const [api1Data, setApi1Data] = useState(null);
  const [api2Data, setApi2Data] = useState(null);

  const refreshApis = useCallback(async () => {
    try {
      const [data1, data2] = await Promise.all([
        getUhaApis(theme, api1),
        getUhaApis(theme, api2),
      ]);
      setApi1Data(data1);
      setApi2Data(data2);
    } catch (e) {
      console.error("Erreur lors du refresh des APIs :", e);
      setApi1Data(null);
      setApi2Data(null);
    }
  }, [theme, api1, api2]);

  const resetApis = () => {
    resetUhaApis(theme).then(() => refreshApis());
  };

  const flushApis = () => {
    flushUhaApis(theme).then(() => refreshApis());
  };

  useEffect(() => {
    async function fetchScripts() {
      try {
        const data = await getJavascript();
        setScripts(data);
      } catch (err) {
        console.error("Erreur lors du fetch des scripts:", err);
      }
    }
    fetchScripts();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(presetsStorageKey);
      setCheckedPresets(saved ? JSON.parse(saved) : []);
    } catch {
      setCheckedPresets([]);
    }
  }, [api1]);

  useEffect(() => {
    const unsub = selectionService.subscribe((arr) => {
      setSelectedScript(arr && arr.length ? arr[0] : "");
    });
    refreshApis();
    return () => unsub();
  }, [refreshApis]);

  useEffect(() => {
    try {
      localStorage.setItem(presetsStorageKey, JSON.stringify(checkedPresets));
    } catch (e) { }
  }, [checkedPresets, presetsStorageKey]);

  const handleScriptChange = (e) => {
    const id = e.target.value;
    setSelectedScript(id);
    selectionService.clear();
    if (id) selectionService.toggle(id);
  };

  const handleTogglePreset = (id) => {
    setCheckedPresets((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const handleAddPreset = () => {
    if (!newPresetName.trim()) return;
    const id = `preset-${Date.now()}`;
    const p = { id, name: newPresetName.trim() };
    setPresets((s) => [p, ...s]);
    setCheckedPresets((c) => [...c, id]);
    setNewPresetName("");
    setOpenPresetModal(false);
  };

  const handleAddScriptToApi = () => {
    addScriptToApi(theme, selectedScript).then(() => refreshApis());
  };

  const handleAddPresetToApi = () => {
    addPresetsToApi(theme, checkedPresets).then(() => refreshApis());
  };

  const goToListJavascript = () => navigate("/list-javascript");

  return (
    <div className="p-4 grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <Header
          title={`Controle de l'api — ${theme || "(thème)"}`}
          description={`Ma super description de la page pour ${theme || "le thème"
            }`}
        />
      </div>

      {/* ---- Colonne gauche ---- */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {/* ---- Scripts ---- */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg font-semibold">Sélectionner un script</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outlined" onClick={goToListJavascript}>
                Ajouter un script
              </Button>
              <Button
                variant="contained"
                onClick={() => getJavascript().then(setScripts)}
              >
                Rafraîchir
              </Button>
            </div>
          </div>
          <RadioGroup value={selectedScript} onChange={handleScriptChange}>
            <FormControlLabel value="" control={<Radio />} label="Random 🎲" />
            {scripts.map((s) => (
              <FormControlLabel
                key={s.id}
                value={s.id}
                control={<Radio />}
                label={s.name}
              />
            ))}
          </RadioGroup>
          <div className="mt-3">
            <Button
              variant="contained"
              onClick={() => handleAddScriptToApi()}
              disabled={selectedScript === null || selectedScript === undefined}
              fullWidth
            >
              Ajouter ce script
            </Button>
          </div>
        </div>

        {/* ---- Presets ---- */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg font-semibold">Presets de données</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outlined"
                onClick={() => setOpenPresetModal(true)}
              >
                Ajouter un preset
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  try {
                    const saved = localStorage.getItem(presetsStorageKey);
                    setCheckedPresets(saved ? JSON.parse(saved) : []);
                  } catch { }
                }}
              >
                Rafraîchir
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            {presets.map((p) => (
              <label key={p.id} className="flex items-center gap-2">
                <Checkbox
                  checked={checkedPresets.includes(p.id)}
                  onChange={() => handleTogglePreset(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
          <div className="mt-3">
            <Button
              variant="contained"
              onClick={() => handleAddPresetToApi()}
              disabled={checkedPresets.length === 0}
              fullWidth
            >
              Ajouter ce(s) preset(s)
            </Button>
          </div>
        </div>
      </div>

      {/* ---- Colonne droite (APIs) ---- */}
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white rounded-2xl shadow p-4 h-full flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h3 className="text-md font-semibold">APIs ({theme})</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={flushApis} variant="outlined">
                Vider
              </Button>
              <Button onClick={resetApis} variant="outlined">
                Reset
              </Button>
              <Button onClick={refreshApis} variant="outlined">
                Actualiser
              </Button>
            </div>
          </div>
          <Tabs
            value={tabIndex}
            onChange={(e, v) => setTabIndex(v)}
            orientation={window.innerWidth < 640 ? "horizontal" : "vertical"}
            variant="scrollable"
            sx={{ borderRight: { sm: 1 }, borderColor: "divider" }}
          >
            <Tab label={`API 1: ${api1 || "(vide)"}`} />
            <Tab label={`API 2: ${api2 || "(vide)"}`} />
          </Tabs>
          <div className="mt-2 overflow-auto grow">
            {tabIndex === 0 && api1Data && (
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(api1Data, null, 2)}
              </pre>
            )}
            {tabIndex === 1 && api2Data && (
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(api2Data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* ---- Modal ajout preset ---- */}
      <Dialog open={openPresetModal} onClose={() => setOpenPresetModal(false)}>
        <DialogTitle>Ajouter un preset</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom du preset"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPresetModal(false)}>Annuler</Button>
          <Button onClick={handleAddPreset} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
