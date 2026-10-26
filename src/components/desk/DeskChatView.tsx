import React, { useState, useRef, useEffect } from 'react';
import { DeskDrawer } from './DeskDrawer';
import { useChatStore } from '@/store/chatStore';
import { useRoutineStore } from '@/store/routineStore';
import { FileBrowserModal } from '@/components/common/FileBrowserModal';
import {
  Search,
  Star,
  Settings,
  Plus,
  ArrowUp,
  FileText,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface DeskChatViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const DeskChatView: React.FC<DeskChatViewProps> = ({ onNavigate }) => {
  const {
    messages,
    activeChatInput,
    setActiveChatInput,
    sendActiveChatMessage,
    isGenerating,
    selectedInvoice,
    setSelectedInvoice,
  } = useChatStore();
  const { showToast } = useRoutineStore();

  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!activeChatInput.trim()) return;
    sendActiveChatMessage(activeChatInput);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      <DeskDrawer activeScreen="chat" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Finance</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              October invoicing
            </span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 ml-1" />
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <button
              type="button"
              onClick={() => showToast('Search chat', 'info')}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => showToast('Chat settings', 'info')}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="max-w-2xl mx-auto space-y-3">
              {msg.sender === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-zinc-100 dark:bg-[#222226] text-zinc-900 dark:text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed max-w-xl border border-zinc-200/50 dark:border-zinc-700/50">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {msg.toolUsed && (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedToolId(expandedToolId === msg.id ? null : msg.id)
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                      >
                        <span className="w-3.5 h-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-sm flex items-center justify-center text-[9px] font-bold">
                          D
                        </span>
                        <span>Used</span>
                        <span className="font-semibold">{msg.toolUsed.name}</span>
                        <span className="text-zinc-400 font-mono text-[10px]">
                          {msg.toolUsed.version}
                        </span>
                        {expandedToolId === msg.id ? (
                          <ChevronDown className="w-3 h-3 text-zinc-400" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-zinc-400" />
                        )}
                      </button>

                      {expandedToolId === msg.id && msg.toolUsed.details && (
                        <div className="mt-2 p-2.5 bg-zinc-50 dark:bg-[#1a1a1d] rounded-xl border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
                          {msg.toolUsed.details}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-line pl-1">{msg.text}</div>

                  {msg.attachment && (
                    <div
                      onClick={() =>
                        setSelectedInvoice({
                          number: 'INV-2026-118',
                          client: 'Acme Corp',
                          amount: '$31,250.00',
                          hours: '122.5 hours',
                          rate: '$255.10 / hr',
                          poNumber: 'PO 4471-B',
                          date: 'Oct 23, 2026',
                        })
                      }
                      className="p-3 bg-zinc-50 dark:bg-[#1c1c1f] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer transition-all flex items-center justify-between max-w-sm group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline">
                            {msg.attachment.name}
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {msg.attachment.meta}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" />
                    </div>
                  )}

                  {msg.learnedUpdate && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        Learned precedent: {msg.learnedUpdate.rule}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-zinc-400 text-[11px]">
                    <span className="font-mono text-[10px]">{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="max-w-2xl mx-auto flex items-center gap-2 text-xs text-zinc-400 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
              <span>Desk assistant processing request...</span>
            </div>
          )}
        </div>

        {/* Bottom Message Input Pill */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] shrink-0">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-[#fcfcfd] dark:bg-[#1f1f23] border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 transition-all">
            <button
              type="button"
              onClick={() => setShowFileBrowser(true)}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={activeChatInput}
              onChange={(e) => setActiveChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything or request changes to invoices..."
              className="flex-1 bg-transparent outline-none text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 font-sans"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!activeChatInput.trim()}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                activeChatInput.trim()
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black cursor-pointer'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <FileBrowserModal
        isOpen={showFileBrowser}
        onClose={() => setShowFileBrowser(false)}
        onAttachFile={(file) => {
          setActiveChatInput(`Reference file: ${file.name} for the invoice.`);
        }}
      />
    </div>
  );
};
