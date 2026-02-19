import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('admin', JSON.stringify(data));
      setAdmin(data);
      toast.success('Logged in');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};