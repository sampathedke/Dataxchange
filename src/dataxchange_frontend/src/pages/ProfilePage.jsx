// src/pages/ProfilePage.jsx
import React, { useContext } from "react"; // Ensure this is the ONLY 'import React from "react";' line
import { UserContext } from "../context/UserContext";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";
import { shortenPrincipal } from "../utils/principal"; // Import shortenPrincipal
import { Principal } from '@dfinity/principal'; // Import Principal for type checking

export default function ProfilePage() {
  const { iiPrincipal, loading } = useContext(UserContext); // Also get loading from context
  const navigate = useNavigate();

  if (loading) {
    return <p className="loading-text">⏳ Loading profile...</p>;
  }

  // If iiPrincipal is null (not logged in) or not a Principal object
  if (!iiPrincipal || !(iiPrincipal instanceof Principal)) {
    return <p className="not-logged-in-message">Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-container">
      <h3>👤 My Profile </h3>

      <div className="profile-info">
        <p><strong>Internet Identity Principal:</strong></p>
        {/* FIX: Convert iiPrincipal object to its text representation */}
        <code className="principal-display">{iiPrincipal.toText()}</code>
        {/* Or, to display a shortened version for better aesthetics: */}
        {/* <code className="principal-display">{shortenPrincipal(iiPrincipal.toText())}</code> */}
      </div>

      <div className="profile-actions">
        <button className="profile-card" onClick={() => navigate("/myuploads")}>
          📦 My Uploads
        </button>
        <button className="profile-card" onClick={() => navigate("/myrequests")}>
          📥 My Requests
        </button>
        <button className="profile-card" onClick={() => navigate("/explore")}>
          🔍 Explore Datasets
        </button>
      </div>
    </div>
  );
}
