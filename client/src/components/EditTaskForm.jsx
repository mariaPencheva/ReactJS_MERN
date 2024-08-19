import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../redux/taskSlice";

const EditTaskModal = ({ task, onClose, onTaskUpdated, onNotify }) => {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.tasks);
  
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(new Date(task.deadline));
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(task.name);
    setDescription(task.description);
    setDeadline(new Date(task.deadline));
    setImage(null);
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (name.length < 5) {
      newErrors.name = true;
      onNotify('Name must be at least 5 characters long!', 'error');
      isValid = false;
    }

    if (description.length >= 200) {
      newErrors.description = true;
      onNotify('Description must be no more than 200 characters long!', 'error');
      isValid = false;
    }

    if (!deadline || isNaN(deadline.getTime())) {
      newErrors.deadline = true;
      onNotify('Deadline is required and must be a valid date', 'error');
      isValid = false;
    } else if (deadline <= new Date()) {
      newErrors.deadline = true;
      onNotify('Deadline must be a future date', 'error');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('deadline', deadline.toISOString());
    if (image) formData.append('image', image);

    try {
      await dispatch(updateTask({ id: task._id, taskData: formData })).unwrap();
      onNotify('Task updated successfully!', 'success');
      onTaskUpdated();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update task. Please try again.';
      onNotify(errorMessage, 'error');
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
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`form-input ${errors.name ? 'error' : ''}`}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`form-input ${errors.description ? 'error' : ''}`}
              required
            />
          </div>
          <div className="form-group">
            <label>Deadline:</label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              dateFormat="yyyy-MM-dd"
              className={`form-input ${errors.deadline ? 'error' : ''}`}
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
            <button type="submit" className="form-submit-button">Update</button>
            <button type="button" onClick={onClose} className="form-cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;