import React from 'react';
import type { HealthFormData, Gender } from '../types/form';
import { calculateBmi } from '../utils/healthCalculations';
import { User, Phone, Mail, MessageCircle, Scale, Ruler, Sparkles, Droplets } from 'lucide-react';

interface Step1Props {
  formData: HealthFormData;
  updateFormData: (fields: Partial<HealthFormData>) => void;
  errors: Record<string, string>;
}

export const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const bmiInfo = calculateBmi(formData.height, formData.weight);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          基本資料與身體數據
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          請提供您的基礎體態與聯繫方式，我們將以此計算生理基礎數值。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            姓名 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              placeholder="請輸入您的真實姓名"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* 生理生理性別 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            生理性別 <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'female', label: '女性' },
              { value: 'male', label: '男性' },
              { value: 'other', label: '其他/多元' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ gender: option.value as Gender })}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.gender === option.value
                    ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20 shadow-sm'
                    : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className="text-xs text-rose-500 mt-1">{errors.gender}</p>
          )}
        </div>

        {/* 年齡 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            年齡 (歲) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="10"
            max="120"
            value={formData.age}
            onChange={(e) => updateFormData({ age: e.target.value })}
            placeholder="例：32"
            className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
              errors.age ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
            }`}
          />
          {errors.age && (
            <p className="text-xs text-rose-500 mt-1">{errors.age}</p>
          )}
        </div>

        {/* 聯絡電話 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            聯絡電話 / 手機 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="0912-345-678"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* 電子信箱 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            電子郵件 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="example@mail.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* LINE ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            LINE ID <span className="text-xs text-slate-400">(選填，便於諮詢師聯繫)</span>
          </label>
          <div className="relative">
            <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={formData.lineId}
              onChange={(e) => updateFormData({ lineId: e.target.value })}
              placeholder="例：line_id_123"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* 身高 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            身高 (公分) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Ruler className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="number"
              step="0.5"
              value={formData.height}
              onChange={(e) => updateFormData({ height: e.target.value })}
              placeholder="例：170"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.height ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.height && (
            <p className="text-xs text-rose-500 mt-1">{errors.height}</p>
          )}
        </div>

        {/* 體重 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            體重 (公斤) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Scale className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="number"
              step="0.5"
              value={formData.weight}
              onChange={(e) => updateFormData({ weight: e.target.value })}
              placeholder="例：65"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.weight ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.weight && (
            <p className="text-xs text-rose-500 mt-1">{errors.weight}</p>
          )}
        </div>
      </div>

      {/* 即時 BMI 與健康分析卡片 */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 via-emerald-50 to-slate-50 border border-teal-100 shadow-xs">
        <div className="flex items-center gap-2 text-teal-800 font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          即時健康指標分析 (根據台灣衛福部建議標準)
        </div>

        {bmiInfo.bmi !== null ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs flex flex-col justify-center">
              <span className="text-xs text-slate-500">身體質量指數 (BMI)</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-800">{bmiInfo.bmi}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium border ${bmiInfo.statusColor}`}
                >
                  {bmiInfo.status}
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs flex flex-col justify-center">
              <span className="text-xs text-slate-500">標準理想體重區間</span>
              <span className="text-lg font-bold text-teal-700 mt-0.5">
                {bmiInfo.healthyWeightRange?.[0]} ~ {bmiInfo.healthyWeightRange?.[1]} kg
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs flex flex-col justify-center">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" /> 建議每日飲水量
              </span>
              <span className="text-lg font-bold text-sky-700 mt-0.5">
                約 {bmiInfo.waterRecommendation} cc
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-1">
            輸入您的身高與體重後，系統將自動為您估算 BMI 身體質量指數與基礎水份建議。
          </p>
        )}
      </div>
    </div>
  );
};
