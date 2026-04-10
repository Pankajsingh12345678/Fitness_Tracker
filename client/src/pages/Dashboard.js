import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutAPI, calorieAPI, waterAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FaDumbbell,
  FaFire,
  FaTint,
  FaUtensils,
  FaCalendarAlt,
  FaPlus
} from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workouts: { totalWorkouts: 0, totalDuration: 0, totalCaloriesBurned: 0 },
    calories: { totalCalories: 0, totalEntries: 0 },
    water: { totalAmount: 0, totalEntries: 0 }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [workoutRes, calorieRes, waterRes] = await Promise.all([
        workoutAPI.getStats('week'),
        calorieAPI.getStats('week'),
        waterAPI.getStats('week')
      ]);

      setStats({
        workouts: workoutRes.data.stats,
        calories: calorieRes.data.stats,
        water: waterRes.data.stats
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Burned',
        data: [300, 450, 320, 500, 480, 400, 350],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const statCards = [
    {
      title: 'Total Workouts',
      value: stats.workouts.totalWorkouts || 0,
      icon: FaDumbbell,
      color: '#667eea',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      link: '/workouts'
    },
    {
      title: 'Duration (min)',
      value: stats.workouts.totalDuration || 0,
      icon: FaCalendarAlt,
      color: '#48bb78',
      bgColor: 'rgba(72, 187, 120, 0.1)',
      link: '/workouts'
    },
    {
      title: 'Calories Burned',
      value: stats.workouts.totalCaloriesBurned || 0,
      icon: FaFire,
      color: '#ed8936',
      bgColor: 'rgba(237, 137, 54, 0.1)',
      link: '/workouts'
    },
    {
      title: 'Calories Consumed',
      value: stats.calories.totalCalories || 0,
      icon: FaUtensils,
      color: '#e53e3e',
      bgColor: 'rgba(229, 62, 62, 0.1)',
      link: '/calories'
    },
    {
      title: 'Water Intake (ml)',
      value: stats.water.totalAmount || 0,
      icon: FaTint,
      color: '#3182ce',
      bgColor: 'rgba(49, 130, 206, 0.1)',
      link: '/water'
    }
  ];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's your fitness summary for this week</p>
        </div>
        <Link to="/workouts/add" className="add-workout-btn">
          <FaPlus />
          <span>Add Workout</span>
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <Link to={stat.link} key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
              <stat.icon style={{ color: stat.color }} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h2>Weekly Progress</h2>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/workouts/add" className="action-card">
              <FaDumbbell />
              <span>Log Workout</span>
            </Link>
            <Link to="/calories" className="action-card">
              <FaUtensils />
              <span>Track Calories</span>
            </Link>
            <Link to="/water" className="action-card">
              <FaTint />
              <span>Log Water</span>
            </Link>
            <Link to="/progress" className="action-card">
              <FaFire />
              <span>View Progress</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
