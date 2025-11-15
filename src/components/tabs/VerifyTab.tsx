import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VerifyTabProps {
  onVerifyAndRedeem: (rtid: string, otp: string) => void;
}

export const VerifyTab = ({ onVerifyAndRedeem }: VerifyTabProps) => {
  const [rtid, setRtid] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifyAndRedeem(rtid.trim().toUpperCase(), otp.trim());
  };

  const handleClear = () => {
    setRtid('');
    setOtp('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">
        Verify & Redeem Blood Credit
      </h2>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="verifyRTID" className="text-sm font-medium mb-2">
              Enter Donor RTID (D-RTID)
            </Label>
            <Input
              id="verifyRTID"
              type="text"
              value={rtid}
              onChange={(e) => setRtid(e.target.value)}
              placeholder="e.g., D-RTID-15112024-A1B2"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="verifyOTP" className="text-sm font-medium mb-2">
              Enter 6-Digit OTP
            </Label>
            <Input
              id="verifyOTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g., 123456"
              maxLength={6}
              pattern="\d{6}"
              className="mt-1"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button type="submit" className="bg-success hover:bg-success/90">
              ✅ Verify & Redeem
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
          <h4 className="font-semibold text-info mb-2">ℹ️ Instructions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Enter the D-RTID provided at the time of donation</li>
            <li>Enter the 6-digit OTP shared with the donor</li>
            <li>Verify the details before confirming redemption</li>
            <li>Once redeemed, the credit cannot be used again</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
