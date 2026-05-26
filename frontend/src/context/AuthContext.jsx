import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-fetch profile if token is stored in localStorage
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          } else {
            // Token expired or invalid
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching user on boot:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Login handler
  const login = async (email, password, role) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        // Load the full profile
        const meRes = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });
        const meData = await meRes.json();
        if (meData.success) {
          setUser(meData.user);
          return meData.user;
        }
      } else {
        setError(data.message || 'Login failed');
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        // Load profile
        const meRes = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });
        const meData = await meRes.json();
        if (meData.success) {
          setUser(meData.user);
          return meData.user;
        }
      } else {
        setError(data.message || 'Registration failed');
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  // Update Profile handler
  const updateUserProfile = async (profileData) => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Load the freshly updated user profile
        const meRes = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.token || token}`,
          },
        });
        const meData = await meRes.json();
        if (meData.success) {
          setUser(meData.user);
          return meData.user;
        }
      } else {
        setError(data.message || 'Profile update failed');
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile: updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
