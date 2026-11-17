import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, AlertTriangle, Shield, User, ChevronDown, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import vigiaLogo from '../assets/vigia-logo.svg';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const navigation = [
    { name: t('header.home'), href: '/' },
    { name: t('header.about'), href: '/about' },
    { name: t('header.resources'), href: '/resources' },
    { name: t('header.training'), href: '/training' },
    { name: t('header.blog'), href: '/blog' },
    { name: t('header.contact'), href: '/contact' },
  ];

  const isActivePage = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || t('header.userFallback');

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={vigiaLogo}
                alt="Vigia Moçambique"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative text-gray-700 hover:text-primary font-medium transition-colors hover:bg-secondary px-2 lg:px-3 py-2 rounded-md text-sm lg:text-base ${
                  isActivePage(item.href) ? 'text-primary' : ''
                }`}
              >
                {item.name}
                {isActivePage(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <LanguageSwitcher />
            <Link to="/report-hazard">
              <Button 
                variant="outline" 
                size="sm" 
                className="btn-emergency border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600 text-xs lg:text-sm px-2 lg:px-3"
              >
                <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">{t('header.emergency')}</span>
                <span className="lg:hidden">SOS</span>
              </Button>
            </Link>
            
            {!user ? (
              <Link to="/role-selection">
                <button 
                  className="bg-primary text-white px-3 lg:px-4 py-2 rounded-md font-medium transition-all duration-300 h-8 lg:h-9 text-xs lg:text-sm hover:bg-[#B4E2F6] hover:text-[#031A23]"
                >
                  {t('header.login')}
                </button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 lg:gap-2 bg-white border border-gray-200 rounded-lg px-2 lg:px-3 py-2 hover:bg-gray-50 hover:border-primary transition-all duration-200 cursor-pointer h-8 lg:h-9"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{userInitial}</span>
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-700 hidden lg:inline max-w-[100px] truncate">{userName}</span>
                  <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">{t('header.admin')}</span>
                        )}
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t('header.dashboard')}
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        {t('header.profile')}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t('header.adminDashboard')}
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('header.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none focus:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 font-medium transition-colors rounded-md ${
                    isActivePage(item.href) 
                      ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                <div className="flex justify-end mb-2">
                  <LanguageSwitcher />
                </div>
                <Link to="/report-hazard" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-red-500 text-red-500 hover:bg-red-50 mb-2"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {t('header.emergency')}
                  </Button>
                </Link>
                {!user ? (
                  <Link to="/role-selection" onClick={() => setIsMenuOpen(false)} className="block">
                    <button 
                      className="bg-primary text-white px-4 py-2 rounded-md font-medium transition-all duration-300 w-full hover:bg-[#B4E2F6] hover:text-[#031A23]"
                    >
                      {t('header.login')}
                    </button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{userInitial}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 block">{userName}</span>
                        {isAdmin && (
                          <span className="text-xs text-primary font-medium">{t('header.admin')}</span>
                        )}
                      </div>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      {t('header.dashboard')}
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      {t('header.profile')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        {t('header.adminDashboard')}
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                      {t('header.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;