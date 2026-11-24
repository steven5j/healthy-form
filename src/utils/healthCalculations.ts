import type { BmiAnalysis } from '../types/form';

export function calculateBmi(heightCmStr: string, weightKgStr: string): BmiAnalysis {
  const heightCm = parseFloat(heightCmStr);
  const weightKg = parseFloat(weightKgStr);

  if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 50 || heightCm >= 250 || weightKg <= 20 || weightKg >= 300) {
    return {
      bmi: null,
      status: '未填寫完整',
      statusColor: 'text-slate-400',
      healthyWeightRange: null,
      waterRecommendation: null,
    };
  }

  const heightM = heightCm / 100;
  const bmiValue = Number((weightKg / (heightM * heightM)).toFixed(1));

  // 台灣衛福部標準
  // BMI < 18.5 過輕
  // 18.5 <= BMI < 24 正常
  // 24 <= BMI < 27 過重
  // BMI >= 27 肥胖
  let status: BmiAnalysis['status'] = '正常';
  let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (bmiValue < 18.5) {
    status = '過輕';
    statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (bmiValue >= 18.5 && bmiValue < 24) {
    status = '正常';
    statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  } else if (bmiValue >= 24 && bmiValue < 27) {
    status = '過重';
    statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else {
    status = '肥胖';
    statusColor = 'text-rose-600 bg-rose-50 border-rose-200';
  }

  // 理想體重 18.5 ~ 24
  const minWeight = Number((18.5 * heightM * heightM).toFixed(1));
  const maxWeight = Number((23.9 * heightM * heightM).toFixed(1));

  // 建議每日飲水量 (體重 x 30~35cc)
  const waterRecommendation = Math.round(weightKg * 33);

  return {
    bmi: bmiValue,
    status,
    statusColor,
    healthyWeightRange: [minWeight, maxWeight],
    waterRecommendation,
  };
}
