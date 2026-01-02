import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { ContractsView } from '@/components/views/ContractsView';
import { ChatView } from '@/components/views/ChatView';
import { PortfolioView } from '@/components/views/PortfolioView';
import { RemindersView } from '@/components/views/RemindersView';
import { SettingsView } from '@/components/views/SettingsView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [promptMsg, setpromptMsg] = useState<string | null>(null);

  const handleTabChange = (tab: string, contractId?: string, promptMsg?: string) => {
    setActiveTab(tab);
    if (contractId) {
      setSelectedContractId(contractId);
    }
    if (promptMsg) {
      setpromptMsg(promptMsg);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onTabChange={handleTabChange} />;
      // case 'contracts':
      //   return <ContractsView onTabChange={setActiveTab} />;
      case 'chat':
        return <ChatView selectedContractId={selectedContractId} promptMsg={promptMsg} />;
      // case 'portfolio':
      //   return <PortfolioView />;
      case 'reminders':
        return <RemindersView />;
      // case 'settings':
      //   return <SettingsView />;
      default:
        return <DashboardView onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="ml-64 min-h-screen">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
