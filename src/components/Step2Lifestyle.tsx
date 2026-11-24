import React from 'react';
import type { HealthFormData } from '../types/form';
import { Moon, Dumbbell, GlassWater, UtensilsCrossed, Cigarette, Wine } from 'lucide-react';

interface Step2Props {
  formData: HealthFormData;
  updateFormData: (fields: Partial<HealthFormData>) => void;
  errors: Record<string, string>;
}

const sleepHourOptions = ['小於 5 小時', '5 - 6 小時', '6 - 7 小時', '7 - 8 小時', '8 小時以上'];
const sleepQualityOptions = ['良好深沉', '普通尚可', '淺眠易醒/多夢', '嚴重入睡困難/失眠'];
const waterOptions = ['少於 1,000 cc', '1,000 - 1,500 cc', '1,500 - 2,000 cc', '2,000 cc 以上'];
const exerciseOptions = ['幾乎無運動習慣', '偶爾活動 (每週 1 天)', '規律運動 (每週 2-3 天)', '運動愛好者 (每週 4 天以上)'];
const dietHabitOptions = [
  '三餐經常外食',
  '蔬果攝取不足',
  '常吃宵夜 / 點心',
  '喜愛甜食或含糖飲料',
  '飲食偏重油重鹹',
  '進食速度過快 / 狼吞虎嚥',
  '三餐作息不固定',
  '飲食均衡清淡',
];

export const Step2Lifestyle: React.FC<Step2Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const toggleDietHabit = (habit: string) => {
    const current = formData.dietHabits;
    if (current.includes(habit)) {
      updateFormData({ dietHabits: current.filter((h) => h !== habit) });
    } else {
      updateFormData({ dietHabits: [...current, habit] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Moon className="w-5 h-5 text-teal-600" />
          日常生活習慣與作息
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          作息與飲食是影響代謝與體能的重要關鍵，請依據近 1~3 個月的實際狀況填寫。
        </p>
      </div>

      {/* 睡眠時長 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-indigo-500" />
          每日平均睡眠時長 <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {sleepHourOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ sleepHours: opt })}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                formData.sleepHours === opt
                  ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                  : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.sleepHours && (
          <p className="text-xs text-rose-500 mt-1">{errors.sleepHours}</p>
        )}
      </div>

      {/* 睡眠品質 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          睡眠品質感受 <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {sleepQualityOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ sleepQuality: opt })}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                formData.sleepQuality === opt
                  ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                  : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.sleepQuality && (
          <p className="text-xs text-rose-500 mt-1">{errors.sleepQuality}</p>
        )}
      </div>

      {/* 每日飲水量 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <GlassWater className="w-4 h-4 text-sky-500" />
          每日水分攝取量 (純水/無糖茶) <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {waterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ waterIntake: opt })}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                formData.waterIntake === opt
                  ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                  : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.waterIntake && (
          <p className="text-xs text-rose-500 mt-1">{errors.waterIntake}</p>
        )}
      </div>

      {/* 運動習慣 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <Dumbbell className="w-4 h-4 text-emerald-500" />
          每週運動頻率 <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {exerciseOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ exerciseFrequency: opt })}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center justify-between ${
                formData.exerciseFrequency === opt
                  ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                  : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
              }`}
            >
              <span>{opt}</span>
              {formData.exerciseFrequency === opt && (
                <span className="w-2 h-2 rounded-full bg-teal-600" />
              )}
            </button>
          ))}
        </div>
        {errors.exerciseFrequency && (
          <p className="text-xs text-rose-500 mt-1">{errors.exerciseFrequency}</p>
        )}
      </div>

      {/* 飲食型態標籤 (多選) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <UtensilsCrossed className="w-4 h-4 text-amber-500" />
          飲食特色與習慣 (可多選)
        </label>
        <div className="flex flex-wrap gap-2">
          {dietHabitOptions.map((opt) => {
            const isSelected = formData.dietHabits.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleDietHabit(opt)}
                className={`py-1.5 px-3 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                  isSelected
                    ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-600'
                }`}
              >
                {isSelected ? `✓ ${opt}` : `+ ${opt}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 菸酒習慣 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
            <Cigarette className="w-4 h-4 text-slate-500" />
            抽菸習慣
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['無吸菸', '偶爾社交抽', '每日規律抽'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ smoking: opt })}
                className={`py-2 px-2 text-xs sm:text-sm rounded-lg border font-medium transition-all ${
                  formData.smoking === opt
                    ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                    : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
            <Wine className="w-4 h-4 text-rose-400" />
            飲酒習慣
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['無飲酒', '小酌/偶爾', '經常飲酒'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => updateFormData({ alcohol: opt })}
                className={`py-2 px-2 text-xs sm:text-sm rounded-lg border font-medium transition-all ${
                  formData.alcohol === opt
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
    </div>
  );
};
