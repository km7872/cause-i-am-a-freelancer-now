import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContractCard } from '@/components/dashboard/ContractCard';
import { UploadContractModal } from '@/components/dashboard/UploadContractModal';
import { Contract } from '@/types/contract';
import { cn } from '@/lib/utils';

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

interface ContractsViewProps {
  onTabChange: (tab: string) => void;
}

export function ContractsView({ onTabChange }: ContractsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'ending-soon' | 'expired'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || contract.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddContract = (data: any) => {
    const newContract: Contract = {
      id: Date.now().toString(),
      role: data.role,
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
      status: 'active',
      description: data.description,
    };
    setContracts([newContract, ...contracts]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Contracts</h1>
          <p className="text-muted-foreground mt-1">Manage all your freelance contracts</p>
        </div>
        <Button variant="glow" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Contract
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              {(['all', 'active', 'ending-soon', 'expired'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all capitalize",
                    filter === status
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {status === 'ending-soon' ? 'Ending' : status}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'list' ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contracts Grid */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
      )}>
        {filteredContracts.map((contract, index) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            delay={0.05 * index}
            onChat={() => onTabChange('chat')}
            onReminder={() => onTabChange('reminders')}
          />
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No contracts found matching your criteria</p>
        </motion.div>
      )}

      <UploadContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddContract}
      />
    </div>
  );
}
