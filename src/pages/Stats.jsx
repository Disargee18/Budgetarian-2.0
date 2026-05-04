import React from 'react';
import { useUser } from '../context/UserContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import './Stats.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Stats = () => {
  const { mealPlan, budget } = useUser();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Prepare data
  const calorieData = days.map(day => {
    if (!mealPlan[day]) return 0;
    return Object.values(mealPlan[day])
      .filter(m => m.eaten)
      .reduce((acc, m) => acc + m.cals, 0);
  });

  const costData = days.map(day => {
    if (!mealPlan[day]) return 0;
    return Object.values(mealPlan[day])
      .filter(m => m.eaten)
      .reduce((acc, m) => acc + m.cost, 0);
  });

  const dailyBudgetTarget = budget.weekly / 7;

  const barChartData = {
    labels: days.map(d => d.substring(0, 3)),
    datasets: [
      {
        label: 'Calories Intake',
        data: calorieData,
        backgroundColor: 'rgba(59, 109, 17, 0.6)',
        borderColor: '#3B6D11',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const lineChartData = {
    labels: days.map(d => d.substring(0, 3)),
    datasets: [
      {
        label: 'Daily Spend',
        data: costData,
        borderColor: '#BA7517',
        backgroundColor: 'rgba(186, 117, 23, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Daily Budget Target',
        data: days.map(() => dailyBudgetTarget),
        borderColor: '#555',
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 1,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="stats-container">
      <header className="mb-lg">
        <h2>Your Statistics</h2>
        <p className="text-muted">Track your progress and spending.</p>
      </header>
      
      <div className="bento-container stats-grid">
        <div className="bento-card chart-card">
          <h3 className="mb-md">Calorie Intake</h3>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={options} />
          </div>
        </div>

        <div className="bento-card chart-card">
          <h3 className="mb-md">Budget Spend</h3>
          <div className="chart-wrapper">
            <Line data={lineChartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
