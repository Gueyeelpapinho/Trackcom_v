import { ComponentEvent } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { 
  Wrench, 
  PlayCircle, 
  Search, 
  RefreshCw,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventTimelineProps {
  events: ComponentEvent[];
}

const eventIcons = {
  installation: PlayCircle,
  repair: Wrench,
  inspection: Search,
  replacement: RefreshCw,
};

const eventColors = {
  installation: 'text-primary border-primary/30 bg-primary/5',
  repair: 'text-warning border-warning/30 bg-warning/5',
  inspection: 'text-secondary border-secondary/30 bg-secondary/5',
  replacement: 'text-destructive border-destructive/30 bg-destructive/5',
};

export const EventTimeline = ({ events }: EventTimelineProps) => {
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      {sortedEvents.map((event, index) => {
        const Icon = eventIcons[event.type];
        const colorClass = eventColors[event.type];

        return (
          <div key={event.id} className="flex gap-4 animate-fade-in">
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full border-2 ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              {index < sortedEvents.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-2" />
              )}
            </div>

            <Card className="flex-1 bg-card/30 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm capitalize">
                      {event.type.replace('_', ' ')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">
                      {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Performed by: <span className="text-foreground">{event.performedBy}</span>
                </p>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
