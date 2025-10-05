import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { EventTimeline } from '@/components/EventTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Hash,
  Plus,
  Wind,
  Battery,
  Gauge,
  Radio,
  Zap,
  Snowflake,
} from 'lucide-react';
import { format } from 'date-fns';

const typeIcons = {
  air_filter: Wind,
  battery: Battery,
  sensor: Gauge,
  communication: Radio,
  power_supply: Zap,
  cooling_system: Snowflake,
};

export default function ComponentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getComponent } = useApp();
  
  const component = id ? getComponent(id) : undefined;

  if (!component) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-card/30">
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">Component not found</p>
              <Button onClick={() => navigate('/')} className="mt-4" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const Icon = typeIcons[component.type];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Component Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-mission">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {component.nftId}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={component.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{component.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {component.type.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Events:</span>
                    <span className="font-medium">{component.events.length}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Installation Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <p className="text-sm font-mono">
                        {format(new Date(component.installationDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Maintenance</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-secondary" />
                      <p className="text-sm font-mono">
                        {format(new Date(component.lastMaintenance), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Next Maintenance</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-warning" />
                      <p className="text-sm font-mono">
                        {format(new Date(component.nextMaintenance), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                {component.metadata && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-sm font-semibold">Metadata</p>
                    {component.metadata.manufacturer && (
                      <div>
                        <p className="text-xs text-muted-foreground">Manufacturer</p>
                        <p className="text-sm">{component.metadata.manufacturer}</p>
                      </div>
                    )}
                    {component.metadata.serialNumber && (
                      <div>
                        <p className="text-xs text-muted-foreground">Serial Number</p>
                        <p className="text-sm font-mono">{component.metadata.serialNumber}</p>
                      </div>
                    )}
                    {component.metadata.specifications && (
                      <div>
                        <p className="text-xs text-muted-foreground">Specifications</p>
                        <p className="text-sm">{component.metadata.specifications}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Event Timeline */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Event History</CardTitle>
                  <Button 
                    onClick={() => navigate(`/add-event/${component.id}`)}
                    size="sm"
                    className="gap-2 bg-gradient-mission hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Immutable blockchain record of all component events
                </p>
              </CardHeader>
              <CardContent>
                {component.events.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No events recorded yet</p>
                  </div>
                ) : (
                  <EventTimeline events={component.events} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
