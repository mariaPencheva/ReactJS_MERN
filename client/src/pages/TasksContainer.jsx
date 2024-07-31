import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { allTasks, completedTasks, completeTask, takenTasks, createdTasks, createTask } from '../redux/taskSlice';
import CreateTask from "../components/CreateTask";
import TaskCard from '../components/TaskCard';

const TasksContainer = ({ view }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks || []);
  const createdTasksArr = useSelector((state) => state.tasks.createdTasks || []);
  const takenTasksArr = useSelector((state) => state.tasks.takenTasks || []);
  const completedTasksArr = useSelector((state) => state.tasks.completedTasks || []); 
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.tasks.isLoading);
  const error = useSelector((state) => state.tasks.error);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  useEffect(() => {
    if (view === 'createdTasks') {
      dispatch(createdTasks());
    } else if (view === 'takenTasks') {
      dispatch(takenTasks());
    } else if (view === 'completedTasks') {
      // dispatch(completedTasks());
      dispatch(completedTasks()).then((response) => {
      console.log('Completed tasks response:', response)});
    } else {
      dispatch(allTasks());
    }
  }, [view, dispatch]);

  // console.log('Redux tasks:', tasks);
  // console.log('==================');
  // console.log('Current view:', view);
  // console.log('Redux createdTasks:', createdTasksArr);
  // console.log('Redux takenTasksArr:', takenTasksArr);
  // console.log('Redux completedTasksArr:', completedTasksArr);

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

  const currentTasks = view === 'completedTasks' ? completedTasksArr :
                        view === 'takenTasks' ? takenTasksArr :
                        view === 'createdTasks' ? createdTasksArr /*tasks.filter(task => task.createdBy._id === user._id)*/ :
                        tasks;

  console.log('Current Tasks:', currentTasks);

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
         view === 'completedTasks' ? 'Finished Tasks' :
         'Tasks'}
      </h2>
      {error && <div className="error">Error from TasksContainer: {error}</div>}
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
