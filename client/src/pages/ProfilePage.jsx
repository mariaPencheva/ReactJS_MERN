import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { currProfile } from '../redux/authSlice';
import { createdTasks, takenTasks, completedTasks, allArchivedTasks } from '../redux/taskSlice';

import Sidebar from '../components/Sidebar';
import TasksContainer from '../pages/TasksContainer';
import Notification from '../components/Notification';
import { VIEW_TYPES } from '../config/viewTypes';

const ProfilePage = ({ onNotify }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, token, isLoading, error } = useSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState(VIEW_TYPES.CREATED);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const view = query.get('view') || VIEW_TYPES.CREATED;
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
      case VIEW_TYPES.CREATED:
        dispatch(createdTasks());
        break;
      case VIEW_TYPES.TAKEN:
        dispatch(takenTasks());
        break;
      case VIEW_TYPES.COMPLETED:
        dispatch(completedTasks());
        break;
      case VIEW_TYPES.ARCHIVED:
        dispatch(allArchivedTasks());
        break;
      default:
        break;
    }
  }, [currentView, dispatch]);

  const handleViewChange = (view) => { 
    setCurrentView(view);
    navigate(`/profile?view=${view}`);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
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
      <div className="menu-toggle" onClick={toggleSidebar}>
        ☰
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <Sidebar 
          username={user?.username} 
          onViewChange={handleViewChange} 
          currentView={currentView} 
          isOpen={isSidebarOpen}
        />
      </div>
        <Notification message={notification?.message} type={notification?.type} />
        <TasksContainer view={currentView} onNotify={onNotify} />
    </div>
  );
};

export default ProfilePage;