import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, CircularProgress, DialogActions, Button, Dialog, DialogContent, TextField, DialogTitle } from "@mui/material";
import api from "./services/api";
import TableKeywords from "./components/TableKeywords";
import SnackbarNotification from "./components/SnackbarNotification";

const PalavrasChave: React.FC = () => {
    const [data, setData] = useState([]);
    const [categoriaOptions, setCategoriaOptions] = useState<{ id: number; nome: string, cor: string }[]>([]);
    const [tipoOptions, setTipoOptions] = useState<{ id: number; nome: string; cor: string }[]>([]);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({ id: null, nome: "", categoria_id: "", tipo_id: "" });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const fetchData = async (filters = {}) => {
        try {
            const response = await api.get("/palavra_chave/list", { params: filters });
            setData(response.data.data || []);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await api.get("/extrato_categoria/list");
            setCategoriaOptions(response.data.data || []);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    const fetchTipos = async () => {
        try {
            const response = await api.get("/extrato_tipo/list");
            setTipoOptions(response.data.data || []);
        } catch (error) {
            console.error("Erro ao buscar tipos:", error);
        }
    };

    useEffect(() => {
        const fetchDataAsync = async () => {
            await Promise.all([fetchCategorias(), fetchTipos()]); // Faz as requisições em paralelo
            fetchData(); // Chama a função para carregar as palavras-chave também
            setLoadingInfo(false);
        };
        fetchDataAsync();
    }, []);

    const handleSave = async () => {
        try {
            const response = modalData.id
                ? await api.put(`/palavra_chave/${modalData.id}`, modalData)
                : await api.post("/palavra_chave", modalData);

            if (response.data.status) {
                fetchData(); // Recarrega os dados após inserção ou atualização
                handleCloseModal(); // Fecha o modal
                setSnackbarMessage(response.data.message ?? "Alteração salva com sucesso!");
                setSnackbarSeverity("success");
            }
        } catch (error: any) {
            setSnackbarMessage(error.response.data.message ?? "Erro ao tentar salvar!");
            setSnackbarSeverity("error");
            console.error("Erro ao salvar palavra-chave:", error);
        } finally {
            setSnackbarOpen(true)
        }
    };

    const handleOpenModal = (palavra?: any) => {
        if (palavra) {
            setModalData(palavra); // Preenche os dados do modal para edição
        } else {
            setModalData({ id: null, nome: "", categoria_id: "", tipo_id: "" }); // Limpa os campos para inserção
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    if (loadingInfo) {
        return (
            <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
                <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                    <CircularProgress />
                </Paper>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                    Gestão de Palavras-chave
                </Typography>
                <Button variant="contained" color="success" onClick={() => handleOpenModal()}>Adicionar Palavra-chave</Button>
            </Paper>
            <Paper sx={{ padding: 4, boxShadow: 3 }}>
                <TableKeywords data={data} fetchData={fetchData} categoriaOptions={categoriaOptions} tipoOptions={tipoOptions} onEdit={handleOpenModal} />
            </Paper>

            {/* Modal de Inserção/Atualização */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{modalData.id ? "Editar Palavra-chave" : "Adicionar Palavra-chave"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={modalData.nome}
                        onChange={(e) => setModalData({ ...modalData, nome: e.target.value })}
                    />
                    <TextField
                        label="Categoria"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        select
                        value={modalData.categoria_id}
                        onChange={(e) => setModalData({ ...modalData, categoria_id: e.target.value })}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {categoriaOptions.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        label="Tipo"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        select
                        value={modalData.tipo_id}
                        onChange={(e) => setModalData({ ...modalData, tipo_id: e.target.value })}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {tipoOptions.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nome}
                            </option>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="error">Cancelar</Button>
                    <Button onClick={handleSave} color="success">{modalData.id ? "Salvar" : "Adicionar"}</Button>
                </DialogActions>
            </Dialog>
            <SnackbarNotification
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Container>
    );
};

export default PalavrasChave;
