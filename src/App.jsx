
const { useState, useMemo } = React;
const { Container, Typography } = MaterialUI;

const App = () => {
    const [times, setTimes] = useState([]);

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h3" color="primary" gutterBottom>
                🏐 VolleyHub
            </Typography>
            
            {/* Os componentes abaixo estarão visíveis pois foram carregados antes no index.html */}
            <SearchBar setTimes={setTimes} />
            <TeamGrid times={times} />
        </Container>
    );
};