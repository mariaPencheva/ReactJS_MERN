import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TasksContainer from "../components/TasksContainer";
import './profile.scss';

const Profile = () => {
  const [username, setUsername] = useState("");
  const [currentView, setCurrentView] = useState("createdTasks");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: token }
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="profile-page">
      <Sidebar username={username} onViewChange={handleViewChange} />
      <TasksContainer view={currentView} />
    </div>
  );
};

export default Profile;
