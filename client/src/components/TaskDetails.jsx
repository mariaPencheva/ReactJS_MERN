import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import EditTaskForm from './EditTaskForm';
import './taskDetails.scss';

const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loggedinUser, setLoggedinUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem('token');

                if (token) {
                    const userResponse = await api.getUserProfile(token);
                    setLoggedinUser(userResponse.data);
                }

                const taskResponse = await api.getTask(id);
                if (taskResponse) {
                    setTask(taskResponse.data);
                } else {
                    setError('Task not found');
                    navigate('/NotFound');
                }
            } catch (err) {
                setError('Error fetching task');
                navigate('/NotFound');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleTakeTask = async () => {
        if (!loggedinUser) return;

        try {
            const result = await api.takeTask(id, localStorage.getItem('token'));
            if (result) {
                setTask(prevTask => ({ ...prevTask, takenBy: loggedinUser }));
            } else {
                console.error('Failed to take task');
            }
        } catch (err) {
            console.error('Error taking task:', err);
        }
    };

    const handleFinishTask = async () => {
        if (!loggedinUser) return;

        try {
            await api.completeTask(id, localStorage.getItem('token'));
            navigate(`/profile?view=completedTasks`);
        } catch (err) {
            console.error('Error completing task:', err);
        }
    };

    const isOwner = task?.createdBy && loggedinUser?._id === task.createdBy._id;
    const isTaskTaken = task?.takenBy !== null;
    const isTaskCompleted = task?.completed; 
    const takenByUser = task?.takenBy?.username;

    const handleEditClick = () => {
        if (loggedinUser) {
            setIsEditModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    const handleTaskUpdated = async () => {
        const data = await api.getTask(id);
        setTask(data);
    };

    const handleDeleteClick = async () => {
        if (!loggedinUser) return;

        try {
            await api.deleteTask(id, localStorage.getItem('token'));
            navigate('/NotFound');
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const imageUrl = task.image ? `http://localhost:3000/uploads/${task.image}` : '/No_Image_Available.jpg';

    return (
        <div className="page-details">
            <div className="text">
                <h1>Task Details</h1>
            </div>
            <div className="task-details">
                <div className="task-content">
                    <div className="image-details">
                        <img src={imageUrl} alt={task.name} onError={(e) => e.target.src = '/No_Image_Available.jpg'} />
                    </div>
                    <div className="info-details">
                        <h2>{task.name}</h2>
                        <p>Description: {task.description}</p>
                        <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                        <p>Created by: {isOwner ? 'you' : task.createdBy.username}</p>
                        {loggedinUser && (
                            <div className="task-actions">
                                {isTaskCompleted ? (
                                    <button className="not-clickable">Completed</button>
                                ) : (
                                    <>
                                        {isOwner && (
                                            <div className="btns-details">
                                                <button onClick={handleEditClick}>Edit Task</button>
                                                <button onClick={handleDeleteClick}>Delete Task</button>
                                            </div>
                                        )}
                                        {!isTaskTaken && !isOwner && (
                                            <button onClick={handleTakeTask}>Take The Task</button>
                                        )}
                                        {isTaskTaken && (
                                            <div>
                                                <div className="not-clickable">
                                                    {loggedinUser?._id === task?.takenBy?._id ? 'Taken by you' : `Taken by: ${takenByUser}`}
                                                </div>
                                                {loggedinUser?._id === task?.takenBy?._id && (
                                                    <button onClick={handleFinishTask}>Finish The Task</button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isEditModalOpen && loggedinUser && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <EditTaskForm
                            task={task}
                            onClose={handleCloseModal}
                            onTaskUpdated={handleTaskUpdated}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetails;