import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicFormPage } from './pages/PublicFormPage';
import { AdminAuthGuard } from './components/admin/AdminAuthGuard';
import { Loader2 } from 'lucide-react';

// 後台頁面進行 Code-Splitting 延遲載入，確保前台首頁極速秒開
const AdminLoginPage = lazy(() =>
  import('./pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);

const PageLoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-2.5">
    <Loader2 className="w-7 h-7 text-teal-600 animate-spin" />
    <span className="text-xs text-slate-400 font-medium">載入諮詢師管理模組中...</span>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 前台訪客健康諮詢問卷：獨立極速載入，不等待 Auth 握手 */}
        <Route path="/" element={<PublicFormPage />} />

        {/* 後台路由群組：僅在進入 /admin 時才載入 AuthProvider 與後台代碼 */}
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="login" element={<AdminLoginPage />} />
                  <Route
                    path="/"
                    element={
                      <AdminAuthGuard>
                        <AdminDashboardPage />
                      </AdminAuthGuard>
                    }
                  />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          }
        />

        {/* 任意未知路由重定向至首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
