import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaUser, FaEdit, FaSave, FaCamera } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitnessGoal: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
        fitnessGoal: user.fitnessGoal || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined
      };

      const response = await profileAPI.update(data);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getGoalLabel = (goal) => {
    const goals = {
      weight_loss: 'Weight Loss',
      muscle_gain: 'Muscle Gain',
      endurance: 'Endurance',
      general_fitness: 'General Fitness'
    };
    return goals[goal] || goal;
  };

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <h1>
          <FaUser /> My Profile
        </h1>
        <button onClick={() => setEditing(!editing)} className="edit-btn">
          {editing ? <><FaSave /> Save</> : <><FaEdit /> Edit</>}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-image-section">
            <div className="profile-image">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <FaUser className="profile-icon" />
              )}
              <button className="change-photo-btn">
                <FaCamera />
              </button>
            </div>
            <h2>{user.name}</h2>
            <p className="user-email">{user.email}</p>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="profile-stat">
              <span className="stat-label">Fitness Goal</span>
              <span className="stat-value">{getGoalLabel(user.fitnessGoal)}</span>
            </div>
          </div>
        </div>

        <div className="profile-details-card">
          <h2>Personal Information</h2>
          
          {editing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="10"
                    max="120"
                  />
                </div>

                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="20"
                    max="300"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="100"
                    max="250"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fitness Goal</label>
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              {user.age && (
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{user.age} years</span>
                </div>
              )}
              {user.weight && (
                <div className="info-item">
                  <span className="info-label">Weight</span>
                  <span className="info-value">{user.weight} kg</span>
                </div>
              )}
              {user.height && (
                <div className="info-item">
                  <span className="info-label">Height</span>
                  <span className="info-value">{user.height} cm</span>
                </div>
              )}
              {user.gender && (
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{user.gender}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
