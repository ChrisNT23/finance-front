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

  // Responsive: close menu on navigation
  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
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
    <nav className="responsive-container" style={{backgroundColor: theme.colors.surface, boxShadow: theme.shadows.sm, position: 'sticky', top: 0, zIndex: 1000, padding: 0}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '56px'}}>
        <span style={{color: theme.colors.primary, fontSize: '2rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer'}} onClick={() => handleNavClick('/')}>FinancePlan</span>
        <div className="desktop-nav" style={{display: 'flex', gap: theme.spacing.xl, alignItems: 'center'}}>
          <div className="nav-links" style={{display: 'flex', gap: theme.spacing.xl, alignItems: 'center'}}>
            <Link to="/dashboard" style={{color: theme.colors.text, textDecoration: 'none'}}>Dashboard</Link>
            <Link to="/transactions" style={{color: theme.colors.text, textDecoration: 'none'}}>Transacciones</Link>
            <Link to="/categories" style={{color: theme.colors.text, textDecoration: 'none'}}>Categorías</Link>
            <Link to="/statistics" style={{color: theme.colors.text, textDecoration: 'none'}}>Estadísticas</Link>
          </div>
          {isAuthenticated && (
            <button onClick={handleLogout} style={{background: 'none', border: 'none', color: theme.colors.error, fontWeight: 600, cursor: 'pointer'}}>Salir</button>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mobile-nav" style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0'}}>
          <Link to="/dashboard" onClick={() => handleNavClick('/dashboard')}>Dashboard</Link>
          <Link to="/transactions" onClick={() => handleNavClick('/transactions')}>Transacciones</Link>
          <Link to="/categories" onClick={() => handleNavClick('/categories')}>Categorías</Link>
          <Link to="/statistics" onClick={() => handleNavClick('/statistics')}>Estadísticas</Link>
          {isAuthenticated && (
            <button onClick={handleLogout} style={{background: 'none', border: 'none', color: theme.colors.error, fontWeight: 600, cursor: 'pointer'}}>Salir</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 