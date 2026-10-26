import React, { useState } from 'react';
import { BrowserTabContext, MOCK_BROWSER_TABS } from '@/types/contextData';
import { Globe, X, Check, ExternalLink } from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface BrowserTabsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: BrowserTabContext) => void;
}

export const BrowserTabsModal: React.FC<BrowserTabsModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const { showToast } = useRoutineStore();
  const [selectedTabId, setSelectedTabId] = useState<string>('tab-1');

  if (!isOpen) return null;

  const handleSelect = (tab: BrowserTabContext) => {
    setSelectedTabId(tab.id);
    if (onSelectTab) {
      onSelectTab(tab);
    }
    showToast(`Included active browser tab: ${tab.title}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 select-none">
      <div className="bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans animate-fade-in">
        {/* Header */}
        <div className="h-14 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-[#18181a] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Open Browser Tabs Context</div>
              <div className="text-[11px] text-zinc-400">
                Select an open tab to automatically pass page contents & tickets into chat
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

        {/* Tab List */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[420px]">
          {MOCK_BROWSER_TABS.map((tab) => {
            const isSelected = selectedTabId === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelect(tab)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-zinc-900 dark:border-white bg-zinc-50/80 dark:bg-zinc-800/60 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#1a1a1d]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{tab.title}</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      {tab.url}
                    </div>
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1.5 bg-zinc-100/60 dark:bg-zinc-800/40 p-2 rounded-lg">
                      {tab.snippet}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium underline">
                      Use
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-[#18181a]/40 flex items-center justify-between text-xs text-zinc-500">
          <span>Connected via Dealcraft Browser Bridge (Active)</span>
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
