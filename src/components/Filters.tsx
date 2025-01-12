import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Stack, SelectChangeEvent, Box, ButtonGroup } from "@mui/material";
import moment from "moment";

interface FiltersProps {
    onFilter: (filters: { data_inicio?: string; data_fim?: string; categorias?: number[]; tipos?: number[] }) => void;
    categoriaOptions?: { id: number; nome: string }[];
    tipoOptions?: { id: number; nome: string }[];
}

const Filters: React.FC<FiltersProps> = ({ onFilter, categoriaOptions, tipoOptions }) => {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [categorias, setCategorias] = useState<number[]>([]);
    const [tipos, setTipos] = useState<number[]>([]);

    const applyFilters = () => {
        onFilter({ data_inicio: dataInicio, data_fim: dataFim, categorias, tipos });
    };

    const handleSelectChange = (e: SelectChangeEvent<typeof categorias>, setter: React.Dispatch<React.SetStateAction<number[]>>) => {
        const selectedValues = e.target.value as number[];
        setter(selectedValues);
    };

    useEffect(() => handleQuickFilter("currentMonth"), []);

    const renderSelected = (selected: number[], options: { id: number; nome: string }[]) => {
        return selected
            .map((id) => {
                const option = options.find((opt) => opt.id === id);
                return option ? option.nome : '';
            })
            .join(", ");
    };

    const handleQuickFilter = (range: string) => {
        let startDate = moment();
        let endDate = moment();

        switch (range) {
            case "last12Months":
                startDate = moment().add(-12, "months").startOf('month');
                break;
            case "lastWeek":
                startDate = moment().add(-1, "week").startOf('day');
                break;
            case "last30Days":
                startDate = moment().add(-30, "days");
                break;
            case "currentMonth":
                startDate = moment().startOf('month');
                break;
            case "last6Months":
                startDate = moment().add(-6, "months").startOf('month');
                break;
            case "last3Months":
                startDate = moment().add(-3, "months").startOf('month');
                break;
            default:
                startDate = moment().startOf('month');
                return;
        }

        setDataInicio(startDate.format('YYYY-MM-DD'));
        setDataFim(endDate.format('YYYY-MM-DD'));
    };

    return (
        <Stack direction="column" spacing={2} sx={{ maxWidth: "100%" }}>
            <ButtonGroup color="success"  variant="contained" fullWidth >
                <Button size="small" onClick={() => handleQuickFilter("lastWeek")}>Última semana</Button>
                <Button size="small" onClick={() => handleQuickFilter("currentMonth")}>Mês atual</Button>
                <Button size="small" onClick={() => handleQuickFilter("last30Days")}>Últimos 30 dias</Button>
                <Button size="small" onClick={() => handleQuickFilter("last3Months")}>Últimos 3 meses</Button>
                <Button size="small" onClick={() => handleQuickFilter("last6Months")}>Últimos 6 meses</Button>
                <Button size="small" onClick={() => handleQuickFilter("last12Months")}>Últimos 12 meses</Button>
            </ButtonGroup>

            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ maxWidth: "100%", paddingY: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <TextField
                        size="small"
                        label="Data Início"
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <TextField
                        size="small"
                        label="Data Fim"
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Box>
                {
                    categoriaOptions ?
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
                    : <></>
                }
                {
                    tipoOptions ?
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
                    : <></>
                }
                <Box sx={{ flex: 1 }}>
                    <Button variant="contained" color="success" onClick={applyFilters}>
                        Filtrar
                    </Button>
                </Box>
            </Stack>
        </Stack>
    );
};

export default Filters;
