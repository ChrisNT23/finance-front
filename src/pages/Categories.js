import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' });
  const [error, setError] = useState('');
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/categories', newCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories([...categories, response.data]);
      setNewCategory({ name: '', type: 'expense' });
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la categoría');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    try {
      await axios.delete(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter(cat => cat._id !== categoryId));
    } catch (error) {
      setError(error.response?.data?.message || 'Error al eliminar la categoría');
    }
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
  };

  const titleStyle = {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  };

  const formStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
    marginBottom: theme.spacing.xl,
  };

  const formTitleStyle = {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  };

  const inputGroupStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  };

  const inputStyle = {
    flex: 1,
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

  const selectStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.body1.fontSize,
    backgroundColor: theme.colors.surface,
    cursor: 'pointer',
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
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
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
    marginTop: theme.spacing.md,
  };

  const categoriesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: theme.spacing.lg,
  };

  const categoryCardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.md,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const categoryNameStyle = {
    ...theme.typography.body1,
    fontWeight: 500,
  };

  const categoryTypeStyle = {
    ...theme.typography.body2,
    color: theme.colors.textLight,
    textTransform: 'capitalize',
  };

  const deleteButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.error,
    cursor: 'pointer',
    padding: theme.spacing.sm,
    fontSize: theme.typography.body2.fontSize,
    transition: theme.transitions.default,
    '&:hover': {
      color: theme.colors.error,
      opacity: 0.8,
    },
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Categorías</h1>

      <div style={formStyle}>
        <h2 style={formTitleStyle}>Nueva Categoría</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Nombre de la categoría"
              required
              style={inputStyle}
            />
            <select
              value={newCategory.type}
              onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
              style={selectStyle}
            >
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
          </div>
          <button type="submit" style={buttonStyle}>
            Agregar Categoría
          </button>
          {error && <p style={errorStyle}>{error}</p>}
        </form>
      </div>

      <div style={categoriesGridStyle}>
        {Array.isArray(categories) && categories.map((category) => (
          <div key={category._id} style={categoryCardStyle}>
            <div>
              <h3 style={categoryNameStyle}>{category.name}</h3>
              <p style={categoryTypeStyle}>
                {category.type === 'income' ? 'Ingreso' : 'Gasto'}
              </p>
            </div>
            <button
              onClick={() => handleDelete(category._id)}
              style={deleteButtonStyle}
              aria-label="Eliminar categoría"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories; 