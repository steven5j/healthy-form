import type { HealthFormData } from './form';

export type InquiryStatus = 'pending' | 'contacted' | 'consulting' | 'completed';

export interface InquiryRecord extends HealthFormData {
  id: string; // Firestore Document ID
  inquiryId: string; // e.g. HF-ABC1234
  status: InquiryStatus;
  consultantNotes?: string;
  createdAt?: {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
  } | string | null;
  clientTimestamp?: string;
  updatedAt?: {
    toDate?: () => Date;
  } | string | null;
}
