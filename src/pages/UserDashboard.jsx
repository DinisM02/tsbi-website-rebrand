import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResidentDashboard from '../components/dashboards/ResidentDashboard';
import ResponderDashboard from '../components/dashboards/ResponderDashboard';
import HelperDashboard from '../components/dashboards/HelperDashboard';
import ScrollIndicator from '../components/ScrollIndicator';

const UserDashboard = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const selectedRole = sessionStorage.getItem('selectedRole');
  const normalizeRole = (role) => (role === 'volunteer' ? 'helper' : role);
  const normalizedSelectedRole = normalizeRole(selectedRole);
  const normalizedUserRole = normalizeRole(userProfile?.role);
  const effectiveRole = normalizedSelectedRole === 'helper' ? 'helper' : normalizedUserRole;

  if (effectiveRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const isResponder = effectiveRole === 'responder';
  const isHelper = effectiveRole === 'helper';
  const helperOnboardingCompleted =
    userProfile?.helperOnboardingCompleted === true ||
    sessionStorage.getItem('helperOnboardingCompleted') === 'true';

  if (isHelper && !helperOnboardingCompleted) {
    return <Navigate to="/helper/tutorial" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role-based Dashboard Rendering */}
        {isResponder ? (
          <ResponderDashboard />
        ) : isHelper ? (
          <HelperDashboard />
        ) : (
          <ResidentDashboard />
        )}
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default UserDashboard;