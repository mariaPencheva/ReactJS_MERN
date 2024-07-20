import React from "react";
import { useLocation } from "react-router-dom";
import "./catalog.scss";

function Catalog() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
        <div className="text">
            <h1>Let's help</h1>
            <p>Create your Own task</p>
            <p>Or help with executing the task</p>
        </div>
    </div>
  );
}

export default Catalog;