import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import AdminListPage from './AdminListPage';
import {
  getHazardReports,
  getIncidentReports,
  updateHazardReportStatus,
  updateIncidentReportStatus,
} from '../../firebase/firestore';

const AdminHazardReports = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [hazardData, incidentData] = await Promise.all([
        getHazardReports(),
        getIncidentReports(),
      ]);

      const normalizedIncidents = incidentData.map((incident) => ({
        ...incident,
        source: 'incidentReports',
        hazardType: incident.hazardType || incident.type,
        contactInfo: incident.contactInfo || '',
        photoUrls: Array.isArray(incident.photoUrls) ? incident.photoUrls : [],
      }));

      const normalizedHazards = hazardData.map((hazard) => ({
        ...hazard,
        source: 'hazardReports',
      }));

      const allReports = [...normalizedHazards, ...normalizedIncidents].sort((a, b) => {
        const aTime = a.createdAt?.seconds || a.timestamp?.seconds || 0;
        const bTime = b.createdAt?.seconds || b.timestamp?.seconds || 0;
        return bTime - aTime;
      });

      setItems(allReports);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, status, response, item) => {
    if (item?.source === 'incidentReports') {
      await updateIncidentReportStatus(id, status, response);
    } else {
      await updateHazardReportStatus(id, status, response);
    }
    await loadData();
  };

  return (
    <AdminListPage
      title="Hazard Reports"
      icon={AlertTriangle}
      items={items}
      loading={loading}
      onUpdateStatus={handleUpdate}
      allowedStatuses={['pending', 'reported', 'reviewed', 'in-progress', 'resolved', 'dismissed']}
      fields={[
        { key: 'hazardType', label: 'Hazard Type' },
        { key: 'severity', label: 'Severity' },
        { key: 'location', label: 'Location', fullWidth: true },
        { key: 'description', label: 'Description', fullWidth: true },
        { key: 'contactInfo', label: 'Contact Info' },
        { key: 'photoUrls', label: 'Photos', type: 'images', fullWidth: true },
      ]}
    />
  );
};

export default AdminHazardReports;
