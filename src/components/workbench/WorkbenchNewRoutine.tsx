import React from 'react';
import { WorkbenchSidebar } from './WorkbenchSidebar';
import { useRoutineStore } from '@/store/routineStore';
import {
  BookOpen,
  Calendar,
  Clock,
  Play,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';

interface WorkbenchNewRoutineProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const WorkbenchNewRoutine: React.FC<WorkbenchNewRoutineProps> = ({ onNavigate }) => {
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
      {/* Dual Left Rails */}
      <WorkbenchSidebar activeScreen="create" onNavigate={onNavigate} />

      {/* Main Center & Right Workstation */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <div className="h-12 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#18181b]">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span
              onClick={() => onNavigate?.('list')}
              className="hover:text-zinc-900 dark:hover:text-white cursor-pointer underline-offset-2 hover:underline"
            >
              All routines
            </span>
            <span>/</span>
            <span>New routine</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">
              This week 11.5h saved · 1.4M tokens
            </span>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse skills</span>
            </button>
          </div>
        </div>

        {/* Action Header */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#151517] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {draftForm.name || 'Untitled Routine'}
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                Draft
              </span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              Drafted from your sentence just now · Nothing runs until you create it
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetDraftForm();
                onNavigate?.('list');
              }}
              className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => showToast('Simulating routine run...', 'info')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Test run now</span>
            </button>

            <button
              type="button"
              onClick={() => {
                createRoutineFromDraft();
                onNavigate?.('list');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Create routine</span>
            </button>
          </div>
        </div>

        {/* Workstation Form & Inspector Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-12 divide-x divide-zinc-200 dark:divide-zinc-800">
          {/* Main 8-Col Form */}
          <div className="col-span-8 p-6 space-y-5 overflow-y-auto">
            {/* Section: Describe it */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-[#1a1a1c] space-y-2">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Describe it · <span className="font-normal lowercase">Drafted into the routine below. Describe a change to review it.</span>
              </div>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                "{draftForm.prompt}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Drafted a routine from this</span>
                <button type="button" className="underline hover:text-zinc-800">
                  Edit in chat
                </button>
              </div>
            </div>

            {/* Section: Routine Info */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#1a1a1c] space-y-3">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Routine · <span className="font-normal lowercase">Name it, and say what it does in plain words</span>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1">Name</label>
                <input
                  type="text"
                  value={draftForm.name}
                  onChange={(e) => setDraftForm({ name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs bg-zinc-50/40 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={draftForm.instructions}
                  onChange={(e) => setDraftForm({ instructions: e.target.value })}
                  className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs bg-zinc-50/40 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 leading-relaxed"
                />
              </div>
            </div>

            {/* Section: Schedule Matrix */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#1a1a1c] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Schedule · <span className="font-normal lowercase">Every 2 weeks on Thursday at 10:00 AM Pacific</span>
                </div>
              </div>

              {/* Presets */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Presets</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Every weekday, 8:30 AM',
                    'Every Monday, 9:00 AM',
                    'Every other Thursday',
                    '1st of the month',
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                        draftForm.preset === p
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white font-medium'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repeats Segmented */}
              <div className="flex flex-wrap gap-1 bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-lg">
                {['Once', 'Daily', 'Weekdays', 'Weekly', 'Monthly', 'Every 2 weeks'].map((rep) => (
                  <button
                    key={rep}
                    type="button"
                    onClick={() => setDraftForm({ repeats: rep as any, preset: rep })}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      draftForm.repeats === rep
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {rep}
                  </button>
                ))}
              </div>

              {/* On Days */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 w-12">On</span>
                <div className="flex items-center gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                        draftForm.days.includes(day)
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                      }`}
                    >
                      {day.slice(0, 2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* At Time */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 w-12">At</span>
                  <input
                    type="text"
                    value={draftForm.time}
                    onChange={(e) => setDraftForm({ time: e.target.value })}
                    className="w-24 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-xs"
                  />
                </div>
                <div className="text-zinc-500">Pacific Time (PT)</div>
              </div>

              {/* Summary Line */}
              <div className="pt-2 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  {draftForm.repeats} on {draftForm.days.join(', ')} at {draftForm.time} {draftForm.timezone}
                </span>
              </div>

              {/* Note */}
              <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                Kai reviews prototypes on Thursdays, so a morning update works before his review. From Memory, Lumen Labs
              </div>
            </div>
          </div>

          {/* Right 4-Col Inspector */}
          <div className="col-span-4 p-5 space-y-4 overflow-y-auto text-xs bg-[#fbfbfb] dark:bg-[#161618]">
            <div className="p-4 bg-white dark:bg-[#1c1c1f] rounded-xl border border-zinc-200 dark:border-zinc-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {draftForm.name || 'Untitled Routine'}
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
                  Draft
                </span>
              </div>
              <div className="text-[11px] text-zinc-500">
                Every 2 weeks on Thursday at 10:00 AM Pacific
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">First run</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">
                    Thu, Oct 23, 10:00 AM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Skills</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sources</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sends to</span>
                  <span className="text-zinc-800 dark:text-zinc-200">{draftForm.sendTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Delivery</span>
                  <span className="text-zinc-800 dark:text-zinc-200">{draftForm.delivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Asks first</span>
                  <span className="text-zinc-800 dark:text-zinc-200">Yes, every time</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={createRoutineFromDraft}
                  className="w-full py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90"
                >
                  Create routine
                </button>
              </div>
            </div>

            {/* Next 5 Runs */}
            <div className="p-3.5 bg-white dark:bg-[#1c1c1f] rounded-xl border border-zinc-200 dark:border-zinc-700/80">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Next 5 runs · Pacific Time
              </div>
              <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Thu, Oct 23, {draftForm.time}</span>
                  <span className="text-zinc-400 text-[10px]">Next</span>
                </div>
                <div>Thu, Nov 6, {draftForm.time}</div>
                <div>Thu, Nov 20, {draftForm.time}</div>
                <div>Thu, Dec 4, {draftForm.time}</div>
                <div>Thu, Dec 18, {draftForm.time}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
