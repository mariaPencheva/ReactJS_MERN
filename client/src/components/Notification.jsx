import React from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;