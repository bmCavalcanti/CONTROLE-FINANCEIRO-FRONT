import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, CircularProgress, Box } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import Filters from "./components/Filters";
import api from "./services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type TransactionData = {
    categoria_id: number;
    tipo_id: number;
    valor: number;
};

type CategoriaOption = {
    id: number;
    nome: string;
    cor: string;
};

type TipoOption = {
    id: number;
    nome: string;
    cor: string;
};

const Analysis: React.FC = () => {
    const [data, setData] = useState<TransactionData[]>([]);
    const [categoriaOptions, setCategoriaOptions] = useState<CategoriaOption[]>([]);
    const [tipoOptions, setTipoOptions] = useState<TipoOption[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async (filters = {}) => {
        try {
            filters = { ...filters, despesas: true };

            const response = await api.get("/extrato/list", { params: filters });
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
            await Promise.all([fetchCategorias(), fetchTipos()]);
            setLoading(false);
        };
        fetchDataAsync();
    }, []);

    const processChartData = () => {
        const categorias = categoriaOptions.map((cat) => cat.nome);
        const tipos = tipoOptions.map((tipo) => tipo.nome);

        const totalCategoria = data.reduce((sum, item) => sum + (item.valor < 0 ? item.valor * (-1) : item.valor), 0);
        const totalTipo = data.reduce((sum, item) => sum + (item.valor < 0 ? item.valor * (-1) : item.valor), 0);

        const categoriaData = categoriaOptions.map((cat) => {
            const categoriaValor = data
                .filter((item) => item.categoria_id === cat.id)
                .reduce((sum, item) => sum + (item.valor < 0 ? item.valor * (-1) : item.valor), 0);
            return ((categoriaValor / totalCategoria) * 100).toFixed(2); // Porcentagem
        });

        const tipoData = tipoOptions.map((tipo) => {
            const tipoValor = data
                .filter((item) => item.tipo_id === tipo.id)
                .reduce((sum, item) => sum + (item.valor < 0 ? item.valor * (-1) : item.valor), 0);
            return ((tipoValor / totalTipo) * 100).toFixed(2); // Porcentagem
        });

        const categoriaValores = categoriaOptions.map((cat) => {
            return data
                .filter((item) => item.categoria_id === cat.id)
                .reduce((sum, item) => sum + (item.valor < 0 ? item.valor * (-1) : item.valor), 0);
        });

        const tipoValores = tipoOptions.map((tipo) => {
            return data
                .filter((item) => item.tipo_id === tipo.id)
                .reduce((sum, item) => sum + (item.valor < 0 ? item.valor * (-1) : item.valor), 0);
        });

        return { categorias, categoriaData, tipos, tipoData, categoriaValores, tipoValores };
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
                <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                    <CircularProgress />
                </Paper>
            </Container>
        );
    }

    const { categorias, categoriaData, tipos, tipoData, categoriaValores, tipoValores } = processChartData();

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                    Análise de Dados de Transações
                </Typography>
                <Filters onFilter={fetchData} categoriaOptions={categoriaOptions} tipoOptions={tipoOptions} />
            </Paper>
            <Box display="flex" flexWrap="wrap" gap={4}>
                <Box flex="1 1 calc(50% - 16px)">
                    <Paper sx={{ padding: 4, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Análise por Categoria (Porcentagem)
                        </Typography>
                        <Pie
                            data={{
                                labels: categorias,
                                datasets: [
                                    {
                                        label: "Porcentagem por Categoria",
                                        data: categoriaData,
                                        backgroundColor: categoriaOptions.map((cat) => cat.cor),
                                    },
                                ],
                            }}
                        />
                    </Paper>
                </Box>
                <Box flex="1 1 calc(50% - 16px)" >
                    <Paper sx={{ padding: 4, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Análise por Tipo (Porcentagem)
                        </Typography>
                        <Bar
                            data={{
                                labels: tipos,
                                datasets: [
                                    {
                                        label: "Porcentagem por Tipo",
                                        data: tipoData,
                                        backgroundColor: tipoOptions.map((tipo) => tipo.cor),
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: "top" },
                                    tooltip: { enabled: true },
                                },
                            }}
                        />
                    </Paper>
                </Box>
                <Box flex="1 1 calc(50% - 16px)" >
                    <Paper sx={{ padding: 4, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Análise por Categoria (Valor Absoluto)
                        </Typography>
                        <Bar
                            data={{
                                labels: categorias,
                                datasets: [
                                    {
                                        label: "Valor por Categoria",
                                        data: categoriaValores,
                                        backgroundColor: categoriaOptions.map((cat) => cat.cor),
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: "top" },
                                    tooltip: { enabled: true },
                                },
                            }}
                        />
                    </Paper>
                </Box>
                <Box flex="1 1 calc(50% - 16px)" >
                    <Paper sx={{ padding: 4, boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Análise por Tipo (Valor Absoluto)
                        </Typography>
                        <Bar
                            data={{
                                labels: tipos,
                                datasets: [
                                    {
                                        label: "Valor por Tipo",
                                        data: tipoValores,
                                        backgroundColor: tipoOptions.map((tipo) => tipo.cor),
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: "top" },
                                    tooltip: { enabled: true },
                                },
                            }}
                        />
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default Analysis;
