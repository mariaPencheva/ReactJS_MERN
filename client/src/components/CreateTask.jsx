import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {createTask} from '../api.js';

const CreateTask = ({ onClose, onTaskCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to create a task.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("deadline", deadline.toISOString());
    if (image) {
      formData.append("image", image);
    } else {
      alert('Image is required!')
      return;
    }

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await createTask(formData);

      if (response.status === 201 || response.status === 200) {
        alert("Task created successfully!");
        if (onTaskCreated) onTaskCreated();
        if (onClose) onClose();
      } else {
        alert("Failed to create task. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("An error occurred. Please try again.");
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
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="form-group button-group">
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
          </div>  
        </form>
      </div>
    </div>
  );
};

export default CreateTask;