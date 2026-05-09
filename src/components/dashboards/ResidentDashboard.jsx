import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, MapPin, Home, BookOpen, Bell, Users, Award, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import DashboardPreview from '../DashboardPreview';
import { getActiveFloodAlerts, getActiveShelters } from '../../firebase/firestore';

const LiveFloodMap = lazy(() => import('../features/LiveFloodMap'));

const DEMO_SHELTERS = [
  { id: 'demo-1', name: 'Community Center Safe Zone', distance: '0.5 km', capacity: 450, lat: -25.9625, lon: 32.5805, type: 'shelter' },
  { id: 'demo-2', name: 'City Hospital Emergency Shelter', distance: '1.2 km', capacity: 200, lat: -25.9682, lon: 32.5872, type: 'hospital' },
  { id: 'demo-3', name: 'High School Gymnasium', distance: '1.8 km', capacity: 600, lat: -25.9714, lon: 32.5758, type: 'shelter' },
];

const ResidentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sheltersSectionRef = useRef(null);
  const [alerts, setAlerts] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const residentLocation = [-25.9655, 32.5832];
  const demoAlerts = [
    {
      id: 'demo-1',
      location: t('residentDashboard.demoAlerts.downtown.location'),
      severity: 'high',
      message: t('residentDashboard.demoAlerts.downtown.message'),
      createdAt: null,
    },
    {
      id: 'demo-2',
      location: t('residentDashboard.demoAlerts.riverside.location'),
      severity: 'medium',
      message: t('residentDashboard.demoAlerts.riverside.message'),
      createdAt: null,
    },
  ];

  const formatTime = (createdAt) => {
    if (!createdAt) return '';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 60) return t('residentDashboard.time.minutesAgo', { count: diff });
    if (diff < 1440) return t('residentDashboard.time.hoursAgo', { count: Math.floor(diff / 60) });
    return t('residentDashboard.time.daysAgo', { count: Math.floor(diff / 1440) });
  };

  const getSeverityLabel = (severity) => t(`residentDashboard.severity.${severity}`);

  const openInternalMap = (destination = null) => {
    setSelectedDestination(destination);
    setShowMapModal(true);
  };

  const focusSheltersSection = () => {
    sheltersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [fetchedAlerts, fetchedShelters] = await Promise.all([
        getActiveFloodAlerts(),
        getActiveShelters(),
      ]);
      if (fetchedAlerts.length > 0 || fetchedShelters.length > 0) {
        setAlerts(fetchedAlerts);
        setShelters(fetchedShelters);
        setUsingDemo(false);
      } else {
        setAlerts(demoAlerts);
        setShelters(DEMO_SHELTERS);
        setUsingDemo(true);
      }
    } catch {
      setAlerts(demoAlerts);
      setShelters(DEMO_SHELTERS);
      setUsingDemo(true);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t('residentDashboard.header.title')}</h2>
            <p className="text-blue-100">{t('residentDashboard.header.description')}</p>
          </div>
          <Button size="sm" variant="outline" className="bg-white text-primary border-white hover:bg-blue-50" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-1" /> {t('residentDashboard.header.refresh')}
          </Button>
        </div>
        {usingDemo && (
          <p className="mt-3 text-xs text-blue-200 bg-blue-700/40 rounded px-3 py-1 inline-block">
            {t('residentDashboard.header.demoBanner')}
          </p>
        )}
      </div>

      {/* Live Alerts Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-6 h-6 text-red-600" />
          <h3 className="text-2xl font-bold text-gray-900">{t('residentDashboard.alerts.title')}</h3>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-5 h-5" />
                      <h4 className="font-semibold text-lg">{alert.location}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                        alert.severity === 'high' ? 'bg-red-200' :
                        alert.severity === 'medium' ? 'bg-yellow-200' :
                        'bg-blue-200'
                      }`}>
                        {getSeverityLabel(alert.severity)}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <p className="text-xs opacity-75">{formatTime(alert.createdAt)}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={() => openInternalMap()}
                  >
                    {t('residentDashboard.alerts.openInternalMap')}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8">{t('residentDashboard.alerts.empty')}</p>
          )}
        </div>
        )}
      </section>

      {/* Nearby Shelters */}
      <section ref={sheltersSectionRef} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Home className="w-6 h-6 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900">{t('residentDashboard.shelters.title')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shelters.map((shelter) => (
            <div key={shelter.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-2">{shelter.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{shelter.distance}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{t('residentDashboard.shelters.capacity', { count: shelter.capacity })}</span>
                </div>
                {shelter.currentOccupancy !== undefined && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{t('residentDashboard.shelters.occupied', { current: shelter.currentOccupancy, total: shelter.capacity })}</span>
                </div>
                )}
              </div>
              <Button
                size="sm"
                className="w-full mt-4 bg-green-700 text-white hover:bg-green-800"
                onClick={() => openInternalMap(shelter.lat && shelter.lon ? shelter : null)}
              >
                {t('residentDashboard.shelters.showRoute')}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Real-time Monitoring */}
      <section>
        <DashboardPreview />
      </section>

      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t('residentDashboard.map.title')}</h3>
                <p className="text-sm text-gray-500">
                  {selectedDestination
                    ? t('residentDashboard.map.routeTo', { name: selectedDestination.name || t('residentDashboard.map.selectedShelter') })
                    : t('residentDashboard.map.description')}
                </p>
              </div>
              <button onClick={() => setShowMapModal(false)} className="text-2xl text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="flex-1 p-5">
              <Suspense fallback={<div className="h-full rounded-xl bg-gray-100 animate-pulse" />}>
                <LiveFloodMap
                  userLocation={residentLocation}
                  weatherData={null}
                  floodData={null}
                  shelters={shelters.filter((shelter) => shelter.lat && shelter.lon)}
                  selectedDestination={selectedDestination}
                  onDestinationSelect={setSelectedDestination}
                  className="!h-full"
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Training Resources */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">{t('residentDashboard.training.title')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">{t('residentDashboard.training.cards.basics.title')}</h4>
            <p className="text-sm text-blue-800 mb-4">{t('residentDashboard.training.cards.basics.description')}</p>
            <Button
              size="sm"
              className="bg-blue-700 text-white hover:bg-blue-800"
              onClick={() => navigate('/training')}
            >
              {t('residentDashboard.training.cards.basics.action')}
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2">{t('residentDashboard.training.cards.procedures.title')}</h4>
            <p className="text-sm text-amber-800 mb-4">{t('residentDashboard.training.cards.procedures.description')}</p>
            <Button
              size="sm"
              className="bg-amber-700 text-white hover:bg-amber-800"
              onClick={() => navigate('/training')}
            >
              {t('residentDashboard.training.cards.procedures.action')}
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('residentDashboard.quickActions.title')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center h-24 gap-2 border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
            onClick={() => navigate('/report-hazard')}
          >
            <AlertCircle className="w-6 h-6" />
            <span className="text-xs text-center">{t('residentDashboard.quickActions.reportHazard')}</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center h-24 gap-2 border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
            onClick={focusSheltersSection}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs text-center">{t('residentDashboard.quickActions.findShelter')}</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center h-24 gap-2 border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
            onClick={() => navigate('/volunteer-opportunities')}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs text-center">{t('residentDashboard.quickActions.volunteer')}</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center h-24 gap-2 border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
            onClick={() => navigate('/training')}
          >
            <Award className="w-6 h-6" />
            <span className="text-xs text-center">{t('residentDashboard.quickActions.myTrainings')}</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ResidentDashboard;
