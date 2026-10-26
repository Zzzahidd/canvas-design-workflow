import React from 'react';
import { Calendar, X, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface CalendarAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMeeting?: (meetingTitle: string) => void;
}

export const CalendarAgendaModal: React.FC<CalendarAgendaModalProps> = ({
  isOpen,
  onClose,
  onSelectMeeting,
}) => {
  const { showToast } = useRoutineStore();

  if (!isOpen) return null;

  const meetings = [
    {
      time: '11:00 AM - 11:45 AM',
      title: 'Design review with Noor',
      prepStatus: 'No prep needed',
      attendees: 'Noor Awan, Maya Okafor',
      location: 'Google Meet',
    },
    {
      time: '2:30 PM - 3:15 PM',
      title: 'Acme sync with Marcus and Priya',
      prepStatus: 'Prep notes ready · PO 4471-B & Q4 deliverables',
      attendees: 'Priya Raman, Marcus Vance, Maya Okafor, Jonas Berg',
      location: 'Zoom',
    },
    {
      time: '4:00 PM - 4:45 PM',
      title: 'Lumen prototype check-in, Kai joins',
      prepStatus: 'Prep notes ready · Loom walkthrough draft prepared',
      attendees: 'Ines Duarte, Kai Lindqvist, Maya Okafor',
      location: 'Zoom',
    },
  ];

  const handleSelect = (title: string) => {
    if (onSelectMeeting) {
      onSelectMeeting(title);
    }
    showToast(`Injected meeting context: ${title}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 select-none">
      <div className="bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans animate-fade-in">
        {/* Header */}
        <div className="h-14 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-[#18181a] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Today - Tuesday, October 21</div>
              <div className="text-[11px] text-zinc-400">
                3 meetings scheduled · 2 prepped with assistant briefs
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meeting List */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[420px]">
          {meetings.map((m, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(m.title)}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1d] hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                  <Clock className="w-3.5 h-3.5" />
                  {m.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {m.location}
                </span>
              </div>

              <div className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:underline">
                {m.title}
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Attendees: {m.attendees}
              </div>

              <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  {m.prepStatus}
                </span>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white underline">
                  Attach notes
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-[#18181a]/40 flex items-center justify-between text-xs text-zinc-500">
          <span>Synced with Google Calendar & Outlook</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 font-medium text-zinc-800 dark:text-zinc-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
