// Extrai os hooks e componentes das variáveis globais
const { useState } = React;
const { TextField, Button, Alert, CircularProgress } = MaterialUI;

const SearchBar = ({ setTimes }) => {
    const [termo, setTermo] = useState('');
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const handleBusca = async () => {
        // Validação ANTES do envio (Critério de avaliação)
        if (termo.trim().length < 3) {
            setErro("Digite pelo menos 3 caracteres para buscar.");
            setTimes([]); // Limpa a tela se houver erro
            return;
        }

        setErro(null);
        setCarregando(true);

        try {
            // Chamada AJAX pura com fetch
            const resposta = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${termo}`);
            const dados = await resposta.json();

            // Validação DEPOIS do envio
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
            
            {/* Exibe o alerta de erro caso a validação falhe */}
            {erro && <Alert severity="error">{erro}</Alert>}
        </div>
    );
};