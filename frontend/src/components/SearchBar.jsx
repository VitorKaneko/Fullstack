import React, { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'

const MIN_QUERY_LENGTH = 3

export default function SearchBar({ onSearch, isLoading }) {
  const [inputValue, setInputValue] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) {
      setValidationError('O campo de busca é obrigatório.')
      return
    }
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setValidationError(`Digite ao menos ${MIN_QUERY_LENGTH} caracteres.`)
      return
    }
    setValidationError('')
    onSearch(trimmed)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 2, maxWidth: 600, mx: 'auto', mb: 4 }}
    >
      <TextField
        fullWidth
        label="Buscar time de vôlei"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        error={Boolean(validationError)}
        helperText={validationError}
        disabled={isLoading}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? 'Buscando...' : 'Buscar'}
      </Button>
    </Box>
  )
}