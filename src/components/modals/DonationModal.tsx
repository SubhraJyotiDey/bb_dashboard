import { useState, useEffect } from 'react';
import { BloodGroup, DonationType } from '@/types/bloodbank';
import { BLOOD_GROUPS } from '@/lib/bloodbank-utils';
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

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DonationFormData) => void;
  checkInData?: {
    rtid: string;
    name: string;
    bloodGroup: BloodGroup;
  };
}

export interface DonationFormData {
  donorName: string;
  bloodGroup: BloodGroup;
  donationType: DonationType;
  linkedHrtid?: string;
  appointmentRtid?: string;
}

export const DonationModal = ({
  isOpen,
  onClose,
  onSubmit,
  checkInData,
}: DonationModalProps) => {
  const [formData, setFormData] = useState<DonationFormData>({
    donorName: '',
    bloodGroup: 'O+',
    donationType: 'Standard Donation',
    linkedHrtid: '',
  });

  const [showHrtidField, setShowHrtidField] = useState(false);
  const [hrtidError, setHrtidError] = useState('');

  useEffect(() => {
    if (checkInData) {
      setFormData({
        donorName: checkInData.name,
        bloodGroup: checkInData.bloodGroup,
        donationType: 'Standard Donation',
        linkedHrtid: '',
        appointmentRtid: checkInData.rtid,
      });
    }
  }, [checkInData]);

  useEffect(() => {
    setShowHrtidField(formData.donationType === 'H-RTID-Linked');
    setHrtidError('');
  }, [formData.donationType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      donorName: '',
      bloodGroup: 'O+',
      donationType: 'Standard Donation',
      linkedHrtid: '',
    });
    setHrtidError('');
    setShowHrtidField(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            🩸 Register New Donor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="donorName">Donor Full Name</Label>
            <Input
              id="donorName"
              value={formData.donorName}
              onChange={(e) =>
                setFormData({ ...formData, donorName: e.target.value })
              }
              placeholder="e.g., Amit Sharma"
              required
              disabled={!!checkInData}
            />
          </div>

          <div>
            <Label htmlFor="donorBloodGroup">Blood Group</Label>
            <Select
              value={formData.bloodGroup}
              onValueChange={(value) =>
                setFormData({ ...formData, bloodGroup: value as BloodGroup })
              }
              disabled={!!checkInData}
            >
              <SelectTrigger id="donorBloodGroup">
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

          <div>
            <Label htmlFor="donationType">Donation Type</Label>
            <Select
              value={formData.donationType}
              onValueChange={(value) =>
                setFormData({ ...formData, donationType: value as DonationType })
              }
            >
              <SelectTrigger id="donationType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard Donation">Standard Donation</SelectItem>
                <SelectItem value="H-RTID-Linked">H-RTID-Linked Donation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showHrtidField && (
            <div>
              <Label htmlFor="linkedHrtid">
                Patient H-RTID (Format: H-RTID-ddmmyyyy-XXXX)
              </Label>
              <Input
                id="linkedHrtid"
                value={formData.linkedHrtid}
                onChange={(e) => {
                  setFormData({ ...formData, linkedHrtid: e.target.value });
                  setHrtidError('');
                }}
                placeholder="e.g., H-RTID-15112024-A1B2"
                required={showHrtidField}
                className={hrtidError ? 'border-destructive' : ''}
              />
              {hrtidError && (
                <p className="text-sm text-destructive mt-1">{hrtidError}</p>
              )}
            </div>
          )}

          {checkInData && (
            <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-sm text-info">
                ℹ️ Check-in appointment: <strong>{checkInData.rtid}</strong>
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              Register Donation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
