import React from 'react';

export type YutianExpression = 'greeting' | 'caring' | 'measuring' | 'cheering';

interface YutianCharacterProps {
  expression?: YutianExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  speechText?: string;
}

export const YutianCharacter: React.FC<YutianCharacterProps> = ({
  expression = 'greeting',
  size = 'md',
  className = '',
  speechText,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {speechText && (
        <div className="relative mb-2.5 max-w-xs bg-white text-slate-700 text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-sm border border-teal-200/80 leading-relaxed font-medium">
          <div className="flex items-center gap-1.5 text-teal-700 font-bold mb-0.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            健康諮詢師 雨天
          </div>
          {speechText}
          {/* 對話框尖角 */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-teal-200/80 rotate-45"></div>
        </div>
      )}

      {/* 可愛眼鏡女性健康諮詢師 - 雨天 (SVG 插畫) */}
      <div className={`relative ${sizeMap[size]} shrink-0 select-none group`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 背景小光暈 */}
          <circle cx="100" cy="100" r="94" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="3" />

          {/* 後髮 (深棕色齊肩短髮) */}
          <path
            d="M50 100 C45 130 55 155 75 165 C68 140 65 115 65 100 Z"
            fill="#4A3427"
          />
          <path
            d="M150 100 C155 130 145 155 125 165 C132 140 135 115 135 100 Z"
            fill="#4A3427"
          />

          {/* 身體與白袍/諮詢師制服 */}
          <path
            d="M60 185 C60 148 78 135 100 135 C122 135 140 148 140 185 Z"
            fill="#0D9488"
          />
          {/* 內襯襯衫領口 */}
          <path d="M85 135 L100 155 L115 135 Z" fill="#E2E8F0" />
          {/* 白色顧問袍翻領 */}
          <path d="M78 135 L96 170 L72 185 Z" fill="#FFFFFF" />
          <path d="M122 135 L104 170 L128 185 Z" fill="#FFFFFF" />
          
          {/* 聽診器或胸前名牌 */}
          <rect x="110" y="160" width="16" height="8" rx="2" fill="#5EEAD4" />
          <line x1="113" y1="164" x2="123" y2="164" stroke="#134E4A" strokeWidth="1.5" strokeLinecap="round" />

          {/* 脖子 */}
          <rect x="91" y="122" width="18" height="18" rx="5" fill="#FFE3D1" />

          {/* 臉部輪廓 */}
          <ellipse cx="100" cy="95" rx="46" ry="43" fill="#FFEADA" />

          {/* 前髮與精緻瀏海 (棕髮微捲) */}
          <path
            d="M54 90 C50 60 70 42 100 42 C130 42 150 60 146 90 C143 74 130 60 115 60 C103 60 97 68 85 64 C73 60 62 70 54 90 Z"
            fill="#5A3E2D"
          />
          <path
            d="M75 58 C85 65 95 65 105 60 C98 52 88 52 75 58 Z"
            fill="#6B4B36"
          />

          {/* 耳朵 */}
          <circle cx="54" cy="98" r="8" fill="#FFD5C0" />
          <circle cx="146" cy="98" r="8" fill="#FFD5C0" />

          {/* 粉嫩腮紅 */}
          <ellipse cx="73" cy="107" rx="8" ry="4.5" fill="#FDA4AF" opacity="0.65" />
          <ellipse cx="127" cy="107" rx="8" ry="4.5" fill="#FDA4AF" opacity="0.65" />

          {/* 眉毛 */}
          <path d="M70 82 Q80 79 88 83" stroke="#4A3427" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M112 83 Q120 79 130 82" stroke="#4A3427" strokeWidth="2.5" strokeLinecap="round" />

          {/* 眼睛 (依表情切換) */}
          {expression === 'cheering' ? (
            // 開心彎月笑眼 ^^
            <>
              <path d="M72 96 Q80 89 88 96" stroke="#2D1A10" strokeWidth="3" strokeLinecap="round" />
              <path d="M112 96 Q120 89 128 96" stroke="#2D1A10" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // 靈動明亮大眼睛
            <>
              <ellipse cx="79" cy="95" rx="5" ry="6.5" fill="#24140D" />
              <ellipse cx="121" cy="95" rx="5" ry="6.5" fill="#24140D" />
              {/* 眼神高光 */}
              <circle cx="77.5" cy="93" r="2" fill="#FFFFFF" />
              <circle cx="81" cy="97" r="1.2" fill="#FFFFFF" />
              <circle cx="119.5" cy="93" r="2" fill="#FFFFFF" />
              <circle cx="123" cy="97" r="1.2" fill="#FFFFFF" />
            </>
          )}

          {/* 圓框金絲/銀絲眼鏡 (精緻透明鏡片) */}
          <circle
            cx="78"
            cy="95"
            r="16"
            stroke="#C09A6C"
            strokeWidth="2.5"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />
          <circle
            cx="122"
            cy="95"
            r="16"
            stroke="#C09A6C"
            strokeWidth="2.5"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />
          {/* 鏡架中樑與鏡腳 */}
          <path d="M94 94 Q100 91 106 94" stroke="#C09A6C" strokeWidth="2.5" fill="none" />
          <line x1="62" y1="94" x2="52" y2="92" stroke="#C09A6C" strokeWidth="2" strokeLinecap="round" />
          <line x1="138" y1="94" x2="148" y2="92" stroke="#C09A6C" strokeWidth="2" strokeLinecap="round" />
          {/* 鏡片微反光 */}
          <path d="M70 85 L76 83" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M114 85 L120 83" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

          {/* 小鼻子 */}
          <path d="M99 104 Q101 106 102 105" stroke="#E29D7D" strokeWidth="1.5" strokeLinecap="round" />

          {/* 溫柔嘴巴 */}
          {expression === 'greeting' || expression === 'measuring' ? (
            <path d="M94 114 Q100 120 106 114" stroke="#E15B64" strokeWidth="2.5" strokeLinecap="round" />
          ) : expression === 'cheering' ? (
            <path d="M93 113 Q100 125 107 113 Z" fill="#E15B64" stroke="#C53030" strokeWidth="1" />
          ) : (
            <path d="M95 114 Q100 119 105 114" stroke="#E15B64" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* 手部動作配件 */}
          {expression === 'greeting' && (
            // 右手揮手
            <g className="animate-pulse">
              <circle cx="152" cy="130" r="8" fill="#FFE3D1" />
              <path d="M148 132 Q158 120 162 125" stroke="#FFE3D1" strokeWidth="6" strokeLinecap="round" />
            </g>
          )}

          {expression === 'measuring' && (
            // 手持健康記錄板
            <g>
              <rect x="42" y="132" width="22" height="30" rx="3" fill="#0284C7" transform="rotate(-10 42 132)" />
              <rect x="45" y="136" width="16" height="22" rx="1.5" fill="#FFFFFF" transform="rotate(-10 45 136)" />
              <line x1="48" y1="142" x2="57" y2="140" stroke="#0D9488" strokeWidth="1.5" />
              <line x1="47" y1="147" x2="56" y2="145" stroke="#94A3B8" strokeWidth="1.5" />
            </g>
          )}

          {expression === 'cheering' && (
            // 雙手加油比讚/開心
            <g>
              <circle cx="48" cy="142" r="7" fill="#FFE3D1" />
              <circle cx="152" cy="142" r="7" fill="#FFE3D1" />
              {/* 小星星裝飾 */}
              <path d="M162 70 L164 76 L170 78 L164 80 L162 86 L160 80 L154 78 L160 76 Z" fill="#FBBF24" />
              <path d="M38 80 L39.5 84 L44 85.5 L39.5 87 L38 91 L36.5 87 L32 85.5 L36.5 84 Z" fill="#FBBF24" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
