import React from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, isOwner }) => {
    const imageUrl = task.image ? `http://localhost:3000/uploads/${task.image}` : '/No_Image_Available.jpg';

    const createdByText = isOwner ? 'you' : (task.createdBy ? task.createdBy.username : 'Unknown');

    return (
        <div className="task-card">
            <img 
                src={imageUrl} 
                alt={task.name || 'No image available'} 
                onError={(e) => e.target.src = '/No_Image_Available.jpg'}
            />
            <div className="taskCardDetails">
                <h3>{task.name || 'No Title'}</h3>
                <p>Created by: {createdByText}</p>
                <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline'}</p>
                <div className="btns-details">
                    <button><Link to={`/tasks/${task._id}`}>Details</Link></button>
                </div>
            </div>  
        </div>
    );
};

export default TaskCard;
