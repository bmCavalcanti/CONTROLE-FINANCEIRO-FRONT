import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container } from "@mui/material";
import Analysis from "./Analysis";
import Transactions from "./Transactions";
import LiquidityAnalysis from "./LiquidityAnalysis";
import FinancialForecast from "./FinancialForecast";

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/transacoes" element={<Transactions />} />
                <Route path="/analise" element={<Analysis />} />
                <Route path="/analise-liquidez" element={<LiquidityAnalysis />} />
                <Route path="/previsao-financeira" element={<FinancialForecast />} />
            </Routes>
        </Router>
    );
};

const Navbar: React.FC = () => {
    return (
        <AppBar position="sticky" color="success">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    CONTROLE FINANCEIRO
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/transacoes">
                    Transações
                </Button>
                <Button color="inherit" component={Link} to="/analise">
                    Análise de extrato
                </Button>
                <Button color="inherit" component={Link} to="/analise-liquidez">
                    Análise de Liquidez
                </Button>
                <Button color="inherit" component={Link} to="/previsao-financeira">
                    Previsão Financeira
                </Button>
            </Toolbar>
        </AppBar>
    );
};

const WelcomePage: React.FC = () => {
    return (
        <Container sx={{ textAlign: "center", marginTop: 4 }}>
            <h1>Bem-vindo!</h1>
            <p>Escolha uma das opções no menu para navegar.</p>
        </Container>
    );
};

export default App;
