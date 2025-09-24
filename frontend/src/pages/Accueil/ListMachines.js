import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  Button,
  Checkbox,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import TerminalIcon from "@mui/icons-material/Terminal";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getServers } from "../../services/out/serverApi";
import { selectionService } from "../../services/selectionService";
import { createServer } from "../../services/out/serverApi";

function ListMachines() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(selectionService.getSelected());

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    ip: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const fetchServers = async () => {
    try {
      setLoading(true);
      const data = await getServers();
      setServers(data);
    } catch (error) {
      console.error("Erreur lors du chargement des serveurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();

    const unsubscribe = selectionService.subscribe(setSelected);
    return () => unsubscribe();
  }, []);

  const toggleSelection = (id) => {
    selectionService.toggle(id);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMachine = async () => {
    setError("");

    if (!form.name || !form.ip || !form.username || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    const duplicateName = servers.some((s) => s.name === form.name);
    const duplicateIp = servers.some((s) => s.ip === form.ip);

    if (duplicateName) {
      setError("Une machine avec ce nom existe déjà.");
      return;
    }
    if (duplicateIp) {
      setError("Une machine avec cette IP existe déjà.");
      return;
    }

    try {
      const newMachine = await createServer(form);

      setServers([...servers, newMachine]);

      setForm({ name: "", ip: "", username: "", password: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la machine.");
    }
  };

  return (
    <div className="p-4">
      <Header
        title={`Liste des machines`}
        description={`Voici la liste des machines enregistré dans la base de donnée. Vous pouvez voir quelle sont les machines accessibles. Vous pouvez aussi en ajouter.`}
      />

      <div className="flex gap-4 my-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className="rounded-2xl shadow-md"
          onClick={() => setOpen(true)}
        >
          Ajouter une machine
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RefreshIcon />}
          className="rounded-2xl shadow-md"
          onClick={fetchServers}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Rafraîchir"}
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow-lg rounded-2xl">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Seen</TableCell>
              <TableCell align="center">Action rapide</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servers.length > 0 ? (
              servers.map((server) => (
                <TableRow key={server.id} hover>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(server.id)}
                      onChange={() => toggleSelection(server.id)}
                    />
                  </TableCell>
                  <TableCell>{server.id}</TableCell>
                  <TableCell>{server.name}</TableCell>
                  <TableCell>{server.ip}</TableCell>
                  <TableCell>{server.username}</TableCell>
                  <TableCell>{server.password}</TableCell>
                  <TableCell>{server.status}</TableCell>
                  <TableCell>
                    {server.last_seen ? server.last_seen : "jamais détecté"}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-2">
                      <Tooltip title="Connexion SSH" arrow>
                        <IconButton
                          color="default"
                          size="small"
                          onClick={() =>
                            alert(`SSH vers ${server.name} (${server.ip})`)
                          }
                        >
                          <TerminalIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Play song" arrow>
                        <IconButton
                          color="default"
                          size="small"
                          onClick={() =>
                            alert(`Lecture de son sur ${server.name}`)
                          }
                        >
                          <VolumeUpIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Aucun serveur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ajouter une machine</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField
            label="Nom"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={
              !form.name ? true : servers.some((s) => s.name === form.name)
            }
            helperText={
              !form.name
                ? "Le nom est obligatoire."
                : servers.some((s) => s.name === form.name)
                  ? "Une machine avec ce nom existe déjà."
                  : ""
            }
          />
          <TextField
            label="IP"
            name="ip"
            value={form.ip}
            onChange={handleChange}
            fullWidth
            error={!form.ip ? true : servers.some((s) => s.ip === form.ip)}
            helperText={
              !form.ip
                ? "L'adresse IP est obligatoire."
                : servers.some((s) => s.ip === form.ip)
                  ? "Une machine avec cette IP existe déjà."
                  : ""
            }
          />
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            error={!form.username}
            helperText={!form.username ? "Le username est obligatoire." : ""}
          />
          <TextField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            error={!form.password}
            helperText={
              !form.password ? "Le mot de passe est obligatoire." : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={handleAddMachine}
            color="primary"
            variant="contained"
            disabled={
              !form.name ||
              !form.ip ||
              !form.username ||
              !form.password ||
              servers.some((s) => s.name === form.name) ||
              servers.some((s) => s.ip === form.ip)
            }
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListMachines;
