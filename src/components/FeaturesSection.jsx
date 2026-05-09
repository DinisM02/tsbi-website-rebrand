import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  AlertTriangle, Map, Headphones, Shield, Users, Eye, Navigation, Waves,
  Satellite, RefreshCw, AlertCircle, Locate, LocateOff, Thermometer,
  Droplets, Wind, Gauge, Clock, Video, Route, Bell, Play, Pause,
  Settings, MapPin, Wifi, WifiOff, CloudRain, ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchNearbyShelters } from './features/shelterService';
import { joinCommunity, leaveCommunity, subscribeToCommunityCount } from './features/communityService';
import { saveAlertPreferences, loadAlertPreferences, sendTestNotification } from './features/alertService';
import TrainingScenario from './features/TrainingScenario';

const LiveFloodMap = lazy(() => import('./features/LiveFloodMap'));

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const FeaturesSection = () => {
    const { t } = useTranslation();
  const { user, userProfile } = useAuth();

  // ── Data states ──
  const [weatherData, setWeatherData] = useState(null);
  const [floodData, setFloodData] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [, setLocationError] = useState(null);
  const [apiStatus, setApiStatus] = useState({
    weather: 'checking', flood: 'checking', alerts: 'checking', location: 'checking',
  });

  // ── Feature states ──
  const [shelters, setShelters] = useState([]);
  const [sheltersLoading, setSheltersLoading] = useState(false);
  const [emergencyNavigationActive, setEmergencyNavigationActive] = useState(false);
  const [communityConnected, setCommunityConnected] = useState(false);
  const [communityStats, setCommunityStats] = useState({ responders: 0, neighbors: 0, total: 0 });
  const [showTraining, setShowTraining] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [alertSettings, setAlertSettings] = useState({ sms: false, email: true, push: true, voice: false });
  const [alertsSaving, setAlertsSaving] = useState(false);
  const [featureNotice, setFeatureNotice] = useState({ type: '', message: '' });

  // ─────────── Location ───────────
  const getUserLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation not supported');
        const fb = [51.505, -0.09];
        setUserLocation(fb);
        setApiStatus((p) => ({ ...p, location: 'fallback' }));
        return resolve(fb);
      }
      setApiStatus((p) => ({ ...p, location: 'loading' }));
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = [coords.latitude, coords.longitude];
          setUserLocation(loc);
          setApiStatus((p) => ({ ...p, location: 'active' }));
          resolve(loc);
        },
        (err) => {
          setLocationError(err.message);
          const fb = [51.505, -0.09];
          setUserLocation(fb);
          setApiStatus((p) => ({ ...p, location: 'fallback' }));
          resolve(fb);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });

  // ─────────── Weather API ───────────
  const fetchWeatherData = async ([lat, lon]) => {
    try {
      setApiStatus((p) => ({ ...p, weather: 'loading' }));
      const r = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      );
      if (!r.ok) throw new Error();
      const d = await r.json();
      setWeatherData(d);
      setApiStatus((p) => ({ ...p, weather: 'active' }));
      return d;
    } catch {
      setApiStatus((p) => ({ ...p, weather: 'error' }));
      const fb = {
        main: { temp: 20, humidity: 65, pressure: 1013, feels_like: 19 },
        weather: [{ description: 'clear sky', main: 'Clear' }],
        wind: { speed: 4 },
        rain: { '1h': 0 },
        name: 'Unknown',
      };
      setWeatherData(fb);
      return fb;
    }
  };

  // ─────────── Flood API ───────────
  const fetchFloodData = async ([lat, lon]) => {
    try {
      setApiStatus((p) => ({ ...p, flood: 'loading' }));
      const r = await fetch(
        `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge,river_discharge_mean&timezone=auto`,
      );
      if (!r.ok) throw new Error();
      const d = await r.json();
      setFloodData(d);
      setApiStatus((p) => ({ ...p, flood: 'active' }));
      return d;
    } catch {
      setApiStatus((p) => ({ ...p, flood: 'error' }));
      const fb = { daily: { river_discharge_mean: [0] } };
      setFloodData(fb);
      return fb;
    }
  };

  // ─────────── Generate alerts from real data ───────────
  const buildAlerts = (weather, flood) => {
    const rl = flood?.daily?.river_discharge_mean?.[0] ?? 0;
    const rf = weather?.rain?.['1h'] ?? 0;
    const temp = weather?.main?.temp ?? 0;
    const a = [];
    if (rl > 60) a.push({ id: 1, title: t('featuresSection.alerts.criticalRiverTitle', { value: rl.toFixed(1) }), level: 'high', type: 'flood', icon: '🚨', description: t('featuresSection.alerts.criticalRiverDesc'), date: new Date().toLocaleTimeString() });
    else if (rl > 40) a.push({ id: 2, title: t('featuresSection.alerts.highRiverTitle', { value: rl.toFixed(1) }), level: 'moderate', type: 'flood', icon: '⚠️', description: t('featuresSection.alerts.highRiverDesc'), date: new Date().toLocaleTimeString() });
    if (rf > 15) a.push({ id: 3, title: t('featuresSection.alerts.heavyRainTitle', { value: rf }), level: 'high', type: 'rain', icon: '🌧️', description: t('featuresSection.alerts.heavyRainDesc'), date: new Date().toLocaleTimeString() });
    if (temp > 35) a.push({ id: 4, title: t('featuresSection.alerts.heatTitle', { value: Math.round(temp) }), level: 'moderate', type: 'heat', icon: '🔥', description: t('featuresSection.alerts.heatDesc'), date: new Date().toLocaleTimeString() });
    if (a.length === 0) a.push({ id: 0, title: t('featuresSection.alerts.noAlertsTitle'), level: 'normal', type: 'info', icon: '✅', description: t('featuresSection.alerts.noAlertsDesc'), date: new Date().toLocaleTimeString() });
    setAlertsData(a);
    setApiStatus((p) => ({ ...p, alerts: 'active' }));
  };

  // ─────────── Master load ───────────
  const loadAllData = async () => {
    setLoading(true);
    try {
      const loc = await getUserLocation();
      const [weather, flood] = await Promise.all([fetchWeatherData(loc), fetchFloodData(loc)]);
      buildAlerts(weather, flood);
      setLastUpdate(new Date());
    } catch (e) { console.error('loadAllData error:', e); } finally { setLoading(false); }
  };

  useEffect(() => { loadAllData(); const iv = setInterval(loadAllData, 120000); return () => clearInterval(iv); }, []);

  // ─────────── Community real-time ───────────
  useEffect(() => {
    const unsub = subscribeToCommunityCount(setCommunityStats);
    return () => unsub();
  }, []);

  // ─────────── Load alert prefs ───────────
  useEffect(() => {
    if (user?.uid) loadAlertPreferences(user.uid).then(setAlertSettings).catch(() => {});
  }, [user?.uid]);

  // ─────────── Emergency Navigation ───────────
  const startEmergencyNavigation = async () => {
    if (emergencyNavigationActive) {
      setEmergencyNavigationActive(false);
      setShelters([]);
      setSelectedDestination(null);
      return;
    }
    setEmergencyNavigationActive(true);
    setSheltersLoading(true);
    try {
      const loc = userLocation || [51.505, -0.09];
      const found = await fetchNearbyShelters(loc[0], loc[1], 10);
      setShelters(found);
      if (found[0]) {
        setSelectedDestination(found[0]);
      }
      setShowMapModal(true);
    } catch (e) { console.error('Shelter error:', e); } finally { setSheltersLoading(false); }
  };

  // ─────────── Community ───────────
  const toggleCommunity = async () => {
    if (!user) {
      setFeatureNotice({ type: 'warning', message: 'Please log in to join the community network.' });
      return;
    }
    try {
      if (communityConnected) {
        await leaveCommunity(user.uid);
        setCommunityConnected(false);
        setFeatureNotice({ type: 'info', message: 'You have left the community network.' });
      }
      else {
        await joinCommunity(user.uid, { displayName: user.displayName, role: userProfile?.role === 'admin' ? 'responder' : 'neighbor', location: userLocation });
        setCommunityConnected(true);
        setFeatureNotice({ type: 'success', message: 'You are now connected to the community network.' });
      }
    } catch (e) { console.error('Community error:', e); }
  };

  // ─────────── Alert prefs ───────────
  const toggleAlertChannel = async (ch) => {
    const updated = { ...alertSettings, [ch]: !alertSettings[ch] };
    setAlertSettings(updated);
    if (user?.uid) {
      setAlertsSaving(true);
      try {
        await saveAlertPreferences(user.uid, updated);
      } catch (error) {
        console.error('Failed to save alert preferences:', error);
      } finally {
        setAlertsSaving(false);
      }
    }
  };
  const handleTestAlert = async () => {
    const result = await sendTestNotification(weatherData, floodData);
    setFeatureNotice({ type: result.type, message: result.message });
  };

  // ─────────── Computed ───────────
  const riverLevel = floodData?.daily?.river_discharge_mean?.[0] ?? 0;
  const nearestShelter = shelters[0];
  const safeRoutes = shelters.slice(0, 5).length;

  // ═══════════ FEATURES ARRAY ═══════════
  const features = [
    // 1. Flood Alerts
    {
      icon: AlertTriangle, title: t('featuresSection.features.floodAlerts.title'),
      description: t('featuresSection.features.floodAlerts.description'),
      color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200',
      content: (
        <div className="space-y-2">
          {alertsData.slice(0, 2).map((al) => (
            <div key={al.id} className={`p-2 rounded-lg border ${al.level === 'high' ? 'border-red-200 bg-red-50' : al.level === 'moderate' ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{al.icon} {al.type.toUpperCase()}</span>
                <span className={`px-2 py-0.5 rounded-full text-white text-xs ${al.level === 'high' ? 'bg-red-500' : al.level === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}>{al.level.toUpperCase()}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">{al.title}</div>
            </div>
          ))}
          {weatherData && (
            <div className="p-2 bg-white rounded-lg border border-gray-200 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center"><Thermometer className="w-3 h-3 mr-1 text-blue-500" />{Math.round(weatherData.main.temp)}°C</div>
              <div className="flex items-center"><Droplets className="w-3 h-3 mr-1 text-green-500" />{weatherData.main.humidity}%</div>
              <div className="flex items-center"><Gauge className="w-3 h-3 mr-1 text-purple-500" />{weatherData.main.pressure}hPa</div>
              <div className="flex items-center"><Wind className="w-3 h-3 mr-1 text-gray-500" />{weatherData.wind?.speed?.toFixed(1) || '0'}m/s</div>
            </div>
          )}
        </div>
      ),
    },
    // 2. Flood Forecasting
    {
      icon: Waves, title: t('featuresSection.features.floodForecasting.title'),
      description: t('featuresSection.features.floodForecasting.description'),
      color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200',
      content: floodData && (
        <div className="space-y-2">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600">{t('featuresSection.featureContent.riverDischarge')}</span>
              <span className="font-semibold text-green-600">{riverLevel.toFixed(1)} m³/s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (riverLevel / 80) * 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-600">{t('featuresSection.featureContent.status')}</span>
              <span className={`font-semibold ${riverLevel > 50 ? 'text-red-600' : riverLevel > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                {riverLevel > 50 ? t('featuresSection.featureContent.high') : riverLevel > 30 ? t('featuresSection.featureContent.moderate') : t('featuresSection.featureContent.normal')}
              </span>
            </div>
          </div>
          {userLocation && <div className="flex items-center text-xs text-blue-600"><Locate className="w-3 h-3 mr-1" />{t('featuresSection.featureContent.liveDataForLocation')}</div>}
        </div>
      ),
    },
    // 3. Interactive Risk Maps (opens real Leaflet map)
    {
      icon: Map, title: t('featuresSection.features.riskMaps.title'),
      description: t('featuresSection.features.riskMaps.description'),
      color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200',
      onClick: () => setShowMapModal(true),
      content: (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => setShowMapModal(true)}>
          <div className="text-sm text-green-700 font-medium mb-2 flex items-center justify-between">
            <span>{userLocation ? t('featuresSection.featureContent.viewYourLiveMap') : t('featuresSection.featureContent.viewInteractiveMap')}</span>
            <ExternalLink className="w-4 h-4" />
          </div>
          <div className="w-full h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded border-2 border-green-300 border-dashed flex items-center justify-center">
            <Map className="w-5 h-5 text-green-500" />
            {userLocation && <Locate className="w-3 h-3 text-blue-500 ml-1" />}
          </div>
          <div className="text-xs text-green-600 mt-2 text-center">{t('featuresSection.featureContent.clickToOpenMap')}</div>
        </div>
      ),
    },
    // 4. VR/AR Training (real interactive quiz)
    {
      icon: Eye, title: t('featuresSection.features.vrArTraining.title'),
      description: t('featuresSection.features.vrArTraining.description'),
      color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
              <div className="flex items-center"><Video className="w-4 h-4 mr-2 text-purple-500" /><span className="text-gray-600">{t('featuresSection.featureContent.ready')}</span></div>
          </div>
          <button onClick={() => setShowTraining(true)} className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm transition-colors">
            <Play className="w-4 h-4 mr-2" /> {t('featuresSection.featureContent.startTraining')}
          </button>
          <div className="bg-purple-50 p-2 rounded-lg border border-purple-200 text-xs text-purple-700">
            <div className="font-medium mb-1">{t('featuresSection.featureContent.availableScenarios')}</div>
            <div className="space-y-1">
              <div className="flex items-center"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2" />{t('featuresSection.featureContent.flashFloodEvacuation')}</div>
              <div className="flex items-center"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2" />{t('featuresSection.featureContent.emergencyShelter')}</div>
            </div>
          </div>
        </div>
      ),
    },
    // 5. Emergency Navigation (real shelter finder)
    {
      icon: Navigation, title: t('featuresSection.features.navigation.title'),
      description: t('featuresSection.features.navigation.description'),
      color: 'text-teal-500', bgColor: 'bg-teal-50', borderColor: 'border-teal-200',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Route className="w-4 h-4 mr-2 text-teal-500" />
              <span className={emergencyNavigationActive ? 'text-green-600 font-medium' : 'text-gray-600'}>
                {emergencyNavigationActive ? t('featuresSection.featureContent.active') : t('featuresSection.featureContent.standby')}
              </span>
            </div>
            <div className={`w-2 h-2 rounded-full ${emergencyNavigationActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>
          <button
            onClick={startEmergencyNavigation}
            disabled={sheltersLoading}
            className={`w-full py-2 rounded-lg flex items-center justify-center text-sm transition-colors ${emergencyNavigationActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
          >
            {sheltersLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
            {sheltersLoading ? t('featuresSection.featureContent.searching') : emergencyNavigationActive ? t('featuresSection.featureContent.stop') : t('featuresSection.featureContent.findShelters')}
          </button>
          <div className="bg-teal-50 p-2 rounded-lg border border-teal-200 text-xs text-teal-700 space-y-1">
            <div className="flex justify-between">
              <span>{t('featuresSection.featureContent.nearestShelter')}</span>
              <span className="font-medium">{nearestShelter ? `${nearestShelter.distance.toFixed(1)} km` : emergencyNavigationActive ? t('featuresSection.featureContent.noneFound') : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('featuresSection.featureContent.safeLocations')}</span>
              <span className="font-medium">{emergencyNavigationActive ? `${safeRoutes} found` : '—'}</span>
            </div>
          </div>
          {emergencyNavigationActive && nearestShelter && userLocation && (
            <button
              type="button"
              onClick={() => {
                setSelectedDestination(nearestShelter);
                setShowMapModal(true);
              }}
              className="block w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center text-sm transition-colors"
            >
              <MapPin className="w-4 h-4 inline mr-1" />{t('featuresSection.featureContent.openInternalRouteTo', { name: nearestShelter.name || 'Nearest Shelter' })}
            </button>
          )}
          {emergencyNavigationActive && shelters.length > 1 && userLocation && (
            <div className="max-h-32 overflow-y-auto space-y-1">
              {shelters.slice(1, 5).map((s, i) => (
                <button key={i} type="button"
                  onClick={() => {
                    setSelectedDestination(s);
                    setShowMapModal(true);
                  }}
                  className="flex items-center justify-between p-1.5 bg-white rounded border border-teal-100 hover:bg-teal-50 text-xs transition-colors">
                  <span className="truncate">{s.name || s.type}</span>
                  <span className="text-teal-600 font-medium flex-shrink-0 ml-2">{s.distance.toFixed(1)} km</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ),
    },
    // 6. Community Network (Firestore real-time)
    {
      icon: Users, title: t('featuresSection.features.community.title'),
      description: t('featuresSection.features.community.description'),
      color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              {communityConnected ? <Wifi className="w-4 h-4 mr-2 text-green-500" /> : <WifiOff className="w-4 h-4 mr-2 text-gray-500" />}
              <span className={communityConnected ? 'text-green-600 font-medium' : 'text-gray-600'}>{communityConnected ? t('featuresSection.featureContent.connected') : t('featuresSection.featureContent.offline')}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${communityConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>
          <button
            onClick={toggleCommunity}
            className={`w-full py-2 rounded-lg flex items-center justify-center text-sm transition-colors ${communityConnected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
          >
            <Users className="w-4 h-4 mr-2" />{communityConnected ? t('featuresSection.featureContent.leave') : t('featuresSection.featureContent.join')}
          </button>
          <div className="bg-orange-50 p-2 rounded-lg border border-orange-200 text-xs text-orange-700 space-y-1">
            <div className="flex justify-between"><span>{t('featuresSection.featureContent.responders')}</span><span className="font-medium">{communityStats.responders}</span></div>
            <div className="flex justify-between"><span>{t('featuresSection.featureContent.neighbors')}</span><span className="font-medium">{communityStats.neighbors}</span></div>
          </div>
          {featureNotice.message && (
            <div className={`text-xs text-center rounded-lg px-2 py-2 ${featureNotice.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : featureNotice.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : featureNotice.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {featureNotice.message}
            </div>
          )}
          {!user && <p className="text-xs text-gray-400 text-center">{t('featuresSection.featureContent.logInToJoin')}</p>}
        </div>
      ),
    },
    // 7. Multi-Source Data
    {
      icon: Satellite, title: t('featuresSection.features.multiSource.title'),
      description: t('featuresSection.features.multiSource.description'),
      color: 'text-indigo-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200',
      content: (
        <div className="p-2 bg-white rounded-lg border border-gray-200 text-xs space-y-2">
          {Object.entries(apiStatus).map(([key, status]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-600 capitalize">{key}:</span>
              <span className={`flex items-center ${status === 'active' ? 'text-green-600' : status === 'loading' ? 'text-yellow-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${status === 'active' ? 'bg-green-500 animate-pulse' : status === 'loading' ? 'bg-yellow-500' : status === 'error' ? 'bg-red-500' : 'bg-gray-500'}`} />
                {status}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    // 8. Multi-Channel Alerts (saved to Firestore + browser notifications)
    {
      icon: Headphones, title: t('featuresSection.features.multiChannel.title'),
      description: t('featuresSection.features.multiChannel.description'),
      color: 'text-pink-500', bgColor: 'bg-pink-50', borderColor: 'border-pink-200',
      content: (
        <div className="space-y-3">
          <div className="space-y-2">
            {Object.entries(alertSettings).map(([ch, on]) => (
              <div key={ch} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${on ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs font-medium text-gray-700 capitalize">{ch}</span>
                </div>
                <button
                  onClick={() => toggleAlertChannel(ch)}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${on ? 'bg-pink-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          {alertsSaving && <div className="text-xs text-center text-gray-400">{t('featuresSection.featureContent.saving')}</div>}
          <button onClick={handleTestAlert} className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs rounded-lg flex items-center justify-center transition-colors">
            <Bell className="w-3 h-3 mr-1" /> {t('featuresSection.featureContent.testAlerts')}
          </button>
          {featureNotice.message && (
            <div className={`text-xs text-center rounded-lg px-2 py-2 ${featureNotice.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : featureNotice.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : featureNotice.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {featureNotice.message}
            </div>
          )}
          {!user && <p className="text-xs text-gray-400 text-center">{t('featuresSection.featureContent.logInToSavePreferences')}</p>}
        </div>
      ),
    },
  ];

  // ═══════════ API Integration cards ═══════════
  const apiIntegrations = [
    { name: t('featuresSection.apiIntegrations.openweathermap.name'), desc: t('featuresSection.apiIntegrations.openweathermap.description'), status: apiStatus.weather, icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: t('featuresSection.apiIntegrations.openMeteoFlood.name'), desc: t('featuresSection.apiIntegrations.openMeteoFlood.description'), status: apiStatus.flood, icon: Waves, color: 'text-green-500', bg: 'bg-green-50' },
    { name: t('featuresSection.apiIntegrations.geolocation.name'), desc: t('featuresSection.apiIntegrations.geolocation.description'), status: apiStatus.location, icon: Locate, color: apiStatus.location === 'active' ? 'text-green-500' : 'text-yellow-500', bg: apiStatus.location === 'active' ? 'bg-green-50' : 'bg-yellow-50' },
    { name: t('featuresSection.apiIntegrations.overpass.name'), desc: t('featuresSection.apiIntegrations.overpass.description'), status: emergencyNavigationActive ? 'active' : 'standby', icon: MapPin, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  // ═══════════ RENDER ═══════════
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('featuresSection.header')}</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('featuresSection.subtitle', { 
              count: Object.values(apiStatus).filter((s) => s === 'active').length,
              lat: userLocation ? userLocation[0].toFixed(4) : 'N/A',
              lon: userLocation ? userLocation[1].toFixed(4) : 'N/A'
            })}
          </p>
        </div>

        {/* Status Banner */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg border border-blue-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${apiStatus.weather === 'active' && apiStatus.flood === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <div>
                <span className="text-sm font-medium text-gray-700">{t(apiStatus.weather === 'active' && apiStatus.flood === 'active' ? 'featuresSection.allSystemsOperational' : 'featuresSection.partialSystems')}</span>
                {lastUpdate && <div className="text-xs text-gray-500">{t('featuresSection.updated', { time: lastUpdate.toLocaleTimeString() })}</div>}
              </div>
            </div>
            <button onClick={loadAllData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? t('featuresSection.updating') : t('featuresSection.refreshNow')}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={`group bg-white rounded-2xl shadow-lg border-2 ${f.borderColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full`}>
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-4">
                    <div className={`inline-flex p-3 rounded-xl ${f.bgColor} group-hover:scale-110 transition-transform ${f.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-shrink-0">{f.description}</p>
                  <div className="flex-1 min-h-0">
                    {!loading && f.content}
                    {loading && (
                      <div className="p-2 bg-gray-100 rounded-lg animate-pulse h-full flex items-center">
                        <div className="w-full"><div className="h-4 bg-gray-200 rounded mb-2" /><div className="h-4 bg-gray-200 rounded w-3/4" /></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* API Integrations */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('featuresSection.apiIntegrations.title')}</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t('featuresSection.apiIntegrations.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiIntegrations.map((api, i) => {
              const ApiIcon = api.icon;
              const live = api.status === 'active';
              return (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors group">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${api.bg} mr-4 group-hover:scale-110 transition-transform`}>
                      <ApiIcon className={`w-6 h-6 ${api.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{api.name}</h4>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full ${live ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'} mr-2`} />
                        <span className="text-sm text-gray-600 capitalize">{api.status}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{api.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Interactive Map */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('featuresSection.riskMap.title')}</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {userLocation ? t('featuresSection.riskMap.dynamicVisualization', { lat: userLocation[0].toFixed(4), lon: userLocation[1].toFixed(4) }) : t('featuresSection.riskMap.dynamicVisualization', { lat: 'N/A', lon: 'N/A' })}
            </p>
          </div>
          <Suspense fallback={<div className="h-[400px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center"><RefreshCw className="w-8 h-8 text-gray-400 animate-spin" /></div>}>
            <LiveFloodMap userLocation={userLocation} weatherData={weatherData} floodData={floodData} shelters={shelters} selectedDestination={selectedDestination} onDestinationSelect={setSelectedDestination} />
          </Suspense>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center"><div className="flex items-center justify-center mb-1"><div className="w-4 h-4 bg-red-500 rounded mr-2" /><span className="font-semibold text-red-800">{t('featuresSection.riskLegend.highRisk')}</span></div><div className="text-xs text-red-600">{t('featuresSection.riskLegend.highRiskCondition')}</div></div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center"><div className="flex items-center justify-center mb-1"><div className="w-4 h-4 bg-yellow-500 rounded mr-2" /><span className="font-semibold text-yellow-800">{t('featuresSection.riskLegend.mediumRisk')}</span></div><div className="text-xs text-yellow-600">{t('featuresSection.riskLegend.mediumRiskCondition')}</div></div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center"><div className="flex items-center justify-center mb-1"><div className="w-4 h-4 bg-green-500 rounded mr-2" /><span className="font-semibold text-green-800">{t('featuresSection.riskLegend.lowRisk')}</span></div><div className="text-xs text-green-600">{t('featuresSection.riskLegend.lowRiskCondition')}</div></div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t('featuresSection.alerts.title')}</h3>
          </div>
          <div className="space-y-4">
            {alertsData.map((al) => (
              <div key={al.id} className={`p-4 rounded-lg border-l-4 ${al.level === 'high' ? 'border-red-500 bg-red-50' : al.level === 'moderate' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
                <div className="flex items-center mb-2"><span className="text-lg mr-2">{al.icon}</span><h4 className="font-semibold text-gray-900">{al.title}</h4></div>
                <p className="text-sm text-gray-600 mb-2">{al.description}</p>
                <div className="flex justify-between text-xs text-gray-500"><span className="capitalize">{al.type}</span><span>{al.date}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer status */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />{t('featuresSection.footer.liveDataStreaming')}</div>
            <span className="hidden sm:block">•</span>
            <span>{t('featuresSection.footer.updatesEvery2Min')}</span>
            <span className="hidden sm:block">•</span>
            {userLocation
              ? <span className="text-blue-600 flex items-center"><Locate className="w-3 h-3 mr-1" />{t('featuresSection.footer.trackingyourLocation')}</span>
              : <span className="text-yellow-600">{t('featuresSection.footer.usingDefaultLocation')}</span>}
          </div>
        </div>
      </div>

      {/* ═══ Map Modal ═══ */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">{t('featuresSection.riskMap.title')}</h3>
              {selectedDestination && (
                <p className="mt-1 text-sm text-gray-500">{t('featuresSection.riskMap.internalRoute', { name: selectedDestination.name || selectedDestination.type || 'destination' })}</p>
              )}
              <button onClick={() => setShowMapModal(false)} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 text-2xl">&times;</button>
            </div>
            <div className="flex-1 p-6">
              <Suspense fallback={<div className="h-full bg-gray-100 rounded-xl animate-pulse" />}>
                <LiveFloodMap userLocation={userLocation} weatherData={weatherData} floodData={floodData} shelters={shelters} selectedDestination={selectedDestination} onDestinationSelect={setSelectedDestination} className="!h-full" />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Training Modal ═══ */}
      {showTraining && <TrainingScenario onClose={() => setShowTraining(false)} />}
    </section>
  );
};

export default FeaturesSection;
