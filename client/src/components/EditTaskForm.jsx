import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '../api';

const EditTaskModal = ({ task, onClose, onTaskUpdated }) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(new Date(task.deadline));
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(task.name);
    setDescription(task.description);
    setDeadline(new Date(task.deadline));
    setImage(null);
  }, [task]);

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("deadline", deadline.toISOString());
    if (image) {
        formData.append("image", image);
    }

     for (const [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
}
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("You need to be logged in to update the task.");
            return;
        }

        const updatedTask = await api.updateTask(task._id, formData);
        // console.log('Task ID:', task._id);
        // console.log('Task name:', task.name);
        // console.log('Task cretor:', task.createdBy.username);

        if (updatedTask) {
            onTaskUpdated(); 
            onClose();       
        } else {
            setError("Error updating task");
        }
    } catch (err) {
        console.error('Error:', err);
        setError("Error updating task");
    }
};

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <div className="title-text">
          <h2>Edit Task</h2>
        </div>
        {error && <div>{error}</div>}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Deadline:</label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              required
            />
          </div>
          <div className="form-group">
            <label>Image:</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="form-group button-group">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
