const { useContext } = React;
const { Card, CardMedia, CardContent, CardActions, Typography, Button } = MaterialUI;

const TeamCard = ({ time }) => {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    
    const isFavorito = favorites.some((fav) => fav.idTeam === time.idTeam);

    return (
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={time.strTeamBadge || 'https://via.placeholder.com/200?text=Sem+Escudo'}  
                alt={`Escudo do ${time.strTeam}`}
                style={{ objectFit: 'contain', padding: '10px', backgroundColor: '#f5f5f5' }}
            />
            
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