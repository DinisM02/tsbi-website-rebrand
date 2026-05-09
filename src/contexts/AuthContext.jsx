import React, { createContext, useContext, useState, useEffect } from 'react';

const loadAuthApi = () => import('../firebase/auth');

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    let active = true;

    const initAuthListener = async () => {
      try {
        const { onAuthChange, ensureUserProfile } = await loadAuthApi();
        if (!active) return;

        unsubscribe = onAuthChange(async (firebaseUser) => {
          try {
            if (firebaseUser) {
              setUser(firebaseUser);
              try {
                const profile = await ensureUserProfile(firebaseUser);
                setUserProfile(profile);
              } catch (profileErr) {
                console.warn('Could not load user profile:', profileErr.message);
                setUserProfile({ role: 'user', displayName: firebaseUser.displayName, email: firebaseUser.email });
              }
            } else {
              setUser(null);
              setUserProfile(null);
            }
          } catch (err) {
            console.error('Auth state error:', err);
          } finally {
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (active) setLoading(false);
      }
    };

    initAuthListener();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { logoutUser } = await loadAuthApi();
    await logoutUser();
    setUser(null);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === 'admin';

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
