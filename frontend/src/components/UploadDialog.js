import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
} from "@mui/material";

function UploadDialog({
    open,
    onClose,
    onUpload,
    existingNames,
    acceptedTypes = [],
}) {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [baseName, setBaseName] = useState("");
    const [extension, setExtension] = useState("");
    const [error, setError] = useState("");

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        handleFile(selectedFile);
    };

    const handleFile = (selectedFile) => {
        if (!selectedFile) return;

        const ext = "." + selectedFile.name.split(".").pop().toLowerCase();

        if (acceptedTypes.length > 0 && !acceptedTypes.includes(ext)) {
            setError(`Seuls les fichiers ${acceptedTypes.join(", ")} sont autorisés`);
            setFile(null);
            setImagePreview(null);
            setAudioPreview(null);
            setBaseName("");
            setExtension("");
            return;
        }

        setFile(selectedFile);
        setExtension(ext);
        setBaseName(selectedFile.name.replace(ext, ""));
        setError("");
    };

    useEffect(() => {
        if (!file) {
            setImagePreview(null);
            setAudioPreview(null);
            return;
        }

        if (acceptedTypes.includes(".mp3")) {
            const objectUrl = URL.createObjectURL(file);
            setAudioPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }

        if (
            acceptedTypes.includes(".png") ||
            acceptedTypes.includes(".jpg") ||
            acceptedTypes.includes(".jpeg")
        ) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file, acceptedTypes]);

    useEffect(() => {
        if (!baseName) {
            setError("Le nom ne peut pas être vide");
        } else if (existingNames.includes(baseName + extension)) {
            setError("Ce nom est déjà utilisé");
        } else {
            setError("");
        }
    }, [baseName, extension, existingNames]);

    const handleUpload = () => {
        if (file && !error) {
            const newName = baseName + extension;
            const renamedFile = new File([file], newName, { type: file.type });
            onUpload(renamedFile);
            reset();
        }
    };

    const reset = () => {
        setFile(null);
        setImagePreview(null);
        setAudioPreview(null);
        setBaseName("");
        setExtension("");
        setError("");
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ajouter un fichier</DialogTitle>
            <DialogContent>
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
                >
                    {file ? (
                        <>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="imagePreview"
                                    className="mx-auto max-h-48 mb-2 rounded"
                                />
                            )}
                            {audioPreview && (
                                <img
                                    src={audioPreview}
                                    alt="audioPreview"
                                    className="mx-auto max-h-48 mb-2 rounded"
                                />
                            )}
                            <Typography variant="body2" className="mb-2">
                                {file.name} ({Math.round(file.size / 1024)} Ko)
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Glissez-déposez un fichier ({acceptedTypes.join(", ")}) ici ou
                            cliquez pour en sélectionner un.
                        </Typography>
                    )}
                    <input
                        type="file"
                        accept={acceptedTypes.join(",")}
                        onChange={handleFileSelect}
                        className="hidden"
                        id="upload-input"
                    />
                </div>
                <div className="text-center mt-2">
                    <label
                        htmlFor="upload-input"
                        className="text-blue-600 cursor-pointer underline"
                    >
                        Choisir un fichier
                    </label>
                </div>

                {file && (
                    <div className="mt-4 flex items-center gap-2">
                        <TextField
                            label="Nom du fichier"
                            fullWidth
                            value={baseName}
                            onChange={(e) => setBaseName(e.target.value)}
                            error={!!error}
                            helperText={error}
                        />
                        <Typography variant="body1">{extension}</Typography>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Annuler
                </Button>
                <Button
                    onClick={handleUpload}
                    color="primary"
                    variant="contained"
                    disabled={!file || !!error}
                >
                    Ajouter
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UploadDialog;
