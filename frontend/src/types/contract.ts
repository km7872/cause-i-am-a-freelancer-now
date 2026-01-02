export interface Contract {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  hourlyRate?: number;
  status: 'active' | 'ending-soon' | 'expired';
  description?: string;
  fileName?: string;
}

export interface PortfolioEntry {
  id: string;
  date: string;
  content: string;
  tags?: string[];
  contractId: string;
}

export interface Reminder {
  id: string;
  contractId: string;
  message: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface NotificationSettings {
  standupReminder: 'daily' | 'weekly' | 'monthly';
  contractEndingReminder: number; // days before
  enabled: boolean;
}
