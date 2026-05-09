import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import AdminListPage from './AdminListPage';
import { getContacts, updateContactStatus } from '../../firebase/firestore';

const AdminContacts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getContacts();
      setItems(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, status, response) => {
    await updateContactStatus(id, status, response);
    await loadData();
  };

  return (
    <AdminListPage
      title="Contact Messages"
      icon={Mail}
      items={items}
      loading={loading}
      onUpdateStatus={handleUpdate}
      allowedStatuses={['new', 'in-progress', 'resolved', 'dismissed']}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message', fullWidth: true },
      ]}
    />
  );
};

export default AdminContacts;
