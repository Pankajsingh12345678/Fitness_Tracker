import React, { useState, useEffect } from 'react';
import { workoutAPI, calorieAPI, waterAPI } from '../utils/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaChartLine } from 'react-icons/fa';
import './Progress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [workoutStats, setWorkoutStats] = useState(null);
  const [calorieStats, setCalorieStats] = useState(null);
  const [waterStats, setWaterStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      const [workoutRes, calorieRes, waterRes] = await Promise.all([
        workoutAPI.getStats(period),
        calorieAPI.getStats(period),
        waterAPI.getStats(period)
      ]);

      setWorkoutStats(workoutRes.data);
      setCalorieStats(calorieRes.data);
      setWaterStats(waterRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const workoutChartData = {
    labels: workoutStats?.workoutsByType?.map(w => w._id) || [],
    datasets: [
      {
        label: 'Workouts by Type',
        data: workoutStats?.workoutsByType?.map(w => w.count) || [],
        backgroundColor: [
          'rgba(102, 126, 234, 0.7)',
          'rgba(72, 187, 120, 0.7)',
          'rgba(237, 137, 54, 0.7)',
          'rgba(229, 62, 62, 0.7)',
          'rgba(128, 90, 213, 0.7)'
        ],
        borderColor: [
          '#667eea',
          '#48bb78',
          '#ed8936',
          '#e53e3e',
          '#805ad5'
        ],
        borderWidth: 2
      }
    ]
  };

  const calorieChartData = {
    labels: calorieStats?.caloriesByMeal?.map(c => c._id) || [],
    datasets: [
      {
        label: 'Calories by Meal',
        data: calorieStats?.caloriesByMeal?.map(c => c.totalCalories) || [],
        backgroundColor: 'rgba(237, 137, 54, 0.7)',
        borderColor: '#ed8936',
        borderWidth: 2
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
    }
  };

  if (loading) {
    return <div className="loading">Loading progress...</div>;
  }

  return (
    <div className="progress-container fade-in">
      <div className="progress-header">
        <h1>
          <FaChartLine /> Progress & Analytics
        </h1>
        <div className="period-selector">
          <button
            className={period === 'week' ? 'active' : ''}
            onClick={() => setPeriod('week')}
          >
            This Week
          </button>
          <button
            className={period === 'month' ? 'active' : ''}
            onClick={() => setPeriod('month')}
          >
            This Month
          </button>
          <button
            className={period === 'year' ? 'active' : ''}
            onClick={() => setPeriod('year')}
          >
            This Year
          </button>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card workout-stat">
          <h3>Workout Summary</h3>
          <div className="stat-details">
            <div className="detail">
              <span className="detail-label">Total Workouts</span>
              <span className="detail-value">{workoutStats?.stats?.totalWorkouts || 0}</span>
            </div>
            <div className="detail">
              <span className="detail-label">Total Duration</span>
              <span className="detail-value">{workoutStats?.stats?.totalDuration || 0} min</span>
            </div>
            <div className="detail">
              <span className="detail-label">Calories Burned</span>
              <span className="detail-value">{workoutStats?.stats?.totalCaloriesBurned || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card calorie-stat">
          <h3>Calorie Summary</h3>
          <div className="stat-details">
            <div className="detail">
              <span className="detail-label">Total Entries</span>
              <span className="detail-value">{calorieStats?.stats?.totalEntries || 0}</span>
            </div>
            <div className="detail">
              <span className="detail-label">Total Calories</span>
              <span className="detail-value">{calorieStats?.stats?.totalCalories || 0}</span>
            </div>
            <div className="detail">
              <span className="detail-label">Avg per Meal</span>
              <span className="detail-value">{Math.round(calorieStats?.stats?.avgCalories || 0)}</span>
            </div>
          </div>
        </div>

        <div className="stat-card water-stat">
          <h3>Water Summary</h3>
          <div className="stat-details">
            <div className="detail">
              <span className="detail-label">Total Entries</span>
              <span className="detail-value">{waterStats?.stats?.totalEntries || 0}</span>
            </div>
            <div className="detail">
              <span className="detail-label">Total Intake</span>
              <span className="detail-value">{waterStats?.stats?.totalAmount || 0} ml</span>
            </div>
            <div className="detail">
              <span className="detail-label">Avg per Entry</span>
              <span className="detail-value">{Math.round(waterStats?.stats?.avgAmount || 0)} ml</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Workout Distribution</h2>
          <div className="chart-container">
            <Bar data={workoutChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h2>Calorie Distribution</h2>
          <div className="chart-container">
            <Bar data={calorieChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="insights-card">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          <div className="insight">
            <div className="insight-icon">🏆</div>
            <div className="insight-content">
              <h4>Most Active Workout</h4>
              <p>
                {workoutStats?.workoutsByType?.length > 0
                  ? workoutStats.workoutsByType.reduce((a, b) => a.count > b.count ? a : b)._id
                  : 'No data'}
              </p>
            </div>
          </div>

          <div className="insight">
            <div className="insight-icon">🔥</div>
            <div className="insight-content">
              <h4>Average Daily Burn</h4>
              <p>
                {period === 'week'
                  ? Math.round((workoutStats?.stats?.totalCaloriesBurned || 0) / 7)
                  : period === 'month'
                  ? Math.round((workoutStats?.stats?.totalCaloriesBurned || 0) / 30)
                  : workoutStats?.stats?.totalCaloriesBurned || 0}{' '}
                calories
              </p>
            </div>
          </div>

          <div className="insight">
            <div className="insight-icon">💧</div>
            <div className="insight-content">
              <h4>Daily Water Average</h4>
              <p>
                {period === 'week'
                  ? Math.round((waterStats?.stats?.totalAmount || 0) / 7)
                  : period === 'month'
                  ? Math.round((waterStats?.stats?.totalAmount || 0) / 30)
                  : waterStats?.stats?.totalAmount || 0}{' '}
                ml
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
