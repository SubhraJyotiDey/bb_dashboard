import { KPIData, Inventory } from '@/types/bloodbank';
import { BLOOD_GROUPS, getInventoryStatus, getStatusColor, getStatusEmoji, getStatusLabel } from '@/lib/bloodbank-utils';
import { Card } from '@/components/ui/card';

interface OverviewTabProps {
  kpi: KPIData;
  inventory: Inventory;
}

export const OverviewTab = ({ kpi, inventory }: OverviewTabProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Blood Bank Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
        <Card className="p-5 border-l-4 border-l-muted-foreground card-hover">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Total Inventory
          </div>
          <div className="text-3xl font-bold text-foreground">{kpi.totalInventory}</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-success card-hover">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Available Units
          </div>
          <div className="text-3xl font-bold text-success">{kpi.availableUnits}</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-info card-hover">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Today's Appointments
          </div>
          <div className="text-3xl font-bold text-info">{kpi.todayAppointments}</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-primary card-hover">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Total Donations
          </div>
          <div className="text-3xl font-bold text-primary">{kpi.totalDonations}</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-warning card-hover">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Total Redemptions
          </div>
          <div className="text-3xl font-bold text-warning">{kpi.totalRedemptions}</div>
        </Card>
      </div>

      {/* Inventory Summary */}
      <h3 className="text-xl font-semibold text-foreground mb-4">Inventory Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BLOOD_GROUPS.map((bg) => {
          const item = inventory[bg];
          const status = getInventoryStatus(item.available, item.total);
          const statusColor = getStatusColor(status);

          return (
            <Card key={bg} className="p-5 card-hover">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-2xl font-bold text-primary">{bg}</div>
                  <div className="text-sm text-muted-foreground">Blood Group</div>
                </div>
                <div className={`status-pill border ${statusColor}`}>
                  <span>{getStatusEmoji(status)}</span>
                  <span>{getStatusLabel(status)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-foreground">{item.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-semibold text-success">{item.available}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reserved:</span>
                  <span className="font-semibold text-warning">
                    {item.total - item.available}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
