import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import DataTable from "../../components/DataTable";
import { getPictures, createPictures } from "../../services/out/serverApi";
import MediaModal from "../../components/MediaModal";
import useDownloadFile from "../../hooks/useDownloadFile";
import UploadDialog from "../../components/UploadDialog";
import { Button } from "@mui/material";
import Loading from "../../components/loading/Loading";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

function ListPictures() {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const downloadFile = useDownloadFile();

  const fetchPictures = async () => {
    setLoading(true);
    try {
      const data = await getPictures();
      setPictures(data);
    } catch (error) {
      console.error("Erreur fetch pictures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    const url = `http://0.0.0.0:3001/${row.path}`;
    setSelected({ id: row.id, name: row.name, url, type: "image", path: row.path });
  };

  const handleCopyLink = () => {
    if (!selected?.path) return;
    const url = `http://0.0.0.0:3001/${selected.path}`;
    navigator.clipboard.writeText(url);
  };

  const handleUpload = async (file) => {
    try {
      await createPictures(file);
      setUploadOpen(false);
      fetchPictures();
    } catch (error) {
      console.error("Erreur upload image:", error);
    }
  };

  useEffect(() => {
    fetchPictures();
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
        title="Liste des images"
        description="Voici la liste des images enregistrées dans la base de données. Vous pouvez voir les images et en ajouter."
      />

      <div className="flex gap-2 mt-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => setUploadOpen(true)}
        >
          Ajouter une image
        </Button>
        <Button 
          variant="outlined"
          color="secondary" 
          onClick={fetchPictures}
          startIcon={<RefreshIcon />}
        >
          Rafraîchir
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={pictures}
          onRowClick={handleRowClick}
          onDownload={(row) =>
            downloadFile(`http://0.0.0.0:3001/pictures/${row.id}`, row.name)
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
        onCopyLink={handleCopyLink}
      />

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        existingNames={pictures.map((p) => p.name)}
        acceptedTypes={[".png", ".jpg"]}
      />
    </div>
  );
}

export default ListPictures;
