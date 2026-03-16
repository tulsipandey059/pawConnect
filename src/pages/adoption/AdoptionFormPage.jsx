import React from 'react';
import { Link } from 'react-router-dom';
import AdoptionForm from '../../components/forms/AdoptionForm';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { useParams } from 'react-router-dom';


const AdoptionFormPage = () => {
  const { petId } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [petName, setPetName] = React.useState('Buddy');

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API
      alert('Adoption request submitted! We will contact you soon.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader size="lg" />
          <p className="text-xl text-text-dark">Submitting your adoption request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
        <Link to="/adoption">
          <Button variant="outline" className="mb-8">
            ← Back to Adoption
          </Button>
        </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-orange to-orange-500 bg-clip-text text-transparent mb-4">
            Adoption Application
          </h1>
          <p className="text-xl text-text-dark/70">
            Apply to adopt <span className="font-semibold text-primary-orange">{petName}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-12">
          <AdoptionForm 
            petId={petId}
            petName={petName}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AdoptionFormPage;

