import React, { useState } from 'react';
import { DeskDrawer } from './DeskDrawer';
import { MOCK_WORKSPACE_SKILLS, WorkspaceSkill } from '@/types/contextData';
import { Search, Play, Boxes } from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface DeskSkillsViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const DeskSkillsView: React.FC<DeskSkillsViewProps> = ({ onNavigate }) => {
  const { showToast } = useRoutineStore();
  const [skills, setSkills] = useState<WorkspaceSkill[]>(MOCK_WORKSPACE_SKILLS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Finance', 'Communication', 'Engineering', 'Legal'];

  const filtered = skills.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    showToast('Toggled skill availability', 'info');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      <DeskDrawer activeScreen="skills" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Boxes className="w-4 h-4 text-zinc-500" />
            <span>Workspace Skills</span>
            <span className="text-zinc-400 font-normal">· 22 skills available</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#202024] outline-none text-zinc-800 dark:text-zinc-200 w-44 focus:w-56 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Filter Chips Bar */}
        <div className="px-6 py-2.5 border-b border-zinc-100 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#151517] flex items-center gap-1.5 shrink-0 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeCategory === c
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 2-Column Modular Cards Grid (Desk Signature Layout) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
          {filtered.map((sk) => (
            <div
              key={sk.id}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-[#1a1a1c] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-white">
                      {sk.name}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {sk.version}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      sk.enabled ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                        sk.enabled ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                  {sk.description}
                </p>

                <div className="flex gap-1.5 flex-wrap">
                  {sk.tools.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px]">
                  {sk.runs}
                </span>

                <button
                  type="button"
                  onClick={() => showToast(`Executing dry run: ${sk.name}`, 'success')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-medium cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Dry run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
