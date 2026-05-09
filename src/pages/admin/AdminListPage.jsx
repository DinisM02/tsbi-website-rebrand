import React, { useState } from 'react';
import { ArrowLeft, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import ScrollIndicator from '../../components/ScrollIndicator';

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-100 text-blue-700' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  { value: 'dismissed', label: 'Dismissed', color: 'bg-red-100 text-red-700' },
];

const getStatusColor = (status) => {
  return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
};

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const AdminListPage = ({
  title,
  icon: Icon,
  items,
  loading,
  fields,
  onUpdateStatus,
  allowedStatuses = ['new', 'in-progress', 'resolved'],
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all' ? items : items.filter(i => i.status === filter);

  const handleUpdate = async (item) => {
    if (!selectedStatus) return;
    setUpdating(true);
    try {
      await onUpdateStatus(item.id, selectedStatus, responseText, item);
      setExpandedId(null);
      setResponseText('');
      setSelectedStatus('');
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {Icon && <Icon className="w-6 h-6 text-primary" />}
              {title}
            </h1>
            <p className="text-sm text-gray-500">{filteredItems.length} of {items.length} items</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            All ({items.length})
          </button>
          {allowedStatuses.map(s => {
            const count = items.filter(i => i.status === s).length;
            if (count === 0) return null;
            const opt = statusOptions.find(o => o.value === s);
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-primary text-white' : `bg-white text-gray-600 hover:bg-gray-100 border border-gray-200`}`}
              >
                {opt?.label || s} ({count})
              </button>
            );
          })}
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-12 text-center text-gray-500">
              No items found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Summary row */}
                <button
                  onClick={() => {
                    setExpandedId(expandedId === item.id ? null : item.id);
                    setSelectedStatus(item.status || '');
                    setResponseText(item.adminResponse || '');
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'new' || item.status === 'pending' ? 'bg-yellow-400' : item.status === 'resolved' || item.status === 'completed' || item.status === 'accepted' ? 'bg-green-400' : 'bg-blue-400'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fields.slice(0, 2).map(f => item[f.key]).filter(Boolean).join(' — ')}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {/* Expanded details */}
                {expandedId === item.id && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {fields.map(f => (
                        <div key={f.key} className={f.fullWidth ? 'md:col-span-2' : ''}>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{f.label}</p>
                          {f.type === 'images' && Array.isArray(item[f.key]) ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item[f.key].map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">{item[f.key] || '—'}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Admin response */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Admin Response</p>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write a response..."
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        rows={3}
                      />
                      <div className="flex items-center gap-3 mt-3">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          {allowedStatuses.map(s => {
                            const opt = statusOptions.find(o => o.value === s);
                            return <option key={s} value={s}>{opt?.label || s}</option>;
                          })}
                        </select>
                        <Button
                          onClick={() => handleUpdate(item)}
                          disabled={updating}
                          className="bg-primary hover:bg-primary/90 text-white text-sm px-4"
                        >
                          {updating ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                              Updating...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send className="w-3 h-3" />
                              Update
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default AdminListPage;
