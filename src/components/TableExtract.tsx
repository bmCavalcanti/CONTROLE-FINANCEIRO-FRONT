import React, { useState } from "react";
import { useTable, Column } from "react-table";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import api from "../services/api";
import SnackbarNotification from "./SnackbarNotification"; // Importando o componente SnackbarNotification

interface Transaction {
    id: number;
    data: string;
    valor: number;
    descricao: string;
    tipo_id: number | null;
    categoria_id: number | null;
}

interface TableProps {
    data: Transaction[];
    fetchData: () => void;
    tipoOptions: { id: number; nome: string; cor: string }[];
    categoriaOptions: { id: number; nome: string; cor: string }[];
}

const TableExtract: React.FC<TableProps> = ({ data, fetchData, tipoOptions, categoriaOptions}) => {
    const [loading, setLoading] = useState<number | null>(null); // Track loading state for each row
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const handleChange = async (id: number, field: string, value: any) => {
        setLoading(id);

        try {
            await api.put(`/extrato/${id}`, {
                [field]: value
            });
            fetchData();
            setSnackbarMessage("Alteração salva com sucesso!");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            setSnackbarMessage("Erro ao salvar alterações.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(null);
            setSnackbarOpen(true);
        }
    };

    const renderSelected = (selected: number, options: { id: number; nome: string; cor: string }[]) => {
        const option = options.find((opt) => opt.id === selected);
        return option ? option.nome : '';
    };

    const columns: Column<Transaction>[] = React.useMemo(
        () => [
            { Header: "Data", accessor: "data" },
            { Header: "Valor", accessor: "valor" },
            { Header: "Descrição", accessor: "descricao" },
            {
                Header: "Categoria",
                accessor: "categoria_id",
                Cell: ({ row }: any) => {
                    const { id } = row.original;
                    return (
                        <FormControl fullWidth>
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={row.original.categoria_id || ""}
                                onChange={(e) => handleChange(id, "categoria_id", Number(e.target.value))}
                                renderValue={(selected) => renderSelected(selected, categoriaOptions)}
                                style={{ backgroundColor: row.original.categoria?.cor || "#FFFFFF" }}
                            >
                                {categoriaOptions.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id} >
                                        {categoria.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                },
            },
            {
                Header: "Tipo",
                accessor: "tipo_id",
                Cell: ({ row }: any) => {
                    const { id } = row.original;
                    return (
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={row.original.tipo_id || ""}
                                onChange={(e) => handleChange(id, "tipo_id", Number(e.target.value))}
                                renderValue={(selected) => renderSelected(selected, tipoOptions)}
                                style={{ backgroundColor: row.original.tipo?.cor || "#FFFFFF" }}
                            >
                                {tipoOptions.map((tipo) => (
                                    <MenuItem key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                },
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return (
        <>
            <TableContainer>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps()}>{column.render("Header")}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            const { key, ...rowProps } = row.getRowProps(); // Remover o key de row.getRowProps
                            return (
                                <TableRow key={row.id} {...rowProps}> {/* Passando o key diretamente */}
                                    {row.cells.map((cell) => (
                                        <TableCell {...cell.getCellProps()}>
                                            {loading === row.original.id ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                cell.render("Cell")
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <SnackbarNotification
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
};

export default TableExtract;
