import React, { useState, useMemo } from 'react'
import { Container, Box, Typography, Button, Alert, Snackbar } from '@mui/material'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import Header from './components/Header'
import LoginForm from './components/LoginForm'
import SearchBar from './components/SearchBar'
import TeamGrid from './components/TeamGrid'
import InsertTeamForm from './components/InsertTeamForm'

function MainScreen() {
  const { token, apiUrl } = useAuth()

  const [teamData, setTeamData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [insertOpen, setInsertOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // useMemo: filtra apenas times de vôlei
  const volleyballTeams = useMemo(
    () => teamData.filter((team) => team.strSport === 'Volleyball'),
    [teamData],
  )

  const handleSearch = async (query) => {
    setIsLoading(true)
    setError(null)
    setTeamData([])
    setSearchPerformed(false)
    try {
      const response = await fetch(
        `${apiUrl}/teams/search?name=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.errors?.[0]?.message || 'Erro na busca.')
      }
      if (!data.teams || data.teams.length === 0) {
        throw new Error('Nenhum time encontrado.')
      }
      setTeamData(data.teams)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      setSearchPerformed(true)
    }
  }

  const handleInsertSuccess = (team) => {
    setSnackbar({
      open: true,
      message: `"${team.strTeam}" cadastrado com sucesso!`,
      severity: 'success',
    })
  }

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Busca de Times de Vôlei
        </Typography>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button variant="outlined" onClick={() => setInsertOpen(true)}>
            Cadastrar novo time
          </Button>
        </Box>

        {error && searchPerformed && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        <TeamGrid teams={volleyballTeams} searchPerformed={searchPerformed && !error} />
      </Container>

      <InsertTeamForm
        open={insertOpen}
        onClose={() => setInsertOpen(false)}
        onSuccess={handleInsertSuccess}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  )
}

function AppContent() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <MainScreen /> : <LoginForm />
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  )
}