const fs = require("fs");
const path = require("path");

const offlineUsersPath = path.join(__dirname, "offlineUsers.json");

// Mock users for offline development mode
const mockUsers = [
  {
    _id: "507f1f77bcf86cd799439010",
    name: "Test User",
    email: "test@example.com",
    password: "password", // plain text for development
    role: "owner",
    phone: "+91 98765 43210",
    city: "Mumbai",
    createdAt: new Date("2024-01-01").toISOString(),
    avatar: "",
  },
  {
    _id: "507f1f77bcf86cd799439011",
    name: "NGO Admin",
    email: "ngo@pawconnect.com",
    password: "password", // plain text for development
    role: "ngo",
    phone: "+91 98765 43211",
    city: "Delhi",
    createdAt: new Date("2024-01-02").toISOString(),
    avatar: "",
  },
];

const normalizeUser = (user = {}) => ({
  ...user,
  email: user.email?.trim().toLowerCase(),
});

const mergeUsers = (users = []) => {
  const uniqueUsers = new Map();

  users.filter(Boolean).forEach((user) => {
    const normalizedUser = normalizeUser(user);
    const key =
      normalizedUser._id ||
      normalizedUser.id ||
      normalizedUser.email ||
      `user_${uniqueUsers.size}`;

    uniqueUsers.set(String(key), normalizedUser);
  });

  return Array.from(uniqueUsers.values());
};

const readPersistedUsers = () => {
  try {
    if (!fs.existsSync(offlineUsersPath)) {
      return [];
    }

    const raw = fs.readFileSync(offlineUsersPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : [];
  } catch (error) {
    console.warn("Failed to load offline users:", error.message);
    return [];
  }
};

let offlineUsers = mergeUsers([...mockUsers, ...readPersistedUsers()]);

const persistOfflineUsers = () => {
  try {
    fs.writeFileSync(
      offlineUsersPath,
      JSON.stringify(offlineUsers, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.warn("Failed to persist offline users:", error.message);
  }
};

const getOfflineUsers = () => offlineUsers;

const findOfflineUserByEmail = (email = "") =>
  offlineUsers.find(
    (user) => user.email === email.trim().toLowerCase()
  );

const findOfflineUserById = (id = "") =>
  offlineUsers.find(
    (user) => String(user._id || user.id || "") === String(id)
  );

const upsertOfflineUser = (user = {}) => {
  const normalizedUser = normalizeUser(user);
  const existingIndex = offlineUsers.findIndex(
    (candidate) =>
      String(candidate._id || candidate.id || "") ===
        String(normalizedUser._id || normalizedUser.id || "") ||
      candidate.email === normalizedUser.email
  );

  if (existingIndex >= 0) {
    offlineUsers[existingIndex] = {
      ...offlineUsers[existingIndex],
      ...normalizedUser,
    };
  } else {
    offlineUsers.push(normalizedUser);
  }

  persistOfflineUsers();
  return normalizedUser;
};

module.exports = {
  mockUsers,
  getOfflineUsers,
  findOfflineUserByEmail,
  findOfflineUserById,
  upsertOfflineUser,
};
