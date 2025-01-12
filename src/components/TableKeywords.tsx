import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Badge } from "@mui/material";
import { Edit } from "@mui/icons-material";

interface Item {
    id: number;
    nome: string;
    cor: string;
}

interface Keywords {
    id: number;
    nome: string;
    tipo_id: number | null;
    categoria_id: number | null;
    categoria: Item;
    tipo: Item;
}

interface TableKeywordsProps {
    data: Keywords[];
    fetchData: (filters?: any) => void;
    onEdit: (filters?: any) => void;
    categoriaOptions: { id: number; nome: string, cor: string }[];
    tipoOptions: { id: number; nome: string; cor: string }[];
}

const TableKeywords: React.FC<TableKeywordsProps> = ({ data, fetchData, categoriaOptions, tipoOptions, onEdit  }) => {

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((palavra) => (
                        <TableRow key={palavra.id}>
                            <TableCell>{palavra.nome}</TableCell>
                            <TableCell>
                                <Badge
                                    // badgeContent={palavra.categoria.nome}
                                    sx={{
                                        backgroundColor: palavra.categoria.cor,
                                        padding: 1,
                                        borderRadius: '5px',
                                    }}
                                >
                                    {palavra.categoria.nome}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    // badgeContent={palavra.tipo.nome}
                                    sx={{
                                        backgroundColor: palavra.tipo.cor,
                                        padding: 1,
                                        borderRadius: '5px',
                                    }}
                                >
                                    {palavra.tipo.nome}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <Button onClick={() => onEdit(palavra)} color="success"><Edit /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableKeywords;
