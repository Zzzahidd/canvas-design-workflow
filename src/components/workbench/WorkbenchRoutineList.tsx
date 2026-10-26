import React, { useState } from 'react';
import { WorkbenchSidebar } from './WorkbenchSidebar';
import { useRoutineStore } from '@/store/routineStore';
import {
  BookOpen,
  Filter,
  Search,
  MoreHorizontal,
  Plus,
  Play,
  RotateCcw,
} from 'lucide-react';

interface WorkbenchRoutineListProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const WorkbenchRoutineList: React.FC<WorkbenchRoutineListProps> = ({ onNavigate }) => {
  const {
    routines,
    filterTab,
    subTab,
    setSubTab,
    searchQuery,
    setSearchQuery,
    toggleRoutine,
    setSelectedRoutineId,
    setDraftForm,
    resumeRoutine,
    showToast,
  } = useRoutineStore();

  const [quickInput, setQuickInput] = useState('');

  // Filter routines based on tab and search
  const filteredRoutines = routines.filter((r) => {
    if (filterTab === 'scheduled' && r.status !== 'scheduled') return false;
    if (filterTab === 'watching' && r.status !== 'watching') return false;
    if (filterTab === 'paused' && r.status !== 'paused') return false;
    if (subTab === 'yours' && r.owner.name !== 'Maya Okafor') return false;
    if (subTab === 'team' && r.owner.name === 'Maya Okafor') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.schedule.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const scheduled = filteredRoutines.filter((r) => r.status === 'scheduled');
  const watching = filteredRoutines.filter((r) => r.status === 'watching');
  const paused = filteredRoutines.filter((r) => r.status === 'paused');

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    setDraftForm({
      prompt: quickInput,
      name: quickInput.slice(0, 30),
      instructions: quickInput,
    });
    showToast(`Drafted routine from "${quickInput.slice(0, 24)}..."`, 'success');
    setQuickInput('');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Dual Left Rails */}
      <WorkbenchSidebar activeScreen="list" onNavigate={onNavigate} />

      {/* Main Table Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
        {/* Header Bar */}
        <div className="h-12 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#18181b]">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              All routines
            </span>
            <span className="text-zinc-400">
              Run on a schedule, or watch for a change
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">
              This week 11.5h saved · 1.4M tokens
            </span>
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse skills</span>
            </button>
          </div>
        </div>

        {/* Subheader Filters & Search */}
        <div className="px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs flex-shrink-0 bg-[#fafafa] dark:bg-[#161618]">
          <div className="flex items-center gap-2">
            {/* Segmented Subtabs */}
            <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setSubTab('all')}
                className={`px-2 py-0.5 rounded ${
                  subTab === 'all'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                All {routines.length}
              </button>
              <button
                type="button"
                onClick={() => setSubTab('yours')}
                className={`px-2 py-0.5 rounded ${
                  subTab === 'yours'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Yours 4
              </button>
              <button
                type="button"
                onClick={() => setSubTab('team')}
                className={`px-2 py-0.5 rounded ${
                  subTab === 'team'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Your team's 4
              </button>
            </div>

            {/* Filters Button */}
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
            >
              <Filter className="w-3 h-3 text-zinc-400" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all routines /"
                className="w-48 pl-7 pr-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:border-zinc-400"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2" />
            </div>

            {/* Next up tag */}
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Next up: IT inbox triage · Today, 1:00 PM</span>
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {/* Table Header */}
          <div className="grid grid-cols-12 text-[11px] font-medium text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div className="col-span-4">Routine</div>
            <div className="col-span-2">Next run</div>
            <div className="col-span-3">Last run</div>
            <div className="col-span-2">Skills</div>
            <div className="col-span-1 text-right">Owner</div>
          </div>

          {/* Scheduled Section */}
          {scheduled.length > 0 && (
            <div className="mt-2 mb-4">
              <div className="text-[11px] font-semibold text-zinc-400 py-1">
                Scheduled {scheduled.length}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {scheduled.map((routine) => (
                  <div
                    key={routine.id}
                    onClick={() => {
                      setSelectedRoutineId(routine.id);
                      onNavigate?.('detail');
                    }}
                    className="grid grid-cols-12 items-center py-2.5 px-1 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 rounded transition-colors cursor-pointer group text-xs"
                  >
                    {/* Routine & Switch */}
                    <div className="col-span-4 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoutine(routine.id);
                        }}
                        className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                          routine.enabled ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 shadow-xs transition-transform ${
                            routine.enabled ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <div className="truncate">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline truncate">
                          {routine.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {routine.schedule}
                        </div>
                      </div>
                    </div>

                    {/* Next Run */}
                    <div className="col-span-2 font-medium text-zinc-700 dark:text-zinc-300 truncate">
                      {routine.nextRun}
                    </div>

                    {/* Last Run */}
                    <div className="col-span-3 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 truncate">
                      {routine.lastRun.status === 'needs_review' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      )}
                      {routine.lastRun.status === 'success' && (
                        <span className="text-emerald-500 text-[10px]">✓</span>
                      )}
                      <span className="truncate">{routine.lastRun.summary}</span>
                    </div>

                    {/* Skills Badges */}
                    <div className="col-span-2 flex items-center gap-1 truncate">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400 truncate">
                        {routine.skills[0] || 'Skill'}
                      </span>
                      {routine.skills.length > 1 && (
                        <span className="text-[10px] text-zinc-400">
                          +{routine.skills.length - 1}
                        </span>
                      )}
                    </div>

                    {/* Owner & Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center">
                        {routine.owner.initials}
                      </div>
                      <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watching Section */}
          {watching.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-zinc-400 py-1">
                Watching {watching.length}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {watching.map((routine) => (
                  <div
                    key={routine.id}
                    onClick={() => {
                      setSelectedRoutineId(routine.id);
                      onNavigate?.('detail');
                    }}
                    className="grid grid-cols-12 items-center py-2.5 px-1 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 rounded transition-colors cursor-pointer group text-xs"
                  >
                    <div className="col-span-4 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoutine(routine.id);
                        }}
                        className="w-7 h-4 rounded-full bg-zinc-900 dark:bg-white transition-colors relative flex items-center p-0.5"
                      >
                        <span className="w-3 h-3 rounded-full bg-white dark:bg-zinc-900 translate-x-3 shadow-xs" />
                      </button>
                      <div className="truncate">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline truncate">
                          {routine.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {routine.schedule}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-zinc-700 dark:text-zinc-300">
                      {routine.nextRun}
                    </div>

                    <div className="col-span-3 text-zinc-500 truncate">
                      {routine.lastRun.summary}
                    </div>

                    <div className="col-span-2 text-[10px] text-zinc-400">
                      Watch only
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center">
                        {routine.owner.initials}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paused Section */}
          {paused.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-zinc-400 py-1">
                Paused {paused.length}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {paused.map((routine) => (
                  <div
                    key={routine.id}
                    onClick={() => {
                      setSelectedRoutineId(routine.id);
                      onNavigate?.('detail');
                    }}
                    className="grid grid-cols-12 items-center py-2.5 px-1 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 rounded transition-colors cursor-pointer group text-xs opacity-75"
                  >
                    <div className="col-span-4 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoutine(routine.id);
                        }}
                        className="w-7 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 transition-colors relative flex items-center p-0.5"
                      >
                        <span className="w-3 h-3 rounded-full bg-white dark:bg-zinc-900 shadow-xs" />
                      </button>
                      <div className="truncate">
                        <div className="font-medium text-zinc-700 dark:text-zinc-300 group-hover:underline truncate">
                          {routine.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {routine.schedule}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-zinc-500">
                      {routine.nextRun}
                    </div>

                    <div className="col-span-3 text-zinc-500 truncate">
                      {routine.lastRun.summary}
                    </div>

                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          resumeRoutine(routine.id);
                        }}
                        className="px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                      >
                        Resume
                      </button>
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center">
                        {routine.owner.initials}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Inspector Rail */}
      <div className="w-60 h-full bg-[#fbfbfb] dark:bg-[#18181b] p-4 flex flex-col justify-between overflow-y-auto text-xs space-y-4">
        {/* Quick New Routine Box */}
        <div className="p-3 bg-white dark:bg-[#202023] rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            New routine
          </div>
          <p className="text-[11px] text-zinc-500 leading-tight mb-2">
            Every Monday at 9, send me the invoices that are past due...
          </p>
          <form onSubmit={handleDraftSubmit} className="space-y-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Say when, and what"
              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90"
            >
              Draft routine
            </button>
          </form>
        </div>

        {/* Needs you 1 Card */}
        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              Needs you 1
            </span>
          </div>
          <div className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">
            Morning brief
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            3 need a reply, 2 meetings...
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedRoutineId('routine-1');
              onNavigate?.('detail');
            }}
            className="mt-2 px-2.5 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[11px] font-medium"
          >
            Open
          </button>
        </div>

        {/* Up Next List */}
        <div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Up next
          </div>
          <div className="space-y-2 text-[11px]">
            <div>
              <div className="font-medium text-zinc-800 dark:text-zinc-200">
                IT inbox triage
              </div>
              <div className="text-zinc-400 font-mono text-[10px]">Today, 1:00 PM</div>
            </div>
            <div>
              <div className="font-medium text-zinc-800 dark:text-zinc-200">
                Signed Lumen SOW
              </div>
              <div className="text-zinc-400 font-mono text-[10px]">Today, 6:00 PM</div>
            </div>
            <div>
              <div className="font-medium text-zinc-800 dark:text-zinc-200">
                Morning brief
              </div>
              <div className="text-zinc-400 font-mono text-[10px]">Tomorrow, 8:30 AM</div>
            </div>
          </div>
        </div>

        {/* Start from a Template */}
        <div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Start from a template
          </div>
          <div className="space-y-1.5 text-[11px]">
            {[
              { name: 'Morning brief', sched: 'Every weekday at 8:30 AM' },
              { name: 'End of day wrap-up', sched: 'Every weekday at 5:30 PM' },
              { name: 'Watch for a reply', sched: 'Daily, quiet until it changes' },
              { name: 'Monthly client invoices', sched: 'Last weekday at 4:00 PM' },
            ].map((t) => (
              <div key={t.name} className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <div className="font-medium text-zinc-800 dark:text-zinc-200">{t.name}</div>
                  <div className="text-zinc-400 text-[10px]">{t.sched}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickInput(`Draft ${t.name}`)}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 font-medium"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
