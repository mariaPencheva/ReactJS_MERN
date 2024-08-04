import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { taskDetails, completeTask, takeTask, deleteTask } from '../redux/taskSlice';
import EditTaskForm from '../components/EditTaskForm';

const TaskDetails = ({ onNotify }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const task = useSelector((state) => state.tasks.taskDetails);
    const loggedinUser = useSelector((state) => state.auth.user);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        dispatch(taskDetails(id));
    }, [dispatch, id]);

    if (!task) { 
        return <div>Loading...</div>;
    };

    const handleTakeTask = async () => {
        if (loggedinUser) {
            try {
                await dispatch(takeTask(id));
                dispatch(taskDetails(id));
                onNotify('Task taken successfully!', 'success');
            } catch (error) {
                onNotify('Failed to take task. Please try again.', 'error');
            }
        }
    };

    const handleFinishTask = async () => {
        if (loggedinUser) {
            try {
                await dispatch(completeTask(id));
                dispatch(taskDetails(id));
                navigate(`/profile?view=completedTasks`);
                onNotify('Task marked as completed!', 'success');
            } catch (error) {
                onNotify('Failed to complete task. Please try again.', 'error');
            }
        }
    };

    const handleEditClick = () => {
        if (loggedinUser) {
            setIsEditModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    const handleDeleteClick = async () => {
        if (loggedinUser) {
            try {
                await dispatch(deleteTask(id));
                navigate('/catalog');
                onNotify('Task deleted successfully!', 'success');
            } catch (error) {
                onNotify('Failed to delete task. Please try again!', 'error');
            }
        }
    };

    const isOwner = loggedinUser && task.createdBy && loggedinUser._id === task.createdBy._id;
    const isTaskTaken = task?.takenBy !== null;
    const isTaskCompleted = task?.completed; 
    const takenByUser = task?.takenBy?.username || 'Unknown';
    const completedByUser = task?.completedBy?.username || 'undefined';
    const imageUrl = task.image ? `http://localhost:3000/uploads/${task.image}` : '/No_Image_Available.jpg';

    return (
        <div className="page-details">
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

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
                        <p>{task.description}</p>
                        <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                        <p><strong>Created by:</strong> {isOwner ? 'you' : (task.createdBy ? task.createdBy.username : 'Unknown')}</p>
                        
                        {loggedinUser && (
                            <div className="task-actions">
                                {isTaskCompleted ? (
                                    <div className="btns-details">
                                        <button className="not-clickable">
                                            {loggedinUser?._id === task?.completedBy?._id ? 'Completed by you' : `Completed by: ${completedByUser}`}
                                        </button>
                                    </div>
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
                                            <div className="btns-details">
                                                <button className="not-clickable">
                                                    {loggedinUser?._id === task?.takenBy?._id ? 'Taken by you' : `Taken by: ${takenByUser}`}
                                                </button>
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
                <div className="modal-overlay">
                    <div className="modal-container">
                        <EditTaskForm
                            task={task}
                            onClose={handleCloseModal}
                            onTaskUpdated={() => dispatch(taskDetails(id))}
                            onNotify={onNotify}
                        />
                        <span className="modal-close" onClick={handleCloseModal}>x</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetails;
