import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorBoundaryContent = ({ error }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{t('errorBoundary.title')}</h1>
        <p className="text-gray-600 mb-4 text-sm">{error?.message || t('errorBoundary.genericMessage')}</p>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="bg-[#0084B6] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          {t('errorBoundary.goHome')}
        </button>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryContent error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
