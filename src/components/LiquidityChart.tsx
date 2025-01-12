import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LiquidityChartProps {
    evolucao: Record<string, { receitas: number; despesas: number }>;
}

const LiquidityChart: React.FC<LiquidityChartProps> = ({ evolucao }) => {
    const labels = Object.keys(evolucao).sort();
    const receitasData = labels.map((key) => evolucao[key].receitas);
    const despesasData = labels.map((key) => evolucao[key].despesas);

    const data = {
        labels,
        datasets: [
            {
                label: "Receitas",
                data: receitasData,
                borderColor: "#4caf50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                tension: 0.3,
            },
            {
                label: "Despesas",
                data: despesasData,
                borderColor: "#f44336",
                backgroundColor: "rgba(244, 67, 54, 0.2)",
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Evolução Mensal de Receitas e Despesas",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default LiquidityChart;
