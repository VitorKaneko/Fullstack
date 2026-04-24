const { useMemo } = React;
const { Grid, Typography } = MaterialUI;

const TeamGrid = ({ times }) => {
    const timesDeVolei = useMemo(() => {
        return times.filter((time) => {

            if (!time.strSport) return false;
            
            return time.strSport.toLowerCase() === 'volleyball';
        });
    }, [times]);

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