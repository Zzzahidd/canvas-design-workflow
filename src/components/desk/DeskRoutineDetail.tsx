import React, { useState } from 'react';
import { DeskDrawer } from './DeskDrawer';
import { useRoutineStore } from '@/store/routineStore';
import {
  Cpu,
  History,
  Play,
  Pause,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  ChevronDown,
  Folder,
  FileText,
  Search,
  Plus,
  X,
} from 'lucide-react';

interface DeskRoutineDetailProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const DeskRoutineDetail: React.FC<DeskRoutineDetailProps> = ({ onNavigate }) => {
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

  const [skipHolidays, setSkipHolidays] = useState(
    routine?.settings?.skipHolidays ?? false
  );
  const [pauseAfter5, setPauseAfter5] = useState(
    routine?.settings?.pauseAfterUnread ?? true
  );

  const handleToggle = (type: 'skip' | 'pause') => {
    if (type === 'skip') {
      const next = !skipHolidays;
      setSkipHolidays(next);
      updateRoutine(routine.id, {
        settings: { ...routine.settings!, skipHolidays: next },
      });
    } else {
      const next = !pauseAfter5;
      setPauseAfter5(next);
      updateRoutine(routine.id, {
        settings: { ...routine.settings!, pauseAfterUnread: next },
      });
    }
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Left Desk Drawer */}
      <DeskDrawer activeScreen="detail" onNavigate={onNavigate} />

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
              {routine?.title}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{routine?.enabled ? 'On' : 'Paused'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {routine?.enabled ? (
              <button
                type="button"
                onClick={() => pauseRoutine(routine.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs hover:bg-zinc-50"
              >
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => resumeRoutine(routine.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs hover:bg-zinc-50 text-emerald-600"
              >
                <Play className="w-3 h-3" />
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
              className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs hover:bg-zinc-50"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Edit in chat</span>
            </button>
          </div>
        </div>

        {/* Center Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title & Instructions */}
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {routine?.title}
            </h1>
            <div className="text-xs text-zinc-400 mt-0.5">
              {routine?.schedule}, Pacific Time · Next run: {routine?.nextRun} · Owner Maya Okafor
            </div>

            <div className="mt-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#1a1a1c] text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Instructions
              </div>
              {routine?.instructions}
            </div>

            {/* Learned Pill */}
            <div className="mt-2.5 p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Learned: Skips newsletters since Oct 14, after you archived 9 in a row</span>
              </div>
              <button type="button" className="text-[11px] underline">Undo lesson</button>
            </div>
          </div>

          {/* Today's Brief Section */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-[#1a1a1c] space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Today's brief
                </span>
                <span className="text-zinc-400">· Today, 8:30 AM · 1m 48s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Call prep
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Enterprise email
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Startup email
                </span>
              </div>
            </div>

            {/* Needs a reply */}
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Needs a reply 3
              </div>
              <div className="space-y-2">
                {routine?.needsReply?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/20"
                  >
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 ml-2">
                        "{item.message}"
                      </span>
                    </div>
                    <span className="text-emerald-600 text-[11px] font-medium">
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Today schedule */}
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Today 3
              </div>
              <div className="space-y-1">
                {routine?.todaySchedule?.map((cal) => (
                  <div key={cal.id} className="flex items-center justify-between py-1 border-b border-zinc-50 dark:border-zinc-800/40">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-zinc-400 text-[11px]">{cal.time}</span>
                      <span className="text-zinc-800 dark:text-zinc-200">{cal.title}</span>
                    </div>
                    <span className="text-zinc-400 text-[11px]">{cal.statusText}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Moved since yesterday */}
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Moved since yesterday 2
              </div>
              <div className="space-y-1 text-zinc-600 dark:text-zinc-400 text-xs">
                <div className="flex items-center justify-between">
                  <span>Ticket 4821 has a proposed fix from Rafael</span>
                  <span className="text-zinc-400 text-[11px]">In IT support</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tom Becker replied on clause 7 of the Acme MSA</span>
                  <span className="text-zinc-400 text-[11px]">In Legal</span>
                </div>
              </div>
            </div>

            {/* Can wait */}
            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">
                Can wait 1
              </div>
              <div className="flex items-center justify-between text-zinc-500">
                <span>6 newsletters and 2 receipts</span>
                <span className="text-[11px]">Skipped</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Inspector Rail */}
      <div className="w-64 h-full bg-[#fbfbfb] dark:bg-[#151517] p-4 flex flex-col justify-between overflow-y-auto text-xs space-y-4 flex-shrink-0">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Schedule and runs
            </span>
            <div className="flex items-center gap-2">
              <button type="button" className="text-zinc-400 hover:text-zinc-700">
                <History className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="text-zinc-400 hover:text-zinc-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Next 5 runs */}
          <div className="mb-4">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Next 5 runs · Pacific Time
            </div>
            <div className="space-y-1 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Wed, Oct 22, 8:30 AM</span>
                <span className="text-zinc-400 text-[10px]">Next</span>
              </div>
              <div>Thu, Oct 23, 8:30 AM</div>
              <div>Fri, Oct 24, 8:30 AM</div>
              <div>Mon, Oct 27, 8:30 AM</div>
              <div>Tue, Oct 28, 8:30 AM</div>
            </div>
          </div>

          {/* Run history */}
          <div className="mb-4">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Run history · Last 7 runs
            </div>
            <div className="space-y-1.5 text-xs">
              {routine?.history?.map((h) => (
                <div key={h.id} className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex items-center gap-1.5 truncate">
                    {h.status === 'warning' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    ) : (
                      <span className="text-emerald-500 text-[10px] flex-shrink-0">✓</span>
                    )}
                    <span className="truncate">{h.date}</span>
                  </div>
                  <span className="font-mono text-zinc-400 text-[10px]">{h.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reads & Delivers */}
          <div className="mb-4 space-y-2">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Reads and delivers
            </div>
            <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-zinc-400" />
                <span>Mail & Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>Recorded work & Past chats</span>
              </div>
              <div className="text-zinc-800 dark:text-zinc-200 font-medium pt-1">
                Chat in Saved, and email
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
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
                <span className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 ${skipHolidays ? 'translate-x-3' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Pause after 5 unread</span>
              <button
                type="button"
                onClick={() => handleToggle('pause')}
                className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                  pauseAfter5 ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span className={`w-3 h-3 rounded-full bg-white dark:bg-zinc-900 ${pauseAfter5 ? 'translate-x-3' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
