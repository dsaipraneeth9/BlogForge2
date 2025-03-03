import { createContext, useState, useContext } from 'react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const value = {
    unreadCount,
    setUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use NotificationContext
export const useNotification = () => useContext(NotificationContext);