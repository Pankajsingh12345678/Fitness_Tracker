import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaDumbbell, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './Workout.css';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchWorkouts();
  }, [page]);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutAPI.getAll({ page, limit: 20 });
      setWorkouts(response.data.workouts);
    } catch (error) {
      toast.error('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      await workoutAPI.delete(id);
      toast.success('Workout deleted successfully');
      fetchWorkouts();
    } catch (error) {
      toast.error('Failed to delete workout');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'low': return '#48bb78';
      case 'medium': return '#ed8936';
      case 'high': return '#e53e3e';
      default: return '#718096';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'cardio': return '🏃';
      case 'strength': return '💪';
      case 'flexibility': return '🧘';
      case 'sports': return '⚽';
      default: return '🏋️';
    }
  };

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workouts-container fade-in">
      <div className="workouts-header">
        <h1>
          <FaDumbbell /> My Workouts
        </h1>
        <Link to="/workouts/add" className="add-btn">
          <FaPlus /> Add Workout
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state">
          <FaDumbbell className="empty-icon" />
          <h2>No workouts yet</h2>
          <p>Start tracking your fitness journey today!</p>
          <Link to="/workouts/add" className="add-btn">
            <FaPlus /> Add Your First Workout
          </Link>
        </div>
      ) : (
        <div className="workouts-list">
          {workouts.map((workout) => (
            <div key={workout._id} className="workout-card">
              <div className="workout-card-header">
                <div className="workout-type">
                  <span className="type-icon">{getTypeIcon(workout.exerciseType)}</span>
                  <div>
                    <h3>{workout.exerciseName}</h3>
                    <p className="workout-date">{formatDate(workout.date)}</p>
                  </div>
                </div>
                <div className="workout-actions">
                  <span
                    className="intensity-badge"
                    style={{ backgroundColor: getIntensityColor(workout.intensity) }}
                  >
                    {workout.intensity}
                  </span>
                  <button className="icon-btn" onClick={() => handleDelete(workout._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="workout-stats">
                <div className="stat">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{workout.duration} min</span>
                </div>
                {workout.caloriesBurned && (
                  <div className="stat">
                    <span className="stat-label">Calories</span>
                    <span className="stat-value">{workout.caloriesBurned}</span>
                  </div>
                )}
                {workout.sets && (
                  <div className="stat">
                    <span className="stat-label">Sets</span>
                    <span className="stat-value">{workout.sets}</span>
                  </div>
                )}
                {workout.reps && (
                  <div className="stat">
                    <span className="stat-label">Reps</span>
                    <span className="stat-value">{workout.reps}</span>
                  </div>
                )}
                {workout.distance && (
                  <div className="stat">
                    <span className="stat-label">Distance</span>
                    <span className="stat-value">{workout.distance} km</span>
                  </div>
                )}
              </div>

              {workout.notes && (
                <div className="workout-notes">
                  <p>{workout.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;
