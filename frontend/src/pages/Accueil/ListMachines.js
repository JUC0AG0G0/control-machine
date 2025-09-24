import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Button, Checkbox } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
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

function ListMachines() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(selectionService.getSelected());

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

    // Abonnement aux changements du service
    const unsubscribe = selectionService.subscribe(setSelected);
    return () => unsubscribe();
  }, []);

  const toggleSelection = (id) => {
    selectionService.toggle(id);
  };

  return (
    <div className="p-4">
      <Header
        title={`Liste des machines`}
        description={`Voici la liste des machines enregistré dans la base de donnée. Vous pouvez voir quelle sont les machines accessibles. Vous pouvez aussi en ajouter.`}
      />

      {/* Boutons */}
      <div className="flex gap-4 my-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className="rounded-2xl shadow-md"
          onClick={() => alert("Ajout d'une machine")}
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

      {/* Tableau */}
      <TableContainer component={Paper} className="shadow-lg rounded-2xl">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell /> {/* colonne checkbox */}
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Seen</TableCell>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun serveur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ListMachines;
