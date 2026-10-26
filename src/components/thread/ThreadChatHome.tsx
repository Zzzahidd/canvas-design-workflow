import React, { useState } from 'react';
import { ThreadSidebar } from './ThreadSidebar';
import { useChatStore } from '@/store/chatStore';
import { useRoutineStore } from '@/store/routineStore';
import { FileBrowserModal } from '@/components/common/FileBrowserModal';
import { BrowserTabsModal } from '@/components/common/BrowserTabsModal';
import { CalendarAgendaModal } from '@/components/common/CalendarAgendaModal';
import { ProjectFile, BrowserTabContext } from '@/types/contextData';
import {
  ArrowUp,
  Paperclip,
  ChevronDown,
  FileText,
  Globe,
  Calendar,
  MessageSquare,
  BookOpen,
  X,
} from 'lucide-react';

interface ThreadChatHomeProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadChatHome: React.FC<ThreadChatHomeProps> = ({ onNavigate }) => {
  const { homePrompt, setHomePrompt, sendMessageFromHome } = useChatStore();
  const { showToast } = useRoutineStore();

  // Interactive Modals State
  const [showFileModal, setShowFileModal] = useState(false);
  const [showTabsModal, setShowTabsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [attachedFile, setAttachedFile] = useState<ProjectFile | null>(null);
  const [attachedTab, setAttachedTab] = useState<BrowserTabContext | null>(null);

  const suggestionCards = [
    {
      id: 'c1',
      title: 'Finish October invoicing, 2 clients left',
      skill: 'Invoice clients from tracked hours v23',
      prompt: 'Invoice Acme and Lumen Labs for October. Draft replies to each client in their usual tone. Ask me before sending.',
    },
    {
      id: 'c2',
      title: 'Reply to Priya at Acme about the MSA',
      skill: 'Client email, enterprise v37',
      prompt: 'Draft reply to Priya at Acme regarding the MSA terms and liability clause.',
    },
    {
      id: 'c3',
      title: 'Research ticket 4821 and propose a fix',
      skill: 'Research an ambiguous IT ticket v9',
      prompt: 'Review ticket 4821 logs, identify the root cause, and propose a pull request draft.',
    },
    {
      id: 'c4',
      title: 'Draft the week 43 status report',
      skill: 'Weekly status report v3',
      prompt: 'Summarize week 43 progress, highlights, and blockers across all active milestones.',
    },
  ];

  const skillsList = [
    { name: 'Invoice clients from tracked hours', runs: '1,254 runs', version: 'v23' },
    { name: 'Client email, startups', runs: '3,410 runs', version: 'v41' },
    { name: 'Client email, enterprise', runs: '2,098 runs', version: 'v37' },
    { name: 'Legal docs in house style', runs: '412 runs', version: 'v12' },
    { name: 'Research an ambiguous IT ticket', runs: '959 runs', version: 'v19' },
    { name: 'Meeting notes to tasks', runs: '2,580 runs', version: 'v33' },
  ];

  const learnedList = [
    {
      rule: 'Acme needs a PO number on every invoice',
      source: 'Invoice clients from tracked h... · 4 runs by Jonas',
    },
    {
      rule: 'Cap liability at 12 months of fees',
      source: "Legal docs in house sty... · Daniel's last 3 redlines",
    },
    {
      rule: 'Lumen prefers Loom links over attachments',
      source: 'Client email, startups · 6 email threads',
    },
  ];

  const handleSend = () => {
    if (!homePrompt.trim()) return;
    sendMessageFromHome(homePrompt);
    showToast('Sent message to Thread · Active chat', 'success');
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const handleCardClick = (cardPrompt: string) => {
    setHomePrompt(cardPrompt);
    showToast('Applied suggestion to prompt box', 'info');
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Shared Thread Sidebar with real-time navigation */}
      <ThreadSidebar activeScreen="home" onNavigate={onNavigate} />

      {/* Main Home Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto px-8 py-8 flex flex-col justify-between flex-1">
          {/* Top greeting header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div />
              <button
                type="button"
                onClick={() => onNavigate?.('skills')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 rounded-lg transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                <span>Browse skills</span>
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Good morning, Maya
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                Tuesday, October 21 · 3 meetings, next Acme sync at 2:30 PM
              </p>
            </div>

            {/* Central Large Prompt Box */}
            <div className="bg-[#fcfcfd] dark:bg-[#1f1f23] rounded-2xl border border-zinc-200/90 dark:border-zinc-700/80 p-4 shadow-subtle focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 transition-all">
              {/* Attached Context Chips Bar */}
              {(attachedFile || attachedTab) && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60 flex-wrap">
                  {attachedFile && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      <FileText className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{attachedFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="ml-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {attachedTab && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Tab: {attachedTab.title}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedTab(null)}
                        className="ml-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              <textarea
                value={homePrompt}
                onChange={(e) => setHomePrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={3}
                placeholder="Ask anything, or hand off a task. Skills are picked for you."
                className="w-full bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-sans"
              />

              {/* Input Action Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
                <button
                  type="button"
                  onClick={() => setShowFileModal(true)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Drop files to add context</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    <span>Auto</span>
                    <ChevronDown className="w-3 h-3" />
                  </span>

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!homePrompt.trim()}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      homePrompt.trim()
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Context Pills - Real Interactive Pickers! */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button
                type="button"
                onClick={() => setShowFileModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-full transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3 text-zinc-400" />
                <span>Open file</span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={() => setShowTabsModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-full transition-colors cursor-pointer"
              >
                <Globe className="w-3 h-3 text-zinc-400" />
                <span>Browser tabs</span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={() => setShowCalendarModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-full transition-colors cursor-pointer"
              >
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>Today - Tue, Oct 21</span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('chat')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-full transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 text-zinc-400" />
                <span>Past chats</span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
              </button>
            </div>

            {/* Pick up where you left off */}
            <div className="mt-8">
              <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                Pick up where you left off
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {suggestionCards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCardClick(c.prompt)}
                    className="p-3 bg-white dark:bg-[#1a1a1e] hover:bg-zinc-50 dark:hover:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-left transition-all hover:border-zinc-300 dark:hover:border-zinc-700 group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 inline-block" />
                      <span>{c.skill}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Dual-Column Section: Skills & Learned */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
            {/* Left: Your Skills */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Your skills
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigate?.('skills')}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-2 cursor-pointer"
                >
                  Browse all
                </button>
              </div>

              <div className="space-y-1.5">
                {skillsList.map((s) => (
                  <div
                    key={s.name}
                    onClick={() => onNavigate?.('skills')}
                    className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="truncate">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 shrink-0">
                      <span>{s.runs}</span>
                      <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-600 dark:text-zinc-300">
                        {s.version}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Learned this week */}
            <div>
              <div className="mb-3">
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Learned this week
                </h3>
              </div>

              <div className="space-y-2.5">
                {learnedList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigate?.('memory')}
                    className="p-2.5 bg-zinc-50/80 dark:bg-zinc-800/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {item.rule}
                    </div>
                    <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                      {item.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive File Browser Modal */}
      <FileBrowserModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        onAttachFile={(file) => setAttachedFile(file)}
      />

      {/* Interactive Browser Tabs Modal */}
      <BrowserTabsModal
        isOpen={showTabsModal}
        onClose={() => setShowTabsModal(false)}
        onSelectTab={(tab) => setAttachedTab(tab)}
      />

      {/* Interactive Calendar Agenda Modal */}
      <CalendarAgendaModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onSelectMeeting={(title) => {
          setHomePrompt(`Prepare meeting notes and agenda for: ${title}`);
        }}
      />
    </div>
  );
};
