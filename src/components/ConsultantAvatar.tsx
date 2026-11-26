import { useState } from 'react';
import { consultantAvatarDataUri } from '../assets/consultantAvatarData';
import { User } from 'lucide-react';

interface ConsultantAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineDot?: boolean;
}

export const ConsultantAvatar = ({
  size = 'md',
  className = '',
  showOnlineDot = false,
}: ConsultantAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {!hasError ? (
        <img
          src={consultantAvatarDataUri}
          alt="健康諮詢師 雨天"
          onError={() => setHasError(true)}
          className={`${selectedSize} rounded-full object-cover border-2 border-teal-500 shadow-sm`}
          loading="eager"
          decoding="sync"
        />
      ) : (
        <div
          className={`${selectedSize} rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs border-2 border-teal-500 shadow-sm`}
        >
          <User className="w-1/2 h-1/2" />
        </div>
      )}

      {showOnlineDot && (
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white shadow-2xs animate-pulse" />
      )}
    </div>
  );
};
