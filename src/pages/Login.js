import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/authSlice';
import axios from '../utils/axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      console.log('Intentando login...');
      const response = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Respuesta del servidor:', response.data);
      const { token } = response.data;
      
      console.log('Dispatching token...');
      dispatch(setToken(token));
      
      console.log('Navegando a dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');
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