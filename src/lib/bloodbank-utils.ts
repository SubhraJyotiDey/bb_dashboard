import { BloodGroup, Inventory } from '@/types/bloodbank';

export const BLOOD_BANK_LOCATION = 'AIIMS Blood Bank, Delhi';

export const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const generateRtid = (type: 'D' | 'H'): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${type}-RTID-${dd}${mm}${yyyy}-${randomPart}`;
};

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateHrtidFormat = (
  hrtid: string
): { ok: boolean; reason?: string } => {
  const re = /^H-RTID-(\d{2})(\d{2})(\d{4})-([A-Z0-9]{4})$/;
  const m = re.exec(hrtid);
  if (!m) return { ok: false, reason: 'pattern' };

  const dd = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const yyyy = parseInt(m[3], 10);

  const date = new Date(yyyy, mm - 1, dd);
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return { ok: false, reason: 'invalid-date' };
  }

  if (yyyy < 2000 || yyyy > 2100) {
    return { ok: false, reason: 'invalid-year' };
  }

  return { ok: true };
};

export const getInventoryStatus = (
  available: number,
  total: number
): 'good' | 'low' | 'critical' => {
  const ratio = total > 0 ? available / total : 0;
  if (ratio > 0.5) return 'good';
  if (ratio > 0.2) return 'low';
  return 'critical';
};

export const getStatusColor = (status: 'good' | 'low' | 'critical'): string => {
  switch (status) {
    case 'good':
      return 'bg-success/10 text-success border-success/20';
    case 'low':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'critical':
      return 'bg-status-critical/10 text-status-critical border-status-critical/20';
  }
};

export const getStatusEmoji = (status: 'good' | 'low' | 'critical'): string => {
  switch (status) {
    case 'good':
      return '✅';
    case 'low':
      return '⚠️';
    case 'critical':
      return '🚨';
  }
};

export const getStatusLabel = (status: 'good' | 'low' | 'critical'): string => {
  switch (status) {
    case 'good':
      return 'Good Stock';
    case 'low':
      return 'Low Stock';
    case 'critical':
      return 'Critical';
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const getTodayDateString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const initializeInventory = (): Inventory => {
  return {
    'O+': { total: 45, available: 38 },
    'O-': { total: 12, available: 8 },
    'A+': { total: 30, available: 25 },
    'A-': { total: 10, available: 6 },
    'B+': { total: 28, available: 22 },
    'B-': { total: 8, available: 4 },
    'AB+': { total: 15, available: 12 },
    'AB-': { total: 5, available: 2 },
  };
};
