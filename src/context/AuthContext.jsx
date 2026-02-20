import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
});

/**
 * Add JWT token to request headers if available
 */
API.interceptors.request.use((config) => {
  const storedAdmin = localStorage.getItem('admin');
  if (storedAdmin) {
    const admin = JSON.parse(storedAdmin);
    if (admin.token) {
      config.headers.Authorization = `Bearer ${admin.token}`;
    }
  }
  return config;
}, error => Promise.reject(error));

/**
 * Handle 401/403 responses by clearing auth
 */
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('admin');
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize auth from localStorage on mount
   */
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        // Verify stored admin has required properties
        if (adminData.token && adminData.email) {
          setAdmin(adminData);
        } else {
          localStorage.removeItem('admin');
        }
      } catch (err) {
        console.error('Failed to parse stored admin data:', err);
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login admin user with email and password
   * Only users with 'superadmin' or 'clerk' roles can login
   */
  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Verify response contains required fields
      if (!data._id || !data.token || !data.role) {
        toast.error('Invalid response from server');
        return false;
      }

      // Verify user has admin role
      const validRoles = ['superadmin', 'clerk'];
      if (!validRoles.includes(data.role)) {
        toast.error('Only admin users can access the admin portal');
        return false;
      }

      // Store admin data with token
      const adminData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token
      };
      
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);
      toast.success(`Welcome ${data.name}!`);
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      console.error('Login error:', err);
      toast.error(errorMsg);
      return false;
    }
  };

  /**
   * Logout admin user and clear session
   */
  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
    toast.success('Logged out successfully');
  };

  /**
   * Check if user is authenticated and has admin role
   */
  const isAdmin = () => {
    return admin && ['superadmin', 'clerk'].includes(admin.role);
  };

  /**
   * Check if user has superadmin role
   */
  const isSuperAdmin = () => {
    return admin && admin.role === 'superadmin';
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      loading, 
      login, 
      logout,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};