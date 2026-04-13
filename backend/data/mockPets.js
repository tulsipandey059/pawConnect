// Mock pet data - starts with initial pets, then new ones are added in memory
const initialMockPets = [
  {
    _id: "607f1f77bcf86cd799439001",
    name: "Buddy",
    breed: "Golden Retriever",
    age: "2 years",
    gender: "Male",
    type: "dog",
    images: [
      { url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop", publicId: "pawconnect/pets/buddy" }
    ],
    status: "lost",
    tags: ["Dog", "Friendly", "Vaccinated"],
    description: "Buddy is a friendly Golden Retriever who got scared during Diwali fireworks and ran off. He is microchipped and wearing a blue collar with tags.",
    location: { address: "Andheri", city: "Mumbai", state: "Maharashtra" },
    contact: "+91 98765 43210",
    postedBy: null,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
    isResolved: false
  },
  {
    _id: "607f1f77bcf86cd799439002",
    name: "Whiskers",
    breed: "Persian Cat",
    age: "1 year",
    gender: "Female",
    type: "cat",
    images: [
      { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop", publicId: "pawconnect/pets/whiskers" }
    ],
    status: "adoption",
    tags: ["Cat", "Indoor", "Spayed"],
    description: "Whiskers is a beautiful Persian cat looking for her forever home. She is very calm and loves to cuddle.",
    location: { address: "Koramangala", city: "Bangalore", state: "Karnataka" },
    contact: "+91 98765 43211",
    postedBy: null,
    createdAt: new Date("2024-04-02"),
    updatedAt: new Date("2024-04-02"),
    isResolved: false
  },
  {
    _id: "607f1f77bcf86cd799439003",
    name: "Max",
    breed: "German Shepherd",
    age: "3 years",
    gender: "Male",
    type: "dog",
    images: [
      { url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop", publicId: "pawconnect/pets/max" }
    ],
    status: "found",
    tags: ["Dog", "Trained", "Large"],
    description: "Found this handsome German Shepherd near Lodhi Gardens. He appears well-trained and friendly.",
    location: { address: "Lodhi Gardens", city: "Delhi", state: "Delhi" },
    contact: "+91 98765 43212",
    postedBy: null,
    createdAt: new Date("2024-04-03"),
    updatedAt: new Date("2024-04-03"),
    isResolved: false
  },
  {
    _id: "607f1f77bcf86cd799439004",
    name: "Luna",
    breed: "Siamese Mix",
    age: "6 months",
    gender: "Female",
    type: "cat",
    images: [
      { url: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=300&fit=crop", publicId: "pawconnect/pets/luna" }
    ],
    status: "found",
    tags: ["Cat", "Playful", "Small"],
    description: "Found this cute Siamese mix kitten in my neighborhood. She is very playful and friendly.",
    location: { address: "Indiranagar", city: "Bangalore", state: "Karnataka" },
    contact: "+91 98765 43213",
    postedBy: null,
    createdAt: new Date("2024-04-04"),
    updatedAt: new Date("2024-04-04"),
    isResolved: false
  }
];

// In-memory store that persists across requests
let allMockPets = [...initialMockPets];

const matchesUserId = (pet, userId) => {
  const postedBy = pet?.postedBy;

  if (!postedBy || !userId) {
    return false;
  }

  if (typeof postedBy === "string") {
    return postedBy === String(userId);
  }

  if (typeof postedBy === "object") {
    return String(postedBy._id || postedBy.id || "") === String(userId);
  }

  return String(postedBy) === String(userId);
};

// Export functions to manage the store
module.exports = {
  getMockPets: () => allMockPets,
  addMockPet: (pet) => {
    allMockPets.push(pet);
    return pet;
  },
  getUserMockPets: (userId) => {
    return allMockPets.filter((pet) => matchesUserId(pet, userId));
  },
  getMockPetsByIds: (ids = []) => {
    const wanted = new Set(ids.map((id) => String(id)));
    return allMockPets.filter((pet) => wanted.has(String(pet._id)));
  },
  resetMockPets: () => {
    allMockPets = [...initialMockPets];
  },
};
