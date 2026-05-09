import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import AdminListPage from './AdminListPage';
import { getTrainingRequests, updateTrainingRequestStatus } from '../../firebase/firestore';

const AdminTraining = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getTrainingRequests();
      setItems(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, status, response) => {
    await updateTrainingRequestStatus(id, status, response);
    await loadData();
  };

  return (
    <AdminListPage
      title="Training Requests"
      icon={GraduationCap}
      items={items}
      loading={loading}
      onUpdateStatus={handleUpdate}
      allowedStatuses={['new', 'in-progress', 'completed', 'rejected']}
      fields={[
        { key: 'name', label: 'Contact Name' },
        { key: 'email', label: 'Email' },
        { key: 'organization', label: 'Organization' },
        { key: 'role', label: 'Role' },
        { key: 'phone', label: 'Phone' },
        { key: 'region', label: 'Region' },
        { key: 'areaType', label: 'Area Type' },
        { key: 'traineeTypes', label: 'Trainee Types' },
        { key: 'groupSize', label: 'Group Size' },
        { key: 'focusAreas', label: 'Focus Areas' },
        { key: 'timing', label: 'When Needed' },
        { key: 'deviceType', label: 'Device Type' },
        { key: 'preferredFormat', label: 'Preferred Format' },
        { key: 'timeline', label: 'Timeline' },
        { key: 'challenge', label: 'Biggest Challenge', fullWidth: true },
      ]}
    />
  );
};

export default AdminTraining;
