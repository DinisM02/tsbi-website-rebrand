import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import AdminListPage from './AdminListPage';
import { getVolunteerApplications, updateVolunteerApplicationStatus } from '../../firebase/firestore';

const AdminVolunteers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getVolunteerApplications();
      setItems(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, status, response) => {
    await updateVolunteerApplicationStatus(id, status, response);
    await loadData();
  };

  return (
    <AdminListPage
      title="Volunteer Applications"
      icon={Heart}
      items={items}
      loading={loading}
      onUpdateStatus={handleUpdate}
      allowedStatuses={['new', 'in-progress', 'accepted', 'rejected']}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'opportunity', label: 'Position Applied' },
        { key: 'experience', label: 'Experience' },
        { key: 'availability', label: 'Availability' },
        { key: 'message', label: 'Cover Message', fullWidth: true },
      ]}
    />
  );
};

export default AdminVolunteers;
