import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'operational' | 'warning' | 'critical' | 'maintenance';
  className?: string;
}

const statusConfig = {
  operational: {
    label: 'Operational',
    variant: 'default' as const,
    className: 'bg-success text-success-foreground',
  },
  warning: {
    label: 'Warning',
    variant: 'secondary' as const,
    className: 'bg-warning text-warning-foreground',
  },
  critical: {
    label: 'Critical',
    variant: 'destructive' as const,
    className: 'bg-destructive text-destructive-foreground',
  },
  maintenance: {
    label: 'Maintenance',
    variant: 'outline' as const,
    className: 'border-primary text-primary',
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, 'font-mono text-xs', className)}
    >
      {config.label}
    </Badge>
  );
};
