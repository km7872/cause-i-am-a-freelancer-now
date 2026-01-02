"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ContractCard } from '@/components/dashboard/ContractCard';
import { UploadContractModal } from '@/components/dashboard/UploadContractModal';
import { Contract } from '@/types/contract';


const mockContracts: Contract[] = [
  {
    id: '1',
    role: 'Senior Frontend Developer',
    company: 'TechStart Inc.',
    startDate: '2024-01-15',
    endDate: '2025-03-15',
    hourlyRate: 85,
    status: 'active',
  },
  {
    id: '2',
    role: 'UI/UX Consultant',
    company: 'Design Agency Co.',
    startDate: '2024-06-01',
    endDate: '2025-01-25',
    hourlyRate: 95,
    status: 'ending-soon',
  },
  {
    id: '3',
    role: 'React Developer',
    company: 'Startup Labs',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    hourlyRate: 75,
    status: 'expired',
  },
  {
    id: '4',
    role: 'Technical Lead',
    company: 'Enterprise Solutions',
    startDate: '2024-09-01',
    endDate: '2025-09-01',
    hourlyRate: 120,
    status: 'active',
  },
];

interface DashboardViewProps {
  onTabChange: (tab: string, contractId?: string) => void;
}

console.log("📁 DASHBOARD VIEW FILE LOADED");

export function DashboardView({ onTabChange }: DashboardViewProps) {
  console.log("🧱 DASHBOARD VIEW RENDER");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [contracts, setContracts] = useState<Contract[]>([]);

  const fetchContracts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/contracts/");
      const data = await response.json();

      console.log("📄 Fetched contracts");

      const mappedContracts: Contract[] = data.map((c: any) => {
        const fields =
          typeof c.fields === "string" ? JSON.parse(c.fields) : c.fields;

        return {
          id: c.id,
          role: fields.position,
          company: fields.company,
          startDate: fields.start_date,
          endDate: fields.end_date ?? "",
          hourlyRate: fields.salary ? Number(fields.salary): 0,
          status: fields.status,
        };
      });

      setContracts(mappedContracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  }

  useEffect(() => {
    // console.log("🔥 useEffect FIRED");
  

  fetchContracts();
}, []);

  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const endingSoon = contracts.filter(c => c.status === 'ending-soon').length;
  const totalEarnings = contracts.filter(c => c.status === 'active').reduce((acc, c) => acc + (c.hourlyRate || 0) * 160, 0);

  const handleAddContract = async (data: any) => {
    // const newContract: Contract = {
    //   id: Date.now().toString(),
    //   role: data.role,
    //   company: data.company,
    //   startDate: data.startDate,
    //   endDate: data.endDate,
    //   hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
    //   status: 'active',
    //   description: data.description,
    // };
    // setContracts([newContract, ...contracts]);
    fetchContracts();
    //refresh this view
    // onTabChange('dashboard');

  };

  const handleChat = (id: string) => {
    onTabChange('chat', id);
  };

  const handleReminder = (id: string) => {
    onTabChange('reminders');
  };

  const handleExtendContract = (id: string) => {
    onTabChange('chat', id); // add prompt to draft email for ext
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
    "Are you sure? This action cannot be undone."
  );

  if (!confirmed) {
    // User clicked "Cancel"
    return;
  }
    console.log("🗑️ Deleting contract");
    try {
      const response = await fetch("http://127.0.0.1:8000/delete_document/" + id, {
        method: "DELETE"
      });
      const data = await response;
      console.log("🗑️ Deleted contract");

      // console.log("RAW:", data);

      fetchContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, <span className="text-gradient">John</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your contracts and activities
          </p>
        </div>
        <Button variant="glow" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Contract
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Contracts"
          value={activeContracts}
          subtitle="Currently working"
          icon={FileText}
          delay={0.1}
        />
        <StatsCard
          title="Ending Soon"
          value={endingSoon}
          subtitle="Within 30 days"
          icon={AlertTriangle}
          delay={0.2}
        />
        <StatsCard
          title="Total Contracts"
          value={contracts.length}
          subtitle="All time"
          icon={Clock}
          delay={0.3}
        />
        <StatsCard
          title="Est. Monthly"
          value={`$${totalEarnings.toLocaleString()}`}
          subtitle="Based on hourly rates"
          icon={TrendingUp}
          // trend={{ value: 12, isPositive: true }}
          delay={0.4}
        />
      </div>

      {/* Contracts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-foreground">Your Contracts</h2>
          {/* <Button variant="ghost" size="sm" onClick={() => onTabChange('contracts')}>
            View all
          </Button> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* {contracts.slice(0, 4).map((contract, index) => ( */}
            {contracts.map((contract, index) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              delay={0.1 * index}
              onChat={handleChat}
              onExtension={handleExtendContract}
              // onReminder={handleReminder}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {/* <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="secondary" onClick={() => onTabChange('portfolio')} className="h-auto py-4 flex-col gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm">Update Portfolio</span>
          </Button>
          <Button variant="secondary" onClick={() => onTabChange('chat')} className="h-auto py-4 flex-col gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm">Chat with Contract</span>
          </Button>
          <Button variant="secondary" onClick={() => onTabChange('reminders')} className="h-auto py-4 flex-col gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm">Prep for Standup</span>
          </Button>
          <Button variant="secondary" onClick={() => onTabChange('settings')} className="h-auto py-4 flex-col gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <span className="text-sm">View Reminders</span>
          </Button>
        </div>
      </motion.div> */}

      <UploadContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddContract}
      />
    </div>
  );
}
