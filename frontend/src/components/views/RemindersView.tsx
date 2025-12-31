import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Calendar, Clock, Check, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  contractName?: string;
  type: 'contract-ending' | 'standup' | 'custom';
  isCompleted: boolean;
}

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Contract ending soon',
    dueDate: '2025-01-25',
    contractName: 'UI/UX Consultant - Design Agency Co.',
    type: 'contract-ending',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Weekly standup prep',
    dueDate: '2025-01-06',
    type: 'standup',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Submit timesheet',
    dueDate: '2024-12-31',
    type: 'custom',
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Review contract terms',
    dueDate: '2025-01-15',
    contractName: 'Senior Frontend Developer - TechStart Inc.',
    type: 'contract-ending',
    isCompleted: false,
  },
];

export function RemindersView() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', dueDate: '' });

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.dueDate) return;
    
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      dueDate: newReminder.dueDate,
      type: 'custom',
      isCompleted: false,
    };
    
    setReminders([reminder, ...reminders]);
    setNewReminder({ title: '', dueDate: '' });
    setIsAdding(false);
  };

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'contract-ending':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'standup':
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground mt-1">Stay on top of important dates and tasks</p>
        </div>
        <Button variant="glow" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Reminder
        </Button>
      </motion.div>

      {/* Add Reminder Form */}
      {isAdding && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="glass-card p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">New Reminder</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Reminder title..."
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              className="flex-1 bg-secondary border-border"
            />
            <Input
              type="date"
              value={newReminder.dueDate}
              onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
              className="md:w-48 bg-secondary border-border"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button variant="glow" onClick={handleAddReminder}>Add</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pending Reminders */}
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Upcoming ({pendingReminders.length})
        </h2>
        <div className="space-y-3">
          {pendingReminders.map((reminder, index) => {
            const daysUntil = getDaysUntil(reminder.dueDate);
            
            return (
              <motion.div
                key={reminder.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "glass-card p-4 flex items-center gap-4 group hover:border-primary/30 transition-all",
                  daysUntil <= 3 && "border-warning/30"
                )}
              >
                <button
                  onClick={() => toggleComplete(reminder.id)}
                  className="w-6 h-6 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-colors"
                >
                  <Check className="w-3 h-3 text-transparent group-hover:text-muted-foreground" />
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(reminder.type)}
                    <h3 className="font-medium text-foreground">{reminder.title}</h3>
                  </div>
                  {reminder.contractName && (
                    <p className="text-sm text-muted-foreground mt-0.5">{reminder.contractName}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-medium",
                      daysUntil <= 3 ? "text-warning" : "text-muted-foreground"
                    )}>
                      {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reminder.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Completed ({completedReminders.length})
          </h2>
          <div className="space-y-3 opacity-60">
            {completedReminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                className="glass-card p-4 flex items-center gap-4 group"
              >
                <button
                  onClick={() => toggleComplete(reminder.id)}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </button>
                
                <div className="flex-1">
                  <h3 className="font-medium text-foreground line-through">{reminder.title}</h3>
                </div>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
