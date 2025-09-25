import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import LinkIcon from "@mui/icons-material/Link";

function MediaModal({
  open,
  onClose,
  title,
  url,
  type,
  onDownload,
  onCopyLink,
}) {
  const [scriptContent, setScriptContent] = useState("");

  useEffect(() => {
    if (url && type === "script") {
      fetch(url)
        .then((res) => res.text())
        .then((data) => setScriptContent(data))
        .catch((err) => console.error("Erreur de chargement du script:", err));
    }
  }, [url, type]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div className="flex items-center justify-between">
        <DialogTitle>{title}</DialogTitle>
        <IconButton onClick={onClose} className="mr-2">
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent dividers className="flex justify-center items-center">
        {type === "image" && (
          <img
            src={url}
            alt={title}
            className="max-h-[70vh] mx-auto rounded-lg shadow-md"
          />
        )}
        {type === "audio" && (
          <audio controls autoPlay className="w-full">
            <source src={url} type="audio/mpeg" />
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        )}
        {type === "script" && (
          <pre className="bg-gray-100 p-4 rounded-lg w-full max-h-[70vh] overflow-auto text-sm">
            {url ? (
              <code>{scriptContent}</code>
            ) : (
              <span>Aucun script à afficher.</span>
            )}
          </pre>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<LinkIcon />}
          onClick={onCopyLink}
          disabled={!url}
        >
          Copier le lien
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
          disabled={!url}
        >
          Télécharger
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MediaModal;
