import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockNotifications } from '../utils/mockData';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load mock notifications
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
    setUnreadCount(prev => prev - 1);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

