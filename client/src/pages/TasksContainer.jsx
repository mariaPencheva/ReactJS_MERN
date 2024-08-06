import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allTasks, completedTasks, completeTask, takenTasks, createdTasks, createTask, allArchivedTasks } from "../redux/taskSlice";
import CreateTask from "../components/CreateTask";
import TaskCard from "../components/TaskCard";
import { VIEW_TYPES } from '../config/viewTypes';

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
    switch (view) {
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
        dispatch(allTasks());
        break;
    }
  }, [view, dispatch]);

  const getNoTasksMessage = useMemo(() => {
    switch (view) {
      case VIEW_TYPES.CREATED:
        return "No created tasks yet.";
      case VIEW_TYPES.TAKEN:
        return "No taken tasks yet.";
      case VIEW_TYPES.COMPLETED:
        return "No completed tasks yet.";
      case VIEW_TYPES.ARCHIVED:
        return "No archived tasks yet.";
      default:
        return "No tasks yet.";
    }
  }, [view]);

  const currentTasks = useMemo(() => {
    switch (view) {
      case VIEW_TYPES.CREATED:
        return createdTasksArr;
      case VIEW_TYPES.TAKEN:
        return takenTasksArr;
      case VIEW_TYPES.COMPLETED:
        return completedTasksArr;
      case VIEW_TYPES.ARCHIVED:
        return archivedTasksArr;
      default:
        return tasks;
    }
  }, [ view, createdTasksArr, takenTasksArr, completedTasksArr, archivedTasksArr, tasks, ]);

  const handleTaskCreated = (task) => {
    setShowCreateTaskForm(false);
    dispatch(createTask(task)).then(() => {
      dispatch(view === VIEW_TYPES.CREATED ? createdTasks() : allTasks());
    });
  };

  const handleTaskCompletion = (taskId) => {
    dispatch(completeTask(taskId)).then(() => {
      dispatch(view === VIEW_TYPES.COMPLETED ? completedTasks() : allTasks());
    });
  };

  return (
    <div className="tasks-container">
      <h2>
        { view === VIEW_TYPES.CREATED ? "Your Created Tasks" :
          view === VIEW_TYPES.TAKEN ? "Your Taken Tasks" :
          view === VIEW_TYPES.COMPLETED ? "Your Finished Tasks" :
          view === VIEW_TYPES.ARCHIVED ? "Your Archive" : "Tasks"}
      </h2>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <p className="no-tasks-message">
            {currentTasks.length === 0 && getNoTasksMessage}
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
            {view === VIEW_TYPES.CREATED && (
              <div
                className="create-task-button"
                onClick={() => setShowCreateTaskForm(true)}
              >
                <h1> + </h1>
                <h3>Create New Task</h3>
              </div>
            )}
          </div>
        </>
      )}
      {showCreateTaskForm && (
        <CreateTask
          onClose={() => setShowCreateTaskForm(false)}
          onTaskCreated={handleTaskCreated}
          onNotify={onNotify}
        />
      )}
    </div>
  );
};

export default TasksContainer;
