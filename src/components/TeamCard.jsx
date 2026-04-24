const { useContext } = React;
const { Card, CardMedia, CardContent, CardActions, Typography, Button } = MaterialUI;

const TeamCard = ({ time }) => {
    // Consome o Contexto Global criado no arquivo FavoritesContext.jsx
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    
    // Verifica se este card específico já está no array de favoritos
    const isFavorito = favorites.some((fav) => fav.idTeam === time.idTeam);

    return (
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Escudo do time */}
            <CardMedia
                component="img"
                height="200"
                image={time.strTeamBadge || 'https://via.placeholder.com/200?text=Sem+Escudo'}
                alt={`Escudo do ${time.strTeam}`}
                style={{ objectFit: 'contain', padding: '10px', backgroundColor: '#f5f5f5' }}
            />
            
            {/* Informações do time */}
            <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {time.strTeam}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>País:</strong> {time.strCountry}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Estádio:</strong> {time.strStadium || "Não informado"}
                </Typography>
            </CardContent>

            {/* Botão de Favoritar (Comunica com o Context API) */}
            <CardActions>
                <Button 
                    size="small" 
                    color={isFavorito ? "secondary" : "primary"}
                    onClick={() => toggleFavorite(time)}
                    variant={isFavorito ? "contained" : "outlined"}
                    fullWidth
                >
                    {isFavorito ? "Remover Favorito" : "⭐ Favoritar"}
                </Button>
            </CardActions>
        </Card>
    );
};