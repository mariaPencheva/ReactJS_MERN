import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { allTasks, completedTasks, completeTask, takenTasks, createdTasks, createTask, getAllArchivedTasks } from '../redux/taskSlice';
import CreateTask from "../components/CreateTask";
import TaskCard from '../components/TaskCard';

const TasksContainer = ({ view, onNotify }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks || []);

  const createdTasksArr = useSelector((state) => state.tasks.createdTasks || []);
  const takenTasksArr = useSelector((state) => state.tasks.takenTasks || []);
  const completedTasksArr = useSelector((state) => state.tasks.completedTasks || []); 
  const archivedTasksArr = useSelector((state) => state.tasks.archivedTasks || []);

  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.tasks.isLoading);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  useEffect(() => {
    if (view === 'createdTasks') {
      dispatch(createdTasks());
    } else if (view === 'takenTasks') {
      dispatch(takenTasks());
    } else if (view === 'completedTasks') {
      dispatch(completedTasks());
    } else if (view === 'archivedTasks') {
      dispatch(getAllArchivedTasks());
    }
  }, [view, dispatch]);

  const getNoTasksMessage = () => {
    switch (view) {
      case 'createdTasks':
        return 'No created tasks yet.';
      case 'takenTasks':
        return 'No taken tasks yet.';
      case 'completedTasks':
        return 'No completed tasks yet.';
      case 'archivedTasks':
        return 'No archived tasks yet.';
      default:
        return 'No tasks yet.';
    }
  };

  const currentTasks = view === 'completedTasks' ? completedTasksArr :
                      view === 'takenTasks' ? takenTasksArr :
                      view === 'createdTasks' ? createdTasksArr :
                      view === 'archivedTasks' ? archivedTasksArr :
                      tasks;

  const handleTaskCreated = (task) => {
    setShowCreateTaskForm(false);
    dispatch(createTask(task)).then(() => {
      if (view === 'createdTasks') {
        dispatch(createdTasks());
      } else {
        dispatch(allTasks());
      }
    });
  };

  const handleTaskCompletion = (taskId) => {
    dispatch(completeTask(taskId)).then(() => {
      if (view === 'completedTasks') {
        dispatch(completedTasks());
      } else {
        dispatch(allTasks());
      }
    });
  };


  return (
    <div className="tasks-container">
      <h2>
        {view === 'createdTasks' ? 'Your Created Tasks' :
         view === 'takenTasks' ? 'Your Taken Tasks' :
         view === 'completedTasks' ? 'Your Finished Tasks' :
         view === 'archivedTasks' ? 'Your Archive' : 
         'Tasks'}
      </h2>


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
        <CreateTask onClose={() => setShowCreateTaskForm(false)} onTaskCreated={handleTaskCreated} onNotify={onNotify} />
      )}
    </div>
  );
};

export default TasksContainer;