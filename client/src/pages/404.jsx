import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="not-found-page">
        <h1>404 - Ooops...</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist, but you can</p>
        <button><Link to="/">Go Back</Link></button>
    </div>
);

export default NotFound;