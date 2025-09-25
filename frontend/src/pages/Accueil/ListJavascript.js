import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import DataTable from "../../components/DataTable";
import { getJavascript, createJavascript } from "../../services/out/serverApi";
import MediaModal from "../../components/MediaModal";
import useDownloadFile from "../../hooks/useDownloadFile";
import UploadDialog from "../../components/UploadDialog";
import { Button } from "@mui/material";
import Loading from "../../components/loading/Loading";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

function ListJavascript() {
  const [javascript, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const downloadFile = useDownloadFile();

  const fetchJavascript = async () => {
    setLoading(true);
    try {
      const data = await getJavascript();
      setPictures(data);
    } catch (error) {
      console.error("Erreur fetch javascript:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    const url = `http://0.0.0.0:3001/${row.path}`;
    setSelected({ id: row.id, name: row.name, url, type: "script", path: row.path });
  };

  const handleCopyLink = () => {
    if (!selected?.path) return;
    const url = `http://0.0.0.0:3001/${selected.path}`;
    navigator.clipboard.writeText(url);
  };

  const handleUpload = async (file) => {
    try {
      await createJavascript(file);
      setUploadOpen(false);
      fetchJavascript();
    } catch (error) {
      console.error("Erreur upload script:", error);
    }
  };

  useEffect(() => {
    fetchJavascript();
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
        title={`Liste des scripts javascript`}
        description={`Voici la liste des script enregistré dans la base de donnée. Vous pouvez les voir les modifié, vous pouvez aussi en ajouter.`}
      />

      <div className="flex gap-2 mt-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => setUploadOpen(true)}
        >
          Ajouter un script
        </Button>
        <Button 
          variant="outlined"
          color="secondary" 
          onClick={fetchJavascript}
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
          data={javascript}
          onRowClick={handleRowClick}
          onDownload={(row) =>
            downloadFile(`http://0.0.0.0:3001/javascript/${row.id}`, row.name)
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
        existingNames={javascript.map((p) => p.name)}
        acceptedTypes={[".js"]}
      />
    </div>
  );
}

export default ListJavascript;
