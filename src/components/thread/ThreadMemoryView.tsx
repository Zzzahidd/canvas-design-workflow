import React, { useState } from 'react';
import { ThreadSidebar } from './ThreadSidebar';
import { MOCK_LEARNED_RULES, LearnedRule } from '@/types/contextData';
import {
  Cpu,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Building2,
  X,
} from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface ThreadMemoryViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadMemoryView: React.FC<ThreadMemoryViewProps> = ({ onNavigate }) => {
  const { showToast } = useRoutineStore();
  const [rules, setRules] = useState<LearnedRule[]>(MOCK_LEARNED_RULES);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRuleClient, setNewRuleClient] = useState('Acme Corp');
  const [newRuleText, setNewRuleText] = useState('');

  const filtered = rules.filter(
    (r) =>
      r.rule.toLowerCase().includes(search.toLowerCase()) ||
      r.client.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Removed learned rule from memory', 'info');
  };

  const handleToggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast('Toggled learned rule status', 'info');
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;

    const created: LearnedRule = {
      id: `rule-${Date.now()}`,
      client: newRuleClient,
      rule: newRuleText.trim(),
      source: 'Manual entry by Maya Okafor',
      dateAdded: 'Today',
      enabled: true,
    };

    setRules((prev) => [created, ...prev]);
    setNewRuleText('');
    setShowAddModal(false);
    showToast('Added new business rule to memory', 'success');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      {/* Thread Sidebar with active navigation */}
      <ThreadSidebar activeScreen="memory" onNavigate={onNavigate} />

      {/* Main Memory Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <header className="h-14 border-b border-zinc-200/80 dark:border-zinc-800 px-6 flex items-center justify-between bg-zinc-50/50 dark:bg-[#18181a] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Memory & Learned Rules</div>
              <div className="text-[11px] text-zinc-400">
                Institutional knowledge, client habits, and compliance precedents
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202024] text-xs text-zinc-800 dark:text-zinc-200 outline-none w-48 focus:w-60 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add rule</span>
            </button>
          </div>
        </header>

        {/* Rules List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                item.enabled
                  ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1d]'
                  : 'border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-[#151517] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                      {item.client}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Added {item.dateAdded}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                    {item.rule}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1.5">
                    Source: {item.source}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                {/* Enable toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                    item.enabled
                      ? 'bg-zinc-900 dark:bg-white'
                      : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full transition-transform bg-white dark:bg-zinc-900 ${
                      item.enabled ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleAddRule}
            className="bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl text-xs space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-sm">Add Business Precedent</span>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                Associated Client or Category
              </label>
              <input
                type="text"
                value={newRuleClient}
                onChange={(e) => setNewRuleClient(e.target.value)}
                placeholder="e.g. Acme Corp, Lumen Labs, Finance"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 outline-none text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                Rule / Learned Habit
              </label>
              <textarea
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                rows={3}
                placeholder="e.g. Require approval from Jonas before sending invoices exceeding $25,000."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 outline-none text-zinc-900 dark:text-white resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newRuleText.trim()}
                className="px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
              >
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
