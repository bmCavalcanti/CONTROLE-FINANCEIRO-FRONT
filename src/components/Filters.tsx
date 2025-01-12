import React, { useState } from "react";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Stack, SelectChangeEvent, Box } from "@mui/material";
import moment from "moment";

interface FiltersProps {
    onFilter: (filters: { data_inicio?: string; data_fim?: string; categorias?: number[]; tipos?: number[] }) => void;
    categoriaOptions: { id: number; nome: string }[];
    tipoOptions: { id: number; nome: string }[];
}

const Filters: React.FC<FiltersProps> = ({ onFilter, categoriaOptions, tipoOptions }) => {
    const [dataInicio, setDataInicio] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [dataFim, setDataFim] = useState(moment().endOf('month').format('YYYY-MM-DD'));
    const [categorias, setCategorias] = useState<number[]>([]);
    const [tipos, setTipos] = useState<number[]>([]);

    const applyFilters = () => {
        onFilter({ data_inicio: dataInicio, data_fim: dataFim, categorias, tipos });
    };

    const handleSelectChange = (e: SelectChangeEvent<typeof categorias>, setter: React.Dispatch<React.SetStateAction<number[]>>) => {
        const selectedValues = e.target.value as number[];
        setter(selectedValues);
    };

    const renderSelected = (selected: number[], options: { id: number; nome: string }[]) => {
        return selected
            .map((id) => {
                const option = options.find((opt) => opt.id === id);
                return option ? option.nome : '';
            })
            .join(", ");
    };

    return (
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ maxWidth: "100%" }}>
            <Box sx={{ flex: 1 }}>
                <TextField size="small"
                    label="Data Início"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                />
            </Box>
            <Box sx={{ flex: 1 }}>
                <TextField size="small"
                    label="Data Fim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                />
            </Box>
            <Box sx={{ flex: 1 }}>
                <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel>Categoria</InputLabel>
                    <Select
                        multiple
                        value={categorias}
                        onChange={(e) => handleSelectChange(e, setCategorias)}
                        label="Categoria"
                        renderValue={(selected) => renderSelected(selected as number[], categoriaOptions)}
                    >
                        {categoriaOptions.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
                <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        multiple
                        value={tipos}
                        onChange={(e) => handleSelectChange(e, setTipos)}
                        label="Tipo"
                        renderValue={(selected) => renderSelected(selected as number[], tipoOptions)}
                    >
                        {tipoOptions.map((tipo) => (
                            <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
                <Button variant="contained" color="primary" onClick={applyFilters}>
                    Filtrar
                </Button>
            </Box>
        </Stack>
    );
};

export default Filters;
