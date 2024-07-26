import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import CreateTask from "./CreateTask";
import TaskCard from './TaskCard';
import axios from "axios";
import './taskContainer.scss';

const TasksContainer = ({ view }) => {
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      let url = '';

      if (view === 'createdTasks') {
        url = '/api/tasks/created';
      } else if (view === 'takenTasks') {
        url = '/api/tasks/taken'; 
      } else if (view === 'completedTasks') {
        url = '/api/tasks/completed'; 
      }

      const response = await axios.get(url, { withCredentials: true });
      console.log('Fetched tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [view, showCreateTaskForm]);

  const handleFinishTask = async (taskId) => {
    try {
      await axios.post(`/api/tasks/${taskId}/complete`, {}, { withCredentials: true });
      fetchTasks(); 
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="tasks-container">
      <h2>
        {view === 'createdTasks' ? 'Your Created Tasks' :
         view === 'takenTasks' ? 'Your Taken Tasks' :
         view === 'completedTasks' ? 'Finished Tasks' :
         'Tasks'}
      </h2>
      {error && <div>Error: {error.message}</div>}
      <div className="tasks-list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onFinishTask={() => handleFinishTask(task._id)}
          />
        ))}
      </div>
      {view === 'createdTasks' && (
        <div className="create-task-button" onClick={() => setShowCreateTaskForm(true)}>
          <h1> + </h1>
          <h3>Create New Task</h3>
        </div>
      )}
      {showCreateTaskForm && (
        <CreateTask onClose={() => setShowCreateTaskForm(false)} onTaskCreated={fetchTasks} />
      )}
    </div>
  );
};

export default TasksContainer;