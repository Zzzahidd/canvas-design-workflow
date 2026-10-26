import React from 'react';
import { ThreadSidebar } from './ThreadSidebar';
import { useRoutineStore } from '@/store/routineStore';
import {
  BookOpen,
  Cpu,
  CheckCircle2,
  ArrowUp,
  Plus,
  Calendar,
  Clock,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';

interface ThreadNewRoutineProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadNewRoutine: React.FC<ThreadNewRoutineProps> = ({ onNavigate }) => {
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
      {/* Left Sidebar */}
      <ThreadSidebar activeScreen="create" onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#18181b]">
        {/* Top Header */}
        <div className="h-12 px-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Routines</span>
            <span>›</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              New routine
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetDraftForm}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              Discard draft
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse skills</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-8 py-5">
          <div className="grid grid-cols-12 gap-8">
            {/* Left 8 Columns: Conversational Form */}
            <div className="col-span-8 space-y-4">
              {/* User Prompt Bubble (Top Right) */}
              <div className="flex justify-end mb-4">
                <div className="max-w-md bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl rounded-tr-sm p-3.5 text-xs text-zinc-800 dark:text-zinc-200 shadow-xs">
                  <p className="leading-relaxed">{draftForm.prompt}</p>
                  <div className="text-[10px] text-zinc-400 text-right mt-1 font-mono">
                    10:24 AM
                  </div>
                </div>
              </div>

              {/* Assistant Draft Response Card */}
              <div className="border border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 bg-white dark:bg-[#1a1a1c] space-y-4 shadow-xs">
                {/* Status Bar */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    Drafted a routine · Nothing runs until you create it
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Here is the routine. It writes from the tracker and your recorded work, and holds each update for you before it goes to Ines.
                </p>

                {/* Memory Note Chip */}
                <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span>
                    <strong>Memory, Lumen Labs:</strong> Kai reviews prototypes on Thursdays, so a morning update before that works.
                  </span>
                </div>

                {/* Input: Routine Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={draftForm.name}
                    onChange={(e) => setDraftForm({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Input: Instructions */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={draftForm.instructions}
                    onChange={(e) => setDraftForm({ instructions: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 leading-relaxed"
                  />
                </div>

                {/* Schedule Configuration Matrix */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Schedule
                  </div>

                  {/* Repeats Segmented Buttons */}
                  <div className="flex flex-wrap gap-1 bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-lg">
                    {['Once', 'Daily', 'Weekdays', 'Weekly', 'Monthly', 'Every 2 weeks'].map((rep) => (
                      <button
                        key={rep}
                        type="button"
                        onClick={() =>
                          setDraftForm({
                            repeats: rep as any,
                            preset: rep,
                          })
                        }
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

                  {/* Days Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 w-12">On</span>
                    <div className="flex items-center gap-1.5">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
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

                  {/* Time and Timezone */}
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
                    <div className="text-zinc-500">
                      Pacific Time (PT)
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1.5">
                      Presets
                    </span>
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
                          className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                            draftForm.preset === p
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white font-medium'
                              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
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
                    <span>
                      {draftForm.repeats} on {draftForm.days.join(', ')} at {draftForm.time} {draftForm.timezone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Creation Summary Card */}
            <div className="col-span-4 space-y-4">
              <div className="border border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-4 bg-zinc-50/40 dark:bg-[#1a1a1c] text-xs space-y-3">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  New routine
                </div>
                <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {draftForm.name || 'Untitled Routine'}
                </div>

                <div className="space-y-2 text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Runs</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {draftForm.repeats} on {draftForm.days.join(', ')} at {draftForm.time}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[11px]">Sends</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {draftForm.sendTo}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[11px]">Approval</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      Waits for you every time
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      createRoutineFromDraft();
                      if (onNavigate) onNavigate('list');
                    }}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-xs hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Create routine</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast('Testing routine run simulation...', 'info')}
                    className="w-full py-1.5 text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test run now</span>
                  </button>
                </div>

                {/* Next 5 Runs Preview */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Next runs 5
                  </div>
                  <div className="space-y-1 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                    <div>Thu, Oct 23, {draftForm.time}</div>
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

        {/* Bottom Change Routine Chat Bar */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]">
          <div className="flex items-center border border-zinc-200 dark:border-zinc-700/80 rounded-xl bg-zinc-50 dark:bg-[#1f1f23] px-3 py-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 mr-2">
              <Plus className="w-3 h-3" />
              <span>{draftForm.name}</span>
            </span>
            <input
              type="text"
              placeholder="Change this routine..."
              className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
            />
            <span className="text-[11px] text-zinc-400 mr-2 hidden md:inline">
              The draft updates as you describe changes
            </span>
            <button
              type="button"
              className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center hover:opacity-90"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
