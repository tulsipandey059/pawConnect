import React from 'react';
import { mockUsers, mockStats } from '../../utils/mockData';
import { usePets } from '../../context/PetContext';

const AdminDashboard = () => {
  const { pets } = usePets();

  return (
    <div className="space-y-8">
      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-8 shadow-xl">
          <div className="text-3xl font-bold mb-2">{mockStats.totalUsers}</div>
          <div className="text-blue-100">Total Users</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl p-8 shadow-xl">
          <div className="text-3xl font-bold mb-2">{pets.length}</div>
          <div className="text-green-100">Total Pets</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-8 shadow-xl">
          <div className="text-3xl font-bold mb-2">{mockStats.adoptions}</div>
          <div className="text-purple-100">Adoptions</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-8 shadow-xl">
          <div className="text-3xl font-bold mb-2">{mockStats.reunions}</div>
          <div className="text-orange-100">Reunions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manage Users */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-soft p-8">
          <h3 className="text-2xl font-bold text-text-dark mb-6">Users ({mockUsers.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 font-semibold text-text-dark">Name</th>
                  <th className="text-left py-4 font-semibold text-text-dark">Email</th>
                  <th className="text-left py-4 font-semibold text-text-dark">Role</th>
                  <th className="text-left py-4 font-semibold text-text-dark">Joined</th>
                  <th className="text-left py-4 font-semibold text-text-dark">Status</th>
                  <th className="py-4"></th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 font-medium text-text-dark">{user.name}</td>
                    <td className="py-4 text-text-dark/70">{user.email}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'ngo' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-text-dark/70">{user.joined}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h4 className="font-bold text-text-dark mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full bg-primary-orange text-white py-3 px-4 rounded-xl hover:bg-orange-400 transition-all font-medium">
                Verify NGO
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all font-medium">
                Approve Reports
              </button>
              <button className="w-full border border-gray-200 text-text-dark py-3 px-4 rounded-xl hover:bg-gray-50 transition-all font-medium">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

