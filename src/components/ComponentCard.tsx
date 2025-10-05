import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { ISSComponent } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { 
  Wind, 
  Battery, 
  Gauge, 
  Radio, 
  Zap, 
  Snowflake,
  Calendar,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ComponentCardProps {
  component: ISSComponent;
}

const typeIcons = {
  air_filter: Wind,
  battery: Battery,
  sensor: Gauge,
  communication: Radio,
  power_supply: Zap,
  cooling_system: Snowflake,
};

export const ComponentCard = ({ component }: ComponentCardProps) => {
  const navigate = useNavigate();
  const Icon = typeIcons[component.type];
  const isOverdue = component.nextMaintenance < Date.now();

  return (
    <Card 
      className="hover:border-primary transition-all cursor-pointer group bg-card/50 backdrop-blur-sm"
      onClick={() => navigate(`/component/${component.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {component.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                NFT: {component.nftId}
              </p>
            </div>
          </div>
          <StatusBadge status={component.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{component.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Next maintenance:</span>
          <span className={isOverdue ? 'text-destructive font-medium' : 'text-foreground'}>
            {format(new Date(component.nextMaintenance), 'MMM dd, yyyy')}
          </span>
          {isOverdue && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {component.type.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {component.events.length} events
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
