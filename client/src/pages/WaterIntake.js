import React, { useState, useEffect } from 'react';
import { waterAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaTint, FaPlus, FaTrash } from 'react-icons/fa';
import './Tracker.css';

const WaterIntake = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '250',
    unit: 'ml',
    notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await waterAPI.getAll({ limit: 50 });
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
      await waterAPI.create({
        ...formData,
        amount: Number(formData.amount)
      });
      toast.success('Water intake logged!');
      setFormData({ amount: '250', unit: 'ml', notes: '' });
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
      await waterAPI.delete(id);
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

  const totalWater = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const dailyGoal = 2500;
  const progress = Math.min((totalWater / dailyGoal) * 100, 100);

  if (loading) {
    return <div className="loading">Loading water intake...</div>;
  }

  return (
    <div className="tracker-container fade-in">
      <div className="tracker-header">
        <h1>
          <FaTint /> Water Intake Tracker
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          <FaPlus /> {showForm ? 'Cancel' : 'Add Entry'}
        </button>
      </div>

      <div className="summary-card water-summary">
        <h3>Today's Intake</h3>
        <div className="water-display">
          <span>{totalWater}</span>
          <span className="unit">ml</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{Math.round(progress)}% of daily goal ({dailyGoal}ml)</p>
      </div>

      <div className="quick-add">
        <button onClick={() => {
          waterAPI.create({ amount: 250 }).then(() => {
            toast.success('Added 250ml');
            fetchEntries();
          });
        }} className="quick-btn">
          +250ml
        </button>
        <button onClick={() => {
          waterAPI.create({ amount: 500 }).then(() => {
            toast.success('Added 500ml');
            fetchEntries();
          });
        }} className="quick-btn">
          +500ml
        </button>
        <button onClick={() => {
          waterAPI.create({ amount: 750 }).then(() => {
            toast.success('Added 750ml');
            fetchEntries();
          });
        }} className="quick-btn">
          +750ml
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="tracker-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Amount (ml) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="250"
                min="50"
                max="5000"
                required
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="ml">Milliliters (ml)</option>
                <option value="oz">Ounces (oz)</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes..."
                rows="3"
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
          <FaTint className="empty-icon" />
          <h2>No entries yet</h2>
          <p>Start tracking your daily water intake!</p>
        </div>
      ) : (
        <div className="entries-list">
          {entries.map((entry) => (
            <div key={entry._id} className="entry-card water-card">
              <div className="entry-header">
                <div className="entry-type">
                  <span className="type-icon">💧</span>
                  <div>
                    <h3>{entry.amount}{entry.unit}</h3>
                    <p className="entry-date">{formatDate(entry.date)}</p>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => handleDelete(entry._id)}>
                  <FaTrash />
                </button>
              </div>
              {entry.notes && (
                <div className="entry-notes">
                  <p>{entry.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaterIntake;
