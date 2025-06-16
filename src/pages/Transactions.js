import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import { theme } from '../theme';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const { token } = useSelector((state) => state.auth);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpen = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category._id,
        description: transaction.description || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaction(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category || !newTransaction.date) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (Number(newTransaction.amount) <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }

    try {
      const response = await axios.post('/transactions', {
        ...newTransaction,
        amount: Number(newTransaction.amount),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la transacción');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      return;
    }

    try {
      await axios.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al eliminar la transacción');
    }
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing.xl,
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

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  };

  const labelStyle = {
    ...theme.typography.body2,
    color: theme.colors.textLight,
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

  const transactionsListStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
  };

  const transactionItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  };

  const transactionInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  };

  const transactionDescriptionStyle = {
    ...theme.typography.body1,
    fontWeight: 500,
  };

  const transactionDetailsStyle = {
    ...theme.typography.body2,
    color: theme.colors.textLight,
  };

  const transactionAmountStyle = {
    ...theme.typography.body1,
    fontWeight: 500,
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Transacciones</h1>

      <div style={formStyle}>
        <h2 style={formTitleStyle}>Nueva Transacción</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Descripción</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Monto</label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                required
                min="0"
                step="0.01"
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Tipo</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                style={selectStyle}
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Categoría</label>
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                required
                style={selectStyle}
              >
                <option value="">Seleccionar categoría</option>
                {Array.isArray(categories) && categories
                  .filter(cat => cat.type === newTransaction.type)
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Fecha</label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <button type="submit" style={buttonStyle}>
            Agregar Transacción
          </button>
          {error && <p style={errorStyle}>{error}</p>}
        </form>
      </div>

      <div style={transactionsListStyle}>
        <h2 style={formTitleStyle}>Historial de Transacciones</h2>
        {transactions.length === 0 ? (
          <p style={{ ...theme.typography.body1, color: theme.colors.textLight, textAlign: 'center' }}>
            No hay transacciones registradas
          </p>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction._id} style={transactionItemStyle}>
              <div style={transactionInfoStyle}>
                <span style={transactionDescriptionStyle}>{transaction.description}</span>
                <span style={transactionDetailsStyle}>
                  {formatDate(transaction.date)} • {transaction.category?.name || 'Sin categoría'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                <span style={{
                  ...transactionAmountStyle,
                  color: transaction.type === 'income' ? theme.colors.success : theme.colors.error,
                }}>
                  {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount)}
                </span>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  style={deleteButtonStyle}
                  aria-label="Eliminar transacción"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: '$',
              }}
            />

            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              required
            >
              {categories
                .filter((cat) => cat.type === formData.type)
                .map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: category.color || theme.palette.primary.main,
                          mr: 1
                        }}
                      />
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Transactions; 