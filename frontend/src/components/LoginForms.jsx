import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginForm() {
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const errors = { email: '', password: '' }
    if (!email.trim()) {
      errors.email = 'O e-mail é obrigatório.'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Digite um e-mail válido.'
    }
    if (!password) {
      errors.password = 'A senha é obrigatória.'
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter ao menos 6 caracteres.'
    }
    setFieldErrors(errors)
    return !errors.email && !errors.password
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ maxWidth: 400, mx: 'auto', mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h4" align="center">
        VolleyHub — Login
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}

      <TextField
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={Boolean(fieldErrors.email)}
        helperText={fieldErrors.email}
        disabled={isSubmitting}
      />

      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={Boolean(fieldErrors.password)}
        helperText={fieldErrors.password}
        disabled={isSubmitting}
      />

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </Box>
  )
}