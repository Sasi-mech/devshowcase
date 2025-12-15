// src/hooks/useAuth.js
import { useContext, createContext } from 'react';

// Create the context object
export const AuthContext = createContext(null);

// Create and export the custom hook
export const useAuth = () => useContext(AuthContext);