import React from 'react';
import { YutianCharacter } from './YutianCharacter';
import { ConsultantAvatar } from './ConsultantAvatar';
import { Sparkles, Award } from 'lucide-react';

interface ConsultantIntroCardProps {
  currentStep: number;
}

const stepTips: Record<number, { title: string; message: string; expression: 'greeting' | 'caring' | 'measuring' | 'cheering' }> = {
  1: {
    title: '雨天的貼心小提醒',
    message: '放輕鬆填寫！身高體重只是客觀數據起點，沒有好壞標準，誠實填寫我才能為你算出最健康的體態區間與水分目標喔～',
    expression: 'measuring',
  },
  2: {
    title: '雨天與你聊聊生活作息',
    message: '水份跟睡眠是代謝最重要的燃料💧 如果目前水喝不夠或常熬夜也別焦慮，我們會一步步陪你找出最舒服的調整節奏！',
    expression: 'caring',
  },
  3: {
    title: '雨天陪你傾聽身體的聲音',
    message: '每個小困擾都是身體正在跟我們溝通～不論是減脂體態、經常疲憊還是腸胃脹氣，勾選您最有感的問題，我會為您規劃優先順序！',
    expression: 'caring',
  },
  4: {
    title: '安全第一，雨天為您把關',
    message: '慢性病史、正在吃的藥物或保健食品請放心告訴我！這能讓我評估時避開交互作用，確保給您最切合且安全的建議。',
    expression: 'greeting',
  },
  5: {
    title: '太棒了！即將完成評估',
    message: '請花一分鐘核對填寫內容～確認送出後，我會親自仔細調閱您的各項數據，並在您方便的時段給予專屬建議！',
    expression: 'cheering',
  },
};

export const ConsultantIntroCard: React.FC<ConsultantIntroCardProps> = ({ currentStep }) => {
  const currentTip = stepTips[currentStep] || stepTips[1];

  return (
    <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-white rounded-2xl border border-teal-200/80 p-4 sm:p-5 shadow-xs mb-6 transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* 雨天頭像與徽章 */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="relative">
            {/* 真人照片頭像 (零延遲 Base64 內嵌) */}
            <ConsultantAvatar size="lg" />
            {/* 認證小徽章 */}
            <span className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1 rounded-full shadow-xs" title="專業認證">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* 可愛卡通人物 */}
          <div className="ml-1 -mr-2">
            <YutianCharacter expression={currentTip.expression} size="sm" />
          </div>
        </div>

        {/* 顧問資訊與即時提示對話 */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <span>健康諮詢師：雨天</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-normal text-teal-800 bg-teal-100/80 border border-teal-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                在線為您服務
              </span>
            </h3>
            <span className="text-xs text-teal-600 font-medium hidden md:inline">
              · 個人化健康體態管理顧問
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-2">
            「哈囉！我是雨天。放輕鬆填寫，我會親自為您檢閱數據並提供最溫暖切實的改善方向！」
          </p>

          {/* 當前步驟動態提示框 */}
          <div className="bg-white/95 rounded-xl border border-teal-100 px-3.5 py-2 text-xs text-slate-700 shadow-2xs flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-left">
              <span className="font-bold text-teal-800 mr-1.5">【{currentTip.title}】</span>
              <span className="leading-relaxed">{currentTip.message}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
