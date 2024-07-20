import React from "react";
import { useLocation } from "react-router-dom";
import "./home.scss";

function Home() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
        <div className="text">
            <h1>Welcome to Task Board</h1>
            <p>Task Board facilitates collaboration and task distribution by</p>
            <p>providing an efficient way to manage projects and tasks in a team or individually.</p>
        </div>
    </div>
  );
}

export default Home;