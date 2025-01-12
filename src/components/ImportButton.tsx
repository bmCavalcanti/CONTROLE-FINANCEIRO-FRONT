import React, { useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import api from "../services/api";
import SnackbarNotification from "./SnackbarNotification";

const ImportButton: React.FC<{ onImport: () => void }> = ({ onImport }) => {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append("extrato", e.target.files[0]);

        try {
            const response = await api.post("/extrato/import", formData);
            onImport();
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity("success");
        } catch (error: any) {
            console.error("Erro ao importar arquivo:", error);
            setSnackbarMessage(error.response.data.message ?? "Erro ao importar arquivo. Tente novamente.");
            setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Button
                variant="contained"
                component="label"
                color="success"
            >
                Importar Arquivo
                <input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                />
            </Button>
            <SnackbarNotification
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Box>
    );
};

export default ImportButton;
