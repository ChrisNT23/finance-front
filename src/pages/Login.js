import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      if (!data.token) {
        throw new Error('No se recibió el token de autenticación');
      }

      // Guardar el token y los datos del usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Verificar que el token se guardó correctamente
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        throw new Error('Error al guardar el token');
      }

      // Navegar directamente al dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      // Limpiar el token si hay error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
  };

  const titleStyle = {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  };

  const labelStyle = {
    ...theme.typography.body2,
    color: theme.colors.textLight,
    fontWeight: 500,
  };

  const inputStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.body1.fontSize,
    transition: theme.transitions.default,
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 2px ${theme.colors.primaryLight}40`,
    },
  };

  const buttonStyle = {
    backgroundColor: theme.colors.primary,
    color: 'white',
    border: 'none',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 500,
    cursor: 'pointer',
    transition: theme.transitions.default,
    '&:hover': {
      backgroundColor: theme.colors.primaryDark,
    },
  };

  const errorStyle = {
    color: theme.colors.error,
    fontSize: theme.typography.body2.fontSize,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  };

  const linkStyle = {
    color: theme.colors.primary,
    textDecoration: 'none',
    fontSize: theme.typography.body2.fontSize,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    '&:hover': {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="email" style={labelStyle}>
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="password" style={labelStyle}>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Iniciar Sesión
        </button>
        {error && <p style={errorStyle}>{error}</p>}
        <Link to="/register" style={linkStyle}>
          ¿No tienes una cuenta? Regístrate
        </Link>
      </form>
    </div>
  );
};

export default Login; 