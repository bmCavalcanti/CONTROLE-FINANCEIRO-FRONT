import React, { useEffect, useState } from "react";
import { useTable, Column } from "react-table";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import api from "../services/api";
import SnackbarNotification from "./SnackbarNotification";
import { formatCurrency } from "../utils/formatCurrency";
import moment from "moment";

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
    tipoOptions: { id: number; nome: string; cor: string }[];
    categoriaOptions: { id: number; nome: string; cor: string }[];
}

const TableExtract: React.FC<TableProps> = ({ data, tipoOptions, categoriaOptions }) => {
    const [tableData, setTableData] = useState<Transaction[]>(data);
    const [loading, setLoading] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleChange = async (id: number, field: string, value: any) => {
        setLoading(id);

        try {
            await api.put(`/extrato/${id}`, {
                [field]: value,
            });

            setTableData((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, [field]: value } : item
                )
            );

            setSnackbarMessage("Alteração salva com sucesso!");
            setSnackbarSeverity("success");
        } catch (error: any) {
            console.error("Erro ao salvar alterações:", error);
            setSnackbarMessage(error.response?.data?.message ?? "Erro ao salvar alterações. Tente novamente.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(null);
            setSnackbarOpen(true);
        }
    };

    const renderSelected = (selected: number, options: { id: number; nome: string; cor: string }[]) => {
        const option = options.find((opt) => opt.id === selected);
        return option ? option.nome : "";
    };

    const columns: Column<Transaction>[] = React.useMemo(
        () => [
            {
                Header: "Data",
                accessor: "data",
                Cell: ({ value }: any) => {
                    const formattedDate = moment(value).add(3, "hour").utc(true).format("DD/MM/YYYY");
                    return <span>{formattedDate}</span>;
                },
            },
            {
                Header: "Valor",
                accessor: "valor",
                Cell: ({ value }: any) => {
                    const formattedValue = formatCurrency(value);
                    return <span>{formattedValue}</span>;
                },
            },
            { Header: "Descrição", accessor: "descricao" },
            {
                Header: "Categoria",
                accessor: "categoria_id",
                Cell: ({ row }: any) => {
                    const { id } = row.original;
                    return (
                        <FormControl fullWidth>
                            <Select
                                value={row.original.categoria_id || ""}
                                onChange={(e) => handleChange(id, "categoria_id", Number(e.target.value))}
                                renderValue={(selected) => renderSelected(selected, categoriaOptions)}
                                style={{ backgroundColor: row.original.categoria?.cor || "red" }}
                            >
                                {categoriaOptions.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id}>
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
                            <Select
                                value={row.original.tipo_id || ""}
                                onChange={(e) => handleChange(id, "tipo_id", Number(e.target.value))}
                                renderValue={(selected) => renderSelected(selected, tipoOptions)}
                                style={{ backgroundColor: row.original.tipo?.cor || "red" }}
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
        [categoriaOptions, tipoOptions]
    );

    const tableInstance = useTable({ columns, data: tableData });

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
                            const { key, ...rowProps } = row.getRowProps();
                            return (
                                <TableRow key={row.id} {...rowProps}>
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
