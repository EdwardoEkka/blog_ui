// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context object
const UserContext = createContext();

// Custom hook to access the context
export const useUserContext = () => useContext(UserContext);


// Provider component
export const UserProvider = ({ children }) => {
  // Load user data from session storage or set default values
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    return storedUser || { email: '', username: '', userId: '' };
  });

  // Update user and save to session storage whenever user data changes
  const updateUser = (email, username, userId) => {
    const newUser = { email, username, userId };
    setUser(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));
  };

  useEffect(() => {
    // Update session storage whenever user data changes
    sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
