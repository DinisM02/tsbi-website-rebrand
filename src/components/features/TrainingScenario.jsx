import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Shield } from 'lucide-react';

const TrainingScenario = ({ onClose }) => {
  const { t } = useTranslation();
  const scenarios = [
    {
      id: 'flash-flood',
      title: t('trainingScenario.scenarios.flashFlood.title'),
      icon: '🌊',
      description: t('trainingScenario.scenarios.flashFlood.description'),
      steps: [
        {
          question: t('trainingScenario.scenarios.flashFlood.steps.1.question'),
          options: [
            { text: t('trainingScenario.scenarios.flashFlood.steps.1.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.1.options.2'), correct: true },
            { text: t('trainingScenario.scenarios.flashFlood.steps.1.options.3'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.1.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.flashFlood.steps.1.explanation')
        },
        {
          question: t('trainingScenario.scenarios.flashFlood.steps.2.question'),
          options: [
            { text: t('trainingScenario.scenarios.flashFlood.steps.2.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.2.options.2'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.2.options.3'), correct: true },
            { text: t('trainingScenario.scenarios.flashFlood.steps.2.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.flashFlood.steps.2.explanation')
        },
        {
          question: t('trainingScenario.scenarios.flashFlood.steps.3.question'),
          options: [
            { text: t('trainingScenario.scenarios.flashFlood.steps.3.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.3.options.2'), correct: true },
            { text: t('trainingScenario.scenarios.flashFlood.steps.3.options.3'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.3.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.flashFlood.steps.3.explanation')
        },
        {
          question: t('trainingScenario.scenarios.flashFlood.steps.4.question'),
          options: [
            { text: t('trainingScenario.scenarios.flashFlood.steps.4.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.4.options.2'), correct: true },
            { text: t('trainingScenario.scenarios.flashFlood.steps.4.options.3'), correct: false },
            { text: t('trainingScenario.scenarios.flashFlood.steps.4.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.flashFlood.steps.4.explanation')
        }
      ]
    },
    {
      id: 'emergency-shelter',
      title: t('trainingScenario.scenarios.emergencyShelter.title'),
      icon: '🏠',
      description: t('trainingScenario.scenarios.emergencyShelter.description'),
      steps: [
        {
          question: t('trainingScenario.scenarios.emergencyShelter.steps.1.question'),
          options: [
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.1.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.1.options.2'), correct: true },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.1.options.3'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.1.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.emergencyShelter.steps.1.explanation')
        },
        {
          question: t('trainingScenario.scenarios.emergencyShelter.steps.2.question'),
          options: [
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.2.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.2.options.2'), correct: true },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.2.options.3'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.2.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.emergencyShelter.steps.2.explanation')
        },
        {
          question: t('trainingScenario.scenarios.emergencyShelter.steps.3.question'),
          options: [
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.3.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.3.options.2'), correct: true },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.3.options.3'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.3.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.emergencyShelter.steps.3.explanation')
        },
        {
          question: t('trainingScenario.scenarios.emergencyShelter.steps.4.question'),
          options: [
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.4.options.1'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.4.options.2'), correct: true },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.4.options.3'), correct: false },
            { text: t('trainingScenario.scenarios.emergencyShelter.steps.4.options.4'), correct: false }
          ],
          explanation: t('trainingScenario.scenarios.emergencyShelter.steps.4.explanation')
        }
      ]
    }
  ];
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  const handleAnswer = (option, index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (option.correct) setScore((s) => s + 1);
  };

  const nextStep = () => {
    if (currentStep + 1 >= selectedScenario.steps.length) {
      setCompleted(true);
    } else {
      setCurrentStep((s) => s + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  // Scenario selection screen
  if (!selectedScenario) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('trainingScenario.ui.emergencyTraining')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <p className="text-gray-600 mb-6">{t('trainingScenario.ui.chooseScenario')}</p>
          <div className="space-y-3">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{s.title}</div>
                    <div className="text-sm text-gray-500">{s.description}</div>
                    <div className="text-xs text-purple-600 mt-1">{s.steps.length} {t('trainingScenario.ui.questions')}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Completed screen
  if (completed) {
    const total = selectedScenario.steps.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-center">
          <div className="text-5xl mb-4">{pct >= 75 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {pct >= 75 ? t('trainingScenario.ui.results.excellent') : pct >= 50 ? t('trainingScenario.ui.results.goodJob') : t('trainingScenario.ui.results.keepPracticing')}
          </h2>
          <p className="text-gray-600 mb-2">
            {t('trainingScenario.ui.results.youScored')} <span className="font-bold text-purple-600">{score}/{total}</span> ({pct}%)
          </p>
          <p className="text-sm text-gray-500 mb-6">{selectedScenario.title}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <RotateCcw className="w-4 h-4" /> {t('trainingScenario.ui.results.tryAgain')}
            </button>
            <button
              onClick={() => setSelectedScenario(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              {t('trainingScenario.ui.results.otherScenarios')}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              {t('trainingScenario.ui.close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const step = selectedScenario.steps[currentStep];
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {selectedScenario.icon} {selectedScenario.title} - {t('trainingScenario.ui.question')} {currentStep + 1}/{selectedScenario.steps.length}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / selectedScenario.steps.length) * 100}%` }}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">{step.question}</h3>

        <div className="space-y-2">
          {step.options.map((opt, i) => {
            let style = 'border-gray-200 hover:border-purple-300 hover:bg-purple-50';
            if (selectedAnswer !== null) {
              if (opt.correct) style = 'border-green-400 bg-green-50';
              else if (i === selectedAnswer && !opt.correct) style = 'border-red-400 bg-red-50';
              else style = 'border-gray-200 opacity-50';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt, i)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm flex items-start gap-2 ${style}`}
              >
                {selectedAnswer !== null && opt.correct && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                {selectedAnswer !== null && i === selectedAnswer && !opt.correct && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                {selectedAnswer === null && <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs text-gray-400">{String.fromCharCode(65 + i)}</span>}
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">{step.explanation}</p>
            </div>
          </div>
        )}

        {showExplanation && (
          <button
            onClick={nextStep}
            className="mt-4 w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2"
          >
            {currentStep + 1 >= selectedScenario.steps.length ? t('trainingScenario.ui.seeResults') : t('trainingScenario.ui.nextQuestion')}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainingScenario;
