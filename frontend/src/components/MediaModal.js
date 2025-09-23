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

function MediaModal({ open, onClose, title, url, type, onDownload }) {
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
      </DialogContent>

      <DialogActions>
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
