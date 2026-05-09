import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../firebase/auth';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Eye, EyeOff, UserPlus, AlertCircle, Check, LockKeyhole, ShieldAlert } from 'lucide-react';
import ScrollIndicator from '../components/ScrollIndicator';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || sessionStorage.getItem('selectedRole');

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    skills: [],
    availability: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!role) {
    return <Navigate to="/role-selection?next=signup" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const helperSkills = [
    t('signUpPage.helperOptions.skills.firstAid'),
    t('signUpPage.helperOptions.skills.driving'),
    t('signUpPage.helperOptions.skills.translation'),
    t('signUpPage.helperOptions.skills.cooking'),
    t('signUpPage.helperOptions.skills.logistics'),
    t('signUpPage.helperOptions.skills.medical'),
    t('signUpPage.helperOptions.skills.childcare')
  ];
  const helperAvailability = [
    t('signUpPage.helperOptions.availability.weekdays'),
    t('signUpPage.helperOptions.availability.weekends'),
    t('signUpPage.helperOptions.availability.onCall')
  ];

  const toggleMultiValue = (field, value) => {
    setFormData((prev) => {
      const currentValues = prev[field] || [];
      const exists = currentValues.includes(value);
      return {
        ...prev,
        [field]: exists
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
    if (error) setError('');
  };

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t('signUpPage.errors.fillAllFields'));
      return;
    }
    if (!isPasswordStrong) {
      setError(t('signUpPage.errors.passwordRequirements'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('signUpPage.errors.passwordMismatch'));
      return;
    }
    if (role === 'helper' && formData.skills.length === 0) {
      setError(t('signUpPage.errors.selectSkill'));
      return;
    }
    if (role === 'helper' && formData.availability.length === 0) {
      setError(t('signUpPage.errors.selectAvailability'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerUser(formData.email, formData.password, formData.displayName, role, {
        organization: formData.organization,
        skills: formData.skills,
        availability: formData.availability,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('SignUp error:', err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError(t('signUpPage.errors.emailExists'));
      } else if (err.code === 'auth/weak-password') {
        setError(t('signUpPage.errors.weakPassword'));
      } else if (err.code === 'auth/invalid-email') {
        setError(t('signUpPage.errors.invalidEmail'));
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/admin-restricted-operation') {
        setError(t('signUpPage.errors.signInNotEnabled'));
      } else if (err.code === 'auth/network-request-failed') {
        setError(t('signUpPage.errors.networkError'));
      } else {
        setError(err.message || t('signUpPage.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  const PasswordCheck = ({ passed, label }) => (
    <div className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-600' : 'text-gray-400'}`}>
      <Check className={`w-3 h-3 ${passed ? 'opacity-100' : 'opacity-30'}`} />
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-0 min-h-screen">
        {/* Left Panel: Hero Section */}
        <div className="hidden lg:flex flex-col justify-center px-8 relative overflow-hidden bg-gradient-to-br from-primary/95 to-primary">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <LockKeyhole className="w-4 h-4 text-white" />
                <span className="text-xs font-medium text-white">{t('signUpPage.badges.secureEnrollment')}</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                {role === 'responder'
                  ? t('signUpPage.roleHeadlines.responder')
                  : role === 'helper'
                    ? t('signUpPage.roleHeadlines.helper')
                    : t('signUpPage.roleHeadlines.resident')}
              </h2>

              <p className="text-lg text-white/90 leading-relaxed">
                {role === 'responder'
                  ? t('signUpPage.roleDescriptions.responder')
                  : role === 'helper'
                    ? t('signUpPage.roleDescriptions.helper')
                    : t('signUpPage.roleDescriptions.resident')}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-xs text-white/70 font-medium uppercase tracking-wide">{t('signUpPage.info.accountRole')}</p>
                <p className="mt-1 text-white font-semibold">
                  {role === 'resident'
                    ? t('signUpPage.roles.localResident')
                    : role === 'responder'
                      ? t('signUpPage.roles.emergencyResponder')
                      : t('signUpPage.roles.volunteerHelper')}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium uppercase tracking-wide">{t('signUpPage.info.accessLevel')}</p>
                <p className="mt-1 text-white font-semibold">
                  {role === 'responder' ? t('signUpPage.accessLevels.restrictedOperational') : t('signUpPage.accessLevels.community')}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-white/70 font-medium uppercase tracking-wide">{t('signUpPage.info.verification')}</p>
                <p className="mt-1 text-white font-semibold">{t('signUpPage.info.verificationValue')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Sign-Up Form */}
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/* Mobile Role Badge */}
            <div className="lg:hidden text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <LockKeyhole className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">{t('signUpPage.badges.secureEnrollment')}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('signUpPage.createAccount')}</h1>
              <p className="text-sm text-gray-600">
                {role === 'resident'
                  ? t('signUpPage.roles.localResident')
                  : role === 'responder'
                    ? t('signUpPage.roles.emergencyResponder')
                    : t('signUpPage.roles.volunteerHelper')}
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{t('signUpPage.createAccount')}</h1>
              <p className="text-gray-600">{t('signUpPage.joinTsbi')}</p>
            </div>

            {/* Responder Warning */}
            {role === 'responder' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">{t('signUpPage.responderNotice.title')}</p>
                  <p className="text-amber-700">
                    {t('signUpPage.responderNotice.description')}
                  </p>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">{t('signUpPage.form.fullName')}</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="name"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder={t('signUpPage.form.placeholders.fullName')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('signUpPage.form.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('signUpPage.form.placeholders.email')}
                    className="mt-1"
                  />
                </div>

                {role === 'helper' && (
                  <>
                    <div>
                      <Label htmlFor="organization" className="text-sm font-medium text-gray-700">{t('signUpPage.form.organization')}</Label>
                      <Input
                        id="organization"
                        name="organization"
                        type="text"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder={t('signUpPage.form.placeholders.organization')}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">{t('signUpPage.form.skills')}</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {helperSkills.map((skill) => (
                          <label key={skill} className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={formData.skills.includes(skill)}
                              onChange={() => toggleMultiValue('skills', skill)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span>{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">{t('signUpPage.form.availability')}</Label>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {helperAvailability.map((slot) => (
                          <label key={slot} className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={formData.availability.includes(slot)}
                              onChange={() => toggleMultiValue('availability', slot)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span>{slot}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t('signUpPage.form.password')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t('signUpPage.form.placeholders.password')}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      <PasswordCheck passed={passwordChecks.length} label={t('signUpPage.passwordChecks.length')} />
                      <PasswordCheck passed={passwordChecks.uppercase} label={t('signUpPage.passwordChecks.uppercase')} />
                      <PasswordCheck passed={passwordChecks.lowercase} label={t('signUpPage.passwordChecks.lowercase')} />
                      <PasswordCheck passed={passwordChecks.number} label={t('signUpPage.passwordChecks.number')} />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">{t('signUpPage.form.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('signUpPage.form.placeholders.confirmPassword')}
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
                      {t('signUpPage.form.creatingAccount')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      {t('signUpPage.createAccount')}
                    </span>
                  )}
                </Button>
              </form>

              <p className="mt-4 text-xs text-gray-500 text-center">
                {t('signUpPage.legal.prefix')}{' '}
                <Link to="/terms-of-service" className="text-primary hover:underline">{t('signUpPage.legal.terms')}</Link>{' '}
                {t('signUpPage.legal.and')}{' '}
                <Link to="/privacy-policy" className="text-primary hover:underline">{t('signUpPage.legal.privacy')}</Link>.
              </p>

              <div className="mt-4 text-center text-sm text-gray-600">
                {t('signUpPage.haveAccount')}{' '}
                <Link to={`/login?role=${role}`} className="text-primary font-medium hover:underline">
                  {t('signUpPage.signIn')}
                </Link>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  sessionStorage.removeItem('selectedRole');
                  navigate('/role-selection?next=signup');
                }}
                className="w-full mt-4 text-gray-600 hover:text-primary"
              >
                {t('signUpPage.changeRole')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default SignUp;

