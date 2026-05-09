import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const DashboardPreview = lazy(() => import('./components/DashboardPreview'));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection'));
const CTASection = lazy(() => import('./components/CTASection'));

const AboutUs = lazy(() => import('./pages/AboutUs'));
const Resources = lazy(() => import('./pages/Resources'));
const Training = lazy(() => import('./pages/Training'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const HelperTutorial = lazy(() => import('./pages/HelperTutorial'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CommunityGuidelines = lazy(() => import('./pages/CommunityGuidelines'));
const CookieStatement = lazy(() => import('./pages/CookieStatement'));
const VolunteerOpportunities = lazy(() => import('./pages/VolunteerOpportunities'));
const PartnerWithUs = lazy(() => import('./pages/PartnerWithUs'));
const ReportHazard = lazy(() => import('./pages/ReportHazard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminHazardReports = lazy(() => import('./pages/admin/AdminHazardReports'));
const AdminTraining = lazy(() => import('./pages/admin/AdminTraining'));
const AdminVolunteers = lazy(() => import('./pages/admin/AdminVolunteers'));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

const PageLoader = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
);

const SectionLoader = () => (
  <div className="py-10 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <HeroSection />
                  <Suspense fallback={<SectionLoader />}><FeaturesSection /></Suspense>
                  <Suspense fallback={<SectionLoader />}><DashboardPreview /></Suspense>
                  <Suspense fallback={<SectionLoader />}><TestimonialsSection /></Suspense>
                  <Suspense fallback={<SectionLoader />}><CTASection /></Suspense>
                </>
              } />
              <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutUs /></Suspense>} />
              <Route path="/resources" element={<Suspense fallback={<PageLoader />}><Resources /></Suspense>} />
              <Route path="/training" element={<Suspense fallback={<PageLoader />}><Training /></Suspense>} />
              <Route path="/blog" element={<Suspense fallback={<PageLoader />}><Blog /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
              <Route path="/role-selection" element={<Suspense fallback={<PageLoader />}><RoleSelection /></Suspense>} />
              <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
              <Route path="/signup" element={<Suspense fallback={<PageLoader />}><SignUp /></Suspense>} />
              <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
              <Route path="/helper/login" element={<Navigate to="/login?role=helper" replace />} />
              <Route path="/helper/signup" element={<Navigate to="/signup?role=helper" replace />} />
              <Route path="/helper/forgot-password" element={<Navigate to="/forgot-password?role=helper" replace />} />
              <Route path="/volunteer/login" element={<Navigate to="/login?role=helper" replace />} />
              <Route path="/volunteer/signup" element={<Navigate to="/signup?role=helper" replace />} />
              <Route path="/volunteer/forgot-password" element={<Navigate to="/forgot-password?role=helper" replace />} />
              <Route path="/helper/tutorial" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><HelperTutorial /></Suspense></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><UserDashboard /></Suspense></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Profile /></Suspense></ProtectedRoute>} />
              <Route path="/privacy-policy" element={<Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense>} />
              <Route path="/terms-of-service" element={<Suspense fallback={<PageLoader />}><TermsOfService /></Suspense>} />
              <Route path="/community-guidelines" element={<Suspense fallback={<PageLoader />}><CommunityGuidelines /></Suspense>} />
              <Route path="/cookie-statement" element={<Suspense fallback={<PageLoader />}><CookieStatement /></Suspense>} />
              <Route path="/volunteer-opportunities" element={<Suspense fallback={<PageLoader />}><VolunteerOpportunities /></Suspense>} />
              <Route path="/partner-with-us" element={<Suspense fallback={<PageLoader />}><PartnerWithUs /></Suspense>} />
              <Route path="/report-hazard" element={<Suspense fallback={<PageLoader />}><ReportHazard /></Suspense>} />
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></ProtectedRoute>} />
              <Route path="/admin/contacts" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminContacts /></Suspense></ProtectedRoute>} />
              <Route path="/admin/hazard-reports" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminHazardReports /></Suspense></ProtectedRoute>} />
              <Route path="/admin/training" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminTraining /></Suspense></ProtectedRoute>} />
              <Route path="/admin/volunteers" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminVolunteers /></Suspense></ProtectedRoute>} />
              <Route path="/admin/partners" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminPartners /></Suspense></ProtectedRoute>} />
              <Route path="/admin/blog" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminBlog /></Suspense></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><Suspense fallback={<PageLoader />}><AdminUsers /></Suspense></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

