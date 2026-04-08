import React from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/maps/MapComponent';
import Button from '../../components/ui/Button';
import { mockRescueRequests } from '../../utils/mockData';

const EmergencyRescuePage = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleEmergencyCall = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Emergency services notified! Help is on the way.');
    }, 2000);
  };

  const handleHelpNow = (requestTitle) => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      alert(`Rescue team assigned for ${requestTitle}.`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-warm-beige">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-6">
            Emergency Rescue
          </h1>
          <p className="text-xl text-text-dark/80 max-w-3xl mx-auto mb-12">
            Found an injured animal or need immediate help? We're here 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button variant="primary" size="lg" className="flex items-center justify-center space-x-3" onClick={handleEmergencyCall}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Emergency
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/report-found')}>
              Report Injury
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <MapComponent pets={mockRescueRequests} />
          </div>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-soft">
              <h3 className="text-2xl font-bold text-text-dark mb-6">Active Emergencies</h3>
              <div className="space-y-4">
                {mockRescueRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-l-4 border-orange-400">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-text-dark">{req.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.priority === 'Emergency' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-sm text-text-dark/70">{req.location}</p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => handleHelpNow(req.title)}
                    >
                      Help Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRescuePage;

