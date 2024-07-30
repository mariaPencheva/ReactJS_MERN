import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTasks,
  fetchCompletedTasks,
  completeTask,
  fetchTakenTasks,
  fetchCreatedTasks,
  createTask
} from '../redux/taskSlice';
import CreateTask from "./CreateTask";
import TaskCard from './TaskCard';

const TasksContainer = ({ view }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks || []);
  const takenTasks = useSelector((state) => state.tasks.takenTasks || []);
  const completedTasks = useSelector((state) => state.tasks.completedTasks || []);
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.tasks.isLoading);
  const error = useSelector((state) => state.tasks.error);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  useEffect(() => {
    if (view === 'createdTasks') {
      dispatch(fetchCreatedTasks());
    } else if (view === 'takenTasks') {
      dispatch(fetchTakenTasks());
    } else if (view === 'completedTasks') {
      dispatch(fetchCompletedTasks());
    } else {
      dispatch(fetchTasks());
    }
  }, [view, dispatch]);

  const getNoTasksMessage = () => {
    if (view === 'createdTasks') {
      return 'No created tasks yet.';
    } else if (view === 'takenTasks') {
      return 'No taken tasks yet.';
    } else if (view === 'completedTasks') {
      return 'No completed tasks yet.';
    } else {
      return 'No tasks yet.';
    }
  };

  const currentTasks = view === 'completedTasks' ? completedTasks :
                        view === 'takenTasks' ? takenTasks :
                        view === 'createdTasks' ? tasks.filter(task => task.createdBy._id === user._id) :
                        tasks;

  const handleTaskCreated = (task) => {
    setShowCreateTaskForm(false);
    dispatch(createTask(task)).then(() => {
      if (view === 'createdTasks') {
        dispatch(fetchCreatedTasks());
      } else {
        dispatch(fetchTasks());
      }
    });
  };

  const handleTaskCompletion = (taskId) => {
    dispatch(completeTask(taskId)).then(() => {
      if (view === 'completedTasks') {
        dispatch(fetchCompletedTasks());
      } else {
        dispatch(fetchTasks());
      }
    });
  };

  return (
    <div className="tasks-container">
      <h2>
        {view === 'createdTasks' ? 'Your Created Tasks' :
         view === 'takenTasks' ? 'Your Taken Tasks' :
         view === 'completedTasks' ? 'Finished Tasks' :
         'Tasks'}
      </h2>
      {error && <div className="error">Error: {error}</div>}
      {isLoading ? <div className="loading">Loading...</div> : (
        <>
          <p className="no-tasks-message">
            {currentTasks.length === 0 && getNoTasksMessage()}
          </p>
          <div className="tasks-list">
            {currentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                isOwner={task.createdBy._id === (user ? user._id : null)}
                onFinishTask={() => handleTaskCompletion(task._id)}
              />
            ))}
            {view === 'createdTasks' && (
              <div className="create-task-button" onClick={() => setShowCreateTaskForm(true)}>
                <h1> + </h1>
                <h3>Create New Task</h3>
              </div>
            )}
          </div>
        </>
      )}
      {showCreateTaskForm && (
        <CreateTask onClose={() => setShowCreateTaskForm(false)} onTaskCreated={handleTaskCreated} />
      )}
    </div>
  );
};

export default TasksContainer;
