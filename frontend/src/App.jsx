import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import SearchBar from './components/SearchBar.jsx';
import TeamGrid from './components/TeamGrid.jsx';

const App = () => {
    const [times, setTimes] = useState([]);

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h3" color="primary" gutterBottom>
                🏐 VolleyHub
            </Typography>
            
            <SearchBar setTimes={setTimes} />
            <TeamGrid times={times} />
        </Container>
    );
};

export default App; 