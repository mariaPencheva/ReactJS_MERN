import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createTask } from '../api.js';

const CreateTask = ({ onClose, onTaskCreated, onNotify }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [image, setImage] = useState(null);

  const validateForm = () => {
    let isValid = true;

    if (name.length < 5) {
      onNotify('Name must be at least 5 characters long!', 'error');
      isValid = false;
    }

    if (description.length > 200) {
      onNotify('Description must be no more than 200 characters long!', 'error');
      isValid = false;
    }

    if (!deadline || isNaN(deadline.getTime())) {
      onNotify('Deadline is required and must be a valid date', 'error');
      isValid = false;
    } else {
      const currentDate = new Date();
      if (deadline <= currentDate) {
        onNotify('Deadline must be a future date', 'error');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedDate = deadline.toISOString();
    const token = localStorage.getItem('token');

    if (!token) {
      onNotify('You need to be logged in to create a task!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('deadline', formattedDate);
    formData.append('image', image);

    try {
      const response = await createTask(formData);

      if (response.status === 201 || response.status === 200) {
        onNotify('Task created successfully!', 'success');
        if (onTaskCreated) onTaskCreated();
        if (onClose) onClose();
      } else {
        onNotify('Failed to create task. Please try again.', 'error');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        onNotify(error.response.data.message, 'error');
      } else {
        onNotify('An error occurred. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <span className="modal-close" onClick={onClose}>&times;</span>
        <div className="title-text">
          <h2>Create Task</h2>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter task name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              placeholder="Enter task description"
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
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="form-input"
            />
          </div>
          <div className="form-group button-group">
            <button type="submit" className="form-submit-button">Create</button>
            <button type="button" onClick={onClose} className="form-cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
