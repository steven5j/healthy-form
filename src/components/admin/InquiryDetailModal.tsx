import { useState } from 'react';
import type { InquiryRecord, InquiryStatus } from '../../types/inquiry';
import { calculateBmi } from '../../utils/healthCalculations';
import { updateInquiryStatusAndNote, deleteInquiryDoc } from '../../services/firebase';
import {
  X,
  User,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  HeartPulse,
  Activity,
  FileText,
  Save,
  Trash2,
  PhoneCall,
  Copy,
  Check,
  Loader2,
  Calendar,
} from 'lucide-react';

interface InquiryDetailModalProps {
  inquiry: InquiryRecord | null;
  onClose: () => void;
  onRefresh?: () => void;
}

const statusOptions: { value: InquiryStatus; label: string; badgeClass: string }[] = [
  { value: 'pending', label: '待聯繫 (Pending)', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'contacted', label: '已電聯 / 初步聯繫', badgeClass: 'bg-sky-100 text-sky-800 border-sky-300' },
  { value: 'consulting', label: '深入諮詢 / 調理中', badgeClass: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'completed', label: '已結案 / 完成服務', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
];

export const InquiryDetailModal = ({ inquiry, onClose }: InquiryDetailModalProps) => {
  if (!inquiry) return null;

  const [status, setStatus] = useState<InquiryStatus>(inquiry.status || 'pending');
  const [notes, setNotes] = useState<string>(inquiry.consultantNotes || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [copiedLine, setCopiedLine] = useState<boolean>(false);

  const bmiInfo = calculateBmi(inquiry.height, inquiry.weight);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateInquiryStatusAndNote(inquiry.id, status, notes);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      alert('儲存失敗，請確認權限或稍後再試。');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`確定要刪除顧客「${inquiry.fullName}」的這筆問卷紀錄嗎？此操作不可逆。`)) {
      setIsDeleting(true);
      try {
        await deleteInquiryDoc(inquiry.id);
        onClose();
      } catch (err) {
        alert('刪除失敗，請確認權限。');
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCopyLine = () => {
    if (!inquiry.lineId) return;
    navigator.clipboard.writeText(inquiry.lineId).then(() => {
      setCopiedLine(true);
      setTimeout(() => setCopiedLine(false), 2000);
    });
  };

  const formattedDate = inquiry.clientTimestamp
    ? new Date(inquiry.clientTimestamp).toLocaleString('zh-TW')
    : '未知時間';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
      {/* 遮罩點擊關閉 */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* 側邊抽屜面版 */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* 頂部 Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
              {inquiry.fullName?.charAt(0) || '客'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800">{inquiry.fullName}</h3>
                <span className="text-xs font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {inquiry.inquiryId}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>送出時間：{formattedDate}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 抽屜滾動主內容 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 快捷操作條 */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${inquiry.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              撥打電話 ({inquiry.phone})
            </a>
            {inquiry.lineId && (
              <button
                type="button"
                onClick={handleCopyLine}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                {copiedLine ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                複製 LINE ({inquiry.lineId})
              </button>
            )}
            {inquiry.email && (
              <a
                href={`mailto:${inquiry.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                發送 Email
              </a>
            )}
          </div>

          {/* 狀態切換與內部備註區 */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> 諮詢處理進度
              </span>
              <span className="text-xs text-slate-500">
                偏好時段：<strong className="text-teal-800">{inquiry.preferredContactTime}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`py-2 px-2 text-xs rounded-lg border font-medium text-center transition-all cursor-pointer ${
                    status === opt.value
                      ? `${opt.badgeClass} ring-2 ring-teal-500/20 font-bold shadow-2xs`
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label.split(' ')[0]}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                諮詢師內部追蹤備註 (雨天專用，客端不可見)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例：11/26 14:00 電聯無人接聽，改傳簡訊；預約下週二線上評估..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                修改後請點選儲存以同步至雲端
              </span>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : saveSuccess ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saveSuccess ? '已儲存！' : '儲存變更'}
              </button>
            </div>
          </div>

          {/* 區塊 1: 基本資料與 BMI 分析 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-teal-600" /> 基本資料與身體質量分析
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">性別 / 年齡</span>
                <span className="font-semibold text-slate-700">
                  {inquiry.gender === 'male' ? '男性' : inquiry.gender === 'female' ? '女性' : '其他'} / {inquiry.age} 歲
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">身高 / 體重</span>
                <span className="font-semibold text-slate-700">
                  {inquiry.height} cm / {inquiry.weight} kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">BMI 指標</span>
                <span className="font-semibold text-teal-700">
                  {bmiInfo.bmi} ({bmiInfo.status})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">建議每日水量</span>
                <span className="font-semibold text-sky-700">
                  約 {bmiInfo.waterRecommendation} cc
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-50 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{inquiry.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{inquiry.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>LINE: {inquiry.lineId || '未提供'}</span>
              </div>
            </div>
          </div>

          {/* 區塊 2: 健康困擾與主要目標 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <HeartPulse className="w-4 h-4 text-teal-600" /> 健康困擾與首要目標
            </h4>

            <div>
              <span className="text-xs text-slate-400 block mb-1.5">關心的健康困擾標籤</span>
              <div className="flex flex-wrap gap-1.5">
                {inquiry.primaryConcerns?.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-medium"
                  >
                    {c}
                  </span>
                )) || <span className="text-xs text-slate-400">未勾選</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <span className="text-slate-400 block">首要健康目標</span>
                <span className="font-bold text-teal-800">{inquiry.primaryGoal}</span>
              </div>
              <div>
                <span className="text-slate-400 block">自覺壓力指數 (1-10)</span>
                <span className="font-bold text-amber-700">{inquiry.stressLevel} / 10 分</span>
              </div>
              <div>
                <span className="text-slate-400 block">期望改善期程</span>
                <span className="font-semibold text-slate-700">{inquiry.targetTimeline}</span>
              </div>
            </div>
          </div>

          {/* 區塊 3: 生活作息與習慣 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Activity className="w-4 h-4 text-teal-600" /> 生活作息與生活型態
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">睡眠時長 / 品質</span>
                <span className="font-semibold text-slate-700">
                  {inquiry.sleepHours} ({inquiry.sleepQuality})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">水分攝取</span>
                <span className="font-semibold text-slate-700">{inquiry.waterIntake}</span>
              </div>
              <div>
                <span className="text-slate-400 block">運動頻率</span>
                <span className="font-semibold text-slate-700">{inquiry.exerciseFrequency}</span>
              </div>
              <div>
                <span className="text-slate-400 block">抽菸 / 飲酒</span>
                <span className="font-semibold text-slate-700">
                  {inquiry.smoking} / {inquiry.alcohol}
                </span>
              </div>
            </div>

            {inquiry.dietHabits && inquiry.dietHabits.length > 0 && (
              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 block mb-1">飲食習慣特色</span>
                <div className="flex flex-wrap gap-1">
                  {inquiry.dietHabits.map((h) => (
                    <span key={h} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 區塊 4: 既往病史與留言 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-teal-600" /> 既往病史與詳細需求留言
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">既往慢性病史</span>
                <span className="font-medium text-slate-700">
                  {inquiry.chronicDiseases?.join('、 ') || '無'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">食物或藥物過敏史</span>
                <span className="font-medium text-slate-700">{inquiry.allergies || '無'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">目前服用藥物或保健品</span>
                <span className="font-medium text-slate-700">
                  {inquiry.medicationsOrSupplements || '無'}
                </span>
              </div>
              {inquiry.inquiryDetails && (
                <div className="pt-1">
                  <span className="text-slate-400 block mb-1">顧客備註與提問留言</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {inquiry.inquiryDetails}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作條 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>刪除此紀錄</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            關閉檢視
          </button>
        </div>
      </div>
    </div>
  );
};
