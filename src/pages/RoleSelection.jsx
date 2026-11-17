import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, HeartHandshake, ChevronRight, LockKeyhole, BadgeCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { OptimizedImage } from '../components/OptimizedImage';
import heroImage from '../assets/hero-images/pages/contact-hero.jpg';
import heroImageWebp from '../assets/hero-images/pages/contact-hero.webp';

const RoleSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') === 'signup' ? 'signup' : 'login';

  const nextRoute = next === 'signup' ? '/signup' : '/login';
  const nextLabel = next === 'signup' ? t('roleSelection.info.create') : t('roleSelection.info.signin');

  const handleRoleSelect = (role) => {
    sessionStorage.setItem('selectedRole', role);
    navigate(`${nextRoute}?role=${role}`);
  };

  const accessOptions = [
    {
      role: 'resident',
      title: t('roleSelection.resident.title'),
      description: t('roleSelection.resident.description'),
      icon: Shield,
      iconWrap: 'bg-sky-100 text-sky-700',
      border: 'hover:border-sky-400 hover:bg-sky-50/70',
      badge: t('roleSelection.resident.badge'),
    },
    {
      role: 'responder',
      title: t('roleSelection.responder.title'),
      description: t('roleSelection.responder.description'),
      icon: Zap,
      iconWrap: 'bg-amber-100 text-amber-700',
      border: 'hover:border-amber-400 hover:bg-amber-50/70',
      badge: t('roleSelection.responder.badge'),
    },
    {
      role: 'helper',
      title: t('roleSelection.helper.title'),
      description: t('roleSelection.helper.description'),
      icon: HeartHandshake,
      iconWrap: 'bg-emerald-100 text-emerald-700',
      border: 'hover:border-emerald-400 hover:bg-emerald-50/70',
      badge: t('roleSelection.helper.badge'),
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef5f8_0%,#f6f8fa_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="relative overflow-hidden rounded-[28px] bg-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.28)] min-h-[320px] lg:min-h-[720px]">
            <OptimizedImage
              webpSrc={heroImageWebp}
              fallbackSrc={heroImage}
              alt="Vigia secure role-based access"
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,26,35,0.12)_0%,rgba(3,26,35,0.62)_55%,rgba(3,26,35,0.88)_100%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  <BadgeCheck className="h-4 w-4" />
                  {t('roleSelection.tsbiGateway')}
                </div>
                <div className="hidden rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80 sm:block">
                  {t('roleSelection.roleBasedAccess')}
                </div>
              </div>

              <div className="max-w-xl">
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {t('roleSelection.mainTitle')}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/82 sm:text-lg">
                  {t('roleSelection.mainDescription')}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t('roleSelection.info.residents.label')}</p>
                    <p className="mt-2 text-sm text-white/90">{t('roleSelection.alertsShelt')}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t('roleSelection.info.responders.label')}</p>
                    <p className="mt-2 text-sm text-white/90">{t('roleSelection.restrictedDash')}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t('roleSelection.info.partners.label')}</p>
                    <p className="mt-2 text-sm text-white/90">{t('roleSelection.volunteerOutreach')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-[28px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                <LockKeyhole className="h-3.5 w-3.5" />
                {t('roleSelection.secureEntry')}
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {t('roleSelection.howtitle')}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {t('roleSelection.howDescription', { defaultValue: `Choose your access path first, then continue to ${nextLabel}. This supports role-based access control, privacy separation, and agency-grade governance.` })}
              </p>

              <div className="mt-8 space-y-4">
                {accessOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.role}
                      type="button"
                      onClick={() => handleRoleSelect(option.role)}
                      className={`group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 ${option.border}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${option.iconWrap}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{option.title}</h3>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{option.description}</p>
                            </div>
                            <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-600" />
                          </div>
                          <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {option.badge}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-900">{t('common.warning')}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {t('roleSelection.securityNote')}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">{t('roleSelection.changeLater')}</p>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="justify-start px-0 text-slate-600 hover:text-primary sm:justify-end"
                >
                  {t('roleSelection.backToHome')}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;


