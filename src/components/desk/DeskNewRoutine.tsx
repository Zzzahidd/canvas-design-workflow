import React from 'react';
import { DeskDrawer } from './DeskDrawer';
import { useRoutineStore } from '@/store/routineStore';
import {
  BookOpen,
  Info,
  Calendar,
  Clock,
  Play,
  Check,
  ChevronDown,
  FileText,
  X,
  Plus,
} from 'lucide-react';

interface DeskNewRoutineProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const DeskNewRoutine: React.FC<DeskNewRoutineProps> = ({ onNavigate }) => {
  const {
    draftForm,
    setDraftForm,
    createRoutineFromDraft,
    resetDraftForm,
    showToast,
  } = useRoutineStore();

  const handleDayToggle = (day: string) => {
    if (draftForm.days.includes(day)) {
      if (draftForm.days.length > 1) {
        setDraftForm({ days: draftForm.days.filter((d) => d !== day) });
      }
    } else {
      setDraftForm({ days: [...draftForm.days, day] });
    }
  };

  const handlePresetSelect = (preset: string) => {
    if (preset === 'Every weekday, 8:30 AM') {
      setDraftForm({
        preset,
        repeats: 'Weekdays',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        time: '8:30 AM',
      });
    } else if (preset === 'Every Monday, 9:00 AM') {
      setDraftForm({
        preset,
        repeats: 'Weekly',
        days: ['Mon'],
        time: '9:00 AM',
      });
    } else if (preset === 'Every other Thursday') {
      setDraftForm({
        preset,
        repeats: 'Every 2 weeks',
        days: ['Thu'],
        time: '10:00 AM',
      });
    } else if (preset === '1st of the month') {
      setDraftForm({
        preset,
        repeats: 'Monthly',
        days: ['Mon'],
        time: '9:00 AM',
      });
    }
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Left Desk Drawer */}
      <DeskDrawer activeScreen="create" onNavigate={onNavigate} />

      {/* Center Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
        {/* Header Bar */}
        <div className="h-12 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#18181b]">
          <div className="flex items-center gap-2 text-xs">
            <span
              onClick={() => onNavigate?.('list')}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer underline-offset-2 hover:underline"
            >
              Routines
            </span>
            <span className="text-zinc-400">/</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              New routine
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetDraftForm();
                onNavigate?.('list');
              }}
              className="px-2.5 py-1 rounded text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('skills')}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-zinc-200 dark:border-zinc-700 font-medium hover:bg-zinc-50 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse skills</span>
            </button>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center text-[10px] font-mono text-zinc-400">
            Today · Tue, Oct 21
          </div>

          {/* User Prompt Bubble */}
          <div className="flex justify-end">
            <div className="max-w-md bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl rounded-tr-sm p-3.5 text-xs text-zinc-800 dark:text-zinc-200 shadow-xs">
              <p className="leading-relaxed">{draftForm.prompt}</p>
              <div className="text-[10px] text-zinc-400 text-right mt-1 font-mono">
                10:24 AM
              </div>
            </div>
          </div>

          {/* Drafted Routine Card */}
          <div className="border border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 bg-white dark:bg-[#1a1a1c] space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                  Drafted a routine
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Startup email
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Status report
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                from your sentence · nothing runs yet
              </span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                type="text"
                value={draftForm.name}
                onChange={(e) => setDraftForm({ name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Instructions
              </label>
              <textarea
                rows={3}
                value={draftForm.instructions}
                onChange={(e) => setDraftForm({ instructions: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Schedule Matrix */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 w-14">Repeats</span>
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
                  {['Once', 'Daily', 'Weekdays', 'Weekly', 'Monthly'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setDraftForm({ repeats: r as any })}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        draftForm.repeats === r
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Every 2 weeks */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 w-14">Every</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">2</span>
                <span className="text-zinc-500">weeks</span>
              </div>

              {/* On Days */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 w-14">On</span>
                <div className="flex items-center gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`w-6 h-6 rounded text-xs font-medium ${
                        draftForm.days.includes(day)
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {day.slice(0, 2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* At Time */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 w-14">At</span>
                <input
                  type="text"
                  value={draftForm.time}
                  onChange={(e) => setDraftForm({ time: e.target.value })}
                  className="w-20 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-xs"
                />
                <span className="text-zinc-500">Pacific Time</span>
              </div>

              {/* Quick Picks */}
              <div className="pt-1">
                <span className="text-[10px] text-zinc-400 block mb-1">Quick picks</span>
                <div className="flex flex-wrap gap-1">
                  {['Every weekday, 8:30 AM', 'Every Monday, 9:00 AM', 'Every other Thursday', '1st of the month'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`px-2 py-0.5 rounded text-[10px] border ${
                        draftForm.preset === p
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Line */}
              <div className="pt-2 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Every 2 weeks on Thursday at 10:00 AM Pacific</span>
              </div>

              {/* Applied Note */}
              <div className="p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300">
                Applied: Kai reviews prototypes on Thursdays, so a morning update lands before his review. Memory, Lumen Labs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Inspector Rail */}
      <div className="w-64 h-full bg-[#fbfbfb] dark:bg-[#151517] p-4 flex flex-col justify-between overflow-y-auto text-xs space-y-4 flex-shrink-0">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 mb-3">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Before you create it
            </span>
            <div className="flex items-center gap-2">
              <button type="button" className="text-zinc-400 hover:text-zinc-700">
                <Info className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="text-zinc-400 hover:text-zinc-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Next 5 Runs with Relative Time */}
          <div className="mb-4">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Next 5 runs · Pacific Time
            </div>
            <div className="space-y-1.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>Thu, Oct 23, 10:00 AM</span>
                <span className="text-zinc-400 text-[10px]">in 2 days</span>
              </div>
              <div className="flex justify-between">
                <span>Thu, Nov 6, 10:00 AM</span>
                <span className="text-zinc-400 text-[10px]">in 2 weeks</span>
              </div>
              <div className="flex justify-between">
                <span>Thu, Nov 20, 10:00 AM</span>
                <span className="text-zinc-400 text-[10px]">in 4 weeks</span>
              </div>
              <div className="flex justify-between">
                <span>Thu, Dec 4, 10:00 AM</span>
                <span className="text-zinc-400 text-[10px]">in 6 weeks</span>
              </div>
              <div className="flex justify-between">
                <span>Thu, Dec 18, 10:00 AM</span>
                <span className="text-zinc-400 text-[10px]">in 8 weeks</span>
              </div>
            </div>
          </div>

          {/* Skills it will use */}
          <div className="mb-4 space-y-1.5">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Skills it will use
            </div>
            <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1c]">
              <div className="font-medium text-zinc-800 dark:text-zinc-200">
                Client email, startups
              </div>
              <div className="text-[10px] text-zinc-400">v43 · learned from 3,410 runs</div>
            </div>
            <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1c]">
              <div className="font-medium text-zinc-800 dark:text-zinc-200">
                Weekly status report
              </div>
              <div className="text-[10px] text-zinc-400">v9 · learned from 520 runs</div>
            </div>
            <button type="button" className="text-[11px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 pt-0.5">
              <Plus className="w-3 h-3" />
              <span>Add a skill</span>
            </button>
          </div>

          {/* Reads */}
          <div className="mb-4 space-y-1 text-zinc-600 dark:text-zinc-400">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Reads
            </div>
            <div>Tracker: Lumen prototype build</div>
            <div>Recorded work</div>
            <div>Loom</div>
            <div>Memory: Lumen Labs</div>
          </div>

          {/* Delivery */}
          <div className="mb-4 space-y-1 text-zinc-600 dark:text-zinc-400">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Delivery
            </div>
            <div>To: Ines Duarte</div>
            <div>Cc: Jonas Berg</div>
            <div>As: Email draft</div>
          </div>

          {/* Ask before sending */}
          <div className="mb-4 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1c] flex items-center justify-between">
            <div>
              <div className="font-medium text-zinc-800 dark:text-zinc-200">Ask before sending</div>
              <div className="text-[10px] text-zinc-400">Holds each update as a draft</div>
            </div>
            <button
              type="button"
              onClick={() => setDraftForm({ askBeforeSending: !draftForm.askBeforeSending })}
              className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                draftForm.askBeforeSending ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <span className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 ${draftForm.askBeforeSending ? 'translate-x-3' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              createRoutineFromDraft();
              if (onNavigate) onNavigate('list');
            }}
            className="w-full py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-xs hover:opacity-90 shadow-sm flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Create routine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
