import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, AlertTriangle, Users, Zap, Calendar, Lock, BarChart3, RefreshCw, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import DashboardPreview from '../DashboardPreview';
import { getActiveFloodAlerts, getActiveShelters, getOperationalTeams, getUsers, createFloodAlert, createShelter } from '../../firebase/firestore';

const DEMO_TEAMS = [
  { id: 'demo-1', name: 'Squad Alpha', location: 'Downtown', status: 'active', teams: 4 },
  { id: 'demo-2', name: 'Squad Bravo', location: 'Riverside', status: 'active', teams: 3 },
  { id: 'demo-3', name: 'Squad Charlie', location: 'North District', status: 'response', teams: 5 },
  { id: 'demo-4', name: 'Squad Delta', location: 'South Zone', status: 'standby', teams: 2 },
];

const DEMO_SHELTERS = [
  { id: 'demo-1', name: 'Downtown Safe Zone', capacity: 450, currentOccupancy: 312, active: true },
  { id: 'demo-2', name: 'Hospital Shelter', capacity: 200, currentOccupancy: 187, active: true },
  { id: 'demo-3', name: 'High School Gym', capacity: 600, currentOccupancy: 428, active: true },
];

const ResponderDashboard = () => {
  const { t } = useTranslation();
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sheltersStatus, setSheltersStatus] = useState([]);
  const [operativesOnDuty, setOperativesOnDuty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [alertForm, setAlertForm] = useState({ location: '', message: '', severity: 'medium' });
  const [shelterForm, setShelterForm] = useState({ name: '', address: '', capacity: '', phone: '' });
  const [submittingAlert, setSubmittingAlert] = useState(false);
  const [submittingShelter, setSubmittingShelter] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alerts, shelters, teams, users] = await Promise.all([
        getActiveFloodAlerts(),
        getActiveShelters(),
        getOperationalTeams(),
        getUsers(),
      ]);
      const hasRealData = alerts.length > 0 || shelters.length > 0 || teams.length > 0;
      setActiveAlerts(alerts.length || (hasRealData ? 0 : 8));
      setTotalUsers(users.length || 0);
      setSheltersStatus(shelters.length > 0 ? shelters : DEMO_SHELTERS);
      setOperativesOnDuty(teams.length > 0 ? teams : DEMO_TEAMS);
      setUsingDemo(!hasRealData);
    } catch {
      setActiveAlerts(8);
      setSheltersStatus(DEMO_SHELTERS);
      setOperativesOnDuty(DEMO_TEAMS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!alertForm.location || !alertForm.message) return;
    setSubmittingAlert(true);
    try {
      await createFloodAlert(alertForm);
      setAlertForm({ location: '', message: '', severity: 'medium' });
      setShowAlertModal(false);
      await loadData();
    } catch (err) {
      console.error('Error creating alert:', err);
    } finally {
      setSubmittingAlert(false);
    }
  };

  const handleAddShelter = async (e) => {
    e.preventDefault();
    if (!shelterForm.name || !shelterForm.capacity) return;
    setSubmittingShelter(true);
    try {
      await createShelter({ ...shelterForm, capacity: Number(shelterForm.capacity), current: 0, status: 'operational' });
      setShelterForm({ name: '', address: '', capacity: '', phone: '' });
      setShowShelterModal(false);
      await loadData();
    } catch (err) {
      console.error('Error adding shelter:', err);
    } finally {
      setSubmittingShelter(false);
    }
  };

  const getSeverityLabel = (severity) => t(`responderDashboardBatch.severity.${severity}`);
  const getSquadStatusLabel = (status) => t(`responderDashboardBatch.squadStatus.${status}`);
  const getShelterStatusLabel = (status) => t(`responderDashboardBatch.shelterStatus.${status || 'operational'}`);

  useEffect(() => { loadData(); }, []);

  return (
    <div className="space-y-8">
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAlertModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{t('responderDashboardBatch.modals.createAlert.title')}</h3>
              <button onClick={() => setShowAlertModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responderDashboardBatch.modals.createAlert.locationLabel')}</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('responderDashboardBatch.modals.createAlert.locationPlaceholder')} value={alertForm.location} onChange={e => setAlertForm(p => ({ ...p, location: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responderDashboardBatch.modals.createAlert.messageLabel')}</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} placeholder={t('responderDashboardBatch.modals.createAlert.messagePlaceholder')} value={alertForm.message} onChange={e => setAlertForm(p => ({ ...p, message: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responderDashboardBatch.modals.createAlert.severityLabel')}</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" value={alertForm.severity} onChange={e => setAlertForm(p => ({ ...p, severity: e.target.value }))}>
                  <option value="low">{getSeverityLabel('low')}</option>
                  <option value="medium">{getSeverityLabel('medium')}</option>
                  <option value="high">{getSeverityLabel('high')}</option>
                  <option value="critical">{getSeverityLabel('critical')}</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAlertModal(false)} className="flex-1 border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50">{t('common.cancel')}</button>
                <button type="submit" disabled={submittingAlert} className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                  {submittingAlert ? t('responderDashboardBatch.modals.createAlert.creating') : t('responderDashboardBatch.modals.createAlert.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showShelterModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowShelterModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{t('responderDashboardBatch.modals.addShelter.title')}</h3>
              <button onClick={() => setShowShelterModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddShelter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responderDashboardBatch.modals.addShelter.nameLabel')}</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('responderDashboardBatch.modals.addShelter.namePlaceholder')} value={shelterForm.name} onChange={e => setShelterForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responderDashboardBatch.modals.addShelter.addressLabel')}</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('responderDashboardBatch.modals.addShelter.addressPlaceholder')} value={shelterForm.address} onChange={e => setShelterForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responderDashboardBatch.modals.addShelter.capacityLabel')}</label>
                <input type="number" min="1" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('responderDashboardBatch.modals.addShelter.capacityPlaceholder')} value={shelterForm.capacity} onChange={e => setShelterForm(p => ({ ...p, capacity: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responderDashboardBatch.modals.addShelter.phoneLabel')}</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder={t('responderDashboardBatch.modals.addShelter.phonePlaceholder')} value={shelterForm.phone} onChange={e => setShelterForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowShelterModal(false)} className="flex-1 border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50">{t('common.cancel')}</button>
                <button type="submit" disabled={submittingShelter} className="flex-1 bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {submittingShelter ? t('responderDashboardBatch.modals.addShelter.adding') : t('responderDashboardBatch.modals.addShelter.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-accent to-orange-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t('responderDashboardBatch.header.title')}</h2>
            <p className="text-orange-100">{t('responderDashboardBatch.header.subtitle')}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <Lock className="w-8 h-8" />
            <p className="text-sm text-orange-200">{t('responderDashboardBatch.header.secureAccess')}</p>
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {loading ? t('common.loading') : t('responderDashboardBatch.header.refresh')}
            </Button>
          </div>
        </div>
        {usingDemo && (
          <p className="mt-3 text-xs text-orange-200 bg-orange-700/40 rounded px-3 py-1 inline-block">
            {t('responderDashboardBatch.header.demoBanner')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{t('responderDashboardBatch.metrics.activeAlerts')}</p>
              <p className="text-4xl font-bold text-red-600">{activeAlerts}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{t('responderDashboardBatch.metrics.registeredUsers')}</p>
              <p className="text-4xl font-bold text-blue-600">{totalUsers || 24}</p>
            </div>
            <Users className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{t('responderDashboardBatch.metrics.sheltersActive')}</p>
              <p className="text-4xl font-bold text-green-600">{sheltersStatus.length}</p>
            </div>
            <MapPin className="w-12 h-12 text-green-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{t('responderDashboardBatch.metrics.responseTime')}</p>
              <p className="text-4xl font-bold text-orange-600">4.2m</p>
            </div>
            <Zap className="w-12 h-12 text-orange-100" />
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('responderDashboardBatch.liveMonitoringTitle')}</h3>
        <DashboardPreview />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowAlertModal(true)}
          className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white rounded-lg p-5 text-base font-semibold transition-colors shadow"
        >
          <Plus className="w-5 h-5" />
          {t('responderDashboardBatch.quickActions.createFloodAlert')}
        </button>
        <button
          onClick={() => setShowShelterModal(true)}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-lg p-5 text-base font-semibold transition-colors shadow"
        >
          <Plus className="w-5 h-5" />
          {t('responderDashboardBatch.quickActions.addShelter')}
        </button>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('responderDashboardBatch.operationalTeams.title')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('responderDashboardBatch.operationalTeams.columns.squadName')}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('responderDashboardBatch.operationalTeams.columns.location')}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('responderDashboardBatch.operationalTeams.columns.status')}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('responderDashboardBatch.operationalTeams.columns.teams')}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('responderDashboardBatch.operationalTeams.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {operativesOnDuty.map((squad) => (
                <tr key={squad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{squad.name}</td>
                  <td className="px-4 py-3 text-gray-600">{squad.location}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      squad.status === 'active' ? 'bg-green-100 text-green-800' :
                      squad.status === 'response' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        squad.status === 'active' ? 'bg-green-600' :
                        squad.status === 'response' ? 'bg-red-600' :
                        'bg-yellow-600'
                      }`}></span>
                      {getSquadStatusLabel(squad.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{squad.teams}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline">
                      {t('responderDashboardBatch.operationalTeams.assignMission')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('responderDashboardBatch.shelterManagement.title')}</h3>
        <div className="space-y-4">
          {sheltersStatus.map((shelter) => (
            <div key={shelter.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{shelter.name}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  (shelter.status || 'operational') === 'operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getShelterStatusLabel(shelter.status)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  {(() => {
                    const current = shelter.current ?? shelter.currentOccupancy ?? 0;
                    const capacity = shelter.capacity || 1;
                    const percentage = Math.min(100, Math.max(0, (current / capacity) * 100));
                    return (
                      <>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-orange-500 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {current} / {capacity} ({Math.round(percentage)}%)
                        </p>
                      </>
                    );
                  })()}
                </div>
                <Button size="sm" variant="outline">
                  {t('responderDashboardBatch.shelterManagement.manage')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{t('responderDashboardBatch.incidentManagement.title')}</h3>
          <Button className="bg-red-600 hover:bg-red-700">
            {t('responderDashboardBatch.incidentManagement.reportNewIncident')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-red-900 mb-2">{t('responderDashboardBatch.incidentManagement.criticalTitle')}</h4>
                <p className="text-sm text-red-800 mb-3">{t('responderDashboardBatch.incidentManagement.criticalDescription')}</p>
                <p className="text-xs text-red-700">{t('responderDashboardBatch.incidentManagement.criticalReported')}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-orange-900 mb-2">{t('responderDashboardBatch.incidentManagement.responseTitle')}</h4>
                <p className="text-sm text-orange-800 mb-3">{t('responderDashboardBatch.incidentManagement.responseDescription')}</p>
                <p className="text-xs text-orange-700">{t('responderDashboardBatch.incidentManagement.responseReported')}</p>
              </div>
              <Zap className="w-6 h-6 text-orange-600 flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">{t('responderDashboardBatch.analytics.responseStatsTitle')}</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('responderDashboardBatch.analytics.responseTimeAverage')}</p>
              <p className="text-2xl font-bold text-blue-600">4.2 {t('responderDashboardBatch.analytics.minutes')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('responderDashboardBatch.analytics.successRate')}</p>
              <p className="text-2xl font-bold text-green-600">94.3%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('responderDashboardBatch.analytics.peopleAssistedToday')}</p>
              <p className="text-2xl font-bold text-amber-600">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">{t('responderDashboardBatch.analytics.scheduledOperationsTitle')}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span className="text-sm text-purple-900 font-medium">{t('responderDashboardBatch.analytics.perimeterPatrol')}</span>
              <span className="text-xs text-purple-700">14:30 - 16:00</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span className="text-sm text-purple-900 font-medium">{t('responderDashboardBatch.analytics.communityBriefing')}</span>
              <span className="text-xs text-purple-700">18:00 - 18:30</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span className="text-sm text-purple-900 font-medium">{t('responderDashboardBatch.analytics.shiftChange')}</span>
              <span className="text-xs text-purple-700">22:00 - 23:00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResponderDashboard;
