export type Gender = 'male' | 'female' | 'other';

export interface HealthFormData {
  // Step 1: 基本資料
  fullName: string;
  gender: Gender | '';
  age: string;
  height: string; // cm
  weight: string; // kg
  phone: string;
  email: string;
  lineId: string;

  // Step 2: 生活與飲食習慣
  sleepHours: string;
  sleepQuality: string;
  waterIntake: string;
  exerciseFrequency: string;
  dietHabits: string[];
  smoking: string;
  alcohol: string;

  // Step 3: 健康困擾與主要目標
  primaryConcerns: string[];
  primaryGoal: string;
  stressLevel: number; // 1-10
  targetTimeline: string;

  // Step 4: 既往狀況與諮詢留言
  chronicDiseases: string[];
  allergies: string;
  medicationsOrSupplements: string;
  inquiryDetails: string;
  preferredContactTime: string;
  agreedToTerms: boolean;
}

export interface BmiAnalysis {
  bmi: number | null;
  status: '過輕' | '正常' | '過重' | '肥胖' | '未填寫完整';
  statusColor: string;
  healthyWeightRange: [number, number] | null;
  waterRecommendation: number | null;
}
