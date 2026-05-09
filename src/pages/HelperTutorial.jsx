import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, HeartHandshake, CheckCircle2, Users, Building2, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { completeHelperOnboarding } from '../firebase/auth';

const HelperTutorial = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userProfile, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/role-selection?next=login" replace />;
  }

  const role = userProfile?.role || sessionStorage.getItem('selectedRole');
  const normalizedRole = role === 'volunteer' ? 'helper' : role;
  if (normalizedRole !== 'helper') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      await completeHelperOnboarding(user.uid);
      sessionStorage.setItem('helperOnboardingCompleted', 'true');
      navigate('/dashboard', { replace: true });
    } catch {
      // Keep flow usable even without Firestore configured.
      sessionStorage.setItem('helperOnboardingCompleted', 'true');
      navigate('/dashboard', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white p-8 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t('helperTutorialPage.title')}</h1>
              <p className="mt-2 text-emerald-100">
                {t('helperTutorialPage.subtitle')}
              </p>
            </div>
            <HeartHandshake className="w-9 h-9" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-emerald-200 p-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {t('helperTutorialPage.canDo.title')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><Users className="w-4 h-4 mt-0.5 text-emerald-700" />{t('helperTutorialPage.canDo.items.1')}</li>
              <li className="flex items-start gap-2"><Building2 className="w-4 h-4 mt-0.5 text-emerald-700" />{t('helperTutorialPage.canDo.items.2')}</li>
              <li className="flex items-start gap-2"><HeartHandshake className="w-4 h-4 mt-0.5 text-emerald-700" />{t('helperTutorialPage.canDo.items.3')}</li>
              <li className="flex items-start gap-2"><BookOpen className="w-4 h-4 mt-0.5 text-emerald-700" />{t('helperTutorialPage.canDo.items.4')}</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 p-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              {t('helperTutorialPage.boundaries.title')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>{t('helperTutorialPage.boundaries.items.1')}</li>
              <li>{t('helperTutorialPage.boundaries.items.2')}</li>
              <li>{t('helperTutorialPage.boundaries.items.3')}</li>
              <li>{t('helperTutorialPage.boundaries.items.4')}</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-700">
            {t('helperTutorialPage.confirmation')}
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleContinue} disabled={submitting} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {submitting ? t('helperTutorialPage.settingUp') : t('helperTutorialPage.continue')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperTutorial;
