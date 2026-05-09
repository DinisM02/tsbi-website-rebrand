import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Users, Building2, Megaphone, BookOpen, AlertTriangle, Handshake, ShieldAlert, ShieldCheck, Bell, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

const HelperDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [availableToHelp, setAvailableToHelp] = useState(true);

  const verificationStatus = userProfile?.verificationStatus || 'pending';
  const verificationStyles =
    verificationStatus === 'verified'
      ? 'bg-green-100 text-green-800 border-green-200'
      : verificationStatus === 'rejected'
        ? 'bg-red-100 text-red-800 border-red-200'
        : 'bg-amber-100 text-amber-800 border-amber-200';
  const verificationLabel =
    verificationStatus === 'verified'
      ? t('helperDashboard.header.verifiedByNgo')
      : verificationStatus === 'rejected'
        ? t('helperDashboard.header.verificationActionNeeded')
        : t('helperDashboard.header.verificationPending');

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t('helperDashboard.header.title')}</h2>
            <p className="text-emerald-100 max-w-2xl">
              {t('helperDashboard.header.description')}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${verificationStyles}`}>
                {verificationStatus === 'verified' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                {verificationLabel}
              </span>
              <button
                type="button"
                onClick={() => setAvailableToHelp((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold text-white"
              >
                <span className={`h-2 w-2 rounded-full ${availableToHelp ? 'bg-lime-300' : 'bg-gray-300'}`}></span>
                {availableToHelp ? t('helperDashboard.header.availableToHelp') : t('helperDashboard.header.notAvailable')}
              </button>
            </div>
          </div>
          <div className="hidden sm:block rounded-lg bg-white/20 p-3">
            <HeartHandshake className="w-7 h-7" />
          </div>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Handshake className="w-6 h-6 text-emerald-700" />
          <h3 className="text-2xl font-bold text-gray-900">{t('helperDashboard.operations.title')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button onClick={() => navigate('/volunteer-opportunities')} className="h-auto min-h-24 justify-start text-left bg-emerald-700 hover:bg-emerald-800 text-white">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <div>
                <p className="font-semibold">{t('helperDashboard.operations.openHelpRequests.title')}</p>
                <p className="text-xs text-emerald-100">{t('helperDashboard.operations.openHelpRequests.description')}</p>
              </div>
            </div>
          </Button>

          <Button onClick={() => navigate('/partner-with-us')} className="h-auto min-h-24 justify-start text-left bg-sky-700 hover:bg-sky-800 text-white">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5" />
              <div>
                <p className="font-semibold">{t('helperDashboard.operations.donationDrives.title')}</p>
                <p className="text-xs text-sky-100">{t('helperDashboard.operations.donationDrives.description')}</p>
              </div>
            </div>
          </Button>

          <Button onClick={() => navigate('/dashboard')} className="h-auto min-h-24 justify-start text-left bg-violet-700 hover:bg-violet-800 text-white">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5" />
              <div>
                <p className="font-semibold">{t('helperDashboard.operations.shelterSupport.title')}</p>
                <p className="text-xs text-violet-100">{t('helperDashboard.operations.shelterSupport.description')}</p>
              </div>
            </div>
          </Button>

          <Button onClick={() => navigate('/report-hazard')} className="h-auto min-h-24 justify-start text-left bg-rose-700 hover:bg-rose-800 text-white">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5" />
              <div>
                <p className="font-semibold">{t('helperDashboard.operations.communityOutreach.title')}</p>
                <p className="text-xs text-rose-100">{t('helperDashboard.operations.communityOutreach.description')}</p>
              </div>
            </div>
          </Button>

          <Button onClick={() => navigate('/training')} className="h-auto min-h-24 justify-start text-left bg-amber-700 hover:bg-amber-800 text-white">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <div>
                <p className="font-semibold">{t('helperDashboard.operations.trainingCenter.title')}</p>
                <p className="text-xs text-amber-100">{t('helperDashboard.operations.trainingCenter.description')}</p>
              </div>
            </div>
          </Button>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('helperDashboard.boundaries.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-red-700 mb-2" />
            <h4 className="font-semibold text-red-900">{t('helperDashboard.boundaries.noSosDispatch.title')}</h4>
            <p className="text-sm text-red-800 mt-1">{t('helperDashboard.boundaries.noSosDispatch.description')}</p>
          </div>
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
            <ShieldAlert className="w-5 h-5 text-amber-700 mb-2" />
            <h4 className="font-semibold text-amber-900">{t('helperDashboard.boundaries.limitedDataAccess.title')}</h4>
            <p className="text-sm text-amber-800 mt-1">{t('helperDashboard.boundaries.limitedDataAccess.description')}</p>
          </div>
          <div className="border border-slate-200 bg-slate-50 rounded-lg p-4">
            <Bell className="w-5 h-5 text-slate-700 mb-2" />
            <h4 className="font-semibold text-slate-900">{t('helperDashboard.boundaries.coordinatorChannel.title')}</h4>
            <p className="text-sm text-slate-700 mt-1">{t('helperDashboard.boundaries.coordinatorChannel.description')}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('helperDashboard.quickActions.title')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 border-gray-300 text-gray-900 hover:bg-gray-50" onClick={() => navigate('/volunteer-opportunities')}>
            {t('helperDashboard.quickActions.volunteer')}
          </Button>
          <Button variant="outline" className="h-20 border-gray-300 text-gray-900 hover:bg-gray-50" onClick={() => navigate('/partner-with-us')}>
            {t('helperDashboard.quickActions.ngoPartner')}
          </Button>
          <Button variant="outline" className="h-20 border-gray-300 text-gray-900 hover:bg-gray-50" onClick={() => navigate('/training')}>
            {t('helperDashboard.quickActions.training')}
          </Button>
          <Button variant="outline" className="h-20 border-gray-300 text-gray-900 hover:bg-gray-50" onClick={() => navigate('/contact')}>
            {t('helperDashboard.quickActions.contactTsbi')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HelperDashboard;
