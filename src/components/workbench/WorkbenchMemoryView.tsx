import React, { useState } from 'react';
import { WorkbenchSidebar } from './WorkbenchSidebar';
import { MOCK_LEARNED_RULES, LearnedRule } from '@/types/contextData';
import { Search, Plus, Trash2, Cpu, Building2 } from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface WorkbenchMemoryViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const WorkbenchMemoryView: React.FC<WorkbenchMemoryViewProps> = ({ onNavigate }) => {
  const { showToast } = useRoutineStore();
  const [rules, setRules] = useState<LearnedRule[]>(MOCK_LEARNED_RULES);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('All');
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleClient, setNewRuleClient] = useState('Acme Corp');

  const clients = ['All', 'Acme Corp', 'Lumen Labs', 'Northwind Legal', 'General Brief'];

  const filtered = rules.filter((r) => {
    const matchClient = selectedClient === 'All' || r.client === selectedClient;
    const matchSearch =
      r.rule.toLowerCase().includes(search.toLowerCase()) ||
      r.source.toLowerCase().includes(search.toLowerCase());
    return matchClient && matchSearch;
  });

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Deleted rule from Workbench memory', 'info');
  };

  const handleToggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast('Updated rule status', 'info');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    const created: LearnedRule = {
      id: `rule-${Date.now()}`,
      client: newRuleClient,
      rule: newRuleText.trim(),
      source: 'Workbench policy manager',
      dateAdded: 'Today',
      enabled: true,
    };
    setRules((prev) => [created, ...prev]);
    setNewRuleText('');
    showToast('Added precedent to memory registry', 'success');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      <WorkbenchSidebar activeScreen="memory" onNavigate={onNavigate} />

      {/* Main Table Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 px-5 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-900 dark:text-white">
              Memory & Precedents
            </span>
            <span className="text-zinc-400">
              Contract compliance & learned habits database
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 pr-2.5 py-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202023] outline-none text-zinc-800 dark:text-zinc-200 w-44"
              />
            </div>
          </div>
        </header>

        {/* Client Subtabs */}
        <div className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#151517] flex items-center gap-1 shrink-0 text-xs">
          {clients.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedClient(c)}
              className={`px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                selectedClient === c
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Dense Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 font-medium border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase">
              <tr>
                <th className="px-4 py-2">Client / Scope</th>
                <th className="px-3 py-2">Learned Rule</th>
                <th className="px-3 py-2">Attribution Source</th>
                <th className="px-3 py-2">Added</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-4 py-2 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-zinc-900 dark:text-white">
                    {r.client}
                  </td>
                  <td className="px-3 py-2.5 text-zinc-800 dark:text-zinc-200 font-medium">
                    {r.rule}
                  </td>
                  <td className="px-3 py-2.5 text-zinc-400 text-[11px]">
                    {r.source}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-zinc-400">
                    {r.dateAdded}
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggle(r.id)}
                      className={`w-6 h-3.5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                        r.enabled ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-900 ${
                          r.enabled ? 'translate-x-2.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="p-1 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Form Inspector */}
      <div className="w-72 h-full bg-[#fcfcfd] dark:bg-[#161618] p-4 flex flex-col justify-between overflow-y-auto text-xs shrink-0">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-[10px]">
              Add Precedent
            </span>
            <div className="text-zinc-500 text-[11px] mt-0.5">
              Teach assistant rules for upcoming routines and chats
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Client or Domain
            </label>
            <input
              type="text"
              value={newRuleClient}
              onChange={(e) => setNewRuleClient(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202024] text-xs text-zinc-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Rule Statement
            </label>
            <textarea
              value={newRuleText}
              onChange={(e) => setNewRuleText(e.target.value)}
              rows={4}
              placeholder="e.g. Always check billing cycle dates before staging invoice PDF."
              className="w-full px-2.5 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202024] text-xs text-zinc-900 dark:text-white outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!newRuleText.trim()}
            className="w-full py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Store Precedent</span>
          </button>
        </form>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 font-mono">
          Memory Engine: Vector Synced
        </div>
      </div>
    </div>
  );
};
