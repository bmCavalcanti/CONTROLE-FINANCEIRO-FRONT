import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, CircularProgress } from "@mui/material";
import TableExtract from "./components/TableExtract";
import Filters from "./components/Filters";
import ImportButton from "./components/ImportButton";
import api from "./services/api";

const Transactions: React.FC = () => {
    const [data, setData] = useState([]);
    const [categoriaOptions, setCategoriaOptions] = useState<{ id: number; nome: string; cor: string }[]>([]);
    const [tipoOptions, setTipoOptions] = useState<{ id: number; nome: string; cor: string }[]>([]);
    const [filters, setFilters] = useState({});
    const [loadingInfo, setLoadingInfo] = useState(true);

    const fetchData = async (newFilters = filters) => {
        try {
            const response = await api.get("/extrato/list", { params: newFilters });
            setData(response.data.data || []);
            setFilters(newFilters)
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
            await Promise.all([fetchCategorias(), fetchTipos()]);
            setLoadingInfo(false);
        };
        fetchDataAsync();
    }, []);

    if (loadingInfo) {
        return (
            <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
                <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                    <CircularProgress />
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                    Gestão de Transações
                </Typography>
                <Filters onFilter={fetchData} categoriaOptions={categoriaOptions} tipoOptions={tipoOptions} />
                <ImportButton onImport={fetchData} />
            </Paper>
            <Paper sx={{ padding: 4, boxShadow: 3 }}>
                <TableExtract
                    data={data}
                    fetchData={() => fetchData(filters)}
                    categoriaOptions={categoriaOptions}
                    tipoOptions={tipoOptions}
                />
            </Paper>
        </Container>
    );
};

export default Transactions;
