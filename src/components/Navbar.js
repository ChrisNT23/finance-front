import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle = {
    color: theme.colors.primary,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const navLinksStyle = {
    display: 'flex',
    gap: theme.spacing.xl,
    alignItems: 'center',
  };

  const linkStyle = {
    color: theme.colors.text,
    textDecoration: 'none',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 500,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.default,
    '&:hover': {
      backgroundColor: theme.colors.background,
      color: theme.colors.primary,
    },
  };

  const buttonStyle = {
    backgroundColor: theme.colors.primary,
    color: 'white',
    border: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 500,
    transition: theme.transitions.default,
    '&:hover': {
      backgroundColor: theme.colors.primaryDark,
    },
  };

  const mobileMenuButtonStyle = {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing.sm,
  };

  const mobileMenuStyle = {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    boxShadow: theme.shadows.md,
  };

  if (isMenuOpen) {
    mobileMenuStyle.display = 'flex';
    mobileMenuStyle.flexDirection = 'column';
    mobileMenuStyle.gap = theme.spacing.md;
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          <span role="img" aria-label="money">💰</span>
          FinancePlan
        </Link>

        <button
          style={mobileMenuButtonStyle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span role="img" aria-label="menu">☰</span>
        </button>

        <div style={navLinksStyle}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
              <Link to="/transactions" style={linkStyle}>Transacciones</Link>
              <Link to="/categories" style={linkStyle}>Categorías</Link>
              <button onClick={handleLogout} style={buttonStyle}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Iniciar Sesión</Link>
              <Link to="/register" style={buttonStyle}>Registrarse</Link>
            </>
          )}
        </div>

        <div style={mobileMenuStyle}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
              <Link to="/transactions" style={linkStyle}>Transacciones</Link>
              <Link to="/categories" style={linkStyle}>Categorías</Link>
              <button onClick={handleLogout} style={buttonStyle}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Iniciar Sesión</Link>
              <Link to="/register" style={buttonStyle}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 