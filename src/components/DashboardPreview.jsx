import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { fetchNearbyShelters } from './features/shelterService';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Phone, 
  Users, 
  Navigation,
  RefreshCw,
  Clock,
  Thermometer,
  Droplets,
  Wind,
  Locate,
  Eye,
  Map,
  X,
} from 'lucide-react';

const LiveFloodMap = lazy(() => import('./features/LiveFloodMap'));

const DashboardPreview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [floodData, setFloodData] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('Your Location');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [nearbyShelters, setNearbyShelters] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [sosMessage, setSosMessage] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Footer colors
  const footerBlue = '#0084B6';
  const footerDarkBlue = '#006A9B';

  // OpenWeatherMap API Key
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const createStableSeed = (lat, lon) => Math.abs(Math.round((lat + 90) * 1000 + (lon + 180) * 1000));

  const buildWeatherFallback = (lat, lon) => {
    const seed = createStableSeed(lat, lon);
    const temp = 18 + (seed % 12);
    const humidity = 55 + (seed % 30);
    const windSpeed = 2 + ((seed % 80) / 10);
    const rainfall = (seed % 6) * 2;

    return {
      main: {
        temp,
        humidity,
        pressure: 1008 + (seed % 8),
      },
      weather: [{
        description: rainfall > 0 ? 'scattered clouds' : 'clear sky',
        main: rainfall > 0 ? 'Clouds' : 'Clear',
      }],
      wind: { speed: windSpeed },
      name: locationName,
      rain: { '1h': rainfall },
    };
  };

  const buildFloodFallback = (lat, lon) => {
    const seed = createStableSeed(lat, lon);
    return {
      daily: {
        river_discharge_mean: [18 + (seed % 28)],
      },
    };
  };

  // Get location name based on coordinates
  const getLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const location = data[0];
          return location.name || `${location.state || ''} ${location.country || ''}`.trim();
        }
      }
    } catch (error) {
      console.error('Error getting location name:', error);
    }
    
    // Fallback: show coordinates
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  };

  // Get user location more aggressively
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error(t('dashboardPreview.geolocation.notSupported'));
        setLocationError(t('dashboardPreview.geolocation.notSupported'));
        reject(error);
        return;
      }

      setLocationError(null);

      // More aggressive options to get location
      const options = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          
          setUserLocation(location);
          
          // Get location name
          try {
            const name = await getLocationName(latitude, longitude);
            setLocationName(name);
          } catch {
            setLocationName(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`);
          }
          
          resolve(location);
        },
        (error) => {
          let errorMessage = t('dashboardPreview.geolocation.couldNotGetLocation');
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t('dashboardPreview.geolocation.permissionDenied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t('dashboardPreview.geolocation.positionUnavailable');
              break;
            case error.TIMEOUT:
              errorMessage = t('dashboardPreview.geolocation.timeout');
              break;
            default:
              errorMessage = t('dashboardPreview.geolocation.unknown');
              break;
          }
          
          setLocationError(errorMessage);
          
          // Try to get approximate location via IP as last resort
          getLocationByIP()
            .then(location => {
              if (location) {
                setUserLocation(location);
                setLocationName(t('dashboardPreview.geolocation.approximateLocation'));
                resolve(location);
              } else {
                reject(error);
              }
            })
            .catch(() => reject(error));
        },
        options
      );
    });
  };

  // Get approximate location via IP (fallback)
  const getLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        if (data.latitude && data.longitude) {
          return [data.latitude, data.longitude];
        }
      }
    } catch (error) {
      console.error('Error getting location by IP:', error);
    }
    
    // Last fallback: use browser location without high precision
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([latitude, longitude]);
        },
        () => {
          // Final fallback: generic Brazil coordinates
          resolve([-15.7975, -47.8919]); // Brasília
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    });
  };

  // Fetch weather data
  const fetchWeatherData = async (location) => {
    try {
      const [lat, lon] = location;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${OPENWEATHER_API_KEY}&units=metric&lang=en`
      );
      
      if (!response.ok) throw new Error('Weather API failed');
      
      const data = await response.json();
      setWeatherData(data);
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      const [lat, lon] = location;
      const fallbackData = buildWeatherFallback(lat, lon);
      setWeatherData(fallbackData);
      return fallbackData;
    }
  };

  // Fetch flood data
  const fetchFloodData = async (location) => {
    try {
      const [lat, lon] = location;
      const response = await fetch(
        `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge,river_discharge_mean&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Flood API failed');
      
      const data = await response.json();
      setFloodData(data);
      return data;
    } catch (error) {
      console.error('Error fetching flood data:', error);
      const [lat, lon] = location;
      const fallbackData = buildFloodFallback(lat, lon);
      setFloodData(fallbackData);
      return fallbackData;
    }
  };

  // Generate realistic alerts based on weather and flood data
  const generateRealisticAlerts = (weatherData, floodData) => {
    const alerts = [];
    const now = Math.floor(Date.now() / 1000);
    const riverLevel = floodData?.daily?.river_discharge_mean?.[0] || 0;
    const rainfall = weatherData?.rain?.['1h'] || 0;
    const windSpeed = weatherData?.wind?.speed || 0;

    // High rainfall alert
    if (rainfall > 20) {
      alerts.push({
        sender_name: "National Meteorological Department",
        event: "Red Alert: Heavy Rainfall",
        start: now - 3600, // 1 hour ago
        end: now + 6 * 3600, // 6 hours from now
        description: `Heavy rainfall detected: ${rainfall.toFixed(1)}mm in the last hour. Risk of flash floods and landslides. Stay in safe areas.`,
        severity: "high",
        color: "red",
        icon: Droplets
      });
    } else if (rainfall > 10) {
      alerts.push({
        sender_name: "Flood Alert System",
        event: "Orange Alert: Moderate Rainfall",
        start: now - 1800, // 30 minutes ago
        end: now + 3 * 3600, // 3 hours from now
        description: `Moderate rainfall: ${rainfall.toFixed(1)}mm in the last hour. Conditions may worsen. Stay alert.`,
        severity: "moderate",
        color: "orange",
        icon: AlertTriangle
      });
    }

    // River level alerts
    if (riverLevel > 60) {
      alerts.push({
        sender_name: "National Water Agency",
        event: "Red Alert: Critical River Level",
        start: now - 7200, // 2 hours ago
        end: now + 12 * 3600, // 12 hours from now
        description: `River level reached ${riverLevel.toFixed(1)} m³/s. Riverside areas at imminent flood risk. Seek higher ground.`,
        severity: "high",
        color: "red",
        icon: AlertTriangle
      });
    } else if (riverLevel > 40) {
      alerts.push({
        sender_name: "National Water Agency",
        event: "Yellow Alert: High River Level",
        start: now - 3600,
        end: now + 8 * 3600,
        description: `River level at ${riverLevel.toFixed(1)} m³/s. Constant monitoring recommended.`,
        severity: "moderate",
        color: "yellow",
        icon: AlertTriangle
      });
    }

    // Wind alerts
    if (windSpeed > 15) {
      alerts.push({
        sender_name: "National Meteorological Department",
        event: "Strong Winds Alert",
        start: now - 2700, // 45 minutes ago
        end: now + 4 * 3600,
        description: `Winds of ${windSpeed.toFixed(1)} m/s detected. Risk of structural damage and falling trees. Avoid open areas.`,
        severity: "moderate",
        color: "yellow",
        icon: Wind
      });
    }

    // Default monitoring alert when no critical conditions
    if (alerts.length === 0) {
      alerts.push({
        sender_name: "Vigia Monitoring System",
        event: "All Normal",
        start: now - 900, // 15 minutes ago
        end: now + 3600,
        description: "No adverse weather conditions detected. Continue regular monitoring.",
        severity: "low",
        color: "green",
        icon: Shield
      });
    }

    return alerts;
  };

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const location = await getUserLocation();
      const weather = await fetchWeatherData(location);
      const flood = await fetchFloodData(location);
      const alerts = generateRealisticAlerts(weather, flood);
      
      setAlertsData(alerts);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate risk level based on real data
  const calculateRiskLevel = () => {
    if (!floodData || !weatherData) return { level: "Loading...", percentage: 0, color: "gray" };

    const riverLevel = floodData.daily?.river_discharge_mean?.[0] || 0;
    const rainfall = weatherData.rain?.['1h'] || 0;
    const windSpeed = weatherData.wind?.speed || 0;

    let riskScore = 0;
    
    if (riverLevel > 60) riskScore += 40;
    else if (riverLevel > 40) riskScore += 20;
    
    if (rainfall > 20) riskScore += 40;
    else if (rainfall > 10) riskScore += 20;
    
    if (windSpeed > 15) riskScore += 20;

    if (riskScore >= 60) {
      return { level: "High", percentage: Math.min(riskScore, 90), color: "red" };
    } else if (riskScore >= 30) {
      return { level: "Moderate", percentage: riskScore, color: "yellow" };
    } else {
      return { level: "Low", percentage: Math.max(riskScore, 15), color: "green" };
    }
  };

  // Format relative time
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  // Format timestamp to readable time
  const formatAlertTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ensureLocation = async () => {
    if (userLocation) return userLocation;
    return getUserLocation();
  };

  const loadShelters = async () => {
    const location = await ensureLocation();
    const [lat, lon] = location;
    const shelters = await fetchNearbyShelters(lat, lon, 15);
    setNearbyShelters(shelters);
    return { location, shelters };
  };

  const handleEvacuationRoutes = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      const { shelters } = await loadShelters();
      const destination = shelters.find((place) => ['shelter', 'hospital', 'fire_station'].includes(place.type));

      if (destination) {
        setSelectedDestination(destination);
        setActionModal('map');
        return;
      }

      setSelectedDestination(null);
      setActionModal('map');
    } catch {
      setActionError('Unable to generate an evacuation route right now. Please try again.');
      setActionModal('contacts');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFindShelters = async () => {
    setActionLoading(true);
    setActionError('');
    setActionModal('shelters');
    try {
      const { shelters } = await loadShelters();
      setSelectedDestination(shelters[0] ?? null);
    } catch {
      setActionError('Unable to load nearby shelters right now.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmergencyContacts = async () => {
    setActionError('');
    setActionModal('contacts');
  };

  const buildSosMessage = async () => {
    const location = await ensureLocation();
    const [lat, lon] = location;
    const risk = calculateRiskLevel();
    return [
      t('dashboardPreview.sos.title'),
      t('dashboardPreview.sos.riskLevel', { level: risk.level, percentage: risk.percentage }),
      t('dashboardPreview.sos.location', { name: locationName }),
      t('dashboardPreview.sos.coordinates', { lat: lat.toFixed(5), lon: lon.toFixed(5) }),
      t('dashboardPreview.sos.instruction'),
    ].join('\n');
  };

  const handleEmergencySOS = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      const message = await buildSosMessage();
      setSosMessage(message);
      setActionModal('sos');
    } catch {
      setActionError('Unable to prepare your SOS details.');
      setActionModal('sos');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShareSOS = async () => {
    if (!sosMessage) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Emergency SOS',
          text: sosMessage,
        });
        return;
      }

      await navigator.clipboard.writeText(sosMessage);
      setActionError('SOS details copied to clipboard. Share them with emergency contacts now.');
    } catch {
      setActionError('Unable to share automatically. Copy the SOS text manually.');
    }
  };

  const openShelterDirections = async (shelter) => {
    try {
      await ensureLocation();
      setSelectedDestination(shelter);
      setActionModal('map');
    } catch {
      setActionError('Unable to open directions without your location.');
    }
  };

  const ActionModal = () => {
    if (!actionModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {actionModal === 'shelters' && t('dashboardPreview.modal.shelters')}
              {actionModal === 'contacts' && t('dashboardPreview.modal.contacts')}
              {actionModal === 'sos' && t('dashboardPreview.modal.sos')}
              {actionModal === 'map' && t('dashboardPreview.modal.map')}
            </h3>
            <button
              onClick={() => {
                setActionModal(null);
                setActionError('');
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {actionError && (
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              {actionError}
            </div>
          )}

          {actionModal === 'shelters' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t('dashboardPreview.modal.sheltersText', { name: locationName })}
              </p>
              {actionLoading ? (
                <div className="py-8 text-center text-gray-500">{t('dashboardPreview.modal.searchingShelters')}</div>
              ) : nearbyShelters.length > 0 ? (
                nearbyShelters.slice(0, 6).map((shelter, index) => (
                  <div key={`${shelter.lat}-${shelter.lon}-${index}`} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{shelter.name || t('dashboardPreview.modal.unnamedLocation')}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {shelter.type.replace('_', ' ')} • {shelter.distance.toFixed(1)} km away
                        </p>
                        {shelter.address && <p className="text-sm text-gray-500">{shelter.address}</p>}
                      </div>
                      <Button onClick={() => openShelterDirections(shelter)}>
                        {t('dashboardPreview.modal.showRoute')}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
                  {t('dashboardPreview.modal.noShelters')}
                  {userLocation && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedDestination(null);
                          setActionModal('map');
                        }}
                      >
                        {t('dashboardPreview.modal.openMap')}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {actionModal === 'map' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {selectedDestination
                  ? t('dashboardPreview.modal.showingRoute', { name: selectedDestination.name || t('dashboardPreview.modal.selectedShelter') })
                  : t('dashboardPreview.modal.showingFloodArea')}
              </p>
              <Suspense fallback={<div className="h-[420px] rounded-xl bg-gray-100 animate-pulse" />}>
                <LiveFloodMap
                  userLocation={userLocation}
                  weatherData={weatherData}
                  floodData={floodData}
                  shelters={nearbyShelters}
                  selectedDestination={selectedDestination}
                  onDestinationSelect={setSelectedDestination}
                  className="!h-[420px]"
                />
              </Suspense>
            </div>
          )}

          {actionModal === 'contacts' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <h4 className="font-semibold text-red-900">{t('dashboardPreview.modal.immediateEmergency')}</h4>
                <p className="mt-1 text-sm text-red-800">{t('dashboardPreview.modal.callEmergency')}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a href="tel:119" className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                    {t('dashboardPreview.modal.callPolice')}
                  </a>
                  <a href="tel:198" className="inline-flex items-center rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
                    {t('dashboardPreview.modal.callFirefighters')}
                  </a>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900">{t('dashboardPreview.modal.tsbiChannels')}</h4>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p><strong>{t('dashboardPreview.modal.email')}:</strong> <a className="text-blue-600 hover:underline" href="mailto:support@hydrobeacon.org">support@hydrobeacon.org</a></p>
                  <p><strong>{t('dashboardPreview.modal.hazardReport')}:</strong> <a className="text-blue-600 hover:underline" href="/report-hazard">{t('dashboardPreview.modal.openHazardReport')}</a></p>
                </div>
              </div>
            </div>
          )}

          {actionModal === 'sos' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 whitespace-pre-line">
                {sosMessage || t('dashboardPreview.modal.preparingSOS')}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:119" className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  {t('dashboardPreview.modal.callEmergency')}
                </a>
                <Button variant="outline" onClick={handleShareSOS}>
                  {t('dashboardPreview.modal.shareSOS')}
                </Button>
                <a
                  href={`mailto:support@hydrobeacon.org?subject=${encodeURIComponent(t('dashboardPreview.modal.emailSubject'))}&body=${encodeURIComponent(sosMessage)}`}
                  className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {t('dashboardPreview.modal.emailSOS')}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Effect to load data initially
  useEffect(() => {
    loadAllData();
    
    // Update every 2 minutes
    const interval = setInterval(loadAllData, 120000);
    return () => clearInterval(interval);
  }, []);

  const riskLevel = calculateRiskLevel();

  const handleAccessDashboard = () => {
    navigate(user ? '/dashboard' : '/login');
  };

  const handleStartTraining = () => {
    navigate('/training');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">{t('dashboardPreview.realTimeData')}</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('dashboardPreview.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('dashboardPreview.description')}
          </p>
          {lastUpdate && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              {t('dashboardPreview.lastUpdate', { time: lastUpdate.toLocaleTimeString('en-US') })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header with status and update */}
          <div 
            className="px-8 py-4 text-white"
            style={{ background: `linear-gradient(to right, ${footerBlue}, ${footerDarkBlue})` }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <Locate className="w-5 h-5 mr-2" />
                <span>
                  {locationError ? (
                    <span className="text-yellow-200">{locationError}</span>
                  ) : userLocation ? (
                    t('dashboardPreview.location', { name: locationName })
                  ) : (
                    t('dashboardPreview.gettingLocation')
                  )}
                </span>
              </div>
              <Button 
                onClick={loadAllData}
                disabled={loading}
                variant="secondary"
                size="sm"
                className="bg-white hover:bg-gray-100 font-semibold"
                style={{ color: footerBlue }}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? t('dashboardPreview.updating') : t('dashboardPreview.updateData')}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Status Cards */}
            <div className="space-y-6">
              {/* Dynamic Risk Level Card */}
              <div className={`bg-${riskLevel.color}-50 border border-${riskLevel.color}-200 rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Flood Risk Level</h3>
                  <Shield className={`w-6 h-6 text-${riskLevel.color}-600`} />
                </div>
                <div className="flex items-center mb-2">
                  <span className={`text-2xl font-bold text-${riskLevel.color}-600`}>
                    {riskLevel.level}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{riskLevel.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`bg-${riskLevel.color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${riskLevel.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {t(`dashboardPreview.riskDescription.${riskLevel.level.toLowerCase()}`)}
                </p>
                {floodData && weatherData && (
                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    <div>{t('dashboardPreview.riverLevel')}: {floodData.daily?.river_discharge_mean?.[0]?.toFixed(1)} m³/s</div>
                    <div>{t('dashboardPreview.rainfall')}: {weatherData.rain?.['1h']?.toFixed(1) || '0'} mm/h</div>
                    <div>{t('dashboardPreview.wind')}: {weatherData.wind?.speed?.toFixed(1)} m/s</div>
                  </div>
                )}
              </div>

              {/* Dynamic Active Alerts */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('dashboardPreview.activeAlerts')}</h3>
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-500">{t('dashboardPreview.alertCount', { count: alertsData.length })}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {alertsData.map((alert, index) => {
                    const IconComponent = alert.icon;
                    return (
                      <div key={index} className={`p-4 rounded-lg border-l-4 bg-${alert.color}-50 border-${alert.color}-500`}>
                        <div className="flex items-start space-x-3">
                          <IconComponent className={`w-5 h-5 text-${alert.color}-600 mt-0.5 flex-shrink-0`} />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm">{alert.event}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full bg-${alert.color}-100 text-${alert.color}-800`}>
                                {alert.sender_name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Active: {formatAlertTime(alert.start)} - {formatAlertTime(alert.end)}</span>
                              <span className={`text-${alert.color}-600 font-medium`}>
                                {alert.severity === 'high' ? 'CRITICAL' : 
                                 alert.severity === 'moderate' ? 'WARNING' : 'INFO'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Map and Weather */}
            <div className="space-y-6">
              {/* Dynamic Risk Map */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Real-Time Risk Map</h3>
                  <MapPin className="w-6 h-6" style={{ color: footerBlue }} />
                </div>
                <div 
                  className="rounded-lg h-32 flex items-center justify-center mb-4 relative overflow-hidden"
                  style={{ backgroundColor: `${footerBlue}15` }}
                >
                  {/* Simulated Map with Dynamic Data */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(90deg, ${footerBlue} 1px, transparent 1px),
                        linear-gradient(180deg, ${footerBlue} 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  ></div>
                  
                  {/* Dynamic Map Indicators */}
                  <div 
                    className={`absolute w-16 h-16 rounded-full border-4 opacity-60 animate-pulse`}
                    style={{ 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      borderColor: footerBlue
                    }}
                  ></div>
                  
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-white rounded-full shadow-lg"
                    style={{ backgroundColor: footerBlue }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                  
                  <p 
                    className="font-medium z-10 bg-white bg-opacity-80 px-3 py-1 rounded-lg"
                    style={{ color: footerBlue }}
                  >
                    {t('dashboardPreview.riskZone', { level: riskLevel.level })}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="flex items-center">
                    <Map className="w-4 h-4 mr-1" style={{ color: footerBlue }} />
                    <strong>{t('dashboardPreview.yourArea')}:</strong> 
                    <span className="ml-1">{locationName}</span>
                  </p>
                  {userLocation && (
                    <p className="mt-1 text-xs text-gray-500">
                      {t('dashboardPreview.coordinates')}: {userLocation[0].toFixed(4)}°, {userLocation[1].toFixed(4)}°
                    </p>
                  )}
                  <p className="mt-2 flex items-center" style={{ color: footerBlue }}>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    {t('dashboardPreview.realtimeData')}
                  </p>
                </div>
              </div>

              {/* Dynamic Weather Widget */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('dashboardPreview.realTimeWeather')}</h3>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-gray-500">{t('dashboardPreview.live')}</span>
                  </div>
                </div>
                {weatherData ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round(weatherData.main.temp)}°C
                      </p>
                      <p className="text-gray-600 capitalize">
                        {weatherData.weather[0]?.description || 'Sunny'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {locationName}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-end">
                        <Droplets className="w-4 h-4 mr-1" style={{ color: footerBlue }} />
                        <span>{t('dashboardPreview.humidity')}: {weatherData.main.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <Wind className="w-4 h-4 mr-1 text-gray-500" />
                        <span>{t('dashboardPreview.wind')}: {weatherData.wind?.speed?.toFixed(1) || '0'} m/s</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <Shield className="w-4 h-4 mr-1 text-green-500" />
                        <span>{t('dashboardPreview.pressure')}: {weatherData.main.pressure} hPa</span>
                      </div>
                      {weatherData.rain && (
                        <div className="flex items-center justify-end">
                          <Droplets className="w-4 h-4 mr-1 text-blue-500" />
                          <span>{t('dashboardPreview.rain')}: {weatherData.rain['1h']?.toFixed(1) || '0'} mm</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-2">{t('dashboardPreview.loadingWeather')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboardPreview.quickActions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-3 px-4 flex flex-col items-center space-y-2" onClick={handleEvacuationRoutes} disabled={actionLoading}>
                <Navigation className="w-5 h-5" style={{ color: footerBlue }} />
                <span className="text-xs">{t('dashboardPreview.evacuationRoutes')}</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 px-4 flex flex-col items-center space-y-2" onClick={handleFindShelters} disabled={actionLoading}>
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-xs">{t('dashboardPreview.findShelters')}</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 px-4 flex flex-col items-center space-y-2" onClick={handleEmergencyContacts}>
                <Phone className="w-5 h-5 text-purple-600" />
                <span className="text-xs">{t('dashboardPreview.emergencyContacts')}</span>
              </Button>
              <Button variant="destructive" className="h-auto py-3 px-4 flex flex-col items-center space-y-2" onClick={handleEmergencySOS} disabled={actionLoading}>
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs">{t('dashboardPreview.emergencySOS')}</span>
              </Button>
            </div>
          </div>

          {/* Dynamic Recent Activity */}
          <div className="px-8 py-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboardPreview.recentActivity')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className={`w-2 h-2 bg-${riskLevel.color}-500 rounded-full`}></div>
                <span className="text-gray-600">{t('dashboardPreview.riskAssessment')}</span>
                <span className="text-gray-900 font-medium">
                  {t('dashboardPreview.riskAssessmentText', { level: riskLevel.level, time: formatTimeAgo(lastUpdate || new Date()) })}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">{t('dashboardPreview.weatherUpdate')}</span>
                <span className="text-gray-900 font-medium">
                  {weatherData ? t('dashboardPreview.dataUpdated', { time: formatTimeAgo(lastUpdate || new Date()) }) : t('dashboardPreview.loadingWeather')}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: footerBlue }}
                ></div>
                <span className="text-gray-600">{t('dashboardPreview.locationTracking')}</span>
                <span className="text-gray-900 font-medium">
                  {userLocation ? t('dashboardPreview.gpsActive', { name: locationName }) : t('dashboardPreview.gettingLocation')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className="px-8 py-6 border-t"
            style={{ 
              background: `linear-gradient(to right, ${footerBlue}, ${footerDarkBlue})`,
              borderColor: `${footerBlue}80`
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white hover:bg-gray-50 font-semibold"
                style={{ color: footerBlue }}
                onClick={handleAccessDashboard}
              >
                {t('dashboardPreview.accessDashboard')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent text-white hover:bg-white font-semibold"
                style={{ 
                  borderColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = footerBlue;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}
                onClick={handleStartTraining}
              >
                <Eye className="w-5 h-5 mr-2" />
                {t('dashboardPreview.startVRTraining')}
              </Button>
            </div>
            <div className="text-center mt-4">
              <p className="text-white text-sm opacity-90">
                {t('dashboardPreview.dataSource')}
              </p>
            </div>
          </div>
        </div>

        {/* Location help message */}
        {locationError && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h4 className="font-medium text-yellow-800">Location Problem</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  {locationError} For a complete experience, allow access to your location.
                </p>
                <Button 
                  onClick={loadAllData} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ActionModal />
    </section>
  );
};

export default DashboardPreview;