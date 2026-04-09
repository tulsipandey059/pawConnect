import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../../context/PetContext';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/similarity/ImageUpload';
import PetDetailsFields from '../../components/similarity/PetDetailsFields';

const initialForm = {
  name: '',
  status: 'lost',
  location: '',
  type: 'dog',
  breed: '',
  imageFile: null,
  contactDetails: '',
};

function AddPetPage() {
  const navigate = useNavigate();
  const { addPet } = usePets();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canContinue = useMemo(() => {
    return Boolean(
      formData.imageFile &&
        formData.location.trim() &&
        formData.type &&
        formData.breed
    );
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((current) => {
      if (field === 'type') {
        return { ...current, type: value, breed: '' };
      }

      return { ...current, [field]: value };
    });
  };

  const handleNextStep = () => {
    if (!canContinue) {
      setError(
        'Please complete the image, location, type, and breed before moving on.'
      );
      return;
    }

    setError('');
    setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.contactDetails.trim()) {
      setError('Please add the contact details you want people to use.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const pet = await addPet({
        name: formData.name.trim() || `${formData.breed} ${formData.type}`,
        status: formData.status,
        location: formData.location.trim(),
        type: formData.type,
        breed: formData.breed,
        image: formData.imageFile,
        contact: formData.contactDetails.trim(),
        contactDetails: formData.contactDetails.trim(),
        description: `${
          formData.status === 'lost' ? 'Lost' : 'Found'
        } ${formData.type} report near ${formData.location.trim()}.`,
        ownerId: currentUser?.id ?? currentUser?._id,
        ownerEmail: currentUser?.email,
        tags: [formData.type === 'dog' ? 'Dog' : 'Cat', formData.breed],
      });

      navigate(`/pet/${pet.id || pet._id}`);
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError?.message || 'Could not submit the report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="shell page-stack">
        <div className="page-intro">
          <span className="eyebrow">Report workflow</span>
          <h1>Report a lost or found pet</h1>
          <p>
            Step 1 captures the pet details for matching. Step 2 stores the
            contact details people should use when they recognize the pet.
          </p>
        </div>

        <div className="progress-steps" aria-label="Report progress">
          <div
            className={`progress-steps__item${
              step === 1
                ? ' progress-steps__item--active'
                : step > 1
                  ? ' progress-steps__item--complete'
                  : ''
            }`}
          >
            1. Pet details
          </div>
          <div
            className={`progress-steps__item${
              step === 2 ? ' progress-steps__item--active' : ''
            }`}
          >
            2. Contact details
          </div>
        </div>

        <form className="card form-card" onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <PetDetailsFields
                values={formData}
                onChange={handleChange}
                includeStatus
                imageField={
                  <ImageUpload
                    label="Pet image"
                    hint="Use a clear photo where the pet is easy to identify."
                    file={formData.imageFile}
                    onChange={(file) => handleChange('imageFile', file)}
                    required
                  />
                }
              />
              {error ? <p className="form-error">{error}</p> : null}
              <div className="form-actions">
                <button type="button" className="button" onClick={handleNextStep}>
                  Continue to contact details
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="form-stack">
                <div className="field-group">
                  <label className="field-label" htmlFor="contactDetails">
                    Contact details
                    <span className="field-label__required">*</span>
                  </label>
                  <textarea
                    id="contactDetails"
                    className="field-input field-input--textarea"
                    placeholder="Add phone number, email, preferred time to contact, landmark details, or any notes that will help the right person reach you."
                    value={formData.contactDetails}
                    onChange={(event) =>
                      handleChange('contactDetails', event.target.value)
                    }
                    required
                  />
                </div>
              </div>
              {error ? <p className="form-error">{error}</p> : null}
              <div className="form-actions form-actions--spread">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button type="submit" className="button" disabled={submitting}>
                  {submitting ? 'Submitting report...' : 'Submit report'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

export default AddPetPage;
