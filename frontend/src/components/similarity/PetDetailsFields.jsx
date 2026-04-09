import React from 'react';
import { getBreedsByType, PET_TYPES } from '../../data/breeds';

function PetDetailsFields({
  values,
  onChange,
  imageField,
  includeStatus = false,
  includeName = true,
}) {
  const breeds = getBreedsByType(values.type);

  return (
    <div className="form-stack">
      {includeStatus ? (
        <div className="field-group">
          <span className="field-label">
            Report type<span className="field-label__required">*</span>
          </span>
          <div className="segmented-toggle">
            {['lost', 'found'].map((status) => (
              <button
                key={status}
                type="button"
                className={`segmented-toggle__button${
                  values.status === status
                    ? ' segmented-toggle__button--active'
                    : ''
                }`}
                onClick={() => onChange('status', status)}
              >
                {status === 'lost' ? 'I lost a pet' : 'I found a pet'}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {imageField}

      <div className="field-grid">
        <div className="field-group">
          <label className="field-label" htmlFor="location">
            Location<span className="field-label__required">*</span>
          </label>
          <input
            id="location"
            className="field-input"
            type="text"
            placeholder="Area, city, or landmark"
            value={values.location}
            onChange={(event) => onChange('location', event.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="type">
            Pet type<span className="field-label__required">*</span>
          </label>
          <select
            id="type"
            className="field-input"
            value={values.type}
            onChange={(event) => onChange('type', event.target.value)}
            required
          >
            {PET_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-grid field-grid--report">
        <div className="field-group">
          <label className="field-label" htmlFor="breed">
            Breed<span className="field-label__required">*</span>
          </label>
          <select
            id="breed"
            className="field-input"
            value={values.breed}
            onChange={(event) => onChange('breed', event.target.value)}
            required
          >
            <option value="">Select a breed</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        {includeName ? (
          <div className="field-group">
            <label className="field-label" htmlFor="name">
              Pet name <span className="field-label__optional">optional</span>
            </label>
            <input
              id="name"
              className="field-input"
              type="text"
              placeholder="If you know the pet's name"
              value={values.name || ''}
              onChange={(event) => onChange('name', event.target.value)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PetDetailsFields;
