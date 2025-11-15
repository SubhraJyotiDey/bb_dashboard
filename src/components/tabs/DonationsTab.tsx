import { Donation } from '@/types/bloodbank';
import { formatDate, formatTime } from '@/lib/bloodbank-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DonationsTabProps {
  donations: Donation[];
}

export const DonationsTab = ({ donations }: DonationsTabProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Donation History</h2>

      {donations.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No donations recorded yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.dRtid} className="p-5 card-hover">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {donation.donorName}
                    </h3>
                    <Badge
                      className={
                        donation.status === 'AVAILABLE'
                          ? 'bg-success/10 text-success border-success/20 border'
                          : 'bg-muted/10 text-muted-foreground border-muted/20 border'
                      }
                    >
                      {donation.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">D-RTID:</span>
                      <span className="ml-2 font-mono font-semibold">{donation.dRtid}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blood Group:</span>
                      <span className="ml-2 font-semibold text-primary">
                        {donation.bloodGroup}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">OTP:</span>
                      <span className="ml-2 font-mono font-semibold text-info">
                        {donation.otp}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 font-semibold">{donation.donationType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-semibold">{donation.donationLocation}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="ml-2 font-semibold">
                        {formatDate(donation.date)} at {formatTime(donation.date)}
                      </span>
                    </div>
                    {donation.hRtid && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <span className="text-muted-foreground">Linked H-RTID:</span>
                        <span className="ml-2 font-mono font-semibold text-warning">
                          {donation.hRtid}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
