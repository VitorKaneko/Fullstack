import React, { createContext, useContext, useState } from 'react'

export const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = (team) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.find((fav) => fav.idTeam === team.idTeam)
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.idTeam !== team.idTeam)
      } else {
        return [...prevFavorites, team]
      }
    })
  }

  const isFavorited = (teamId) =>
    favorites.some((fav) => fav.idTeam === teamId)

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorited,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider')
  }
  return context
}