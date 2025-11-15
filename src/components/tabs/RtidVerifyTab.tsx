import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RtidVerifyTabProps {
  onVerifyRtid: (rtid: string) => void;
}

export const RtidVerifyTab = ({ onVerifyRtid }: RtidVerifyTabProps) => {
  const [rtid, setRtid] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifyRtid(rtid.trim().toUpperCase());
  };

  const handleClear = () => {
    setRtid('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">
        Verify RTID Authenticity
      </h2>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="checkRTID" className="text-sm font-medium mb-2">
              Enter RTID to Verify (D-RTID or H-RTID)
            </Label>
            <Input
              id="checkRTID"
              type="text"
              value={rtid}
              onChange={(e) => setRtid(e.target.value)}
              placeholder="e.g., D-RTID-15112024-A1B2 or H-RTID-15112024-X1Y2"
              className="mt-1"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button type="submit" className="bg-info hover:bg-info/90">
              🔍 Check Authenticity
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
          <h4 className="font-semibold text-info mb-2">ℹ️ About RTID Verification:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              <strong>D-RTID</strong>: Donor RTID - Issued when blood is donated
            </li>
            <li>
              <strong>H-RTID</strong>: Hospital RTID - Issued for blood requests
            </li>
            <li>Verify authenticity before accepting or processing</li>
            <li>System will show full details if RTID is valid</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
