import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import type { HealthFormData } from '../types/form';
import type { InquiryRecord, InquiryStatus } from '../types/inquiry';

export const firebaseConfig = {
  apiKey: "AIzaSyDXCGiZO97wz1arpxGcoe8knpsWJn_gtFE",
  authDomain: "ytfannie-cute.firebaseapp.com",
  projectId: "ytfannie-cute",
  storageBucket: "ytfannie-cute.firebasestorage.app",
  messagingSenderId: "1034923770888",
  appId: "1:1034923770888:web:ef65408c3ee0f629c37dbd",
  measurementId: "G-0FTGBJRX97",
};

// 初始化 Firebase 與 服務
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ==============================
// 1. 前台表單送出
// ==============================
export async function submitHealthForm(data: HealthFormData): Promise<{ success: boolean; id: string }> {
  const inquiryId = 'HF-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  try {
    await addDoc(collection(db, 'inquiries'), {
      inquiryId,
      ...data,
      status: 'pending', // 初始進度：待聯繫
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

// ==============================
// 2. 身分驗證 (Google Auth)
// ==============================
export async function loginWithGoogle(): Promise<User> {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ==============================
// 3. 後台管理：問卷讀取與狀態更新
// ==============================
export function subscribeToInquiries(
  onData: (items: InquiryRecord[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: InquiryRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
        } as InquiryRecord;
      });
      onData(records);
    },
    (err) => {
      console.error('即時監聽 inquiries 失敗:', err);
      if (onError) onError(err);
    }
  );
}

export async function updateInquiryStatusAndNote(
  docId: string,
  status: InquiryStatus,
  consultantNotes?: string
): Promise<void> {
  const docRef = doc(db, 'inquiries', docId);
  const updatePayload: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (consultantNotes !== undefined) {
    updatePayload.consultantNotes = consultantNotes;
  }
  await updateDoc(docRef, updatePayload);
}

export async function deleteInquiryDoc(docId: string): Promise<void> {
  const docRef = doc(db, 'inquiries', docId);
  await deleteDoc(docRef);
}
