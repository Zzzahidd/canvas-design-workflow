import React, { useState, useRef, useEffect } from 'react';
import { ThreadSidebar } from './ThreadSidebar';
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
  X,
  Copy,
  Check,
} from 'lucide-react';

interface ThreadActiveChatProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadActiveChat: React.FC<ThreadActiveChatProps> = ({ onNavigate }) => {
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
  const [isFavorite, setIsFavorite] = useState(true);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
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
      {/* Shared Thread Sidebar with real navigation */}
      <ThreadSidebar activeScreen="chat" onNavigate={onNavigate} />

      {/* Main Active Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-12 border-b border-zinc-200/80 dark:border-zinc-800 px-5 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Finance</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              October invoicing
            </span>
            <button
              type="button"
              onClick={() => {
                setIsFavorite(!isFavorite);
                showToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites', 'info');
              }}
              className="p-0.5 ml-1"
            >
              <Star
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorite ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-600'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <button
              type="button"
              onClick={() => showToast('Search within October invoicing', 'info')}
              className="p-1.5 rounded hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => showToast('Chat preferences & model settings', 'info')}
              className="p-1.5 rounded hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="max-w-2xl mx-auto space-y-3">
              {msg.sender === 'user' ? (
                /* User Bubble */
                <div className="flex justify-end">
                  <div className="bg-zinc-100 dark:bg-[#252529] text-zinc-900 dark:text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed max-w-xl shadow-subtle border border-zinc-200/50 dark:border-zinc-700/50">
                    {msg.text}
                  </div>
                </div>
              ) : (
                /* Assistant Block */
                <div className="space-y-3 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {/* Tool invocation pill if present */}
                  {msg.toolUsed && (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedToolId(expandedToolId === msg.id ? null : msg.id)
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/80 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 transition-colors cursor-pointer"
                      >
                        <span className="w-3.5 h-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-sm flex items-center justify-center text-[9px] font-bold">
                          U
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

                      {/* Tool details card */}
                      {expandedToolId === msg.id && msg.toolUsed.details && (
                        <div className="mt-2 p-2.5 bg-zinc-50 dark:bg-[#1f1f23] rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal animate-fade-in">
                          {msg.toolUsed.details}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assistant response body */}
                  <div className="whitespace-pre-line pl-1">{msg.text}</div>

                  {/* Attachment Card if present */}
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
                      className="p-3 bg-zinc-50 dark:bg-[#202024] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl cursor-pointer transition-all flex items-center justify-between max-w-sm group shadow-xs"
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

                  {/* Learned Rule Notification Pill if present */}
                  {msg.learnedUpdate && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        <strong className="font-semibold">
                          {msg.learnedUpdate.skill} updated
                        </strong>{' '}
                        {msg.learnedUpdate.versionFrom} -&gt; {msg.learnedUpdate.versionTo} ·
                        Learned: {msg.learnedUpdate.rule}
                      </span>
                    </div>
                  )}

                  {/* Message Action Bar */}
                  <div className="flex items-center gap-3 pt-1 text-zinc-400 text-[11px]">
                    <span className="font-mono text-[10px]">{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1"
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

          {/* Typing / Generating Indicator */}
          {isGenerating && (
            <div className="max-w-2xl mx-auto flex items-center gap-2 text-xs text-zinc-400 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin" />
              <span>Analyzing draft and running skills...</span>
            </div>
          )}
        </div>

        {/* Bottom Interactive Message Input */}
        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#18181b] shrink-0">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-[#fcfcfd] dark:bg-[#202024] border border-zinc-200 dark:border-zinc-700/80 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 transition-all">
            <button
              type="button"
              onClick={() => setShowFileBrowser(true)}
              title="Attach project file context"
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
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
              placeholder="Reply, or ask for a change..."
              className="flex-1 bg-transparent outline-none text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-sans"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!activeChatInput.trim()}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeChatInput.trim()
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-lg max-w-md w-full p-6 text-xs text-zinc-800 dark:text-zinc-200 relative animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedInvoice.number} · {selectedInvoice.client}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between py-1 border-b border-zinc-50 dark:border-zinc-800/50">
                <span className="text-zinc-400">Total Billable Amount</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {selectedInvoice.amount}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50 dark:border-zinc-800/50">
                <span className="text-zinc-400">Tracked Time</span>
                <span>{selectedInvoice.hours}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50 dark:border-zinc-800/50">
                <span className="text-zinc-400">Effective Hourly Rate</span>
                <span>{selectedInvoice.rate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-50 dark:border-zinc-800/50">
                <span className="text-zinc-400">Purchase Order</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {selectedInvoice.poNumber}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Issue Date</span>
                <span>{selectedInvoice.date}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Downloaded invoice draft PDF', 'success');
                  setSelectedInvoice(null);
                }}
                className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Browser Modal */}
      <FileBrowserModal
        isOpen={showFileBrowser}
        onClose={() => setShowFileBrowser(false)}
        onAttachFile={(file) => {
          setActiveChatInput(`Please review ${file.name} and include it in our client summary.`);
        }}
      />
    </div>
  );
};
