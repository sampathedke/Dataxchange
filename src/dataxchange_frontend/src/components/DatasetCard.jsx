// src/components/DatasetCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/datasetcard.css';
import { shortenPrincipal } from '../utils/principal';
/**
 * @param {{
 *   id: string;
 *   title: string;
 *   description: string;
 *   price: string;
 *   owner: string;
 *   imageUrl?: string;
 * }} props
 */
export default function DatasetCard({ id, title, category, price, owner, imageUrl }) {
  return (
    <Link to={`/dataset/${id}`} className="dataset-card-link">
      <div className="dataset-card">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="dataset-card-image" />
        )}
        <div className="dataset-card-body">
          <h3 className="dataset-card-title">{title}</h3>
          <p className="dataset-card-category"><strong>Category:</strong> {category}</p>
          <div className="dataset-card-footer">
            <span className="dataset-card-price">{price} ICP</span>
          <span className="dataset-card-owner">by {shortenPrincipal(owner)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
