import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import DataTable from "../../components/DataTable";
import { createSounds, getSounds } from "../../services/out/serverApi";
import MediaModal from "../../components/MediaModal";
import useDownloadFile from "../../hooks/useDownloadFile";
import UploadDialog from "../../components/UploadDialog";
import { Button } from "@mui/material";
import Loading from "../../components/loading/Loading";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

function ListSounds() {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const downloadFile = useDownloadFile();

  const fetchSounds = async () => {
    setLoading(true);
    try {
      const data = await getSounds();
      setSounds(data);
    } catch (error) {
      console.error("Erreur fetch sounds:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    const url = `http://0.0.0.0:3001/sounds/${row.id}`;
    setSelected({ id: row.id, name: row.name, url, type: "audio" });
  };

  const handleUpload = async (file) => {
    try {
      await createSounds(file);
      setUploadOpen(false);
      fetchSounds();
    } catch (error) {
      console.error("Erreur upload son:", error);
    }
  };

  useEffect(() => {
    fetchSounds();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Nom" },
    {
      field: "updated_at",
      headerName: "Date",
      renderCell: (value) => new Date(value).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div className="p-4">
      <Header
        title="Liste des sons"
        description="Voici la liste des sons enregistrés dans la base de données. Vous pouvez écouter et télécharger."
      />

      <div className="flex gap-2 mt-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setUploadOpen(true)}
        >
          Ajouter un son
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          startIcon={<RefreshIcon />}
          onClick={fetchSounds}
        >
          Rafraîchir
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={sounds}
          onRowClick={handleRowClick}
          onDownload={(row) =>
            downloadFile(`http://0.0.0.0:3001/sounds/${row.id}`, row.name)
          }
        />
      )}

      <MediaModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        url={selected?.url}
        type={selected?.type}
        onDownload={() => downloadFile(selected.url, selected.name)}
      />

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        existingNames={sounds.map((p) => p.name)}
        acceptedTypes={[".mp3"]}
      />
    </div>
  );
}

export default ListSounds;
