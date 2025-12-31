import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Bell, 
  Settings,
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  // { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'chat', label: 'Chat with Contract', icon: MessageSquare },
  // { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  // { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">ContractFlow</h1>
            <p className="text-xs text-muted-foreground">Freelancer Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/30">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@example.com</p>
          </div>
          <button className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
