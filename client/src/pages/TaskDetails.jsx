import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { taskDetails, completeTask, /*completedTasks,*/ takeTask, deleteTask } from '../redux/taskSlice';
import EditTaskForm from '../components/EditTaskForm';

const TaskDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const task = useSelector((state) => state.tasks.taskDetails);
    // const completedTasksArr = useSelector((state) => state.tasks.completedTasks || []);
    const loggedinUser = useSelector((state) => state.auth.user);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        // console.log('Fetching details for id:', id);
        // dispatch(taskDetails(id)).then((result) => {
        // console.log('Task Details:', result.payload);
    // });

        dispatch(taskDetails(id));
    }, [dispatch, id]);

    useEffect(() => {}, [task]);

    if (!task) return <div>Loading...</div>;

    const handleTakeTask = async () => {
        if (loggedinUser) {
            await dispatch(takeTask(id));
            dispatch(taskDetails(id));
        }
    };

    const handleFinishTask = async () => {
        if (loggedinUser) {
            await dispatch(completeTask(id));
            dispatch(taskDetails(id));
            navigate(`/profile?view=completedTasks`);
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
            await dispatch(deleteTask(id));
            navigate('/catalog');
        }
    };

    const isOwner = task?.createdBy && loggedinUser?._id === task.createdBy._id;
    const isTaskTaken = task?.takenBy !== null;
    const isTaskCompleted = task?.completed; 
    const takenByUser = task?.takenBy?.username;

    const completedByYou = task?.completedBy?._id === loggedinUser?._id;
    const completedByUser = task?.completedBy?.username || 'undefined';
    // console.log(`Completed By: ${completedByUser} from TD react`);

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
                        
                        {isTaskCompleted && <p>Completed by: {completedByYou ? 'you' : completedByUser}</p>}

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
                            onTaskUpdated={() => dispatch(taskDetails(id))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetails;

//{isTaskCompleted && <p>Completed by: {completedByYou ? 'you' : completedByUser}</p>}