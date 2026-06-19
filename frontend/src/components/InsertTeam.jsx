import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Alert,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const INITIAL = { strTeam: '', strCountry: '', strStadium: '', strTeamBadge: '' }

export default function InsertTeamForm({ open, onClose, onSuccess }) {
  const { token, apiUrl } = useAuth()

  const [form, setForm] = useState(INITIAL)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errors = {}
    if (form.strTeam.trim().length < 2) errors.strTeam = 'Nome do time obrigatório.'
    if (!form.strCountry.trim()) errors.strCountry = 'País obrigatório.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const close = () => {
    setForm(INITIAL)
    setFieldErrors({})
    setServerError('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${apiUrl}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          strTeam: form.strTeam.trim(),
          strCountry: form.strCountry.trim(),
          strStadium: form.strStadium.trim(),
          strTeamBadge: form.strTeamBadge.trim(),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.errors?.[0]?.message || 'Erro ao inserir.')
      }
      onSuccess?.(data.team)
      close()
    } catch (err) {
      setServerError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>Cadastrar novo time</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}

          <TextField
            label="Nome do time *"
            value={form.strTeam}
            onChange={handleChange('strTeam')}
            error={Boolean(fieldErrors.strTeam)}
            helperText={fieldErrors.strTeam}
            disabled={isSubmitting}
          />
          <TextField
            label="País *"
            value={form.strCountry}
            onChange={handleChange('strCountry')}
            error={Boolean(fieldErrors.strCountry)}
            helperText={fieldErrors.strCountry}
            disabled={isSubmitting}
          />
          <TextField
            label="Ginásio / Estádio"
            value={form.strStadium}
            onChange={handleChange('strStadium')}
            disabled={isSubmitting}
          />
          <TextField
            label="URL do escudo (opcional)"
            value={form.strTeamBadge}
            onChange={handleChange('strTeamBadge')}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}