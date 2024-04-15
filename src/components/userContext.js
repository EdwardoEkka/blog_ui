import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load the username and objectId from localStorage or default to empty strings
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [objectId, setObjectId] = useState(localStorage.getItem('objectId') || '');

  // Update localStorage whenever the username or objectId changes
  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('objectId', objectId);
  }, [objectId]);

  const updateUser = (newUsername, newObjectId) => {
    setUsername(newUsername);
    setObjectId(newObjectId);
  };

  return (
    <UserContext.Provider value={{ username, objectId, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);