// src/pages/MyUploadsPage.jsx

import React, { useEffect, useState, useContext } from "react";
import { getBackendActor } from "../services/backend.js";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/myuploads.css";
import { shortenPrincipal } from "../utils/principal"; // Import from utils, remove local def
import { Principal } from '@dfinity/principal'; // Import Principal for type checking

export default function MyUploadsPage() {
  const { iiPrincipal, loading: authLoading } = useContext(UserContext); // Use authLoading for clarity
  const navigate = useNavigate(); // Initialize navigate

  const [uploads, setUploads] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true); // Separate loading state for datasets
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only proceed if auth is not loading and iiPrincipal is available and a Principal object
    if (!authLoading && iiPrincipal instanceof Principal) {
      setLoadingDatasets(true); // Start loading datasets
      setError(null); // Clear previous errors

      (async () => {
        try {
          const actor = await getBackendActor(true);
          const all = await actor.get_all_datasets();

          console.group("🔍 MyUploads DEBUG");
          console.log("• iiPrincipal (current user):", iiPrincipal.toText()); // Log text for clarity
          all.forEach(([id, title, category, price, wallet, owner], i) => {
            console.log(`  [${i}] ds.id=${id} owner=${owner.toText()}`);
          });
          console.groupEnd();

          // FIX: Compare Principal objects by converting BOTH to text strings
          const mine = all.filter(
            ([, , , , , owner]) => owner.toText() === iiPrincipal.toText()
          );

          setUploads(
            mine.map(([id, title, category, price, wallet, owner]) => ({
              id: Number(id),
              title,
              category,
              price: Number(price),
              wallet,
              owner: owner.toText(), // Store as text, shorten in display if needed
            }))
          );
        } catch (err) {
          console.error("MyUploadsPage: Error fetching my uploads:", err);
          setError("Failed to load your uploads.");
        } finally {
          setLoadingDatasets(false); // Stop loading datasets
        }
      })();
    } else if (!authLoading && !(iiPrincipal instanceof Principal)) {
        // If auth is done loading but user is not logged in, set states accordingly
        setUploads([]);
        setLoadingDatasets(false);
        setError("Please log in to view your uploads.");
    }
  }, [iiPrincipal, authLoading]); // Re-run when principal or auth loading state changes

  const handleBack = () => navigate(-1); // Function to navigate back

  // Display loading state from either auth or dataset fetching
  if (authLoading || loadingDatasets) return <p className="loading-message">⏳ Loading your uploads…</p>;
  if (error) return <p className="error-message">{error}</p>; // Display error if any

  return (
    <div className="myuploads-container">
      <button className="back-btn" onClick={handleBack}>← Back</button> {/* Back button */}
      <h3 className="page-title">📦 My Uploaded Datasets</h3> {/* Changed to page-title for consistency */}
      
      {!uploads.length ? (
        <div className="no-uploads-message">
          <p>You haven't uploaded any datasets yet.</p>
          <button onClick={() => navigate("/upload")} className="upload-now-btn">
            Upload Your First Dataset!
          </button>
        </div>
      ) : (
        <ul className="upload-list">
          {uploads.map((ds) => (
            <li key={ds.id} className="upload-item">
              <div>
                <strong>{ds.title}</strong> ({ds.category}) — {ds.price} ICP
                <p className="owner-info">Owner: {shortenPrincipal(ds.owner)}</p> {/* Use shortenPrincipal */}
              </div>
              <Link to={`/admin/requests/${ds.id}`} className="manage-link">
                Manage Access
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}