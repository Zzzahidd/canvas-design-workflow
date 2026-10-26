import React, { useState } from 'react';
import { ThreadSidebar } from './ThreadSidebar';
import { useRoutineStore } from '@/store/routineStore';
import {
  Share2,
  BookOpen,
  Cpu,
  Play,
  Pause,
  MessageSquare,
  ArrowUp,
  Plus,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface ThreadRoutineDetailProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadRoutineDetail: React.FC<ThreadRoutineDetailProps> = ({ onNavigate }) => {
  const {
    routines,
    selectedRoutineId,
    runRoutineNow,
    pauseRoutine,
    resumeRoutine,
    updateRoutine,
    showToast,
  } = useRoutineStore();

  const routine =
    routines.find((r) => r.id === selectedRoutineId) || routines[0];

  const [inputFeedback, setInputFeedback] = useState('');
  const [skipHolidays, setSkipHolidays] = useState(
    routine?.settings?.skipHolidays ?? false
  );
  const [pauseAfter5, setPauseAfter5] = useState(
    routine?.settings?.pauseAfterUnread ?? true
  );
  const [emailCopy, setEmailCopy] = useState(
    routine?.settings?.emailCopy ?? true
  );

  const handleSettingsToggle = (setting: 'skip' | 'pause' | 'email') => {
    if (setting === 'skip') {
      const next = !skipHolidays;
      setSkipHolidays(next);
      updateRoutine(routine.id, {
        settings: { ...routine.settings!, skipHolidays: next },
      });
    } else if (setting === 'pause') {
      const next = !pauseAfter5;
      setPauseAfter5(next);
      updateRoutine(routine.id, {
        settings: { ...routine.settings!, pauseAfterUnread: next },
      });
    } else {
      const next = !emailCopy;
      setEmailCopy(next);
      updateRoutine(routine.id, {
        settings: { ...routine.settings!, emailCopy: next },
      });
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFeedback.trim()) return;
    showToast(`Instruction noted: "${inputFeedback}"`, 'info');
    setInputFeedback('');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <ThreadSidebar activeScreen="detail" onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#18181b]">
        {/* Top Header */}
        <div className="h-12 px-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span
              onClick={() => onNavigate?.('list')}
              className="hover:text-zinc-900 dark:hover:text-white cursor-pointer underline-offset-2 hover:underline"
            >
              Routines
            </span>
            <span>›</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {routine?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Share link copied to clipboard', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
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

        {/* Scrollable Detail Body */}
        <div className="flex-1 overflow-y-auto px-8 py-5">
          <div className="grid grid-cols-12 gap-8">
            {/* Left 8 Columns: Main Information & Sections */}
            <div className="col-span-8 space-y-6">
              {/* Routine Header Card */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {routine?.title}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{routine?.enabled ? 'On' : 'Paused'}</span>
                    </span>
                    <span className="text-xs text-zinc-400">· Owned by Maya</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onNavigate?.('chat')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Edit in chat</span>
                    </button>

                    {routine?.enabled ? (
                      <button
                        type="button"
                        onClick={() => pauseRoutine(routine.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => resumeRoutine(routine.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-emerald-600"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => runRoutineNow(routine.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run now</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {routine?.schedule} · Pacific Time · Next run: {routine?.nextRun}
                </div>

                {/* Instructions */}
                <div className="mt-3 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50/70 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Instructions
                  </div>
                  {routine?.instructions}
                </div>

                {/* Learned Pill */}
                <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-lg text-xs text-indigo-900 dark:text-indigo-300">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Learned: Skips newsletters since Oct 14, after you archived 9 in a row</span>
                  </div>
                  <button type="button" className="text-[11px] underline hover:text-indigo-700 dark:hover:text-indigo-200">
                    Undo
                  </button>
                </div>
              </div>

              {/* Today's Brief Section */}
              <div className="border border-zinc-200 dark:border-zinc-700/80 rounded-xl overflow-hidden bg-white dark:bg-[#1c1c1f]">
                <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Today's brief
                    </span>
                    <span className="text-zinc-500">Today, 8:30 AM · took 1m 48s · 3 needs you</span>
                  </div>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  {/* Needs a reply */}
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Needs a reply 3
                    </div>
                    <div className="space-y-2">
                      {routine?.needsReply?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/30"
                        >
                          <div>
                            <div className="font-medium text-zinc-900 dark:text-zinc-100">
                              {item.name} <span className="text-zinc-400 font-normal">· {item.company}</span>
                            </div>
                            <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                              "{item.message}"
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                              {item.action}
                            </span>
                            <button
                              type="button"
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today Schedule */}
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Today 3
                    </div>
                    <div className="space-y-1.5">
                      {routine?.todaySchedule?.map((cal) => (
                        <div
                          key={cal.id}
                          className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-zinc-500 text-[11px]">{cal.time}</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{cal.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400 text-[11px]">{cal.statusText}</span>
                            {cal.statusType === 'ready' && (
                              <button type="button" className="text-xs text-zinc-700 dark:text-zinc-300 underline">
                                Open
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Moved since yesterday */}
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Moved since yesterday 2
                    </div>
                    <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center justify-between py-1">
                        <span>Ticket 4821 has a proposed fix from Rafael</span>
                        <span className="text-zinc-400 text-[11px]">In IT support ↗</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span>Tom Becker replied on clause 7 of the Acme MSA</span>
                        <span className="text-zinc-400 text-[11px]">In Legal ↗</span>
                      </div>
                    </div>
                  </div>

                  {/* Can wait */}
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Can wait 1
                    </div>
                    <div className="flex items-center justify-between text-zinc-500">
                      <span>6 newsletters and 2 receipts</span>
                      <span className="text-[11px]">Skipped</span>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-zinc-500">
                    <span>2 replies drafted. Nothing is sent until you approve.</span>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Continue in chat
                    </button>
                  </div>
                </div>
              </div>

              {/* How it runs (6 steps) */}
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  How it runs <span className="text-zinc-400 font-normal">6 steps, in order</span>
                </div>
                <div className="space-y-1.5">
                  {routine?.steps?.map((step) => (
                    <div
                      key={step.order}
                      className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#1a1a1c] text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-400 text-[11px] w-4">{step.order}</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{step.text}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                        {step.tool}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Run history */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Run history <span className="text-zinc-400 font-normal">7</span>
                  </div>
                  <button type="button" className="text-[11px] text-zinc-400 hover:text-zinc-600">
                    All runs
                  </button>
                </div>
                <div className="space-y-1">
                  {routine?.history?.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between py-1.5 px-2 border-b border-zinc-100 dark:border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {h.status === 'warning' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        ) : h.status === 'error' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        ) : (
                          <span className="text-emerald-500 text-[10px]">✓</span>
                        )}
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{h.date}</span>
                        <span className="text-zinc-500 ml-2">{h.summary}</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">{h.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Side Controls & Settings */}
            <div className="col-span-4 space-y-5 text-xs">
              {/* Schedule Box */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-[#1a1a1c]">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Schedule
                  </div>
                  <button type="button" className="text-zinc-500 hover:underline">
                    Edit
                  </button>
                </div>
                <div className="text-zinc-700 dark:text-zinc-300 font-medium">
                  {routine?.schedule}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Pacific Time</div>

                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 font-medium">
                    Next runs 5
                  </div>
                  <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span>Wed, Oct 22, 8:30 AM</span>
                      <span className="text-zinc-400 text-[10px]">Tomorrow</span>
                    </div>
                    <div>Thu, Oct 23, 8:30 AM</div>
                    <div>Fri, Oct 24, 8:30 AM</div>
                    <div>Mon, Oct 27, 8:30 AM</div>
                    <div>Tue, Oct 28, 8:30 AM</div>
                  </div>
                </div>
              </div>

              {/* Reads Box */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-[#1a1a1c]">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 font-medium">
                  Reads 4
                </div>
                <div className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Mail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Calendar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Recorded work</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Past chats</span>
                  </div>
                </div>
              </div>

              {/* Delivery Box */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-[#1a1a1c]">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 font-medium">
                  Delivers to
                </div>
                <div className="text-zinc-800 dark:text-zinc-200 font-medium">
                  Chat in Saved, and email
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  maya@northwind.example
                </div>
              </div>

              {/* Settings Switches */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-[#1a1a1c] space-y-3">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                  Settings
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300">Skip US holidays</span>
                  <button
                    type="button"
                    onClick={() => handleSettingsToggle('skip')}
                    className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                      skipHolidays ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                        skipHolidays ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300">Pause after 5 unread briefs</span>
                  <button
                    type="button"
                    onClick={() => handleSettingsToggle('pause')}
                    className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                      pauseAfter5 ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                        pauseAfter5 ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300">Email a copy</span>
                  <button
                    type="button"
                    onClick={() => handleSettingsToggle('email')}
                    className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                      emailCopy ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                        emailCopy ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400">
                Created by Maya Okafor, Mar 18, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Change Routine Chat Bar */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]">
          <form onSubmit={handlePromptSubmit} className="relative">
            <div className="flex items-center border border-zinc-200 dark:border-zinc-700/80 rounded-xl bg-zinc-50 dark:bg-[#1f1f23] px-3 py-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 mr-2"
              >
                <Plus className="w-3 h-3" />
                <span>{routine?.title}</span>
              </button>
              <input
                type="text"
                value={inputFeedback}
                onChange={(e) => setInputFeedback(e.target.value)}
                placeholder="Change this routine..."
                className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
              />
              <span className="text-[11px] text-zinc-400 mr-2 hidden md:inline">
                You see the new version before it runs
              </span>
              <button
                type="submit"
                className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
