import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, completeTask } from '../redux/taskSlice'; 
import TaskCard from '../components/TaskCard'; 
import './catalog.scss';  

const Catalog = ({ loggedinUser }) => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks()); 
  }, [dispatch]);

  const handleTaskCompleted = (taskId) => {
    dispatch(completeTask(taskId)); 
  };

  return (
    <div className="catalog">
      <div className="text">
        <h1>Community Task Catalog</h1>
        <p>Share Your Needs, Offer Your Skills</p>
      </div>
      <div className="task-catalog">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              isOwner={loggedinUser ? loggedinUser._id === task.createdBy._id : false}
              onComplete={() => handleTaskCompleted(task._id)} 
            />
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
