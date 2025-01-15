import React, { useState } from "react";
import { Container, Typography, Paper, CircularProgress, CardContent, Box, Card } from "@mui/material";
import api from "./services/api";
import LiquidityChart from "./components/LiquidityChart";
import Filters from "./components/Filters";
import SnackbarNotification from "./components/SnackbarNotification";
import { formatCurrency } from "./utils/formatCurrency";

const LiquidityAnalysis: React.FC = () => {
    const [data, setData] = useState({
        liquidez: 0,
        evolucao: {},
        gastosSuperfluos: [],
        totalDespesaSuperflua: 0,
    });
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const fetchLiquidityAnalysis = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await api.get("/extrato/analyse-by-period", { params: filters });
            setData(response.data.data || {
                liquidez: 0,
                evolucao: {},
                gastosSuperfluos: [],
                totalDespesaSuperflua: 0,
            });

            setSnackbarMessage(response.data.message);
            setSnackbarSeverity("success");
        } catch (error: any) {
            console.error("Erro ao buscar:", error);
            setSnackbarMessage(error.response.data.message ?? "Erro ao buscar dados. Tente novamente.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
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

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                    Análise de Liquidez
                </Typography>
                <Filters onFilter={fetchLiquidityAnalysis} />
            </Paper>
            <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Média de gastos supérfluos no período
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >

                    <Box
                        key="Total"
                        sx={{
                            flex: '1 1 calc(25% - 16px)', // Faz com que os cards ocupem 1/3 da largura (com espaçamento)
                            minWidth: 200, // Garante que o card tenha uma largura mínima
                        }}
                    >
                        <Card sx={{ boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {formatCurrency(data.totalDespesaSuperflua)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    {data.gastosSuperfluos.map(([categoria, valor]) => (
                        <Box
                            key={categoria}
                            sx={{
                                flex: '1 1 calc(25% - 16px)', // Faz com que os cards ocupem 1/3 da largura (com espaçamento)
                                minWidth: 200, // Garante que o card tenha uma largura mínima
                            }}
                        >
                            <Card sx={{ boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6">{categoria}</Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {formatCurrency(valor)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Paper>
            <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Liquidez Atual: {formatCurrency(data.liquidez)}
                </Typography>
                <LiquidityChart evolucao={data.evolucao} />
            </Paper>

            <SnackbarNotification
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Container>
    );
};

export default LiquidityAnalysis;
