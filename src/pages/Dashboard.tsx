import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { QRCodeSVG } from 'qrcode.react';
import {
  Inventory,
  Appointment,
  Donation,
  Redemption,
  BloodRequest,
  Notification,
  KPIData,
  BloodGroup,
} from '@/types/bloodbank';
import {
  generateRtid,
  generateOtp,
  initializeInventory,
  BLOOD_BANK_LOCATION,
  validateHrtidFormat,
} from '@/lib/bloodbank-utils';
import { BloodBankHeader } from '@/components/BloodBankHeader';
import { BloodBankNavigation, TabType } from '@/components/BloodBankNavigation';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { InventoryTab } from '@/components/tabs/InventoryTab';
import { AppointmentsTab } from '@/components/tabs/AppointmentsTab';
import { DonationsTab } from '@/components/tabs/DonationsTab';
import { RedemptionsTab } from '@/components/tabs/RedemptionsTab';
import { VerifyTab } from '@/components/tabs/VerifyTab';
import { RtidVerifyTab } from '@/components/tabs/RtidVerifyTab';
import { BloodRequestModal, BloodRequestFormData } from '@/components/modals/BloodRequestModal';
import { DonationModal, DonationFormData } from '@/components/modals/DonationModal';
import { AppointmentModal, AppointmentFormData } from '@/components/modals/AppointmentModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [inventory, setInventory] = useState<Inventory>(initializeInventory());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const [bloodRequestModalOpen, setBloodRequestModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [checkInData, setCheckInData] = useState<{
    rtid: string;
    name: string;
    bloodGroup: BloodGroup;
  } | undefined>();

  // Calculate KPIs
  const kpi: KPIData = {
    totalInventory: Object.values(inventory).reduce((sum, item) => sum + item.total, 0),
    availableUnits: Object.values(inventory).reduce((sum, item) => sum + item.available, 0),
    todayAppointments: appointments.filter(a => a.status === 'Upcoming').length,
    totalDonations: donations.length,
    totalRedemptions: redemptions.length,
  };

  // Initialize with sample data
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Sample appointments
    const sampleAppointments: Appointment[] = [
      {
        appointmentRtid: generateRtid('D'),
        donorName: 'Rahul Verma',
        bloodGroup: 'O+',
        date: today,
        time: '10:30 AM',
        status: 'Upcoming',
      },
      {
        appointmentRtid: generateRtid('D'),
        donorName: 'Priya Sharma',
        bloodGroup: 'A+',
        date: today,
        time: '02:00 PM',
        status: 'Upcoming',
      },
    ];

    setAppointments(sampleAppointments);

    // Sample notifications
    addNotification({
      message: 'New blood donation registered: O+ by Rahul Verma',
      type: 'success',
    });
    addNotification({
      message: 'Low stock alert: AB- blood group is running low',
      type: 'warning',
    });
  }, []);

  const addNotification = (data: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      read: false,
      ...data,
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Confirm Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--muted)',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Logged Out', 'You have been logged out successfully.', 'success');
      }
    });
  };

  const handleBloodRequest = (data: BloodRequestFormData) => {
    const newRtid = generateRtid('H');
    const request: BloodRequest = {
      rtid: newRtid,
      patientName: data.patientName,
      bloodGroup: data.bloodGroup,
      units: data.units,
      city: data.city,
      requiredDate: data.requiredDate,
      requiredTime: data.requiredTime,
      hospitalName: BLOOD_BANK_LOCATION,
      status: 'PENDING',
      createdAt: new Date(),
    };

    setRequests((prev) => [request, ...prev]);

    // Show QR Code
    Swal.fire({
      title: '✅ Request Submitted Successfully!',
      html: `
        <div class="text-left space-y-2 mb-4">
          <p><strong>Patient:</strong> ${data.patientName}</p>
          <p><strong>Blood Group:</strong> ${data.bloodGroup}</p>
          <p><strong>Units:</strong> ${data.units}</p>
          <p><strong>H-RTID:</strong> <code class="bg-gray-100 px-2 py-1 rounded">${newRtid}</code></p>
        </div>
        <div id="qrcode-container" class="flex justify-center"></div>
      `,
      icon: 'success',
      confirmButtonText: 'Done',
      didOpen: () => {
        const container = document.getElementById('qrcode-container');
        if (container) {
          const qrDiv = document.createElement('div');
          container.appendChild(qrDiv);
          const root = document.createElement('div');
          qrDiv.appendChild(root);
          import('react-dom/client').then(({ createRoot }) => {
            createRoot(root).render(<QRCodeSVG value={newRtid} size={200} />);
          });
        }
      },
    });

    addNotification({
      message: `New blood request: ${data.units} unit(s) of ${data.bloodGroup} for ${data.patientName}`,
      type: 'info',
    });
  };

  const handleRegisterAppointment = (data: AppointmentFormData) => {
    const newAppointment: Appointment = {
      appointmentRtid: generateRtid('D'),
      donorName: data.donorName,
      bloodGroup: data.bloodGroup,
      date: new Date(data.date),
      time: data.time,
      status: 'Upcoming',
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    Swal.fire({
      title: 'Appointment Registered!',
      html: `
        <p>Appointment RTID: <strong>${newAppointment.appointmentRtid}</strong></p>
        <p>Donor: <strong>${data.donorName}</strong></p>
        <p>Blood Group: <strong>${data.bloodGroup}</strong></p>
      `,
      icon: 'success',
      confirmButtonText: 'Done',
    });

    addNotification({
      message: `New appointment registered: ${data.donorName} (${data.bloodGroup})`,
      type: 'info',
    });
  };

  const handleCheckIn = (appointment: Appointment) => {
    setCheckInData({
      rtid: appointment.appointmentRtid,
      name: appointment.donorName,
      bloodGroup: appointment.bloodGroup,
    });
    setDonationModalOpen(true);
  };

  const handleDonation = (data: DonationFormData) => {
    // Validate H-RTID if linked
    if (data.donationType === 'H-RTID-Linked' && data.linkedHrtid) {
      const validation = validateHrtidFormat(data.linkedHrtid);
      if (!validation.ok) {
        let message = 'Invalid H-RTID format. Expected H-RTID-ddmmyyyy-XXXX';
        if (validation.reason === 'invalid-date') {
          message = 'Invalid date in H-RTID. Please ensure day/month/year are correct.';
        } else if (validation.reason === 'invalid-year') {
          message = 'H-RTID year out of allowed range.';
        }
        Swal.fire('Invalid H-RTID', message, 'error');
        return;
      }
    }

    const newDRTID = generateRtid('D');
    const newOTP = generateOtp();

    const newDonation: Donation = {
      dRtid: newDRTID,
      otp: newOTP,
      bloodGroup: data.bloodGroup,
      donorName: data.donorName,
      donationType: data.donationType,
      hRtid: data.donationType === 'H-RTID-Linked' ? data.linkedHrtid || null : null,
      status: 'AVAILABLE',
      donationLocation: BLOOD_BANK_LOCATION,
      date: new Date(),
    };

    setDonations((prev) => [newDonation, ...prev]);

    // Update inventory if from appointment
    if (data.appointmentRtid) {
      setInventory((prev) => ({
        ...prev,
        [data.bloodGroup]: {
          total: prev[data.bloodGroup].total + 1,
          available: prev[data.bloodGroup].available + 1,
        },
      }));

      // Update appointment status
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentRtid === data.appointmentRtid
            ? { ...apt, status: 'Completed' as const }
            : apt
        )
      );
    }

    setCheckInData(undefined);

    // Show QR Code
    Swal.fire({
      title: '✅ Donation Registered Successfully!',
      html: `
        <div class="text-left space-y-2 mb-4">
          <p><strong>Donor:</strong> ${data.donorName}</p>
          <p><strong>Blood Group:</strong> ${data.bloodGroup}</p>
          <p><strong>D-RTID:</strong> <code class="bg-gray-100 px-2 py-1 rounded">${newDRTID}</code></p>
          <p><strong>OTP:</strong> <code class="bg-green-100 px-2 py-1 rounded text-green-700">${newOTP}</code></p>
          ${
            newDonation.hRtid
              ? `<p><strong>Linked H-RTID:</strong> <code class="bg-yellow-100 px-2 py-1 rounded">${newDonation.hRtid}</code></p>`
              : ''
          }
        </div>
        <div id="qrcode-donation" class="flex justify-center"></div>
      `,
      icon: 'success',
      confirmButtonText: 'Done',
      didOpen: () => {
        const container = document.getElementById('qrcode-donation');
        if (container) {
          const qrDiv = document.createElement('div');
          container.appendChild(qrDiv);
          const root = document.createElement('div');
          qrDiv.appendChild(root);
          import('react-dom/client').then(({ createRoot }) => {
            createRoot(root).render(<QRCodeSVG value={newDRTID} size={200} />);
          });
        }
      },
    });

    addNotification({
      message: `New donation: ${data.bloodGroup} by ${data.donorName}`,
      type: 'success',
    });
  };

  const handleVerifyAndRedeem = (rtid: string, otp: string) => {
    const donation = donations.find((d) => d.dRtid === rtid);

    if (!donation) {
      Swal.fire({
        title: '❌ Verification Failed',
        text: 'Donor RTID not found.',
        icon: 'error',
      });
      return;
    }

    if (donation.otp !== otp) {
      Swal.fire({
        title: '❌ Verification Failed',
        text: 'Invalid OTP.',
        icon: 'error',
      });
      return;
    }

    if (donation.status === 'REDEEMED') {
      Swal.fire({
        title: '❌ Verification Failed',
        text: 'Credit has already been redeemed.',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: 'Confirm Redemption?',
      html: `Are you sure you want to redeem the credit for <strong>${donation.bloodGroup}</strong> donated by <strong>${donation.donorName}</strong>?<br><br>This will finalize the transaction and update inventory.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Redeem Now',
      confirmButtonColor: 'var(--success)',
      cancelButtonColor: 'var(--muted)',
    }).then((result) => {
      if (result.isConfirmed) {
        // Update donation status
        setDonations((prev) =>
          prev.map((d) =>
            d.dRtid === donation.dRtid ? { ...d, status: 'REDEEMED' as const } : d
          )
        );

        // Add redemption
        const redemption: Redemption = {
          dRtid: donation.dRtid,
          bloodGroup: donation.bloodGroup,
          donationLocation: donation.donationLocation,
          redemptionLocation: BLOOD_BANK_LOCATION,
          linkedHRTID: donation.hRtid,
          date: new Date(),
        };
        setRedemptions((prev) => [redemption, ...prev]);

        // Update inventory
        setInventory((prev) => ({
          ...prev,
          [donation.bloodGroup]: {
            total: prev[donation.bloodGroup].total - 1,
            available: prev[donation.bloodGroup].available - 1,
          },
        }));

        Swal.fire({
          title: '✅ Redemption Successful!',
          html: `
            <p>D-RTID: <strong>${donation.dRtid}</strong></p>
            <p>Blood Group: <strong>${donation.bloodGroup}</strong></p>
            <p>Credit has been redeemed successfully.</p>
          `,
          icon: 'success',
          confirmButtonText: 'Done',
        });

        addNotification({
          message: `Credit redeemed: ${donation.bloodGroup} (${donation.dRtid})`,
          type: 'success',
        });
      }
    });
  };

  const handleVerifyRtid = (rtid: string) => {
    const isDRTID = rtid.startsWith('D-RTID');
    const isHRTID = rtid.startsWith('H-RTID');

    if (isDRTID) {
      const donation = donations.find((d) => d.dRtid === rtid);
      if (donation) {
        Swal.fire({
          title: '✅ Authentic Donor RTID (D-RTID)',
          html: `
            <div class="text-left space-y-2">
              <p><strong>RTID Type:</strong> Donor RTID (D-RTID)</p>
              <p><strong>Donor Name:</strong> ${donation.donorName}</p>
              <p><strong>Blood Group:</strong> ${donation.bloodGroup}</p>
              <p><strong>Donation Type:</strong> ${donation.donationType}</p>
              <p><strong>Donation Location:</strong> ${donation.donationLocation}</p>
              <p><strong>Linked Patient RTID:</strong> ${donation.hRtid || 'N/A (Standard Donation)'}</p>
              <p><strong>Credit Status:</strong> ${donation.status}</p>
            </div>
          `,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: '❌ D-RTID Not Found',
          text: 'This Donor RTID is not registered in the system.',
          icon: 'error',
        });
      }
    } else if (isHRTID) {
      const request = requests.find((r) => r.rtid === rtid);
      if (request) {
        Swal.fire({
          title: '✅ Authentic Patient Request (H-RTID)',
          html: `
            <div class="text-left space-y-2">
              <p><strong>RTID Type:</strong> Patient Request (H-RTID)</p>
              <p><strong>Patient Name:</strong> ${request.patientName}</p>
              <p><strong>Blood Group:</strong> ${request.bloodGroup}</p>
              <p><strong>Units Required:</strong> ${request.units}</p>
              <p><strong>Hospital Location:</strong> ${request.city}</p>
              <p><strong>Request Status:</strong> ${request.status}</p>
            </div>
          `,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: '❌ H-RTID Not Found',
          text: 'This Patient RTID is not registered or is outdated.',
          icon: 'error',
        });
      }
    } else {
      Swal.fire({
        title: '❌ Invalid RTID Format',
        text: 'RTID must start with D-RTID or H-RTID.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <BloodBankHeader
        onNotificationClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
        notificationCount={notifications.filter((n) => !n.read).length}
        onLogout={handleLogout}
      />

      <BloodBankNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        notifications={notifications}
        onClose={() => setNotificationDrawerOpen(false)}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {activeTab === 'overview' && <OverviewTab kpi={kpi} inventory={inventory} />}
        {activeTab === 'inventory' && (
          <InventoryTab
            inventory={inventory}
            onRequestBlood={() => setBloodRequestModalOpen(true)}
          />
        )}
        {activeTab === 'appointments' && (
          <AppointmentsTab
            appointments={appointments}
            onRegisterAppointment={() => setAppointmentModalOpen(true)}
            onCheckIn={handleCheckIn}
          />
        )}
        {activeTab === 'donations' && <DonationsTab donations={donations} />}
        {activeTab === 'redemptions' && <RedemptionsTab redemptions={redemptions} />}
        {activeTab === 'verify' && <VerifyTab onVerifyAndRedeem={handleVerifyAndRedeem} />}
        {activeTab === 'rtidVerify' && <RtidVerifyTab onVerifyRtid={handleVerifyRtid} />}
      </div>

      <BloodRequestModal
        isOpen={bloodRequestModalOpen}
        onClose={() => setBloodRequestModalOpen(false)}
        onSubmit={handleBloodRequest}
      />

      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => {
          setDonationModalOpen(false);
          setCheckInData(undefined);
        }}
        onSubmit={handleDonation}
        checkInData={checkInData}
      />

      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        onSubmit={handleRegisterAppointment}
      />
    </div>
  );
}
