const { useMemo } = React;
const { Grid, Typography } = MaterialUI;

const TeamGrid = ({ times }) => {
    // O Hook obrigatório: Memoriza o filtro para não recalcular à toa
    const timesDeVolei = useMemo(() => {
        return times.filter((time) => time.strSport === 'Volleyball');
    }, [times]);

    // Se a API retornou times, mas nenhum deles era de vôlei:
    if (times.length > 0 && timesDeVolei.length === 0) {
        return (
            <Typography variant="h6" color="textSecondary" align="center" style={{ marginTop: '20px' }}>
                Times encontrados, mas nenhum pertence à categoria "Volleyball".
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            {timesDeVolei.map((time) => (
                <Grid item xs={12} sm={6} md={4} key={time.idTeam}>
                    <TeamCard time={time} />
                </Grid>
            ))}
        </Grid>
    );
};