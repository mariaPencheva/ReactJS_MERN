import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProfile } from '../redux/authSlice';
import Sidebar from '../components/Sidebar';
import TasksContainer from '../components/TasksContainer';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, token, isLoading, error } = useSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState('createdTasks');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const view = query.get('view') || 'createdTasks';
    setCurrentView(view);
  }, [location.search]);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    } else {
      navigate('/signin');
    }
  }, [token, dispatch, navigate]);

  const handleViewChange = (view) => {
    setCurrentView(view);
    navigate(`/profile?view=${view}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <div>Please log in first to view your profile.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-page">
      <Sidebar 
        username={user?.username} 
        onViewChange={handleViewChange} 
        currentView={currentView} 
      />
      <TasksContainer view={currentView} />
    </div>
  );
};

export default ProfilePage;