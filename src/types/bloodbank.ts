export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export type DonationType = 'Standard Donation' | 'H-RTID-Linked';

export type DonationStatus = 'AVAILABLE' | 'REDEEMED';

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface InventoryItem {
  total: number;
  available: number;
}

export type Inventory = Record<BloodGroup, InventoryItem>;

export interface Appointment {
  appointmentRtid: string;
  donorName: string;
  bloodGroup: BloodGroup;
  date: Date;
  time: string;
  status: AppointmentStatus;
}

export interface Donation {
  dRtid: string;
  otp: string;
  bloodGroup: BloodGroup;
  donorName: string;
  donationType: DonationType;
  hRtid: string | null;
  status: DonationStatus;
  donationLocation: string;
  date: Date;
}

export interface Redemption {
  dRtid: string;
  bloodGroup: BloodGroup;
  donationLocation: string;
  redemptionLocation: string;
  linkedHRTID: string | null;
  date: Date;
}

export interface BloodRequest {
  rtid: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  city: string;
  requiredDate: string;
  requiredTime: string;
  hospitalName: string;
  status: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface KPIData {
  totalInventory: number;
  availableUnits: number;
  todayAppointments: number;
  totalDonations: number;
  totalRedemptions: number;
}
