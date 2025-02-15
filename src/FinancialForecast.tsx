import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, CircularProgress, Box } from "@mui/material";
import api from "./services/api";
import Filters from "./components/Filters";
import SnackbarNotification from "./components/SnackbarNotification";
import { formatCurrency } from "./utils/formatCurrency";

const FinancialForecast: React.FC = () => {
    const [forecastData, setForecastData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const fetchForecast = async (filters = {}) => {
        try {
            const response = await api.get("/extrato/forecast-financial-health", { params: filters });
            setForecastData(response.data.data);
            setSnackbarMessage(response.data.message ?? "Informações atualizadas!");
            setSnackbarSeverity("success");
        } catch (error: any) {
            console.error("Erro ao buscar previsão financeira:", error);
            setSnackbarMessage(error.response.data.message ?? "Erro ao salvar alterações. Tente novamente.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(false);
            setSnackbarOpen(true)
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
                    Previsão de Saúde Financeira
                </Typography>
                <Filters onFilter={fetchForecast} />

                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3} sx={{ marginTop: 4 }}>
                    <Box flex={1}>
                        <Typography variant="h6">Saldo Atual</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.saldoAtual)}</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography variant="h6">Saldo Previsto para { forecastData?.previstoPara }</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.saldoFuturoEstimado)}</Typography>
                    </Box>
                </Box>
                <Typography variant="h5" style={{ marginTop: 25 }}>Médias no período</Typography>
                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3} mt={3}>
                    <Box flex={1}>
                        <Typography variant="h6">Receitas</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.mediaReceitas)}</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography variant="h6">Despesas</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.mediaDespesas)}</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography variant="h6">Saldo</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.mediaSaldo)}</Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3} mt={3}>
                    <Box flex={1}>
                        <Typography variant="h6">Despesa Fixa</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.mediaDespesaFixa)}</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography variant="h6">Despesa Variável</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.mediaDespesaVariavel)}</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography variant="h6">Despesa Superflua</Typography>
                        <Typography variant="body1">{formatCurrency(forecastData?.mediaDespesaSuperflua)}</Typography>
                    </Box>
                </Box>
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

export default FinancialForecast;
