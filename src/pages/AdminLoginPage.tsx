import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { YutianCharacter } from '../components/YutianCharacter';
import { ConsultantAvatar } from '../components/ConsultantAvatar';
import { ShieldCheck, ArrowLeft, Loader2, Heart } from 'lucide-react';

export const AdminLoginPage = () => {
  const { login, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  // 若已登入且具備權限，直接重定向至後台
  if (currentUser && isAdmin) {
    navigate(from, { replace: true });
    return null;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await login();
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Google 登入失敗:', err);
      const error = err as { code?: string; message?: string };
      if (error?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('登入視窗已關閉，請重新嘗試。');
      } else if (error?.code === 'auth/operation-not-allowed') {
        setErrorMsg('Firebase 尚未啟用 Google 登入方式，請先至 Firebase Console 的 Authentication 啟用 Google Sign-In。');
      } else {
        setErrorMsg('登入失敗，請確認網路或稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 flex flex-col justify-between py-8 px-4">
      {/* 頂部回到前台按鈕 */}
      <div className="max-w-md w-full mx-auto">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> 回到前台健康表單
        </button>
      </div>

      {/* 登入主卡片 */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-sm border border-teal-100 p-8 text-center my-auto">
        {/* 雨天頭像與徽章 */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="relative mb-2">
            <YutianCharacter expression="greeting" size="md" />
            <div className="absolute -bottom-1 -right-1">
              <ConsultantAvatar size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full font-bold">
            <Heart className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
            <span>活力健診 · 諮詢師管理系統</span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">諮詢師管理登入</h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
          歡迎回來，雨天！請使用 Google 帳號驗證身分，進入後台查閱客戶送出的健康問卷與追蹤聯繫。
        </p>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-left">
            {errorMsg}
          </div>
        )}

        {/* Google 登入按鈕 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>正在連線驗證...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>使用 Google 帳號登入</span>
            </>
          )}
        </button>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>全站採用 Firebase 官方身分驗證與 SSL 加密</span>
        </div>
      </div>

      {/* 底部小版權 */}
      <div className="text-center text-xs text-slate-400">
        活力健診 · 健康諮詢管理系統 © {new Date().getFullYear()}
      </div>
    </div>
  );
};
