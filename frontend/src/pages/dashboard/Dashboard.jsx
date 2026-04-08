import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Topbar from '../../components/layout/Topbar';
import Sidebar from '../../components/layout/Sidebar';
import DesktopSidebar from '../../components/layout/DesktopSidebar';

const ownerPetsSeed = [
  { id: 1, name: 'Max', breed: 'Golden Retriever', status: 'Lost', location: 'Central Park' },
  { id: 2, name: 'Luna', breed: 'Siamese Cat', status: 'Found', location: 'Main Street' },
  { id: 3, name: 'Buddy', breed: 'Labrador', status: 'Lost', location: 'School Area' },
];

const ownerMatchesSeed = [
  { id: 1, name: 'Perfect match for Max', similarity: 95, location: '2km away', breed: 'Golden Retriever' },
  { id: 2, name: 'Good match for Luna', similarity: 82, location: '5km away', breed: 'Siamese' },
  { id: 3, name: 'Possible match for Buddy', similarity: 70, location: '1km away', breed: 'Labrador Mix' },
];

const ngoRequestsSeed = [
  { id: 1, pet: 'Buddy', applicant: 'John Doe', status: 'Pending', type: 'Adoption' },
  { id: 2, pet: 'Bella', applicant: 'Jane Smith', status: 'Approved', type: 'Rescue' },
  { id: 3, pet: 'Buddy', applicant: 'Asha Nair', status: 'Pending', type: 'Adoption' },
  { id: 4, pet: 'Charlie', applicant: 'Mike Johnson', status: 'Rejected', type: 'Adoption' },
];

const volunteerTasksSeed = [
  { id: 1, title: 'Help find lost Golden Retriever', location: 'Central Park', status: 'Active' },
  { id: 2, title: 'Check on found Siamese cat', location: 'Main Street', status: 'Completed' },
];

const adminUsersSeed = [
  { id: 1, name: 'Admin User', email: 'admin@pawconnect.com', role: 'admin', status: 'Active' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'owner', status: 'Active' },
  { id: 3, name: 'Rohan Kumar', email: 'rohan@example.com', role: 'volunteer', status: 'Pending Review' },
  { id: 4, name: 'Care Rescue NGO', email: 'ngo@example.com', role: 'ngo', status: 'Suspended' },
];

const initialOwnerReport = {
  petName: '',
  breed: '',
  location: '',
  description: '',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ownerReportDraft, setOwnerReportDraft] = useState(initialOwnerReport);
  const [ngoRequests, setNgoRequests] = useState(ngoRequestsSeed);
  const [volunteerTasks, setVolunteerTasks] = useState(volunteerTasksSeed);
  const [adminUsers, setAdminUsers] = useState(adminUsersSeed);
  const [dashboardNotice, setDashboardNotice] = useState('');
  const assignedTasksRef = useRef(null);

  useEffect(() => {
    if (location.hash === '#assigned-tasks' && currentUser?.role === 'volunteer') {
      window.setTimeout(() => {
        assignedTasksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash, currentUser?.role]);

  const showNotice = (message) => {
    setDashboardNotice(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickRoute = (path, message) => {
    if (message) {
      showNotice(message);
    }
    navigate(path);
  };

  const handleOwnerDraftChange = (field, value) => {
    setOwnerReportDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleOwnerReportSubmit = () => {
    const hasEmptyField = Object.values(ownerReportDraft).some((value) => !value.trim());

    if (hasEmptyField) {
      showNotice('Fill in pet name, breed, location, and description before continuing.');
      return;
    }

    showNotice(`Prepared a lost-pet report for ${ownerReportDraft.petName}. Finish it on the report page.`);
    navigate('/report-lost');
  };

  const handleNgoRequestStatus = (requestId, nextStatus) => {
    const updatedRequest = ngoRequests.find((request) => request.id === requestId);

    setNgoRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: nextStatus } : request
      )
    );

    if (updatedRequest) {
      showNotice(`${updatedRequest.pet}'s ${updatedRequest.type.toLowerCase()} request is now ${nextStatus.toLowerCase()}.`);
    }
  };

  const handleNgoAssignVolunteer = (requestId) => {
    const updatedRequest = ngoRequests.find((request) => request.id === requestId);

    setNgoRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: 'Volunteer Assigned' } : request
      )
    );

    if (updatedRequest) {
      showNotice(`A volunteer has been assigned to ${updatedRequest.pet}.`);
    }
  };

  const handleNgoAdoptionGroupStatus = (petName, nextStatus) => {
    const matchingRequests = ngoRequests.filter(
      (request) => request.pet === petName && request.type === 'Adoption'
    );

    setNgoRequests((prev) =>
      prev.map((request) =>
        request.pet === petName && request.type === 'Adoption'
          ? { ...request, status: nextStatus }
          : request
      )
    );

    if (matchingRequests.length > 0) {
      showNotice(
        `${nextStatus} ${matchingRequests.length} adoption request${matchingRequests.length > 1 ? 's' : ''} for ${petName}.`
      );
    }
  };

  const handleVolunteerHelpSearch = (pet) => {
    const existingTask = volunteerTasks.find((task) => task.title === `Search for ${pet.name}`);

    if (existingTask) {
      showNotice(`You are already helping with ${pet.name}.`);
      return;
    }

    setVolunteerTasks((prev) => [
      {
        id: Date.now(),
        title: `Search for ${pet.name}`,
        location: pet.location,
        status: 'Active',
      },
      ...prev,
    ]);

    showNotice(`Search task created for ${pet.name}. Check Assigned Tasks below.`);
  };

  const handleVolunteerMarkComplete = (taskId) => {
    const updatedTask = volunteerTasks.find((task) => task.id === taskId);

    setVolunteerTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: 'Completed' } : task))
    );

    if (updatedTask) {
      showNotice(`Marked "${updatedTask.title}" as completed.`);
    }
  };

  const handleAdminStatusToggle = (userId) => {
    const selectedUser = adminUsers.find((user) => user.id === userId);

    setAdminUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        const nextStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
        return { ...user, status: nextStatus };
      })
    );

    if (selectedUser) {
      const nextStatus = selectedUser.status === 'Suspended' ? 'Active' : 'Suspended';
      showNotice(`${selectedUser.name} is now ${nextStatus.toLowerCase()}.`);
    }
  };

  const handleAdminApproveUser = (userId) => {
    const selectedUser = adminUsers.find((user) => user.id === userId);

    setAdminUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: 'Active' } : user))
    );

    if (selectedUser) {
      showNotice(`${selectedUser.name} has been approved.`);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: 'bg-blue-100 text-blue-800',
      ngo: 'bg-green-100 text-green-800',
      volunteer: 'bg-orange-100 text-orange-800',
      admin: 'bg-purple-100 text-purple-800',
    };

    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Volunteer Assigned':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const adoptionRequestGroups = Object.values(
    ngoRequests
      .filter((request) => request.type === 'Adoption')
      .reduce((acc, request) => {
        if (!acc[request.pet]) {
          acc[request.pet] = {
            pet: request.pet,
            applicants: [],
            statuses: [],
          };
        }

        acc[request.pet].applicants.push(request.applicant);
        acc[request.pet].statuses.push(request.status);
        return acc;
      }, {})
  ).map((group) => {
    const status = group.statuses.includes('Approved')
      ? 'Approved'
      : group.statuses.includes('Pending') || group.statuses.includes('Volunteer Assigned')
        ? 'Pending'
        : 'Rejected';

    return {
      ...group,
      count: group.applicants.length,
      status,
    };
  });

  const renderDashboard = () => {
    if (!currentUser?.role) {
      return <div className="text-center py-20 text-text-dark text-xl font-semibold">Loading your dashboard...</div>;
    }

    const roleTitle =
      currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1).toLowerCase() + ' Dashboard';

    if (currentUser.role === 'owner') {
      return (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Report Lost Pet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <input
                className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400"
                placeholder="Pet Name"
                value={ownerReportDraft.petName}
                onChange={(event) => handleOwnerDraftChange('petName', event.target.value)}
              />
              <input
                className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400"
                placeholder="Breed / Type"
                value={ownerReportDraft.breed}
                onChange={(event) => handleOwnerDraftChange('breed', event.target.value)}
              />
              <input
                className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400"
                placeholder="Last Location"
                value={ownerReportDraft.location}
                onChange={(event) => handleOwnerDraftChange('location', event.target.value)}
              />
              <input
                className="md:col-span-2 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400"
                placeholder="Description"
                value={ownerReportDraft.description}
                onChange={(event) => handleOwnerDraftChange('description', event.target.value)}
              />
              <div className="md:col-span-3" />
              <button
                className="md:col-span-3 bg-primary-orange text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
                onClick={handleOwnerReportSubmit}
              >
                Report Lost Pet
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">My Pets ({ownerPetsSeed.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerPetsSeed.map((pet) => (
                <div
                  key={pet.id}
                  className="group hover:shadow-xl transition-all rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200"
                >
                  <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl font-semibold text-text-dark/60">{pet.name.slice(0, 1)}</span>
                  </div>
                  <h3 className="font-bold text-xl text-text-dark mb-2">{pet.name}</h3>
                  <p className="text-text-dark/70 mb-2">{pet.breed}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pet.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {pet.status}
                  </span>
                  <p className="text-sm text-text-dark/50 mt-2">{pet.location}</p>
                  <button
                    className="w-full mt-4 bg-slate-900 text-white py-2 px-4 rounded-xl font-medium hover:bg-slate-800 transition-all"
                    onClick={() => navigate('/my-pets')}
                  >
                    View Pet List
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">AI Match Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerMatchesSeed.map((match) => (
                <div
                  key={match.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4">
                      {match.similarity}%
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark">{match.name}</h4>
                      <p className="text-sm text-text-dark/70">{match.breed}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-dark/60 mb-4">{match.location}</p>
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-medium text-sm transition-all"
                    onClick={() => handleQuickRoute('/lost-pets', 'Opening community reports for the closest match.')}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-6 px-8 rounded-2xl font-bold text-xl transition-all shadow-sm hover:shadow-md"
                onClick={() => handleQuickRoute('/report-found')}
              >
                Report Found Pet
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-primary-orange text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl"
                onClick={() => handleQuickRoute('/rescue')}
              >
                Emergency Call
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Recent Notifications</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              <div className="flex items-start space-x-4 p-4 bg-primary-orange/10 border-l-4 border-primary-orange rounded-r-xl">
                <div className="w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mt-1">
                  !
                </div>
                <div>
                  <p className="font-semibold text-text-dark">New match found for Max</p>
                  <p className="text-sm text-text-dark/70">95% similarity - Golden Retriever sighted 2km away</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mt-1">
                  C
                </div>
                <div>
                  <p className="font-semibold text-text-dark">Volunteer contacted you</p>
                  <p className="text-sm text-text-dark/70">Sarah Wilson wants to help search for Luna</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentUser.role === 'ngo') {
      return (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Nearby Lost Pets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerPetsSeed.map((pet) => (
                <div
                  key={pet.id}
                  className="group hover:shadow-xl transition-all rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200"
                >
                  <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl font-semibold text-text-dark/60">{pet.name.slice(0, 1)}</span>
                  </div>
                  <h3 className="font-bold text-xl text-text-dark mb-2">{pet.name}</h3>
                  <p className="text-text-dark/70 mb-2">{pet.breed}</p>
                  <p className="text-sm text-text-dark/50">{pet.location}</p>
                  <button
                    className="w-full mt-4 bg-primary-orange text-white py-2 px-4 rounded-xl font-medium hover:bg-orange-500 transition-all"
                    onClick={() => handleQuickRoute('/lost-pets')}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div ref={assignedTasksRef} id="assigned-tasks" className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Rescue Requests</h3>
              <div className="space-y-4">
                {ngoRequests.slice(0, 2).map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-xl border-l-4 border-orange-400 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <span className="font-semibold">{request.pet}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRequestStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-dark/70">{request.applicant}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="flex-1 bg-green-500 text-white text-sm py-1.5 px-3 rounded-lg hover:bg-green-600 font-medium"
                        onClick={() => handleNgoAssignVolunteer(request.id)}
                      >
                        Assign Volunteer
                      </button>
                      <button
                        className="flex-1 bg-gray-500 text-white text-sm py-1.5 px-3 rounded-lg hover:bg-gray-600 font-medium"
                        onClick={() => handleQuickRoute('/rescue')}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Active Cases</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-text-dark/70">Lost Pets</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-text-dark/70">Rescued</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">4</div>
                  <div className="text-sm text-text-dark/70">Pending</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-text-dark/70">Reunited</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Adoption Requests ({adoptionRequestGroups.length})</h2>
            <div className="space-y-4">
              {adoptionRequestGroups.map((request) => (
                <div
                  key={request.pet}
                  className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <div className="font-bold text-lg text-text-dark">{request.pet}</div>
                    <div className="text-sm text-text-dark/70">
                      {request.count} {request.count === 1 ? 'person has' : 'people have'} requested adoption
                    </div>
                    <div className="text-sm text-text-dark/50 mt-1">{request.applicants.join(', ')}</div>
                    <div className="mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRequestStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 text-sm"
                      onClick={() => handleNgoAdoptionGroupStatus(request.pet, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 text-sm"
                      onClick={() => handleNgoAdoptionGroupStatus(request.pet, 'Rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentUser.role === 'volunteer') {
      return (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Nearby Lost and Found Pets ({ownerPetsSeed.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerPetsSeed.map((pet) => (
                <div key={pet.id} className="relative group">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all overflow-hidden shadow-lg">
                    <span className="text-3xl font-semibold text-text-dark/70">{pet.name}</span>
                  </div>
                  <div className="p-4 bg-white rounded-b-2xl -mt-4 shadow-lg">
                    <h4 className="font-bold text-lg text-text-dark mb-1">{pet.name}</h4>
                    <p className="text-sm text-text-dark/70 mb-2">{pet.breed}</p>
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          pet.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {pet.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full font-medium">1.2km</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-primary-orange text-white text-sm py-2 px-3 rounded-xl font-medium hover:bg-orange-500"
                        onClick={() => handleQuickRoute('/report-found', `Opening a found-pet report for ${pet.name}.`)}
                      >
                        I Found It
                      </button>
                      <button
                        className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded-xl font-medium hover:bg-blue-600"
                        onClick={() => handleVolunteerHelpSearch(pet)}
                      >
                        Help Search
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Assigned Tasks ({volunteerTasks.length})</h3>
              <div className="space-y-4">
                {volunteerTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 bg-gradient-to-r from-emerald-50 to-green-100 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all"
                  >
                    <h4 className="font-bold text-lg text-text-dark mb-2">{task.title}</h4>
                    <p className="text-sm text-text-dark/70 mb-3">{task.location}</p>
                    <div className="flex gap-3 items-center">
                      <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm font-medium">
                        {task.status}
                      </span>
                      <button
                        className="ml-auto bg-emerald-500 text-white px-4 py-1.5 rounded-xl font-medium text-sm hover:bg-emerald-600 disabled:bg-emerald-300"
                        onClick={() => handleVolunteerMarkComplete(task.id)}
                        disabled={task.status === 'Completed'}
                      >
                        {task.status === 'Completed' ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="w-full mt-6 bg-primary-orange text-white py-3 px-6 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-lg"
                onClick={() => handleQuickRoute('/volunteer')}
              >
                Accept New Request
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600">8</div>
                  <div className="text-text-dark/70 font-medium mt-1">Pets Found</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600">15</div>
                  <div className="text-text-dark/70 font-medium mt-1">Hours Helped</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600">4.9</div>
                  <div className="text-text-dark/70 font-medium mt-1">Rating</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600">12km</div>
                  <div className="text-text-dark/70 font-medium mt-1">Coverage</div>
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-primary-orange to-orange-500 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
                onClick={() => handleQuickRoute('/profile')}
              >
                Update Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-green-500 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl"
                onClick={() => handleQuickRoute('/map')}
              >
                Open Map
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-blue-500 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                onClick={() => handleQuickRoute('/rescue')}
              >
                Emergency Call
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-primary-orange text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl"
                onClick={() => handleQuickRoute('/volunteer')}
              >
                Find Tasks
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentUser.role === 'admin') {
      return (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h1 className="text-3xl font-bold text-text-dark mb-2">{roleTitle}</h1>
            <p className="text-lg text-text-dark/60">Monitor users, review pending accounts, and jump into platform operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <p className="text-sm text-text-dark/60">Total Users</p>
              <p className="text-3xl font-bold text-text-dark mt-2">1245</p>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <p className="text-sm text-text-dark/60">Pending Reviews</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {adminUsers.filter((user) => user.status === 'Pending Review').length}
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <p className="text-sm text-text-dark/60">Suspended Users</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {adminUsers.filter((user) => user.status === 'Suspended').length}
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <p className="text-sm text-text-dark/60">Open Rescue Cases</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">18</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-dark">User Management</h2>
              <button
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all"
                onClick={() => handleQuickRoute('/notifications', 'Opening notifications so you can broadcast platform updates.')}
              >
                Send Platform Update
              </button>
            </div>

            <div className="space-y-4">
              {adminUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-5 rounded-2xl border bg-gradient-to-r from-gray-50 to-white"
                >
                  <div>
                    <h3 className="text-lg font-bold text-text-dark">{user.name}</h3>
                    <p className="text-sm text-text-dark/60">{user.email}</p>
                    <div className="flex gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRequestStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user.status === 'Pending Review' && (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 text-sm"
                        onClick={() => handleAdminApproveUser(user.id)}
                      >
                        Approve User
                      </button>
                    )}
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 text-sm"
                      onClick={() => handleQuickRoute('/profile', `Opening the profile area for ${user.name}.`)}
                    >
                      View Profile
                    </button>
                    <button
                      className="bg-slate-700 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-800 text-sm"
                      onClick={() => handleQuickRoute('/notifications', `Opening notifications for ${user.name}.`)}
                    >
                      Notify
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 text-sm"
                      onClick={() => handleAdminStatusToggle(user.id)}
                    >
                      {user.status === 'Suspended' ? 'Reinstate' : 'Suspend'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-emerald-500 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl"
                onClick={() => handleQuickRoute('/rescue')}
              >
                Review Rescue Queue
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-blue-500 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                onClick={() => handleQuickRoute('/lost-pets')}
              >
                Review Reports
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button
                className="w-full bg-primary-orange text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl"
                onClick={() => handleQuickRoute('/adoption')}
              >
                Manage Adoptions
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-text-dark mb-4">Access Denied</h1>
        <p className="text-xl text-text-dark/60 mb-8">Role '{currentUser.role}' dashboard not available</p>
        <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${getRoleColor(currentUser.role)}`}>
          {currentUser.role}
        </span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-warm-beige">
      <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 shrink-0">
        <DesktopSidebar />
      </div>

      <div className="flex-1 min-h-screen">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <button
          className="lg:hidden p-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl fixed top-4 left-4 mt-16"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="pt-24 lg:pt-4 p-6 lg:p-8">
          {dashboardNotice && (
            <div className="mb-6 rounded-2xl border border-primary-orange/20 bg-primary-orange/10 px-5 py-4 text-sm font-medium text-text-dark">
              {dashboardNotice}
            </div>
          )}
          {renderDashboard()}
        </div>
      </div>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
