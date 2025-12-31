import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-display font-bold text-foreground">{value}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              trend.isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}
