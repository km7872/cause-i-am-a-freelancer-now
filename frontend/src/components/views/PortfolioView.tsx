import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Tag, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PortfolioEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];
}

const mockEntries: PortfolioEntry[] = [
  {
    id: '1',
    date: '2024-12-29',
    content: "Completed the new authentication system using OAuth2. Integrated with Google and GitHub providers. Also fixed 3 critical bugs in the payment flow.",
    tags: ['authentication', 'bug-fix', 'TechStart'],
  },
  {
    id: '2',
    date: '2024-12-28',
    content: "Led the sprint planning session. Defined 15 story points for the upcoming sprint. Started working on the dashboard redesign.",
    tags: ['planning', 'design', 'leadership'],
  },
  {
    id: '3',
    date: '2024-12-27',
    content: "Reviewed and merged 5 PRs. Helped junior dev with React hooks patterns. Deployed v2.1 to production.",
    tags: ['code-review', 'mentoring', 'deployment'],
  },
];

export function PortfolioView() {
  const [entries, setEntries] = useState<PortfolioEntry[]>(mockEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ content: '', tags: '' });
  const [standupMode, setStandupMode] = useState(false);

  const handleAddEntry = () => {
    if (!newEntry.content.trim()) return;
    
    const entry: PortfolioEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: newEntry.content,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({ content: '', tags: '' });
    setIsAdding(false);
  };

  const generateStandupSummary = () => {
    const recentEntries = entries.slice(0, 3);
    return recentEntries.map(e => `• ${e.content}`).join('\n');
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
          <h1 className="text-3xl font-display font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground mt-1">Track what you've been working on</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStandupMode(!standupMode)}>
            <Sparkles className="w-4 h-4" />
            {standupMode ? 'Exit Standup Mode' : 'Prep for Standup'}
          </Button>
          <Button variant="glow" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        </div>
      </motion.div>

      {/* Standup Mode */}
      {standupMode && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="glass-card p-6 border-primary/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground">Standup Summary</h2>
              <p className="text-sm text-muted-foreground">Based on your recent activities</p>
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">What I've been working on:</h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
              {generateStandupSummary()}
            </pre>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm">
              Copy to Clipboard
            </Button>
            <Button variant="ghost" size="sm">
              Regenerate
            </Button>
          </div>
        </motion.div>
      )}

      {/* Add Entry Form */}
      {isAdding && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="glass-card p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">What have you been up to?</h3>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe what you worked on today..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="min-h-[120px] bg-secondary border-border"
            />
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tags (comma separated): design, frontend, meeting"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button variant="glow" onClick={handleAddEntry}>Save Entry</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Entries Timeline */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5 group hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                {index < entries.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-2" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-foreground mb-3">{entry.content}</p>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs bg-secondary text-muted-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
