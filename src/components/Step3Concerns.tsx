import React from 'react';
import type { HealthFormData } from '../types/form';
import { HeartPulse, Target, Gauge, Clock } from 'lucide-react';

interface Step3Props {
  formData: HealthFormData;
  updateFormData: (fields: Partial<HealthFormData>) => void;
  errors: Record<string, string>;
}

const concernOptions = [
  '體重控制 / 減脂減重',
  '慢性疲勞 / 精神不濟',
  '睡眠障礙 / 淺眠多夢',
  '腸胃脹氣 / 消化不良',
  '排便不順 / 便祕問題',
  '肩頸僵硬 / 肌肉痠痛',
  '血壓 / 血糖 / 血脂偏高',
  '免疫力差 / 易感冒',
  '皮膚暗沉 / 痘痘過敏',
  '女性經期不適 / 荷爾蒙調理',
  '落髮 / 髮質脆弱',
  '關節卡卡 / 骨骼養護',
  '情緒焦慮 / 壓力過大',
];

const goalOptions = [
  '健康減重與體態雕塑',
  '改善體力與日間精神專注力',
  '改善睡眠品質與深層放鬆',
  '調理腸胃道菌相與代謝',
  '調整三高數據回到健康標準',
  '抗衰老與整體活力維持',
  '懷孕或產後體質調養',
];

const timelineOptions = [
  '希望能盡快 (1 個月內)',
  '穩定規劃 (3 個月期)',
  '深層體質改善 (半年期)',
  '長期健康保養維持',
];

export const Step3Concerns: React.FC<Step3Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const toggleConcern = (concern: string) => {
    const current = formData.primaryConcerns;
    if (current.includes(concern)) {
      updateFormData({ primaryConcerns: current.filter((c) => c !== concern) });
    } else {
      updateFormData({ primaryConcerns: [...current, concern] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-teal-600" />
          目前健康困擾與諮詢目標
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          告訴我們您最關心的身體狀況與目標，讓專業團隊為您量身規劃諮詢建議。
        </p>
      </div>

      {/* 主要健康困擾 (多選) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
          <span>
            目前主要感到困擾的健康狀況 (可多選) <span className="text-rose-500">*</span>
          </span>
          <span className="text-xs text-slate-500">已選 {formData.primaryConcerns.length} 項</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {concernOptions.map((opt) => {
            const isSelected = formData.primaryConcerns.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleConcern(opt)}
                className={`p-3 rounded-xl border text-sm text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 text-teal-800 font-semibold ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-300 hover:border-slate-400 bg-white text-slate-700'
                }`}
              >
                <span>{opt}</span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs border ${
                    isSelected
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
        {errors.primaryConcerns && (
          <p className="text-xs text-rose-500 mt-1">{errors.primaryConcerns}</p>
        )}
      </div>

      {/* 主要期望達成的健康目標 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-emerald-600" />
          最首要希望達成的健康目標 <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {goalOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ primaryGoal: opt })}
              className={`p-3 rounded-xl border text-sm text-left transition-all flex items-center justify-between ${
                formData.primaryGoal === opt
                  ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold ring-2 ring-teal-500/20'
                  : 'border-slate-300 hover:border-slate-400 bg-white text-slate-700'
              }`}
            >
              <span>{opt}</span>
              {formData.primaryGoal === opt && (
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              )}
            </button>
          ))}
        </div>
        {errors.primaryGoal && (
          <p className="text-xs text-rose-500 mt-1">{errors.primaryGoal}</p>
        )}
      </div>

      {/* 壓力指數滑桿 (1-10) */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-amber-500" />
            自覺生活 / 工作壓力指數 (1 分放鬆無壓 ~ 10 分極大緊繃)
          </label>
          <span className="text-base font-bold text-teal-700 px-2.5 py-0.5 rounded-md bg-white border border-slate-200">
            {formData.stressLevel} / 10 分
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={formData.stressLevel}
          onChange={(e) => updateFormData({ stressLevel: parseInt(e.target.value) || 5 })}
          className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>1 (平靜放鬆)</span>
          <span>5 (一般普通)</span>
          <span>10 (極度焦慮/高壓)</span>
        </div>
      </div>

      {/* 期望改善時間期程 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-500" />
          期望改善的時間節奏
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timelineOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ targetTimeline: opt })}
              className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                formData.targetTimeline === opt
                  ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                  : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
