import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Mail, AlertTriangle, GraduationCap, Heart, Handshake,
  FileText, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Eye
} from 'lucide-react';
import { getContacts } from '../../firebase/firestore';
import { getHazardReports } from '../../firebase/firestore';
import { getIncidentReports } from '../../firebase/firestore';
import { getTrainingRequests } from '../../firebase/firestore';
import { getVolunteerApplications } from '../../firebase/firestore';
import { getPartnerInquiries } from '../../firebase/firestore';
import { getBlogPosts } from '../../firebase/firestore';
import { getUsers } from '../../firebase/firestore';
import ScrollIndicator from '../../components/ScrollIndicator';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    contacts: { total: 0, new: 0 },
    hazardReports: { total: 0, pending: 0 },
    trainingRequests: { total: 0, new: 0 },
    volunteers: { total: 0, new: 0 },
    partners: { total: 0, new: 0 },
    blogPosts: { total: 0 },
    users: { total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [contacts, hazards, incidents, training, volunteers, partners, blogs, users] = await Promise.all([
        getContacts(),
        getHazardReports(),
        getIncidentReports(),
        getTrainingRequests(),
        getVolunteerApplications(),
        getPartnerInquiries(),
        getBlogPosts(),
        getUsers(),
      ]);

      const totalHazards = [...hazards, ...incidents];
      const pendingHazards = totalHazards.filter(h => h.status === 'pending' || h.status === 'reported');

      setStats({
        contacts: { total: contacts.length, new: contacts.filter(c => c.status === 'new').length },
        hazardReports: { total: totalHazards.length, pending: pendingHazards.length },
        trainingRequests: { total: training.length, new: training.filter(t => t.status === 'new').length },
        volunteers: { total: volunteers.length, new: volunteers.filter(v => v.status === 'new').length },
        partners: { total: partners.length, new: partners.filter(p => p.status === 'new').length },
        blogPosts: { total: blogs.length },
        users: { total: users.length },
      });

      // Build recent items from all collections
      const all = [
        ...contacts.map(c => ({ ...c, _type: 'contact', _label: `Contact: ${c.subject || c.name}` })),
        ...hazards.map(h => ({ ...h, _type: 'hazard', _label: `Hazard: ${h.hazardType || 'Report'}` })),
        ...incidents.map(i => ({ ...i, _type: 'hazard', _label: `Hazard: ${i.hazardType || i.type || 'Report'}` })),
        ...training.map(t => ({ ...t, _type: 'training', _label: `Training: ${t.name || t.organization || 'Request'}` })),
        ...volunteers.map(v => ({ ...v, _type: 'volunteer', _label: `Volunteer: ${v.name || v.opportunity}` })),
        ...partners.map(p => ({ ...p, _type: 'partner', _label: `Partner: ${p.organization || p.name}` })),
      ].sort((a, b) => {
        const aTime = a.createdAt?.seconds || a.timestamp?.seconds || 0;
        const bTime = b.createdAt?.seconds || b.timestamp?.seconds || 0;
        return bTime - aTime;
      }).slice(0, 10);

      setRecentItems(all);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Contact Messages', icon: Mail, total: stats.contacts.total, badge: stats.contacts.new, badgeLabel: 'new', link: '/admin/contacts', color: 'bg-blue-500' },
    { title: 'Hazard Reports', icon: AlertTriangle, total: stats.hazardReports.total, badge: stats.hazardReports.pending, badgeLabel: 'pending', link: '/admin/hazard-reports', color: 'bg-red-500' },
    { title: 'Training Requests', icon: GraduationCap, total: stats.trainingRequests.total, badge: stats.trainingRequests.new, badgeLabel: 'new', link: '/admin/training', color: 'bg-orange-500' },
    { title: 'Volunteer Apps', icon: Heart, total: stats.volunteers.total, badge: stats.volunteers.new, badgeLabel: 'new', link: '/admin/volunteers', color: 'bg-pink-500' },
    { title: 'Partner Inquiries', icon: Handshake, total: stats.partners.total, badge: stats.partners.new, badgeLabel: 'new', link: '/admin/partners', color: 'bg-purple-500' },
    { title: 'Blog Posts', icon: FileText, total: stats.blogPosts.total, badge: null, badgeLabel: '', link: '/admin/blog', color: 'bg-green-500' },
    { title: 'Users', icon: Users, total: stats.users.total, badge: null, badgeLabel: '', link: '/admin/users', color: 'bg-indigo-500' },
  ];

  const formatDate = (timestamp) => {
    const safeTimestamp = timestamp?.seconds ? timestamp : null;
    if (!safeTimestamp) return 'N/A';
    return new Date(safeTimestamp.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusColor = (status) => {
    switch (status) {
      case 'new': case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-progress': case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'resolved': case 'completed': case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': case 'dismissed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-600">Manage your platform from one place</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <Link key={card.title} to={card.link} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.total}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              {card.badge > 0 && (
                <div className="mt-3 flex items-center gap-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {card.badge} {card.badgeLabel}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentItems.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <p>No activity yet. Data will appear here as users interact with the platform.</p>
              </div>
            ) : (
              recentItems.map((item) => (
                <div key={item.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'new' || item.status === 'pending' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                    <span className="text-sm text-gray-900 truncate">{item._label}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(item.createdAt || item.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default AdminDashboard;
