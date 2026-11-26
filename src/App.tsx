import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicFormPage } from './pages/PublicFormPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminAuthGuard } from './components/admin/AdminAuthGuard';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 前台訪客健康諮詢問卷 */}
          <Route path="/" element={<PublicFormPage />} />

          {/* 後台登入頁面 */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* 後台諮詢師管理主控台 (受守衛保護) */}
          <Route
            path="/admin"
            element={
              <AdminAuthGuard>
                <AdminDashboardPage />
              </AdminAuthGuard>
            }
          />

          {/* 任意未知路由重定向至首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
