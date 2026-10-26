import React, { useState } from 'react';
import { useRoutineStore } from '@/store/routineStore';
import {
  BookOpen,
  Plus,
  ArrowUp,
  Mail,
  Calendar,
  AlertCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface DeskRoutineListProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const DeskRoutineList: React.FC<DeskRoutineListProps> = ({ onNavigate }) => {
  const {
    routines,
    toggleRoutine,
    setSelectedRoutineId,
    setDraftForm,
    resumeRoutine,
    showToast,
  } = useRoutineStore();

  const [promptInput, setPromptInput] = useState('');

  const scheduled = routines.filter((r) => r.status === 'scheduled');
  const watching = routines.filter((r) => r.status === 'watching');
  const paused = routines.filter((r) => r.status === 'paused');

  // Split scheduled into 2 columns for the card grid
  const col1 = scheduled.slice(0, Math.ceil(scheduled.length / 2));
  const col2 = scheduled.slice(Math.ceil(scheduled.length / 2));

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setDraftForm({
      prompt: promptInput,
      name: promptInput.slice(0, 30),
      instructions: promptInput,
    });
    showToast(`Drafted routine from "${promptInput.slice(0, 24)}..."`, 'success');
    setPromptInput('');
    if (onNavigate) onNavigate('create');
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#18181b]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px]">
            D
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
            Routines
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDraftForm({
                name: 'New Desk Routine',
                instructions: 'Coordinate daily team activity and reporting.',
              });
              if (onNavigate) onNavigate('create');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New routine</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('skills')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Browse skills</span>
          </button>
        </div>
      </div>

      {/* Main Card Grid Canvas */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {/* Title & Status */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Routines
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Skills that run on a schedule, or watch for a change and stay quiet until it happens.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Next up: IT inbox triage · Today, 1:00 PM</span>
          </div>
        </div>

        {/* Scheduled 2-Column Card Grid */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
            Scheduled · <span className="font-normal lowercase">runs on set times</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-3">
              {col1.map((routine) => (
                <div
                  key={routine.id}
                  onClick={() => {
                    setSelectedRoutineId(routine.id);
                    onNavigate?.('detail');
                  }}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/40 dark:bg-[#1a1a1c] hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs group-hover:underline">
                        {routine.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {routine.schedule}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center">
                        {routine.owner.initials}
                      </div>
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
                          className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                            routine.enabled ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {routine.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Status row */}
                  <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {routine.lastRun.status === 'needs_review' ? (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">
                          Needs you: {routine.lastRun.summary}
                        </span>
                      ) : (
                        <span className="text-zinc-500">
                          Done: {routine.lastRun.summary}
                        </span>
                      )}
                    </div>

                    {routine.lastRun.status === 'needs_review' ? (
                      <button
                        type="button"
                        className="px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-medium"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-zinc-400 text-[10px]">
                        {routine.lastRun.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              {col2.map((routine) => (
                <div
                  key={routine.id}
                  onClick={() => {
                    setSelectedRoutineId(routine.id);
                    onNavigate?.('detail');
                  }}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/40 dark:bg-[#1a1a1c] hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs group-hover:underline">
                        {routine.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {routine.schedule} · <span className="text-zinc-500">Next {routine.nextRun}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center">
                        {routine.owner.initials}
                      </div>
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
                          className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                            routine.enabled ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {routine.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Status row */}
                  <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                    <div>
                      Done: {routine.lastRun.summary}
                    </div>
                    <span className="text-zinc-400 text-[10px]">
                      {routine.lastRun.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watching & Paused Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Watching */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Watching · <span className="font-normal lowercase">quiet until something changes</span>
            </div>
            {watching.map((routine) => (
              <div
                key={routine.id}
                onClick={() => {
                  setSelectedRoutineId(routine.id);
                  onNavigate?.('detail');
                }}
                className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/40 dark:bg-[#1a1a1c] hover:border-zinc-400 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {routine.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {routine.schedule} · Next {routine.nextRun}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center">
                    {routine.owner.initials}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRoutine(routine.id);
                    }}
                    className="w-7 h-4 rounded-full bg-zinc-900 dark:bg-white transition-colors relative flex items-center p-0.5"
                  >
                    <span className="w-3 h-3 rounded-full bg-white dark:bg-zinc-900 translate-x-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paused */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Paused · <span className="font-normal lowercase">kept, not running</span>
            </div>
            {paused.map((routine) => (
              <div
                key={routine.id}
                onClick={() => {
                  setSelectedRoutineId(routine.id);
                  onNavigate?.('detail');
                }}
                className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/40 dark:bg-[#1a1a1c] hover:border-zinc-400 transition-colors cursor-pointer flex items-center justify-between text-xs opacity-75"
              >
                <div>
                  <div className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {routine.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {routine.schedule}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resumeRoutine(routine.id);
                    }}
                    className="px-2 py-0.5 rounded text-[11px] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                  >
                    Resume
                  </button>
                  <div className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center">
                    {routine.owner.initials}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Footer Creation Prompt */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider">Start from:</span>
              <button type="button" onClick={() => setPromptInput('Morning brief')} className="hover:text-zinc-700 underline">
                Morning brief
              </button>
              <span>·</span>
              <button type="button" onClick={() => setPromptInput('End of day wrap-up')} className="hover:text-zinc-700 underline">
                End of day wrap-up
              </button>
              <span>·</span>
              <button type="button" onClick={() => setPromptInput('Watch for a reply')} className="hover:text-zinc-700 underline">
                Watch for a reply
              </button>
              <span>·</span>
              <button type="button" onClick={() => setPromptInput('Monthly client invoices')} className="hover:text-zinc-700 underline">
                Monthly client invoices
              </button>
            </div>
            <span>or say when and what in your own words</span>
          </div>

          <form onSubmit={handlePromptSubmit} className="relative">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe a routine: 'Every Monday at 9, ...'"
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 text-zinc-400 hover:text-zinc-800"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
