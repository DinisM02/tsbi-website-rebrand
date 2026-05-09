import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { requestPasswordResetOtp, resetPassword, resetPasswordWithOtp } from '../firebase/auth';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import ScrollIndicator from '../components/ScrollIndicator';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || sessionStorage.getItem('selectedRole');
  const loginHref = role ? `/login?role=${role}` : '/role-selection?next=login';
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState('otp');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('forgotPasswordPage.errors.enterEmail'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      await requestPasswordResetOtp(email);
      setDeliveryMode('otp');
      setOtpRequested(true);
    } catch (err) {
      const code = err?.code || '';
      if (code === 'functions/resource-exhausted') {
        setError(t('forgotPasswordPage.errors.tooManyRequests'));
      } else if (code === 'functions/invalid-argument') {
        setError(t('forgotPasswordPage.errors.invalidEmail'));
      } else if (code === 'functions/failed-precondition' || code === 'functions/unavailable' || code === 'functions/not-found' || code === 'functions/internal') {
        await resetPassword(email);
        setDeliveryMode('email-link');
        setSuccess(true);
      } else {
        setError(t('forgotPasswordPage.errors.unableStartOtp'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError(t('forgotPasswordPage.errors.invalidOtpFormat'));
      return;
    }
    if (newPassword.length < 8) {
      setError(t('forgotPasswordPage.errors.passwordMinLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('forgotPasswordPage.errors.passwordMismatch'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPasswordWithOtp(email, otp, newPassword);
      setSuccess(true);
    } catch (err) {
      const code = err?.code || '';
      if (code === 'functions/deadline-exceeded') {
        setError(t('forgotPasswordPage.errors.otpExpired'));
      } else if (code === 'functions/permission-denied') {
        setError(t('forgotPasswordPage.errors.invalidOtpCode'));
      } else if (code === 'functions/resource-exhausted') {
        setError(t('forgotPasswordPage.errors.tooManyFailedAttempts'));
      } else {
        setError(t('forgotPasswordPage.errors.unableResetWithOtp'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('forgotPasswordPage.title')}</h1>
          <p className="mt-2 text-gray-600">
            {success
              ? t('forgotPasswordPage.subtitle.success')
              : otpRequested
                ? t('forgotPasswordPage.subtitle.otpRequested')
                : t('forgotPasswordPage.subtitle.default')}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{t('forgotPasswordPage.success.title')}</h2>
              <p className="text-sm text-gray-600">
                {deliveryMode === 'otp'
                  ? t('forgotPasswordPage.success.otpMessage')
                  : <>{t('forgotPasswordPage.success.emailLinkPrefix')} <strong>{email}</strong>. {t('forgotPasswordPage.success.emailLinkSuffix')}</>}
              </p>
              {deliveryMode === 'email-link' && (
                <p className="text-xs text-gray-500">
                  {t('forgotPasswordPage.success.emailLinkHint')}
                </p>
              )}
              <Link
                to={loginHref}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('forgotPasswordPage.backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {!otpRequested ? (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('forgotPasswordPage.fields.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                      placeholder={t('forgotPasswordPage.placeholders.email')}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-medium transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        {t('forgotPasswordPage.actions.sendingOtp')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t('forgotPasswordPage.actions.sendOtpCode')}
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetWithOtp} className="space-y-5">
                  <div>
                    <Label htmlFor="email-otp" className="text-sm font-medium text-gray-700">{t('forgotPasswordPage.fields.email')}</Label>
                    <Input
                      id="email-otp"
                      type="email"
                      value={email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="otp" className="text-sm font-medium text-gray-700">{t('forgotPasswordPage.fields.otp')}</Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (error) setError('');
                      }}
                      placeholder={t('forgotPasswordPage.placeholders.otp')}
                      className="mt-1 tracking-[0.3em] text-center"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">{t('forgotPasswordPage.fields.newPassword')}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={t('forgotPasswordPage.placeholders.newPassword')}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">{t('forgotPasswordPage.fields.confirmNewPassword')}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={t('forgotPasswordPage.placeholders.confirmPassword')}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-medium transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        {t('forgotPasswordPage.actions.verifyingOtp')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        {t('forgotPasswordPage.actions.verifyOtpAndReset')}
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleRequestOtp}
                    disabled={loading}
                  >
                    {t('forgotPasswordPage.actions.resendOtp')}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link
                  to={loginHref}
                  className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('forgotPasswordPage.backToLogin')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default ForgotPassword;

