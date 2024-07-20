import React from "react";
import { useLocation } from "react-router-dom";
import "./catalog.scss";

function Catalog() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
        <div className="text">
            <h1>Community Task Catalog</h1>
            <p>Share Your Needs</p>
            <p>Offer Your Skills</p>
        </div>
    </div>
  );
}

export default Catalog;