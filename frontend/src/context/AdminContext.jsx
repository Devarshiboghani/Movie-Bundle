import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setAdmin(response.data);
    } catch (error) {
      console.error('Session validation failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, admin: adminData } = response.data;
      localStorage.setItem('adminToken', token);
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AdminContext.Provider>
  );
};
