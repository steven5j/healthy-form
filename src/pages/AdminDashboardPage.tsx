import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToInquiries } from '../services/firebase';
import type { InquiryRecord, InquiryStatus } from '../types/inquiry';
import { InquiryDetailModal } from '../components/admin/InquiryDetailModal';
import { ConsultantAvatar } from '../components/ConsultantAvatar';
import {
  Search,
  Download,
  LogOut,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  PhoneCall,
  Inbox,
  AlertCircle,
} from 'lucide-react';

const statusBadges: Record<InquiryStatus, { label: string; className: string }> = {
  pending: { label: '待聯繫', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  contacted: { label: '已電聯', className: 'bg-sky-100 text-sky-800 border-sky-200' },
  consulting: { label: '諮詢中', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  completed: { label: '已結案', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

export const AdminDashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 篩選與搜尋
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToInquiries(
      (items) => {
        setInquiries(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message || '讀取資料失敗，請確認 Firestore 規則');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // KPI 統計數據計算
  const stats = useMemo(() => {
    const total = inquiries.length;
    const pending = inquiries.filter((i) => i.status === 'pending' || !i.status).length;
    const consulting = inquiries.filter((i) => i.status === 'consulting' || i.status === 'contacted').length;
    const completed = inquiries.filter((i) => i.status === 'completed').length;
    return { total, pending, consulting, completed };
  }, [inquiries]);

  // 篩選後的列表
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      // 狀態篩選
      if (statusFilter !== 'all') {
        const itemStatus = item.status || 'pending';
        if (itemStatus !== statusFilter) return false;
      }
      // 關鍵字搜尋
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = item.fullName?.toLowerCase().includes(query);
        const matchPhone = item.phone?.toLowerCase().includes(query);
        const matchId = item.inquiryId?.toLowerCase().includes(query);
        const matchGoal = item.primaryGoal?.toLowerCase().includes(query);
        return matchName || matchPhone || matchId || matchGoal;
      }
      return true;
    });
  }, [inquiries, statusFilter, searchTerm]);

  // 匯出 CSV 報表
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) {
      alert('目前無可匯出的資料');
      return;
    }

    const headers = [
      '預約單號',
      '送出時間',
      '處理狀態',
      '姓名',
      '性別',
      '年齡',
      '身高(cm)',
      '體重(kg)',
      '電話',
      'Email',
      'LINE ID',
      '首要目標',
      '健康困擾',
      '偏好聯繫時段',
      '內部諮詢備註',
    ];

    const rows = filteredInquiries.map((item) => {
      const dateStr = item.clientTimestamp ? new Date(item.clientTimestamp).toLocaleString('zh-TW') : '';
      const statusLabel = statusBadges[item.status || 'pending']?.label || '待聯繫';
      const concerns = (item.primaryConcerns || []).join('、');
      return [
        item.inquiryId || '',
        dateStr,
        statusLabel,
        item.fullName || '',
        item.gender === 'male' ? '男' : item.gender === 'female' ? '女' : '其他',
        item.age || '',
        item.height || '',
        item.weight || '',
        `\t${item.phone || ''}`, // 加 \t 防止 Excel 跑版
        item.email || '',
        item.lineId || '',
        `"${item.primaryGoal || ''}"`,
        `"${concerns}"`,
        `"${item.preferredContactTime || ''}"`,
        `"${(item.consultantNotes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `健康諮詢問卷清單_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* 頂部導覽列 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ConsultantAvatar size="md" showOnlineDot />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-800 m-0">活力健診</h1>
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  諮詢師管理後台
                </span>
              </div>
              <p className="text-xs text-slate-400">專屬健康管理師：雨天</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <span>查看前台問卷</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-700">{currentUser?.displayName || '雨天'}</span>
              <span className="text-[10px] text-slate-400">{currentUser?.email}</span>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              title="登出系統"
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">登出</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主內容區 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI 統計卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 block">總諮詢收件</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 block">
                {stats.total}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center justify-between bg-gradient-to-br from-white to-amber-50/30">
            <div>
              <span className="text-xs font-semibold text-amber-700 block">待聯繫問卷</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1 block">
                {stats.pending}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-200/80 shadow-2xs flex items-center justify-between bg-gradient-to-br from-white to-purple-50/30">
            <div>
              <span className="text-xs font-semibold text-purple-700 block">深入諮詢中</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-1 block">
                {stats.consulting}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-2xs flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/30">
            <div>
              <span className="text-xs font-semibold text-emerald-700 block">已完成結案</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 block">
                {stats.completed}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 錯誤警告條 (若 Firestore 安全規則阻擋) */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">讀取資料庫發生錯誤：</p>
              <p className="mt-0.5">{error}</p>
              <p className="mt-1 text-[11px] text-rose-500">
                若為 Missing or insufficient permissions，請確認 Firebase Console 的 Firestore 規則已開放讀取權限。
              </p>
            </div>
          </div>
        )}

        {/* 列表工具列 (搜尋、狀態過濾、匯出) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* 搜尋框 */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋姓名、電話、單號或健康目標..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            />
          </div>

          {/* 狀態切換鈕群 */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: '全部' },
              { key: 'pending', label: '待聯繫' },
              { key: 'contacted', label: '已電聯' },
              { key: 'consulting', label: '諮詢中' },
              { key: 'completed', label: '已結案' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 匯出 CSV 按鈕 */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>匯出 CSV</span>
          </button>
        </div>

        {/* 清單主要區域 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
              <span>正在從 Cloud Firestore 即時載入問卷清單...</span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
              <Inbox className="w-10 h-10 text-slate-300 stroke-1" />
              <p className="font-medium text-slate-600">無符合條件的諮詢問卷</p>
              <p className="text-xs text-slate-400">當有新訪客在前台送出表單時，此處將自動即時顯示！</p>
            </div>
          ) : (
            <div>
              {/* 電腦端表格 */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">狀態</th>
                      <th className="py-3 px-4">預約單號 / 時間</th>
                      <th className="py-3 px-4">顧客姓名</th>
                      <th className="py-3 px-4">性別 / 年齡</th>
                      <th className="py-3 px-4">聯絡電話</th>
                      <th className="py-3 px-4">首要目標 / 困擾</th>
                      <th className="py-3 px-4">偏好聯繫時段</th>
                      <th className="py-3 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInquiries.map((item) => {
                      const badge = statusBadges[item.status || 'pending'] || statusBadges.pending;
                      const timeStr = item.clientTimestamp
                        ? new Date(item.clientTimestamp).toLocaleDateString('zh-TW', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-';

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedInquiry(item)}
                          className="hover:bg-teal-50/40 cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-700 block">
                              {item.inquiryId}
                            </span>
                            <span className="text-[11px] text-slate-400">{timeStr}</span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-slate-800 text-sm block">
                              {item.fullName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                            {item.gender === 'male' ? '男' : item.gender === 'female' ? '女' : '其他'} / {item.age} 歲
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                            {item.phone}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <span className="font-semibold text-teal-800 truncate block">
                              {item.primaryGoal}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {item.primaryConcerns?.join('、 ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                            {item.preferredContactTime}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              className="text-teal-600 hover:text-teal-800 font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                            >
                              <span>檢視</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 手機端卡片流 */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredInquiries.map((item) => {
                  const badge = statusBadges[item.status || 'pending'] || statusBadges.pending;
                  const timeStr = item.clientTimestamp
                    ? new Date(item.clientTimestamp).toLocaleDateString('zh-TW', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInquiry(item)}
                      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-base">{item.fullName}</span>
                          <span className="text-xs text-slate-400">
                            ({item.gender === 'male' ? '男' : '女'} / {item.age}歲)
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600">
                        <span className="text-teal-800 font-semibold block mb-0.5">
                          【目標】{item.primaryGoal}
                        </span>
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>單號：{item.inquiryId}</span>
                          <span>{timeStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-xs">
                        <a
                          href={`tel:${item.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-md"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{item.phone}</span>
                        </a>
                        <span className="text-teal-600 font-bold inline-flex items-center">
                          查看詳情 <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 詳情抽屜彈窗 */}
      <InquiryDetailModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
      />
    </div>
  );
};
