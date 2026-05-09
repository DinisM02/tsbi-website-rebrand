import React, { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import AdminListPage from './AdminListPage';
import { getPartnerInquiries, updatePartnerInquiryStatus } from '../../firebase/firestore';

const AdminPartners = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getPartnerInquiries();
      setItems(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, status, response) => {
    await updatePartnerInquiryStatus(id, status, response);
    await loadData();
  };

  return (
    <AdminListPage
      title="Partner Inquiries"
      icon={Handshake}
      items={items}
      loading={loading}
      onUpdateStatus={handleUpdate}
      allowedStatuses={['new', 'in-progress', 'accepted', 'rejected']}
      fields={[
        { key: 'name', label: 'Contact Name' },
        { key: 'email', label: 'Email' },
        { key: 'organization', label: 'Organization' },
        { key: 'partnerType', label: 'Partnership Type' },
        { key: 'message', label: 'Message', fullWidth: true },
      ]}
    />
  );
};

export default AdminPartners;
