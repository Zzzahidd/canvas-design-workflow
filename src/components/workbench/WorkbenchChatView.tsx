import React, { useState, useRef, useEffect } from 'react';
import { WorkbenchSidebar } from './WorkbenchSidebar';
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
  Download,
  ShieldCheck,
} from 'lucide-react';

interface WorkbenchChatViewProps {
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const WorkbenchChatView: React.FC<WorkbenchChatViewProps> = ({ onNavigate }) => {
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
    showToast('Copied message to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#18181b] overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-sans relative">
      {/* Dual Left Rails */}
      <WorkbenchSidebar activeScreen="chat" onNavigate={onNavigate} />

      {/* Main Center Message Stream */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
        {/* Top Header */}
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 px-5 flex items-center justify-between bg-white dark:bg-[#18181b] shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Finance</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              October invoicing
            </span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 ml-1" />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">
              142.5h tracked · PO 4471-B verified
            </span>
            <button
              type="button"
              onClick={() => showToast('Chat session preferences', 'info')}
              className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className="max-w-2xl mx-auto space-y-2.5">
              {msg.sender === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-zinc-100 dark:bg-[#252529] text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-2xl rounded-tr-sm text-xs leading-relaxed max-w-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xs">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {/* Tool invocation pill */}
                  {msg.toolUsed && (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedToolId(expandedToolId === msg.id ? null : msg.id)
                        }
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                      >
                        <span className="font-mono text-[9px] font-bold bg-zinc-900 text-white dark:bg-white dark:text-black px-1 rounded-xs">
                          EXEC
                        </span>
                        <span>{msg.toolUsed.name}</span>
                        <span className="font-mono text-zinc-400 text-[10px]">
                          {msg.toolUsed.version}
                        </span>
                        {expandedToolId === msg.id ? (
                          <ChevronDown className="w-3 h-3 text-zinc-400" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-zinc-400" />
                        )}
                      </button>

                      {expandedToolId === msg.id && msg.toolUsed.details && (
                        <div className="mt-2 p-2.5 bg-zinc-50 dark:bg-[#1a1a1d] rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                          {msg.toolUsed.details}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-line pl-0.5">{msg.text}</div>

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
                      className="p-2.5 bg-zinc-50 dark:bg-[#1e1e22] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-all flex items-center justify-between max-w-sm group shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-white group-hover:underline">
                            {msg.attachment.name}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {msg.attachment.meta}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white" />
                    </div>
                  )}

                  {msg.learnedUpdate && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        Rule cached: {msg.learnedUpdate.rule} ({msg.learnedUpdate.skill})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-0.5 text-zinc-400 text-[10px]">
                    <span className="font-mono">{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
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
              <span>Workbench assistant executing pipeline...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] shrink-0">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-[#fcfcfd] dark:bg-[#1f1f23] border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-zinc-900 dark:focus-within:ring-white transition-all">
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
              placeholder="Command Workbench assistant, e.g. update PO, approve..."
              className="flex-1 bg-transparent outline-none text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 font-sans"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!activeChatInput.trim()}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeChatInput.trim()
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black cursor-pointer'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Inspector Rail (Workbench Pro Layout) */}
      <div className="w-72 h-full bg-[#fcfcfd] dark:bg-[#161618] p-4 flex flex-col justify-between overflow-y-auto text-xs shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-[10px]">
              Active Artifact
            </span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Draft Staged</span>
            </span>
          </div>

          {/* Invoice Card in Inspector */}
          <div className="p-3 bg-white dark:bg-[#1c1c1f] border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900 dark:text-white">
                Invoice-INV-2026-118
              </span>
              <span className="font-mono text-[10px] text-zinc-400">PDF</span>
            </div>
            <div className="text-zinc-500 text-[11px]">
              Acme Corp · 122.5 hours tracked
            </div>
            <div className="text-base font-semibold text-zinc-900 dark:text-white pt-1">
              $31,250.00
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              PO 4471-B · Terms: Net 30
            </div>

            <div className="pt-2 flex gap-1.5">
              <button
                type="button"
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
                className="flex-1 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-[11px] text-center hover:opacity-90 cursor-pointer"
              >
                Inspect
              </button>
              <button
                type="button"
                onClick={() => showToast('Approved and sent invoice to billing portal', 'success')}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] cursor-pointer"
              >
                Approve
              </button>
            </div>
          </div>

          {/* Connected Skills */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Active Pipeline Skills (2)
            </div>
            <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1d] text-[11px] flex items-center justify-between">
              <span>Invoice clients from hours</span>
              <span className="font-mono text-zinc-400 text-[10px]">v24</span>
            </div>
            <div className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1d] text-[11px] flex items-center justify-between">
              <span>Client email, enterprise</span>
              <span className="font-mono text-zinc-400 text-[10px]">v38</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 font-mono">
          Session Tokens: 1,420 · Latency: 240ms
        </div>
      </div>

      {/* File Browser Modal */}
      <FileBrowserModal
        isOpen={showFileBrowser}
        onClose={() => setShowFileBrowser(false)}
        onAttachFile={(file) => {
          setActiveChatInput(`Analyze ${file.name} for the current milestone.`);
        }}
      />
    </div>
  );
};
