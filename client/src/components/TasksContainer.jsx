import React from "react";

const TasksContainer = ({ view }) => {
  return (
    <div className="tasks-container">
      {view === "createdTasks" &&
        <div className="tasks-form">Created Tasks</div>}
      {view === "takenTasks" && <div className="tasks-form">Taken Tasks</div>}
      {view === "completedTasks" && <div className="tasks-form">Finished tasks</div>}
    </div>
  );
};

export default TasksContainer;
