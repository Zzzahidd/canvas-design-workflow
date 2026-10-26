import React, { useState } from 'react';
import { WorkbenchSidebar } from './WorkbenchSidebar';
import { useRoutineStore } from '@/store/routineStore';
import {
  BookOpen,
  Play,
  Pause,
  MessageSquare,
  MoreHorizontal,
  Mail,
  Calendar,
  Clock,
  History,
  Settings,
} from 'lucide-react';

interface WorkbenchRoutineDetailProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const WorkbenchRoutineDetail: React.FC<WorkbenchRoutineDetailProps> = ({ onNavigate }) => {
  const {
    routines,
    selectedRoutineId,
    runRoutineNow,
    pauseRoutine,
    resumeRoutine,
    updateRoutine,
  } = useRoutineStore();

  const routine =
    routines.find((r) => r.id === selectedRoutineId) || routines[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');
  const [skipHolidays, setSkipHolidays] = useState(
    routine?.settings?.skipHolidays ?? false
  );
  const [pauseAfter5, setPauseAfter5] = useState(
    routine?.settings?.pauseAfterUnread ?? true
  );
  const [emailCopy, setEmailCopy] = useState(
    routine?.settings?.emailCopy ?? true
  );

  const handleToggle = (type: 'skip' | 'pause' | 'email') => {
    if (type === 'skip') {
      const next = !skipHolidays;
      setSkipHolidays(next);
      updateRoutine(routine.id, {
        settings: { ...routine.settings!, skipHolidays: next },
      });
    } else if (type === 'pause') {
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

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Dual Left Rails */}
      <WorkbenchSidebar activeScreen="detail" onNavigate={onNavigate} />

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
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {routine?.title}
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

        {/* Action Bar & Meta Header */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#151517] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {routine?.title}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{routine?.enabled ? 'On' : 'Paused'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Today's brief needs you
                </span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {routine?.schedule} · Pacific Time · Next run {routine?.nextRun} · Owner Maya Okafor · Asks before sending
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium hover:bg-zinc-50"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Edit in chat</span>
              </button>

              {routine?.enabled ? (
                <button
                  type="button"
                  onClick={() => pauseRoutine(routine.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium hover:bg-zinc-50"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => resumeRoutine(routine.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium hover:bg-zinc-50 text-emerald-600"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => runRoutineNow(routine.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run now</span>
              </button>

              <button
                type="button"
                className="p-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-zinc-200/80 dark:border-zinc-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-1 ${
                activeTab === 'overview'
                  ? 'border-b-2 border-zinc-900 dark:border-white font-semibold text-zinc-900 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`pb-1 ${
                activeTab === 'history'
                  ? 'border-b-2 border-zinc-900 dark:border-white font-semibold text-zinc-900 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              History 7
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`pb-1 ${
                activeTab === 'settings'
                  ? 'border-b-2 border-zinc-900 dark:border-white font-semibold text-zinc-900 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Content Panes */}
        <div className="flex-1 overflow-y-auto grid grid-cols-12 divide-x divide-zinc-200 dark:divide-zinc-800">
          {/* Main 8-Col Section */}
          <div className="col-span-8 p-6 space-y-6 overflow-y-auto">
            {/* Today's Brief Box */}
            <div className="border border-zinc-200 dark:border-zinc-700/80 rounded-xl overflow-hidden bg-white dark:bg-[#1a1a1c]">
              <div className="px-4 py-3 bg-zinc-50/80 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between text-xs font-medium">
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Today, 8:30 AM
                  </span>
                  <span className="text-zinc-500 ml-2">
                    Took 1m 48s · 3 need a reply, 2 meetings prepped
                  </span>
                </div>
                <button
                  type="button"
                  className="px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 text-xs hover:bg-zinc-100"
                >
                  Continue in chat
                </button>
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
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {item.name}
                          </span>
                          <span className="text-zinc-400 ml-1.5">{item.company}</span>
                          <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                            "{item.message}"
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                            ✓ {item.action}
                          </span>
                          <button
                            type="button"
                            className="px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[11px] font-medium"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today */}
                <div>
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Today 3
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {routine?.todaySchedule?.map((cal) => (
                      <div
                        key={cal.id}
                        className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-zinc-400 text-[11px]">{cal.time}</span>
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
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Moved since yesterday 2
                  </div>
                  <div className="space-y-1 text-zinc-600 dark:text-zinc-400 text-xs">
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
                  <div className="flex items-center justify-between text-zinc-500 text-xs">
                    <span>6 newsletters and 2 receipts</span>
                    <span className="text-[11px]">Skipped</span>
                  </div>
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
          </div>

          {/* Right 4-Col Side Rail */}
          <div className="col-span-4 p-5 space-y-4 overflow-y-auto text-xs bg-[#fbfbfb] dark:bg-[#161618]">
            {/* Run History List */}
            <div className="p-3 bg-white dark:bg-[#1c1c1f] rounded-xl border border-zinc-200 dark:border-zinc-700/80">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Run history 7
              </div>
              <div className="space-y-2 text-xs">
                {routine?.history?.map((h) => (
                  <div key={h.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-1.5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {h.status === 'warning' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        ) : h.status === 'error' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        ) : (
                          <span className="text-emerald-500 text-[10px]">✓</span>
                        )}
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{h.summary}</span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-400">{h.duration}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 pl-3">{h.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources 4 */}
            <div className="p-3 bg-white dark:bg-[#1c1c1f] rounded-xl border border-zinc-200 dark:border-zinc-700/80 space-y-2">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Sources 4
              </div>
              <div className="space-y-1 text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Mail</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">Since the last brief</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Calendar</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">Today only</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Recorded work</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">Overnight changes</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="p-3 bg-white dark:bg-[#1c1c1f] rounded-xl border border-zinc-200 dark:border-zinc-700/80 space-y-1">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Delivery
              </div>
              <div className="text-zinc-800 dark:text-zinc-200 font-medium">
                Chat in Saved, and email
              </div>
              <div className="text-[11px] text-zinc-400">
                maya@northwind.example
              </div>
              <div className="text-[11px] text-zinc-500 pt-1">
                Asks before sending · Drafted replies wait for you
              </div>
            </div>

            {/* Settings Toggles */}
            <div className="p-3 bg-white dark:bg-[#1c1c1f] rounded-xl border border-zinc-200 dark:border-zinc-700/80 space-y-2.5">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Settings
              </div>

              <div className="flex items-center justify-between">
                <span>Skip US holidays</span>
                <button
                  type="button"
                  onClick={() => handleToggle('skip')}
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
                <span>Pause after 5 unread briefs</span>
                <button
                  type="button"
                  onClick={() => handleToggle('pause')}
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
                <span>Email a copy</span>
                <button
                  type="button"
                  onClick={() => handleToggle('email')}
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
          </div>
        </div>
      </div>
    </div>
  );
};
