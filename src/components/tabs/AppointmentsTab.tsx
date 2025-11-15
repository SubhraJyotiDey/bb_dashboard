import { Appointment } from '@/types/bloodbank';
import { formatDate } from '@/lib/bloodbank-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppointmentsTabProps {
  appointments: Appointment[];
  onRegisterAppointment: () => void;
  onCheckIn: (appointment: Appointment) => void;
}

export const AppointmentsTab = ({
  appointments,
  onRegisterAppointment,
  onCheckIn,
}: AppointmentsTabProps) => {
  const getStatusBadge = (status: Appointment['status']) => {
    const variants: Record<Appointment['status'], string> = {
      Upcoming: 'bg-info/10 text-info border-info/20',
      Completed: 'bg-success/10 text-success border-success/20',
      Cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return variants[status];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Appointment Management</h2>
        <Button onClick={onRegisterAppointment} className="bg-primary hover:bg-primary-dark">
          📅 Register New Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No appointments scheduled for today.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.appointmentRtid} className="p-5 card-hover">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {appointment.donorName}
                    </h3>
                    <Badge className={`${getStatusBadge(appointment.status)} border`}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">RTID:</span>
                      <span className="ml-2 font-mono font-semibold">
                        {appointment.appointmentRtid}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blood Group:</span>
                      <span className="ml-2 font-semibold text-primary">
                        {appointment.bloodGroup}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="ml-2 font-semibold">
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <span className="ml-2 font-semibold">{appointment.time}</span>
                    </div>
                  </div>
                </div>
                {appointment.status === 'Upcoming' && (
                  <Button
                    onClick={() => onCheckIn(appointment)}
                    variant="default"
                    className="bg-success hover:bg-success/90"
                  >
                    ✅ Check-In & Donate
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
