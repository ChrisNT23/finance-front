import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSummary();
  }, [navigate]);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/transactions/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el resumen');
      }

      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#333',
  };

  const cardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const cardTitleStyle = {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '0.5rem',
  };

  const cardValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const chartContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
  };

  const chartTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333',
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#EF4444' }}>{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div style={containerStyle}>
        <p>Cargando...</p>
      </div>
    );
  }

  const monthlyData = {
    labels: summary.monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Ingresos',
        data: summary.monthlyData.map(data => data.income),
        borderColor: '#10B981',
        backgroundColor: '#10B98120',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Gastos',
        data: summary.monthlyData.map(data => data.expenses),
        borderColor: '#EF4444',
        backgroundColor: '#EF444420',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: summary.categoryData.map(data => data.name),
    datasets: [
      {
        data: summary.categoryData.map(data => data.amount),
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
          '#14B8A6',
          '#F97316',
        ],
        borderWidth: 1,
      },
    ],
  };

  const balanceData = {
    labels: summary.monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Balance',
        data: summary.monthlyData.map(data => data.balance),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dashboard</h1>
      
      <div style={cardsContainerStyle}>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Ingresos Totales</h3>
          <p style={{...cardValueStyle, color: '#10B981'}}>
            {formatAmount(summary.totalIncome)}
          </p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Gastos Totales</h3>
          <p style={{...cardValueStyle, color: '#EF4444'}}>
            {formatAmount(summary.totalExpenses)}
          </p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Balance</h3>
          <p style={{...cardValueStyle, color: summary.balance >= 0 ? '#10B981' : '#EF4444'}}>
            {formatAmount(summary.balance)}
          </p>
        </div>
      </div>

      <div style={chartContainerStyle}>
        <h2 style={chartTitleStyle}>Tendencias Mensuales</h2>
        <Line
          data={monthlyData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${formatAmount(context.raw)}`;
                  }
                }
              }
            },
            scales: {
              y: {
                ticks: {
                  callback: function(value) {
                    return formatAmount(value);
                  }
                }
              }
            }
          }}
        />
      </div>

      <div style={chartContainerStyle}>
        <h2 style={chartTitleStyle}>Distribución por Categoría</h2>
        <Doughnut
          data={categoryData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${formatAmount(value)} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>

      <div style={chartContainerStyle}>
        <h2 style={chartTitleStyle}>Balance Mensual</h2>
        <Line
          data={balanceData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Balance: ${formatAmount(context.raw)}`;
                  }
                }
              }
            },
            scales: {
              y: {
                ticks: {
                  callback: function(value) {
                    return formatAmount(value);
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard; 