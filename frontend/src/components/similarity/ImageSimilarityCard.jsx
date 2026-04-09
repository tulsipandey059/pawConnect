import React from 'react';
import { useNavigate } from 'react-router-dom';

function ImageSimilarityCard({ pet }) {
  const navigate = useNavigate();
  const status = (pet.status || '').toLowerCase();

  return (
    <article className="pet-card">
      <img
        className="pet-card__image"
        src={
          pet.image ||
          'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=500&fit=crop'
        }
        alt={pet.name}
      />
      <div className="pet-card__body">
        <div className="pet-card__meta-row">
          <span className={`status-pill status-pill--${status || 'lost'}`}>
            {status || 'match'}
          </span>
          {pet.similarity ? (
            <span className="score-pill">{pet.similarity}% match</span>
          ) : null}
        </div>

        <div>
          <h3>{pet.name}</h3>
          <p>{pet.matchReason || 'Potential image similarity match.'}</p>
        </div>

        <dl className="pet-card__facts">
          <div>
            <dt>Breed</dt>
            <dd>{pet.breed || 'Unknown'}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{pet.type || 'Unknown'}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{pet.location || 'Not available'}</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>{pet.contact || pet.contactDetails || 'Open report'}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="button button--secondary button--full"
          onClick={() => navigate(`/pet/${pet.id}`)}
        >
          View details
        </button>
      </div>
    </article>
  );
}

export default ImageSimilarityCard;
