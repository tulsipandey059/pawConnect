import React from 'react';
import { usePets } from '../../context/PetContext';
import { mockNotifications, mockAdoptionRequests } from '../../utils/mockData';
import PetCard from '../../components/pets/PetCard';

const UserDashboard = () => {
  const { pets } = usePets();

  // Mock user's pets (filter by mock ownerId 2 for petOwner)
  const myLostPets = pets.filter(p => p.status === 'Lost' && p.ownerId === 2);
  const myFoundReports = pets.filter(p => p.status === 'Found' && p.ownerId === 2);
  const myAdoptionApps = mockAdoptionRequests.filter(app => app.ownerId === 2);


  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <div className="bg-white rounded-3xl shadow-soft p-8">
        <h2 className="text-2xl font-bold text-text-dark mb-4">Profile Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-primary-orange/5 rounded-2xl">
            <div className="text-3xl font-bold text-primary-orange mb-1">Priya Sharma</div>
            <div className="text-text-dark/70 font-medium">Pet Owner</div>
            <div className="text-sm text-text-dark/50 mt-2">Joined Jan 2024</div>
          </div>
          <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-dark">3</div>
              <div className="text-sm text-text-dark/70">Lost Pets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-dark">1</div>
              <div className="text-sm text-text-dark/70">Found Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-dark">2</div>
              <div className="text-sm text-text-dark/70">Applications</div>
            </div>
          </div>
        </div>
      </div>

      {/* My Lost Pets */}
      <div>
        <h3 className="text-2xl font-bold text-text-dark mb-6">My Lost Pets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myLostPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
        {myLostPets.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🐕</span>
            <p className="text-xl text-text-dark/50">No lost pets yet. <a href="/add-pet" className="text-primary-orange hover:underline font-medium">Report a lost pet</a></p>
          </div>
        )}
      </div>

      {/* My Found Reports */}
      <div>
        <h3 className="text-2xl font-bold text-text-dark mb-6">My Found Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myFoundReports.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
        {myFoundReports.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🐈</span>
            <p className="text-xl text-text-dark/50">No found reports yet. <a href="/report-found" className="text-primary-orange hover:underline font-medium">Report found pet</a></p>
          </div>
        )}
      </div>


      {/* Adoption Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <h3 className="text-2xl font-bold text-text-dark mb-6">Adoption Applications</h3>
          <div className="space-y-4">
            {mockAdoptionRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-text-dark">{req.petName}</div>
                  <div className="text-sm text-text-dark/70">{req.applicant}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <h3 className="text-2xl font-bold text-text-dark mb-6">Notifications</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {mockNotifications.slice(0, 5).map(notif => (
              <div key={notif.id} className={`p-4 rounded-xl border-l-4 ${
                notif.read ? 'bg-gray-50 border-gray-200' : 'bg-primary-orange/10 border-primary-orange'
              }`}>
                <div className="font-semibold text-text-dark">{notif.title}</div>
                <div className="text-sm text-text-dark/70">{notif.message}</div>
                <div className="text-xs text-text-dark/50 mt-1">{notif.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

