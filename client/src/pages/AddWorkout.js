import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaDumbbell, FaArrowLeft } from 'react-icons/fa';
import './Workout.css';

const AddWorkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exerciseName: '',
    exerciseType: 'cardio',
    duration: '',
    caloriesBurned: '',
    sets: '',
    reps: '',
    weight: '',
    distance: '',
    intensity: 'medium',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        duration: Number(formData.duration),
        caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : undefined,
        sets: formData.sets ? Number(formData.sets) : undefined,
        reps: formData.reps ? Number(formData.reps) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        distance: formData.distance ? Number(formData.distance) : undefined
      };

      await workoutAPI.create(data);
      toast.success('Workout added successfully!');
      navigate('/workouts');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add workout';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-form-container fade-in">
      <div className="form-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Back
        </button>
        <h1>
          <FaDumbbell /> Log New Workout
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="workout-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Exercise Name *</label>
            <input
              type="text"
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleChange}
              placeholder="e.g., Running, Bench Press"
              required
            />
          </div>

          <div className="form-group">
            <label>Exercise Type *</label>
            <select
              name="exerciseType"
              value={formData.exerciseType}
              onChange={handleChange}
              required
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="30"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Calories Burned</label>
            <input
              type="number"
              name="caloriesBurned"
              value={formData.caloriesBurned}
              onChange={handleChange}
              placeholder="200"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Intensity</label>
            <select
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sets</label>
            <input
              type="number"
              name="sets"
              value={formData.sets}
              onChange={handleChange}
              placeholder="3"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Reps</label>
            <input
              type="number"
              name="reps"
              value={formData.reps}
              onChange={handleChange}
              placeholder="12"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="50"
              min="0"
              step="0.5"
            />
          </div>

          <div className="form-group">
            <label>Distance (km)</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              placeholder="5"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="How did you feel? Any observations?"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkout;
