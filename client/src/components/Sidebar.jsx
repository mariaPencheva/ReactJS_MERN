import React from "react";

const Sidebar = ({ username, onViewChange, currentView }) => {
  return (
    <div className="sidebar">
      <div className="userName">
        {username ? <h2>Welcome back, {username}!</h2> : <h2>Welcome back!</h2>}
      </div>
      
      <div className="navBar">
      <nav>

        <div
          className={`list-item ${currentView === 'createdTasks' ? 'active' : ''}`}
          onClick={() => onViewChange("createdTasks")}
        >
          <h2>Created Tasks</h2>
        </div>

        <div
          className={`list-item ${currentView === 'takenTasks' ? 'active' : ''}`}
          onClick={() => onViewChange("takenTasks")}
        >
          <h2>Taken Tasks</h2>
        </div>

        <div
          className={`list-item ${currentView === 'completedTasks' ? 'active' : ''}`}
          onClick={() => onViewChange("completedTasks")}
        >
          <h2>Finished Tasks</h2>
        </div>

        <div
          className={`list-item ${currentView === 'archivedTasks' ? 'active' : ''}`}
          onClick={() => onViewChange("archivedTasks")}
        >
          <h2>Archive</h2>
        </div>

      </nav>
      </div>
    </div>
  );
};

export default Sidebar;