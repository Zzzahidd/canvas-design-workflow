import React, { useState } from 'react';
import { DeskDrawer } from './DeskDrawer';
import { MOCK_LEARNED_RULES, LearnedRule } from '@/types/contextData';
import { Search, Plus, Trash2, Cpu, X } from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface DeskMemoryViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const DeskMemoryView: React.FC<DeskMemoryViewProps> = ({ onNavigate }) => {
  const { showToast } = useRoutineStore();
  const [rules, setRules] = useState<LearnedRule[]>(MOCK_LEARNED_RULES);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientInput, setClientInput] = useState('Acme Corp');
  const [ruleInput, setRuleInput] = useState('');

  const filtered = rules.filter(
    (r) =>
      r.rule.toLowerCase().includes(search.toLowerCase()) ||
      r.client.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Deleted precedent from memory', 'info');
  };

  const handleToggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast('Toggled rule status', 'info');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleInput.trim()) return;
    const created: LearnedRule = {
      id: `rule-${Date.now()}`,
      client: clientInput,
      rule: ruleInput.trim(),
      source: 'Desk policy rule',
      dateAdded: 'Today',
      enabled: true,
    };
    setRules((prev) => [created, ...prev]);
    setRuleInput('');
    setShowAddModal(false);
    showToast('Added new business rule', 'success');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      <DeskDrawer activeScreen="memory" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Cpu className="w-4 h-4 text-zinc-500" />
            <span>Memory & Precedents</span>
            <span className="text-zinc-400 font-normal">· {rules.length} stored rules</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#202024] outline-none text-zinc-800 dark:text-zinc-200 w-44"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs font-medium cursor-pointer hover:opacity-90 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add rule</span>
            </button>
          </div>
        </header>

        {/* 2-Column Modular Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-colors flex flex-col justify-between ${
                item.enabled
                  ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-[#1a1a1c]'
                  : 'border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-[#151517] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-white">
                    {item.client}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      item.enabled ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                        item.enabled ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed mb-1">
                  {item.rule}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Source: {item.source}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-zinc-400 font-mono">
                  Added {item.dateAdded}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
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
            onSubmit={handleAdd}
            className="bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl text-xs space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-sm">Add Learned Rule</span>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                Client / Scope
              </label>
              <input
                type="text"
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 outline-none text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">
                Precedent / Habit
              </label>
              <textarea
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                rows={3}
                placeholder="e.g. Always verify project deliverables with Kai before demo."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 outline-none text-zinc-900 dark:text-white resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!ruleInput.trim()}
                className="px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
