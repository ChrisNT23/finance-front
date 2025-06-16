import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Statistics() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    byCategory: {},
  });
  const [timeRange, setTimeRange] = useState('month');
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchStatistics();
  }, [token, timeRange]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `/transactions/statistics?timeRange=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    const categories = Object.keys(statistics.byCategory);
    const incomeData = categories.map(
      (category) => statistics.byCategory[category].income
    );
    const expenseData = categories.map(
      (category) => statistics.byCategory[category].expense
    );

    return {
      labels: categories,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  };

  const getPieChartData = () => {
    const categories = Object.keys(statistics.byCategory);
    const expenseData = categories.map(
      (category) => statistics.byCategory[category].expense
    );

    return {
      labels: categories,
      datasets: [
        {
          data: expenseData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Statistics</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Income vs Expenses by Category
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar
                data={getChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Expense Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <Pie
                data={getPieChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="success.main">
                  Total Income: ${statistics.totalIncome.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="error.main">
                  Total Expenses: ${statistics.totalExpense.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle1"
                  color={
                    statistics.totalIncome - statistics.totalExpense >= 0
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  Net Balance: $
                  {(statistics.totalIncome - statistics.totalExpense).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Statistics; 