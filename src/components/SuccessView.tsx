import React from 'react';
import type { HealthFormData } from '../types/form';
import { calculateBmi } from '../utils/healthCalculations';
import { YutianCharacter } from './YutianCharacter';
import { ConsultantAvatar } from './ConsultantAvatar';
import { Calendar, Sparkles, Copy, RotateCcw, Check, HeartHandshake, PhoneCall } from 'lucide-react';

interface SuccessViewProps {
  formData: HealthFormData;
  inquiryId: string;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  formData,
  inquiryId,
  onReset,
}) => {
  const [copied, setCopied] = React.useState(false);
  const bmiInfo = calculateBmi(formData.height, formData.weight);

  const handleCopySummary = () => {
    const summaryText = `【健康諮詢預約單】
諮詢編號：${inquiryId}
諮詢師：雨天
諮詢姓名：${formData.fullName}
年齡性別：${formData.age}歲 / ${formData.gender === 'male' ? '男' : '女'}
BMI 指標：${bmiInfo.bmi} (${bmiInfo.status})
主要困擾：${formData.primaryConcerns.join('、')}
首要目標：${formData.primaryGoal}
偏好時段：${formData.preferredContactTime}
聯絡電話：${formData.phone}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 text-center">
      {/* 雨天慶祝插畫與頭像 */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="relative mb-2">
          <YutianCharacter expression="cheering" size="lg" />
          <div className="absolute -bottom-1 -right-1">
            <ConsultantAvatar size="md" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs px-3 py-1 rounded-full font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>健康諮詢師「雨天」已受理您的問卷</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
          表單已成功送達！
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
          「嗨 {formData.fullName}！我是雨天。我已經收到您的專屬健康評估表單囉！正在為您細心分析各項指標，很快就會與您連繫！」
        </p>
      </div>

      {/* 預約編號與摘要卡片 */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 text-left mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">諮詢預約編號</span>
            <div className="text-xl font-mono font-bold text-teal-700">{inquiryId}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>送出時間：{new Date().toLocaleString('zh-TW')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">諮詢貴賓</span>
            <span className="font-semibold text-slate-800">{formData.fullName}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">BMI 指標</span>
            <span className="font-semibold text-teal-700">
              {bmiInfo.bmi} ({bmiInfo.status})
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">聯絡方式</span>
            <span className="font-semibold text-slate-800">{formData.phone}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">專屬諮詢師</span>
            <span className="font-semibold text-teal-700">雨天 顧問</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 block mb-1">主要目標與關注困擾</span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            【首要目標】{formData.primaryGoal}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {formData.primaryConcerns.map((c) => (
              <span
                key={c}
                className="text-xs px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-teal-50/70 to-emerald-50/70 rounded-xl border border-teal-200/60 flex items-start gap-2.5 text-xs text-slate-700">
          <PhoneCall className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <strong>諮詢師 雨天</strong> 將於您的偏好時段：
            <span className="text-teal-800 font-bold ml-1">{formData.preferredContactTime}</span>
            <span className="block text-slate-500 mt-0.5">
              透過電話或 LINE 與您進一步說明分析結果，請留意通訊通知。
            </span>
          </div>
        </div>
      </div>

      {/* 按鈕操作區 */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-teal-600" />
              已複製摘要至剪貼簿
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              複製諮詢摘要
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          填寫下一份表單
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <HeartHandshake className="w-4 h-4 text-teal-500" />
        <span>健康諮詢師 雨天 祝您身體健康，活力滿滿！</span>
      </div>
    </div>
  );
};
