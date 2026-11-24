import React from 'react';
import { User, Activity, HeartPulse, FileText, CheckCircle2 } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onSelectStep?: (step: number) => void;
}

const steps = [
  { id: 1, label: '基本資料', icon: User },
  { id: 2, label: '生活作息', icon: Activity },
  { id: 3, label: '健康困擾', icon: HeartPulse },
  { id: 4, label: '病史備註', icon: FileText },
  { id: 5, label: '確認送出', icon: CheckCircle2 },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
}) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
        {/* 進度背景線 */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
        {/* 已完成進度條 */}
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-teal-500 transition-all duration-300 -z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onSelectStep && step.id < currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <button
                type="button"
                onClick={() => isClickable && onSelectStep(step.id)}
                disabled={!isClickable}
                aria-label={`前往步驟 ${step.id}: ${step.label}`}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isCurrent
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 scale-110 font-bold'
                    : isCompleted
                    ? 'bg-teal-500 text-white cursor-pointer hover:bg-teal-600'
                    : 'bg-white border-2 border-slate-300 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
              <span
                className={`mt-2 text-xs md:text-sm font-medium transition-colors text-center ${
                  isCurrent
                    ? 'text-teal-700 font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
