export const mockNotifications = [
  { id: 1, title: 'Lost pet match found!', message: 'Bella was spotted near your location', type: 'match', date: '2 mins ago', read: false },
  { id: 2, title: 'Adoption application approved', message: 'Your application for Whiskers has been approved', type: 'adoption', date: '1 hour ago', read: true },
  { id: 3, title: 'New rescue request nearby', message: 'Injured cat needs help - 1.2km away', type: 'rescue', date: '3 hours ago', read: false },
  { id: 4, title: 'Volunteer assigned', message: 'You are assigned to help with Max rescue', type: 'assignment', date: '1 day ago', read: true },
];

export const mockAdoptionRequests = [
  { id: 1, petName: 'Whiskers', status: 'Pending', applicant: 'Priya Sharma', date: '2024-01-15' },
  { id: 2, petName: 'Luna', status: 'Approved', applicant: 'Rohan Kumar', date: '2024-01-14' },
  { id: 3, petName: 'Mittens', status: 'Rejected', applicant: 'Anita Desai', date: '2024-01-13' },
];

export const mockRescueRequests = [
  { id: 1, title: 'Injured street dog', location: 'Andheri East', priority: 'High', status: 'Open' },
  { id: 2, title: 'Lost kitten in park', location: 'Juhu Beach', priority: 'Medium', status: 'In Progress' },
];

export const mockVolunteers = [
  { id: 1, name: 'Raj Patel', location: 'Mumbai', rating: 4.8, available: true },
  { id: 2, name: 'Sneha Gupta', location: 'Bangalore', rating: 4.5, available: false },
];

export const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@pawconnect.com', role: 'admin', joined: '2023-01-01', status: 'Active' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'petOwner', joined: '2024-01-10', status: 'Active' },
];

export const mockStats = {
  totalUsers: 1245,
  totalPets: 356,
  reunions: 89,
  adoptions: 47,
};

