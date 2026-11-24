import React from 'react';
import type { HealthFormData } from '../types/form';
import { FileText, ShieldAlert, Pill, MessageSquare, Clock3, CheckSquare, Square } from 'lucide-react';

interface Step4Props {
  formData: HealthFormData;
  updateFormData: (fields: Partial<HealthFormData>) => void;
  errors: Record<string, string>;
}

const chronicOptions = [
  '高血壓',
  '糖尿病 / 血糖偏高',
  '高血脂 / 膽固醇過高',
  '脂肪肝',
  '痛風 / 尿酸過高',
  '甲狀腺機能亢進 / 低下',
  '心血管疾病',
  '腎臟相關病史',
  '無特殊慢性病史',
];

const contactTimeOptions = [
  '平日白天 (09:00 - 12:00)',
  '平日下午 (14:00 - 18:00)',
  '平日晚間 (18:30 - 21:00)',
  '週末假期皆可',
  '文字通訊 (LINE/Email) 為主',
];

export const Step4Medical: React.FC<Step4Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const toggleChronic = (disease: string) => {
    if (disease === '無特殊慢性病史') {
      updateFormData({ chronicDiseases: ['無特殊慢性病史'] });
      return;
    }
    const filtered = formData.chronicDiseases.filter((d) => d !== '無特殊慢性病史');
    if (filtered.includes(disease)) {
      updateFormData({ chronicDiseases: filtered.filter((d) => d !== disease) });
    } else {
      updateFormData({ chronicDiseases: [...filtered, disease] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          既往病史與諮詢需求留言
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          請提供您已知的健康狀況，這能幫助健康管理師提供更安全、切確的諮詢建議。
        </p>
      </div>

      {/* 慢性病史標籤 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          是否有既往慢性疾病或醫師診斷病史？(可複選)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {chronicOptions.map((opt) => {
            const isSelected = formData.chronicDiseases.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleChronic(opt)}
                className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-medium text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                    : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <span className="text-teal-600 text-xs font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 過敏史 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          食物或藥物過敏史 <span className="text-xs text-slate-400">(如：海鮮、花生、特定抗生素等，若無請填無)</span>
        </label>
        <input
          type="text"
          value={formData.allergies}
          onChange={(e) => updateFormData({ allergies: e.target.value })}
          placeholder="若無過敏請填「無」"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
        />
      </div>

      {/* 目前服用藥物或保健品 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
          <Pill className="w-4 h-4 text-teal-600" />
          目前是否有固定服用的處方藥物或保健食品？
        </label>
        <input
          type="text"
          value={formData.medicationsOrSupplements}
          onChange={(e) => updateFormData({ medicationsOrSupplements: e.target.value })}
          placeholder="例：降血壓藥物、益生菌、魚油、維生素B群...等"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
        />
      </div>

      {/* 偏好聯繫時段 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <Clock3 className="w-4 h-4 text-indigo-500" />
          諮詢師與您聯繫之方便時段
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {contactTimeOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ preferredContactTime: opt })}
              className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                formData.preferredContactTime === opt
                  ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                  : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 詳細諮詢問題與留言 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-teal-600" />
          詳細想詢問的健康問題或備註說明
        </label>
        <textarea
          rows={3}
          value={formData.inquiryDetails}
          onChange={(e) => updateFormData({ inquiryDetails: e.target.value })}
          placeholder="請簡短描述您想進一步了解的健康方向、任何特殊狀況或期望得到的協助..."
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
        />
      </div>

      {/* 隱私條款同意 */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => updateFormData({ agreedToTerms: !formData.agreedToTerms })}
          className="flex items-start gap-3 text-left group cursor-pointer"
        >
          {formData.agreedToTerms ? (
            <CheckSquare className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          ) : (
            <Square className="w-5 h-5 text-slate-400 group-hover:text-slate-600 shrink-0 mt-0.5" />
          )}
          <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            我已確認上述資料填寫無誤，並同意本網站僅將上述個人健康資訊用於專業健康諮詢與聯繫服務，遵守個人資料保護法規定，絕不外流或挪作其他商業用途。
          </span>
        </button>
        {errors.agreedToTerms && (
          <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.agreedToTerms}</p>
        )}
      </div>
    </div>
  );
};
