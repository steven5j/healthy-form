import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { HealthFormData } from '../types/form';

export const firebaseConfig = {
  apiKey: "AIzaSyDXCGiZO97wz1arpxGcoe8knpsWJn_gtFE",
  authDomain: "ytfannie-cute.firebaseapp.com",
  projectId: "ytfannie-cute",
  storageBucket: "ytfannie-cute.firebasestorage.app",
  messagingSenderId: "1034923770888",
  appId: "1:1034923770888:web:ef65408c3ee0f629c37dbd",
  measurementId: "G-0FTGBJRX97",
};

// 初始化 Firebase 與 Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function submitHealthForm(data: HealthFormData): Promise<{ success: boolean; id: string }> {
  const inquiryId = 'HF-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  try {
    // 寫入 Cloud Firestore 的 inquiries 集合
    await addDoc(collection(db, 'inquiries'), {
      inquiryId,
      ...data,
      status: 'pending', // 諮詢進度：待聯繫
      createdAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('寫入 Cloud Firestore 失敗:', error);
    throw error;
  }

  // 同步備份至 LocalStorage 方便本機離線查閱
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
