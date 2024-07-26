import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TaskDetails from './TaskDetails';
import axios from 'axios';


const ParentComponent = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/tasks/${id}`);
                setTask(response.data);
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

   return (
        <TaskDetails
        />
    );
};

export default ParentComponent;