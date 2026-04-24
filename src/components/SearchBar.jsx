import React, { useState } from 'react';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';

const SearchBar = ({ setTimes }) => {
    const [termo, setTermo] = useState('');
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const handleBusca = async () => {
        if (termo.trim().length < 3) {
            setErro("Digite pelo menos 3 caracteres para buscar.");
            setTimes([]);
            return;
        }

        setErro(null);
        setCarregando(true);

        try {
            const resposta = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${termo}`);
            const dados = await resposta.json();

            if (dados.teams) {
                setTimes(dados.teams);
            } else {
                setTimes([]);
                setErro("Nenhum time encontrado com este nome.");
            }
        } catch (error) {
            setErro("Falha na conexão com a API. Tente novamente.");
            setTimes([]);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <TextField 
                    label="Nome do Clube" 
                    variant="outlined" 
                    fullWidth
                    value={termo} 
                    onChange={(e) => setTermo(e.target.value)}
                    error={!!erro}
                />
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleBusca} 
                    disabled={carregando}
                    style={{ minWidth: '120px' }}
                >
                    {carregando ? <CircularProgress size={24} color="inherit" /> : "Buscar"}
                </Button>
            </div>
            
            {erro && <Alert severity="error">{erro}</Alert>}
        </div>
    );
};

export default SearchBar;