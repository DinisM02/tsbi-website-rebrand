import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../firebase/config';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { User, Mail, Shield, Calendar, Save, CheckCircle } from 'lucide-react';
import ScrollIndicator from '../components/ScrollIndicator';

const Profile = () => {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      if (user) {
        await updateProfile(user, { displayName: displayName.trim() });
      }
      if (isFirebaseEnabled && db && user?.uid) {
        await updateDoc(doc(db, 'users', user.uid), { displayName: displayName.trim() });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return t('profilePage.notAvailable');
    return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          {t('profilePage.title')}
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Avatar Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-primary">
                  {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-xl font-semibold">{user?.displayName || t('profilePage.userFallback')}</h2>
                <p className="text-blue-100 text-sm">{user?.email}</p>
                {userProfile?.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                    <Shield className="w-3 h-3" />
                    {t('profilePage.adminBadge')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <Label htmlFor="displayName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {t('profilePage.fields.displayName')}
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1"
                  placeholder={t('profilePage.placeholders.displayName')}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {t('profilePage.fields.email')}
                </Label>
                <Input value={user?.email || ''} disabled className="mt-1 bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">{t('profilePage.emailLocked')}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  {t('profilePage.fields.role')}
                </Label>
                <Input value={userProfile?.role === 'admin' ? t('profilePage.roles.admin') : t('profilePage.roles.user')} disabled className="mt-1 bg-gray-50" />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {t('profilePage.fields.memberSince')}
                </Label>
                <Input value={formatDate(userProfile?.createdAt)} disabled className="mt-1 bg-gray-50" />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      {t('profilePage.actions.saving')}
                    </span>
                  ) : saved ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {t('profilePage.actions.saved')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {t('profilePage.actions.saveChanges')}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default Profile;
