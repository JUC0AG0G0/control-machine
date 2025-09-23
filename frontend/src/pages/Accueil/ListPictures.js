import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import DataTable from "../../components/DataTable";
import { getPictures } from "../../services/out/serverApi";
import MediaModal from "../../components/MediaModal";
import useDownloadFile from "../../hooks/useDownloadFile";
import { Button } from "@mui/material";
import Loading from "../../components/loading/Loading";

function ListPictures() {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

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
    const url = `http://0.0.0.0:3001/pictures/${row.id}`;
    setSelected({ id: row.id, name: row.name, url, type: "image" });
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
        <Button variant="contained" color="primary">
          Ajouter une image
        </Button>
        <Button variant="outlined" color="secondary" onClick={fetchPictures}>
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
          onDownload={(row) => downloadFile(`http://0.0.0.0:3001/pictures/${row.id}`, row.name)}
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
    </div>
  );
}

export default ListPictures;
