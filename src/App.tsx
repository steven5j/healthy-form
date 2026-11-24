import { useState, useEffect } from 'react';
import type { HealthFormData } from './types/form';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2Lifestyle } from './components/Step2Lifestyle';
import { Step3Concerns } from './components/Step3Concerns';
import { Step4Medical } from './components/Step4Medical';
import { Step5Review } from './components/Step5Review';
import { SuccessView } from './components/SuccessView';
import { submitHealthForm } from './services/firebase';
import {
  Heart,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Loader2,
} from 'lucide-react';

const initialFormData: HealthFormData = {
  fullName: '',
  gender: '',
  age: '',
  height: '',
  weight: '',
  phone: '',
  email: '',
  lineId: '',

  sleepHours: '',
  sleepQuality: '',
  waterIntake: '',
  exerciseFrequency: '',
  dietHabits: [],
  smoking: '無吸菸',
  alcohol: '無飲酒',

  primaryConcerns: [],
  primaryGoal: '',
  stressLevel: 5,
  targetTimeline: '穩定規劃 (3 個月期)',

  chronicDiseases: [],
  allergies: '',
  medicationsOrSupplements: '',
  inquiryDetails: '',
  preferredContactTime: '平日白天 (09:00 - 12:00)',
  agreedToTerms: false,
};

const STORAGE_KEY = 'healthy_form_draft_v1';

export function App() {
  const [formData, setFormData] = useState<HealthFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialFormData;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  // Auto-save draft to LocalStorage
  useEffect(() => {
    if (!submittedInquiryId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, submittedInquiryId]);

  const updateFormData = (fields: Partial<HealthFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear field-specific errors
    const updatedKeys = Object.keys(fields);
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of updatedKeys) {
        delete next[k];
      }
      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = '請填寫姓名';
      if (!formData.gender) errs.gender = '請選擇生理性別';
      if (!formData.age || parseInt(formData.age) <= 0) errs.age = '請填寫有效年齡';
      if (!formData.phone.trim()) errs.phone = '請填寫聯絡電話';
      if (!formData.email.trim() || !formData.email.includes('@'))
        errs.email = '請填寫正確格式的電子信箱';
      if (!formData.height || parseFloat(formData.height) <= 0)
        errs.height = '請輸入身高 (cm)';
      if (!formData.weight || parseFloat(formData.weight) <= 0)
        errs.weight = '請輸入體重 (kg)';
    } else if (step === 2) {
      if (!formData.sleepHours) errs.sleepHours = '請選擇平均睡眠時長';
      if (!formData.sleepQuality) errs.sleepQuality = '請選擇睡眠品質感受';
      if (!formData.waterIntake) errs.waterIntake = '請選擇每日水分攝取量';
      if (!formData.exerciseFrequency) errs.exerciseFrequency = '請選擇運動頻率';
    } else if (step === 3) {
      if (formData.primaryConcerns.length === 0)
        errs.primaryConcerns = '請至少勾選一項您目前最關注的健康困擾';
      if (!formData.primaryGoal) errs.primaryGoal = '請選擇首要期望目標';
    } else if (step === 4) {
      if (!formData.agreedToTerms)
        errs.agreedToTerms = '請閱讀並勾選同意健康諮詢個人資料保護聲明';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitHealthForm(formData);
      if (res.success) {
        localStorage.removeItem(STORAGE_KEY);
        setSubmittedInquiryId(res.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      alert('送出失敗，請稍後再試。');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setErrors({});
    setSubmittedInquiryId(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-slate-50 to-slate-100 flex flex-col justify-between">
      {/* 頁首 Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none m-0">
                  活力健診
                </h1>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                  專業健康諮詢
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Health Inquiry & Assessment Platform</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>資料加密傳輸</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>一對一客製評估</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主內容區 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {submittedInquiryId ? (
          <SuccessView
            formData={formData}
            inquiryId={submittedInquiryId}
            onReset={handleReset}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            {/* 標題與簡介 */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white p-6 sm:p-8">
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-200 bg-teal-900/50 px-2.5 py-1 rounded-full">
                個人化健康評估問卷
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight text-white">
                填寫您的健康需求，開啟專屬健康方案
              </h2>
              <p className="text-teal-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                只需花費約 3 分鐘填寫基本體況、生活作息與健康困擾，我們的專業顧問團隊將為您進行初步生理指標評估與建議。
              </p>
            </div>

            {/* 進度導覽列 */}
            <div className="bg-slate-50 border-b border-slate-200">
              <StepProgressBar
                currentStep={currentStep}
                totalSteps={5}
                onSelectStep={(step) => {
                  if (step < currentStep) {
                    setCurrentStep(step);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />
            </div>

            {/* 各步驟表單內容 */}
            <div className="p-6 sm:p-8">
              {currentStep === 1 && (
                <Step1BasicInfo
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <Step2Lifestyle
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <Step3Concerns
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 4 && (
                <Step4Medical
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {currentStep === 5 && (
                <Step5Review
                  formData={formData}
                  onGoToStep={(step) => {
                    setCurrentStep(step);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* 底部步驟切換控制 */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> 上一步
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    title="重新填寫整份問卷"
                    disabled={isSubmitting}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 重設
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      下一步 <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-base font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          處理中...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          確認並送出問卷
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 頁尾 Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-600">
            活力健診諮詢網 · Health Inquiry & Assessment System
          </p>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            免責聲明：本表單與諮詢建議僅供日常健康管理、營養與生活型態參考，不得作為臨床疾病之診斷、治療或處方之依據。如遇急性身體不適，請立即就醫。
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            Ready for Firebase Hosting Deployment · Powered by React & Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
