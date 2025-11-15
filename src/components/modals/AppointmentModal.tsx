import { useState } from 'react';
import { BloodGroup } from '@/types/bloodbank';
import { BLOOD_GROUPS, getTodayDateString } from '@/lib/bloodbank-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
}

export interface AppointmentFormData {
  donorName: string;
  bloodGroup: BloodGroup;
  date: string;
  time: string;
}

export const AppointmentModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AppointmentModalProps) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    donorName: '',
    bloodGroup: 'O+',
    date: getTodayDateString(),
    time: '10:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      donorName: '',
      bloodGroup: 'O+',
      date: getTodayDateString(),
      time: '10:00',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            📅 Register New Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="appointmentDonorName">Donor Full Name</Label>
            <Input
              id="appointmentDonorName"
              value={formData.donorName}
              onChange={(e) =>
                setFormData({ ...formData, donorName: e.target.value })
              }
              placeholder="e.g., Priya Singh"
              required
            />
          </div>

          <div>
            <Label htmlFor="appointmentBloodGroup">Blood Group</Label>
            <Select
              value={formData.bloodGroup}
              onValueChange={(value) =>
                setFormData({ ...formData, bloodGroup: value as BloodGroup })
              }
            >
              <SelectTrigger id="appointmentBloodGroup">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="appointmentTime">Appointment Time</Label>
              <Input
                id="appointmentTime"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              Register Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
