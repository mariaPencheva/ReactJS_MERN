import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { currProfile } from '../redux/authSlice';
import { createdTasks, takenTasks, completedTasks /*, archiveTasks*/ } from '../redux/taskSlice';

import Sidebar from '../components/Sidebar';
import TasksContainer from '../pages/TasksContainer';

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
      dispatch(currProfile());
    } else {
      navigate('/signin');
    }
  }, [token, dispatch, navigate]);

  useEffect(() => {
    switch (currentView) {
      case 'createdTasks':
        dispatch(createdTasks());
        break;
      case 'takenTasks':
        dispatch(takenTasks());
        break;
      case 'completedTasks':
        dispatch(completedTasks());
        break;
      /*case 'archive':
        dispatch(fetchArchiveTasks());
        break;*/
      default:
        break;
    }
  }, [currentView, dispatch]);

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