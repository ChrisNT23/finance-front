import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
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
      <h1 style={titleStyle}>Crear Cuenta</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="name" style={labelStyle}>
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
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
        <div style={inputGroupStyle}>
          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Registrarse
        </button>
        {error && <p style={errorStyle}>{error}</p>}
        <Link to="/login" style={linkStyle}>
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </form>
    </div>
  );
};

export default Register; 