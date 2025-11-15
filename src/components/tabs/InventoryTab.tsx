import { Inventory } from '@/types/bloodbank';
import {
  BLOOD_GROUPS,
  getInventoryStatus,
  getStatusColor,
  getStatusEmoji,
  getStatusLabel,
} from '@/lib/bloodbank-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InventoryTabProps {
  inventory: Inventory;
  onRequestBlood: () => void;
}

export const InventoryTab = ({ inventory, onRequestBlood }: InventoryTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Blood Inventory Management</h2>
        <Button onClick={onRequestBlood} className="bg-primary hover:bg-primary-dark">
          🩸 Request Blood
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BLOOD_GROUPS.map((bg) => {
          const item = inventory[bg];
          const status = getInventoryStatus(item.available, item.total);
          const statusColor = getStatusColor(status);

          return (
            <Card key={bg} className="p-6 card-hover">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">{bg}</div>
                  <div className="text-sm text-muted-foreground">Blood Group</div>
                </div>
                <div className={`status-pill border ${statusColor}`}>
                  <span>{getStatusEmoji(status)}</span>
                  <span>{getStatusLabel(status)}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Units:</span>
                  <span className="font-bold text-lg text-foreground">{item.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available:</span>
                  <span className="font-bold text-lg text-success">{item.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reserved:</span>
                  <span className="font-bold text-lg text-warning">
                    {item.total - item.available}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    status === 'good'
                      ? 'bg-success'
                      : status === 'low'
                      ? 'bg-warning'
                      : 'bg-status-critical'
                  }`}
                  style={{
                    width: `${item.total > 0 ? (item.available / item.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
