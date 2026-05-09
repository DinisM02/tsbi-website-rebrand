import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, MapPin, Camera, Clock, Phone, Send, CheckCircle } from 'lucide-react';
import { submitHazardReport } from '../firebase/firestore';
import { uploadHazardPhoto } from '../firebase/storage';
import { validateAndSubmitIncidentReport } from '../api/roleValidation';

const ReportHazard = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    hazardType: '',
    location: '',
    description: '',
    severity: '',
    contactInfo: '',
    images: null
  });

  const [submitted, setSubmitted] = useState(false);

  const hazardTypes = [
    t('reportHazardPage.hazardTypes.1'),
    t('reportHazardPage.hazardTypes.2'),
    t('reportHazardPage.hazardTypes.3'),
    t('reportHazardPage.hazardTypes.4'),
    t('reportHazardPage.hazardTypes.5'),
    t('reportHazardPage.hazardTypes.6'),
    t('reportHazardPage.hazardTypes.7'),
    t('reportHazardPage.hazardTypes.8'),
    t('reportHazardPage.hazardTypes.9')
  ];

  const severityLevels = [
    { value: 'low', label: t('reportHazardPage.severity.low'), color: 'text-green-600' },
    { value: 'medium', label: t('reportHazardPage.severity.medium'), color: 'text-yellow-600' },
    { value: 'high', label: t('reportHazardPage.severity.high'), color: 'text-orange-600' },
    { value: 'critical', label: t('reportHazardPage.severity.critical'), color: 'text-red-600' }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload photos if any
      let photoUrls = [];
      if (formData.images && formData.images.length > 0) {
        const tempId = Date.now().toString();
        const uploadPromises = Array.from(formData.images).map(file => uploadHazardPhoto(file, tempId));
        photoUrls = await Promise.all(uploadPromises);
      }
      await validateAndSubmitIncidentReport({
        type: formData.hazardType,
        location: formData.location,
        description: formData.description,
        severity: formData.severity,
        contactInfo: formData.contactInfo,
        photoUrls,
      });

      // Keep legacy hazardReports collection updated for existing admin workflows.
      await submitHazardReport({
        hazardType: formData.hazardType,
        location: formData.location,
        description: formData.description,
        severity: formData.severity,
        contactInfo: formData.contactInfo,
        photoUrls,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting hazard report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('reportHazardPage.success.title')}</h2>
          <p className="text-gray-600 mb-6">
            {t('reportHazardPage.success.description')}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {t('reportHazardPage.success.reportIdLabel')} #HR{Date.now().toString().slice(-6)}
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('reportHazardPage.success.reportAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-red-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('reportHazardPage.hero.title')}</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              {t('reportHazardPage.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 mx-4 sm:mx-6 lg:mx-8 -mt-8 relative z-10 rounded-lg shadow-lg">
        <div className="flex items-center">
          <Phone className="w-6 h-6 text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">{t('reportHazardPage.emergencyNotice.title')}</h3>
            <p className="text-red-700">
              {t('reportHazardPage.emergencyNotice.prefix')} <strong>911</strong> {t('reportHazardPage.emergencyNotice.suffix')}
            </p>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hazard Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                {t('reportHazardPage.form.hazardTypeLabel')}
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {hazardTypes.map((type) => (
                  <label key={type} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="hazardType"
                      value={type}
                      onChange={handleInputChange}
                      className="mr-3 text-primary focus:ring-primary"
                      required
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <MapPin className="w-5 h-5 inline mr-2" />
                {t('reportHazardPage.form.locationLabel')}
              </label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('reportHazardPage.form.locationPlaceholder')}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                rows="3"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {t('reportHazardPage.form.locationHelp')}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                {t('reportHazardPage.form.descriptionLabel')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('reportHazardPage.form.descriptionPlaceholder')}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                rows="5"
                required
              />
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Clock className="w-5 h-5 inline mr-2" />
                {t('reportHazardPage.form.urgencyLabel')}
              </label>
              <div className="space-y-3">
                {severityLevels.map((level) => (
                  <label key={level.value} className="flex items-start p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level.value}
                      onChange={handleInputChange}
                      className="mt-1 mr-3 text-primary focus:ring-primary"
                      required
                    />
                    <span className={`font-medium ${level.color}`}>{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                {t('reportHazardPage.form.contactLabel')}
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder={t('reportHazardPage.form.contactPlaceholder')}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <p className="text-sm text-gray-500 mt-2">
                {t('reportHazardPage.form.contactHelp')}
              </p>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Camera className="w-5 h-5 inline mr-2" />
                {t('reportHazardPage.form.photosLabel')}
              </label>
              <input
                type="file"
                name="images"
                onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.files }))}
                multiple
                accept="image/*"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <p className="text-sm text-gray-500 mt-2">
                {t('reportHazardPage.form.photosHelp')}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    {t('reportHazardPage.form.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t('reportHazardPage.form.submit')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">{t('reportHazardPage.nextSteps.title')}</h3>
            <ul className="space-y-2 text-blue-700">
              <li>â€¢ {t('reportHazardPage.nextSteps.items.1')}</li>
              <li>â€¢ {t('reportHazardPage.nextSteps.items.2')}</li>
              <li>â€¢ {t('reportHazardPage.nextSteps.items.3')}</li>
              <li>â€¢ {t('reportHazardPage.nextSteps.items.4')}</li>
              <li>â€¢ {t('reportHazardPage.nextSteps.items.5')}</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">{t('reportHazardPage.contacts.title')}</h3>
            <div className="space-y-2 text-green-700">
              <p><strong>{t('reportHazardPage.contacts.lifeThreatening')}</strong> 911</p>
              <p><strong>{t('reportHazardPage.contacts.nonEmergency')}</strong> support@hydrobeacon.org</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHazard;



