import React from 'react'
import { AppBar, Toolbar, Typography, Badge, Box, Button } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useFavorites } from '../contexts/FavoritesContext'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { favoritesCount } = useFavorites()
  const { user, logout } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">VolleyHub</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Badge badgeContent={favoritesCount} color="error">
            <FavoriteIcon />
          </Badge>

          {user?.email && (
            <Typography variant="body2">{user.email}</Typography>
          )}

          <Button color="inherit" onClick={logout}>
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}