import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-dark mb-2">Notifications</h1>
            <div className="inline-flex bg-primary-orange/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {unreadCount} unread
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="bg-primary-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-400 transition-all"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-8">
          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-6 block">🔔</span>
              <h3 className="text-2xl font-bold text-text-dark mb-2">No notifications</h3>
              <p className="text-text-dark/60">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-6 rounded-2xl cursor-pointer transition-all hover:shadow-md border-l-4 ${
                    notif.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-primary-orange/10 border-primary-orange shadow-sm'
                  }`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl mt-0.5">{notif.icon || '📩'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text-dark truncate">{notif.title}</div>
                      <div className="text-sm text-text-dark/70 mt-1 line-clamp-2">{notif.message}</div>
                      <div className="text-xs text-text-dark/50 mt-2 flex items-center space-x-2">
                        <span>{notif.date}</span>
                        {!notif.read && <span className="px-2 py-0.5 bg-primary-orange text-white text-xs rounded-full">New</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

