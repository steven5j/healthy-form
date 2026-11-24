// 這是 Firebase 前端 SDK 的選用整合模組
// 如需將表單直接儲存至 Firebase Firestore，請在 .env 中填入對應的 Firebase 專案設定值

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export async function submitHealthForm(data: unknown): Promise<{ success: boolean; id: string }> {
  // 若未來串接 Firestore，可在此處執行 collection('inquiries').add(...)
  // 目前預設使用模擬 API 延遲與 LocalStorage 存檔展示
  await new Promise((resolve) => setTimeout(resolve, 800));

  const inquiryId = 'HF-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  
  // 備份到 LocalStorage 便於測試與檢查
  try {
    const history = JSON.parse(localStorage.getItem('healthy_form_submissions') || '[]');
    history.unshift({ id: inquiryId, submittedAt: new Date().toISOString(), data });
    localStorage.setItem('healthy_form_submissions', JSON.stringify(history.slice(0, 20)));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }

  return {
    success: true,
    id: inquiryId,
  };
}
