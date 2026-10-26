import React, { useState } from 'react';
import { ThreadSidebar } from './ThreadSidebar';
import { useRoutineStore } from '@/store/routineStore';
import {
  RefreshCw,
  Plus,
  ArrowUp,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  Scale,
  BookOpen,
  Search,
} from 'lucide-react';

interface ThreadRoutineListProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadRoutineList: React.FC<ThreadRoutineListProps> = ({ onNavigate }) => {
  const {
    routines,
    filterTab,
    setFilterTab,
    toggleRoutine,
    setSelectedRoutineId,
    setDraftForm,
    resumeRoutine,
  } = useRoutineStore();

  const [promptInput, setPromptInput] = useState('');

  // Count routines by category
  const scheduledList = routines.filter((r) => r.status === 'scheduled');
  const watchingList = routines.filter((r) => r.status === 'watching');
  const pausedList = routines.filter((r) => r.status === 'paused');

  // Filter based on active tab
  const getFilteredList = () => {
    if (filterTab === 'scheduled') return { scheduled: scheduledList, watching: [], paused: [] };
    if (filterTab === 'watching') return { scheduled: [], watching: watchingList, paused: [] };
    if (filterTab === 'paused') return { scheduled: [], watching: [], paused: pausedList };
    return { scheduled: scheduledList, watching: watchingList, paused: pausedList };
  };

  const filtered = getFilteredList();

  const handleTemplateClick = (title: string, schedule: string) => {
    setPromptInput(`Create a ${title} routine that runs ${schedule}.`);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setDraftForm({
      prompt: promptInput,
      name: promptInput.slice(0, 30),
      instructions: promptInput,
    });
    setPromptInput('');
    if (onNavigate) onNavigate('create');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <ThreadSidebar activeScreen="list" onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#18181b]">
        {/* Top Header Bar */}
        <div className="h-12 px-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Routines</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDraftForm({
                  name: 'New Custom Routine',
                  instructions: 'Perform automated check and notify in chat.',
                });
                if (onNavigate) onNavigate('create');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New routine</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.('skills')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse skills</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Routines
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Skills that run on a schedule, or watch for a change · Each one reports back in chat
            </p>
          </div>

          {/* Quick Describe / Input Box */}
          <form onSubmit={handlePromptSubmit} className="mb-6">
            <div className="relative border border-zinc-200 dark:border-zinc-700/80 rounded-xl bg-zinc-50/60 dark:bg-[#1f1f23] focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe a routine, e.g. Every Monday at 9, list overdue invoices and draft a reminder for each client"
                className="w-full pl-9 pr-32 py-3 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
              />
              <div className="absolute left-3 top-3 text-zinc-400">
                <Plus className="w-4 h-4" />
              </div>
              <div className="absolute right-2.5 top-2.5 flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  It drafts the schedule and steps for you to check
                </span>
                <button
                  type="submit"
                  className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Start from a template */}
          <div className="mb-6">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Start from a template
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { title: 'Morning brief', schedule: 'Every weekday at 8:30 AM' },
                { title: 'End of day wrap-up', schedule: 'Every weekday at 5:30 PM' },
                { title: 'Watch for a reply', schedule: 'Daily, quiet until it changes' },
                { title: 'Monthly client invoices', schedule: 'Last weekday at 4:00 PM' },
              ].map((tpl) => (
                <div
                  key={tpl.title}
                  onClick={() => handleTemplateClick(tpl.title, tpl.schedule)}
                  className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#1f1f23] hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    <RefreshCw className="w-3 h-3 text-zinc-400" />
                    <span className="truncate">{tpl.title}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 truncate">
                    {tpl.schedule}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Filter */}
          <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`pb-2 relative ${
                filterTab === 'all'
                  ? 'text-zinc-900 dark:text-white font-semibold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-zinc-900 dark:after:bg-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              All {routines.length}
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('scheduled')}
              className={`pb-2 relative ${
                filterTab === 'scheduled'
                  ? 'text-zinc-900 dark:text-white font-semibold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-zinc-900 dark:after:bg-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Scheduled {scheduledList.length}
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('watching')}
              className={`pb-2 relative ${
                filterTab === 'watching'
                  ? 'text-zinc-900 dark:text-white font-semibold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-zinc-900 dark:after:bg-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Watching {watchingList.length}
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('paused')}
              className={`pb-2 relative ${
                filterTab === 'paused'
                  ? 'text-zinc-900 dark:text-white font-semibold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-zinc-900 dark:after:bg-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Paused {pausedList.length}
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 text-[11px] font-medium text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="col-span-5">Routine</div>
            <div className="col-span-3">Last run</div>
            <div className="col-span-2">Next run</div>
            <div className="col-span-2 text-right">Skills</div>
          </div>

          {/* Scheduled Section */}
          {filtered.scheduled.length > 0 && (
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-zinc-400 py-1">
                Scheduled {filtered.scheduled.length}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filtered.scheduled.map((routine) => (
                  <div
                    key={routine.id}
                    onClick={() => {
                      setSelectedRoutineId(routine.id);
                      onNavigate?.('detail');
                    }}
                    className="grid grid-cols-12 items-center py-2.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 rounded-lg px-1 transition-colors cursor-pointer group"
                  >
                    {/* Routine Title + Toggle */}
                    <div className="col-span-5 flex items-center gap-3">
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
                          className={`w-3 h-3 rounded-full transition-transform bg-white dark:bg-zinc-900 shadow-xs ${
                            routine.enabled ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <div className="truncate">
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline">
                          {routine.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 ml-2">
                          {routine.schedule}
                        </span>
                      </div>
                    </div>

                    {/* Last Run */}
                    <div className="col-span-3 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                      {routine.lastRun.status === 'needs_review' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      )}
                      {routine.lastRun.status === 'success' && (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">✓</span>
                      )}
                      <span className="truncate">{routine.lastRun.summary}</span>
                    </div>

                    {/* Next Run */}
                    <div className="col-span-2 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {routine.nextRun}
                    </div>

                    {/* Skills + Owner */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Mail className="w-3.5 h-3.5" />
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-semibold flex items-center justify-center">
                        {routine.owner.initials}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watching Section */}
          {filtered.watching.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] font-semibold text-zinc-400 py-1">
                Watching {filtered.watching.length}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filtered.watching.map((routine) => (
                  <div
                    key={routine.id}
                    onClick={() => {
                      setSelectedRoutineId(routine.id);
                      onNavigate?.('detail');
                    }}
                    className="grid grid-cols-12 items-center py-2.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 rounded-lg px-1 transition-colors cursor-pointer group"
                  >
                    <div className="col-span-5 flex items-center gap-3">
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
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline">
                          {routine.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 ml-2">
                          {routine.schedule}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-3 text-xs text-zinc-500 truncate">
                      {routine.lastRun.summary}
                    </div>

                    <div className="col-span-2 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {routine.nextRun}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-[11px] text-zinc-400">None</span>
                      <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-semibold flex items-center justify-center">
                        {routine.owner.initials}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paused Section */}
          {filtered.paused.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] font-semibold text-zinc-400 py-1">
                Paused {filtered.paused.length}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filtered.paused.map((routine) => (
                  <div
                    key={routine.id}
                    onClick={() => {
                      setSelectedRoutineId(routine.id);
                      onNavigate?.('detail');
                    }}
                    className="grid grid-cols-12 items-center py-2.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 rounded-lg px-1 transition-colors cursor-pointer opacity-75 group"
                  >
                    <div className="col-span-5 flex items-center gap-3">
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
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:underline">
                          {routine.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 ml-2">
                          {routine.schedule}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-4 text-xs text-zinc-500 truncate">
                      {routine.lastRun.summary}
                    </div>

                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          resumeRoutine(routine.id);
                        }}
                        className="px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Resume
                      </button>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Scale className="w-3.5 h-3.5 text-zinc-400" />
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
    </div>
  );
};
