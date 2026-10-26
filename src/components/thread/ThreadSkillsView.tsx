import React, { useState } from 'react';
import { ThreadSidebar } from './ThreadSidebar';
import { MOCK_WORKSPACE_SKILLS, WorkspaceSkill } from '@/types/contextData';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Play,
  Settings,
  X,
  Code,
  Sliders,
} from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface ThreadSkillsViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadSkillsView: React.FC<ThreadSkillsViewProps> = ({ onNavigate }) => {
  const { showToast } = useRoutineStore();
  const [skills, setSkills] = useState<WorkspaceSkill[]>(MOCK_WORKSPACE_SKILLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectingSkill, setInspectingSkill] = useState<WorkspaceSkill | null>(null);

  const categories = ['All', 'Finance', 'Communication', 'Engineering', 'Legal'];

  const filteredSkills = skills.filter((sk) => {
    const matchesCat = selectedCategory === 'All' || sk.category === selectedCategory;
    const matchesSearch =
      sk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sk.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleSkillEnabled = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    showToast('Updated skill availability in workspace', 'info');
  };

  const handleTestRun = (skill: WorkspaceSkill) => {
    showToast(`Executing dry run for: ${skill.name} (${skill.version})`, 'success');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      {/* Thread Sidebar with active navigation */}
      <ThreadSidebar activeScreen="skills" onNavigate={onNavigate} />

      {/* Main Skills Catalog Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <header className="h-14 border-b border-zinc-200/80 dark:border-zinc-800 px-6 flex items-center justify-between bg-zinc-50/50 dark:bg-[#18181a] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              SK
            </div>
            <div>
              <div className="font-semibold text-sm">Skills Catalog</div>
              <div className="text-[11px] text-zinc-400">
                22 verified workspace skills running on schedules or invoked in chat
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202024] text-xs text-zinc-800 dark:text-zinc-200 outline-none w-48 focus:w-64 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Category Filter Bar */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-xs text-zinc-400">
            Showing {filteredSkills.length} skills
          </div>
        </div>

        {/* Skills Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
          {filteredSkills.map((sk) => (
            <div
              key={sk.id}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#fdfdfd] dark:bg-[#1a1a1d] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                      {sk.name}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {sk.version}
                    </span>
                  </div>

                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSkillEnabled(sk.id)}
                    className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                      sk.enabled
                        ? 'bg-zinc-900 dark:bg-white'
                        : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full transition-transform bg-white dark:bg-zinc-900 ${
                        sk.enabled ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {sk.description}
                </p>

                {/* Tools Used */}
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {sk.tools.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px]">
                  {sk.runs}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectingSkill(sk)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    title="Skill Parameters"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestRun(sk)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Dry run</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Inspector Drawer / Modal */}
      {inspectingSkill && (
        <div className="absolute inset-0 z-30 bg-black/50 flex justify-end">
          <div className="w-96 bg-white dark:bg-[#1a1a1d] h-full p-6 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between text-xs animate-slide-in">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="font-semibold text-sm">{inspectingSkill.name}</div>
                <button
                  type="button"
                  onClick={() => setInspectingSkill(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400">
                    Version & Branch
                  </label>
                  <div className="font-mono text-zinc-800 dark:text-zinc-200 mt-1">
                    {inspectingSkill.version} (production release)
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400">
                    Connected Integrations
                  </label>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {inspectingSkill.tools.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400">
                    Execution Rules
                  </label>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    Always request human confirmation prior to dispatching customer-facing emails. Cap liability clauses in accordance with learned enterprise precedents.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast(`Saved settings for ${inspectingSkill.name}`, 'success');
                setInspectingSkill(null);
              }}
              className="w-full py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
