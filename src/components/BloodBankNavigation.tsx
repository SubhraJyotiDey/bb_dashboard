import { cn } from '@/lib/utils';

export type TabType =
  | 'overview'
  | 'inventory'
  | 'appointments'
  | 'donations'
  | 'redemptions'
  | 'verify'
  | 'rtidVerify';

interface BloodBankNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'inventory', label: 'Inventory', icon: '🩸' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
  { id: 'donations', label: 'Donations', icon: '📜' },
  { id: 'redemptions', label: 'Redemptions', icon: '🔄' },
  { id: 'verify', label: 'Verify & Redeem', icon: '✅' },
  { id: 'rtidVerify', label: 'Verify RTID', icon: '🔍' },
];

export const BloodBankNavigation = ({
  activeTab,
  onTabChange,
}: BloodBankNavigationProps) => {
  return (
    <div className="bg-card shadow-md border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <nav
          className="flex space-x-2 overflow-x-auto whitespace-nowrap py-2"
          aria-label="Main Navigation"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-4 py-2 font-semibold border-b-3 rounded-t-lg inline-flex gap-2 items-center transition-colors',
                activeTab === tab.id
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
