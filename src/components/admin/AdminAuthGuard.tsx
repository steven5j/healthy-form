import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export const AdminAuthGuard = ({ children }: { children: ReactNode }) => {
  const { currentUser, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">正在驗證諮詢師管理權限...</p>
      </div>
    );
  }

  if (!currentUser) {
    // 尚未登入，導向登入頁
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // 已登入但不在管理員名單中
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-rose-200 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">未授權的 Google 帳號</h3>
          <p className="text-sm text-slate-500 mb-4">
            您的 Google 帳號（<strong className="text-slate-700">{currentUser.email}</strong>）非授權之健康諮詢師。
          </p>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 transition-colors cursor-pointer"
          >
            切換其他 Google 帳號登入
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
