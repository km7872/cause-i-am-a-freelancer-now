import { motion } from 'framer-motion';
import { Calendar, Building2, Clock, MessageSquare, Bell, MoreVertical, Trash } from 'lucide-react';
import { Contract } from '@/types/contract';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContractCardProps {
  contract: Contract;
  delay?: number;
  onChat?: (id: string) => void;
  onReminder?: (id: string) => void;
  onExtension?: (id: string) => void;
  onDelete?: (id: string) => void;
}


export function ContractCard({ contract, delay = 0, onChat, onReminder, onExtension, onDelete }: ContractCardProps) {
  const getStatusBadge = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <span className="status-active px-2.5 py-1 text-xs font-medium rounded-full border">Active</span>;
      case 'ending-soon':
        return <span className="status-ending-soon px-2.5 py-1 text-xs font-medium rounded-full border">Ending Soon</span>;
      case 'expired':
        return <span className="status-expired px-2.5 py-1 text-xs font-medium rounded-full border">Expired</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const end = new Date(contract.endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5 group hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {contract.role}
            </h3>
            <p className="text-sm text-muted-foreground">{contract.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(contract.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem onClick={() => onChat?.(contract.id)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with Contract
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => onReminder?.(contract.id)}>
                <Bell className="w-4 h-4 mr-2" />
                Set Reminder
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => onExtension?.(contract.id)}>
                <Clock className="w-4 h-4 mr-2" />
                Extend Contract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(contract.id)}>
                <Trash className="w-4 h-4 mr-2" />
                Delete Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
          </div>
        </div>

        {contract.status !== 'expired' && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={cn(
              "text-sm font-medium",
              daysRemaining <= 30 ? "text-warning" : "text-muted-foreground"
            )}>
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Ends today'}
            </span>
          </div>
        )}

        {contract.hourlyRate && (
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Hourly Rate: <span className="text-foreground font-semibold">${contract.hourlyRate}/hr</span>
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="glass"
          size="sm"
          className="flex-1"
          onClick={() => onChat?.(contract.id)}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </Button>
        {/* <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onReminder?.(contract.id)}
        >
          <Bell className="w-4 h-4" />
          Remind
        </Button> */}
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onExtension?.(contract.id)}
        >
          <Clock className="w-4 h-4" />
          Extend
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onDelete?.(contract.id)}
        >
          <Trash className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </motion.div>
  );
}
