import React, { useState } from 'react';
import { WorkbenchSidebar } from './WorkbenchSidebar';
import { MOCK_WORKSPACE_SKILLS, WorkspaceSkill } from '@/types/contextData';
import { Search, Play, Sliders, CheckCircle2 } from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface WorkbenchSkillsViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const WorkbenchSkillsView: React.FC<WorkbenchSkillsViewProps> = ({ onNavigate }) => {
  const { showToast } = useRoutineStore();
  const [skills, setSkills] = useState<WorkspaceSkill[]>(MOCK_WORKSPACE_SKILLS);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState<WorkspaceSkill>(skills[0]);

  const categories = ['All', 'Finance', 'Communication', 'Engineering', 'Legal'];

  const filtered = skills.filter((s) => {
    const matchCat = selectedCat === 'All' || s.category === selectedCat;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    showToast('Updated skill state in Workbench registry', 'info');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      <WorkbenchSidebar activeScreen="skills" onNavigate={onNavigate} />

      {/* Main Table Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 px-5 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-900 dark:text-white">
              Skills Registry
            </span>
            <span className="text-zinc-400">
              22 production skills · Automated verification
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 pr-2.5 py-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202023] outline-none text-zinc-800 dark:text-zinc-200 w-44"
              />
            </div>
          </div>
        </header>

        {/* Subheader Filters */}
        <div className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#151517] flex items-center gap-1 shrink-0 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCat(c)}
              className={`px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                selectedCat === c
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
                <th className="px-4 py-2">Skill</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Version</th>
                <th className="px-3 py-2">Runs</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedSkill(s)}
                  className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors ${
                    selectedSkill.id === s.id ? 'bg-zinc-50 dark:bg-zinc-800/50 font-medium' : ''
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-zinc-900 dark:text-white">
                      {s.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-xs">
                      {s.description}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-zinc-500">{s.category}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                    {s.version}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-zinc-500">
                    {s.runs}
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSkill(s.id);
                      }}
                      className={`w-6 h-3.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        s.enabled ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-900 ${
                          s.enabled ? 'translate-x-2.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Simulating dry run for ${s.name}`, 'success');
                      }}
                      className="px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[10px] font-medium"
                    >
                      Run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Inspector Rail */}
      <div className="w-72 h-full bg-[#fcfcfd] dark:bg-[#161618] p-4 flex flex-col justify-between overflow-y-auto text-xs shrink-0">
        <div className="space-y-4">
          <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-[10px]">
              Skill Inspector
            </span>
            <div className="text-base font-semibold text-zinc-900 dark:text-white mt-1">
              {selectedSkill.name}
            </div>
            <div className="font-mono text-[10px] text-zinc-400">
              {selectedSkill.version} · {selectedSkill.category}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Description
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs">
              {selectedSkill.description}
            </p>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Connected Tools
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {selectedSkill.tools.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => showToast(`Executing ${selectedSkill.name} dry run...`, 'success')}
              className="w-full py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Execute Skill</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 font-mono">
          Registry Status: 200 OK · Synced
        </div>
      </div>
    </div>
  );
};
