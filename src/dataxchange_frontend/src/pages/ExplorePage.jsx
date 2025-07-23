// src/pages/ExplorePage.jsx

import React, { useEffect, useState } from 'react';
import { getAllDatasets } from '../services/api';
import DatasetCard from '../components/DatasetCard';
import { shortenPrincipal } from '../utils/principal'; // Import shortenPrincipal
import '../styles/explore.css';

export default function ExplorePage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllDatasets()
      .then((data) => {
        setDatasets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ExplorePage: Error fetching datasets:", err);
        setError("❌ Failed to load datasets.");
        setLoading(false);
      });
  }, []);

  const filtered = datasets.filter(ds =>
    // Search by title or by the full owner principal (as a string)
    ds.title.toLowerCase().includes(search.toLowerCase()) ||
    ds.owner.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="explore-loading">⏳ Loading datasets…</p>;
  if (error) return <p className="explore-error">{error}</p>;

  return (
    <div className="explore-container">
      <h3 className="explore-heading">📊 Explore Datasets</h3>
      <p className="explore-subtext">Browse trending and high-quality datasets submitted by data providers.</p>

      <input
        className="explore-search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by title or owner..."
      />

      <div className="explore-grid">
        {filtered.length ? (
          filtered.map((ds) => (
            <DatasetCard
              key={ds.id}
              id={ds.id}
              title={ds.title}
              // FIX: Pass 'category' prop if DatasetCard expects it,
              // or keep 'description' if that's how you want to use it.
              // Assuming DatasetCard was updated to accept 'category'.
              category={ds.category}
              // If DatasetCard still expects 'description', you can do:
              // description={`Category: ${ds.category}`}
              price={ds.price}
              // FIX: Use the imported shortenPrincipal utility
              owner={shortenPrincipal(ds.owner)}
            />
          ))
        ) : (
          <p className="explore-empty">😕 No datasets found.</p>
        )}
      </div>
    </div>
  );
}