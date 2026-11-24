import React from 'react';
import type { HealthFormData } from '../types/form';
import { calculateBmi } from '../utils/healthCalculations';
import { User, Activity, HeartPulse, FileText, CheckCircle2, ShieldCheck, Edit3 } from 'lucide-react';

interface Step5Props {
  formData: HealthFormData;
  onGoToStep: (step: number) => void;
  isSubmitting: boolean;
}

export const Step5Review: React.FC<Step5Props> = ({
  formData,
  onGoToStep,
  isSubmitting,
}) => {
  const bmiInfo = calculateBmi(formData.height, formData.weight);

  const genderLabel =
    formData.gender === 'male' ? '男性' : formData.gender === 'female' ? '女性' : '其他/多元';

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-600" />
          表單資訊核對與確認
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          在正式送出前，請確認以下所填寫的健康評估資訊是否正確。若需修改可點擊各區塊編輯。
        </p>
      </div>

      {/* 區塊 1: 基本資料 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <User className="w-4 h-4 text-teal-600" />
            基本資料與體態數值
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            disabled={isSubmitting}
            className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> 修改
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">姓名</span>
            <span className="font-medium text-slate-700">{formData.fullName || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">生理性別 / 年齡</span>
            <span className="font-medium text-slate-700">
              {genderLabel} / {formData.age} 歲
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">聯絡電話</span>
            <span className="font-medium text-slate-700">{formData.phone || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">電子信箱</span>
            <span className="font-medium text-slate-700 truncate block">
              {formData.email || '-'}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">身高 / 體重</span>
            <span className="font-medium text-slate-700">
              {formData.height} cm / {formData.weight} kg
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">BMI 指標</span>
            <span className="font-medium text-slate-700">
              {bmiInfo.bmi} ({bmiInfo.status})
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">建議每日飲水</span>
            <span className="font-medium text-teal-700">約 {bmiInfo.waterRecommendation} cc</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">LINE ID</span>
            <span className="font-medium text-slate-700">{formData.lineId || '未提供'}</span>
          </div>
        </div>
      </div>

      {/* 區塊 2: 生活作息 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Activity className="w-4 h-4 text-teal-600" />
            生活習慣與作息
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            disabled={isSubmitting}
            className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> 修改
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">睡眠時長 / 品質</span>
            <span className="font-medium text-slate-700">
              {formData.sleepHours} ({formData.sleepQuality})
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">水分攝取</span>
            <span className="font-medium text-slate-700">{formData.waterIntake}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">運動習慣</span>
            <span className="font-medium text-slate-700">{formData.exerciseFrequency}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">抽菸 / 飲酒</span>
            <span className="font-medium text-slate-700">
              {formData.smoking} / {formData.alcohol}
            </span>
          </div>
        </div>

        {formData.dietHabits.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400 block mb-1.5">飲食習慣特色</span>
            <div className="flex flex-wrap gap-1.5">
              {formData.dietHabits.map((h) => (
                <span
                  key={h}
                  className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 區塊 3: 健康困擾與目標 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            健康困擾與期望目標
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            disabled={isSubmitting}
            className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> 修改
          </button>
        </div>

        <div className="space-y-2.5 text-sm">
          <div>
            <span className="text-xs text-slate-400 block mb-1">主要健康困擾項目</span>
            <div className="flex flex-wrap gap-1.5">
              {formData.primaryConcerns.map((c) => (
                <span
                  key={c}
                  className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div>
              <span className="text-xs text-slate-400 block">首要健康目標</span>
              <span className="font-semibold text-teal-700">{formData.primaryGoal}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">自覺壓力指數</span>
              <span className="font-semibold text-slate-700">{formData.stressLevel} / 10 分</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">期望改善期程</span>
              <span className="font-medium text-slate-700">{formData.targetTimeline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 區塊 4: 病史與諮詢需求 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <FileText className="w-4 h-4 text-teal-600" />
            病史與備註需求
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(4)}
            disabled={isSubmitting}
            className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> 修改
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">既往慢性病史</span>
            <span className="text-slate-700 font-medium">
              {formData.chronicDiseases.join('、 ') || '無'}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">過敏史</span>
            <span className="text-slate-700 font-medium">{formData.allergies || '無'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">服用藥物/保健品</span>
            <span className="text-slate-700 font-medium">
              {formData.medicationsOrSupplements || '無'}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">偏好聯繫時段</span>
            <span className="text-slate-700 font-medium">{formData.preferredContactTime}</span>
          </div>
          {formData.inquiryDetails && (
            <div>
              <span className="text-xs text-slate-400 block">詳細諮詢留言</span>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1 whitespace-pre-wrap">
                {formData.inquiryDetails}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          送出後，專業健康顧問團隊將於您偏好的時段進行初步分析並與您連繫，提供完整個人化健康建議。
        </span>
      </div>
    </div>
  );
};
