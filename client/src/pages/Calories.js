import React, { useState, useEffect } from 'react';
import { calorieAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaUtensils, FaPlus, FaTrash } from 'react-icons/fa';
import './Tracker.css';

const Calories = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    meal: 'breakfast',
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await calorieAPI.getAll({ limit: 50 });
      setEntries(response.data.entries);
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const data = {
        ...formData,
        calories: Number(formData.calories),
        protein: formData.protein ? Number(formData.protein) : undefined,
        carbs: formData.carbs ? Number(formData.carbs) : undefined,
        fat: formData.fat ? Number(formData.fat) : undefined
      };

      await calorieAPI.create(data);
      toast.success('Calorie entry added!');
      setFormData({ meal: 'breakfast', foodName: '', calories: '', protein: '', carbs: '', fat: '' });
      setShowForm(false);
      fetchEntries();
    } catch (error) {
      toast.error('Failed to add entry');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;

    try {
      await calorieAPI.delete(id);
      toast.success('Entry deleted');
      fetchEntries();
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMealIcon = (meal) => {
    switch (meal) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  if (loading) {
    return <div className="loading">Loading calories...</div>;
  }

  return (
    <div className="tracker-container fade-in">
      <div className="tracker-header">
        <h1>
          <FaUtensils /> Calorie Tracker
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          <FaPlus /> {showForm ? 'Cancel' : 'Add Entry'}
        </button>
      </div>

      <div className="summary-card">
        <h3>Total Calories Today</h3>
        <div className="calorie-display">{totalCalories}</div>
        <p>kcal</p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="tracker-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Meal Type *</label>
              <select name="meal" value={formData.meal} onChange={handleChange} required>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="form-group">
              <label>Food Name *</label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g., Chicken Breast"
                required
              />
            </div>

            <div className="form-group">
              <label>Calories *</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                placeholder="250"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Protein (g)</label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                placeholder="30"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Carbs (g)</label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                placeholder="40"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Fat (g)</label>
              <input
                type="number"
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                placeholder="10"
                min="0"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={formLoading}>
            {formLoading ? 'Adding...' : 'Add Entry'}
          </button>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="empty-state">
          <FaUtensils className="empty-icon" />
          <h2>No entries yet</h2>
          <p>Start tracking your daily calorie intake!</p>
        </div>
      ) : (
        <div className="entries-list">
          {entries.map((entry) => (
            <div key={entry._id} className="entry-card">
              <div className="entry-header">
                <div className="entry-type">
                  <span className="type-icon">{getMealIcon(entry.meal)}</span>
                  <div>
                    <h3>{entry.foodName}</h3>
                    <p className="entry-date">{formatDate(entry.date)}</p>
                  </div>
                </div>
                <div className="entry-actions">
                  <span className="meal-badge">{entry.meal}</span>
                  <button className="icon-btn" onClick={() => handleDelete(entry._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="entry-stats">
                <div className="stat">
                  <span className="stat-label">Calories</span>
                  <span className="stat-value">{entry.calories}</span>
                </div>
                {entry.protein && (
                  <div className="stat">
                    <span className="stat-label">Protein</span>
                    <span className="stat-value">{entry.protein}g</span>
                  </div>
                )}
                {entry.carbs && (
                  <div className="stat">
                    <span className="stat-label">Carbs</span>
                    <span className="stat-value">{entry.carbs}g</span>
                  </div>
                )}
                {entry.fat && (
                  <div className="stat">
                    <span className="stat-label">Fat</span>
                    <span className="stat-value">{entry.fat}g</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calories;
