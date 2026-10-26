import React, { useState } from 'react';
import {
  MessageSquare,
  Boxes,
  Cpu,
  RefreshCw,
  Plus,
  PanelLeft,
} from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface WorkbenchSidebarProps {
  activeScreen?: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory';
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const WorkbenchSidebar: React.FC<WorkbenchSidebarProps> = ({
  activeScreen = 'list',
  onNavigate,
}) => {
  const { routines, filterTab, setFilterTab, setDraftForm, showToast } = useRoutineStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const scheduledCount = routines.filter((r) => r.status === 'scheduled').length;
  const watchingCount = routines.filter((r) => r.status === 'watching').length;
  const pausedCount = routines.filter((r) => r.status === 'paused').length;

  const togglePanel = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    showToast(next ? 'Collapsed routines panel' : 'Expanded routines panel', 'info');
  };

  return (
    <div className="flex h-full select-none flex-shrink-0 transition-all duration-200">
      {/* 1. Far Left Primary Icon Rail (Always Available) */}
      <div className="w-12 h-full bg-[#f8f8f9] dark:bg-[#141416] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between items-center py-3 shrink-0">
        <div className="flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Toggle Secondary Sidebar Panel */}
          <button
            type="button"
            onClick={togglePanel}
            title={isCollapsed ? 'Expand routines panel' : 'Collapse routines panel'}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>

          <div className="w-5 h-[1px] bg-zinc-200 dark:bg-zinc-800 my-0.5" />

          <button
            type="button"
            title="Chat"
            onClick={() => onNavigate?.('chat')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'chat'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Skills"
            onClick={() => onNavigate?.('skills')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'skills'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Memory"
            onClick={() => onNavigate?.('memory')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'memory'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Routines"
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              onNavigate?.('list');
            }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'list' || activeScreen === 'detail' || activeScreen === 'create'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Avatar */}
        <div
          title="Maya Okafor · Northwind Studio"
          className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-semibold flex items-center justify-center cursor-pointer hover:opacity-90 shadow-xs"
        >
          MO
        </div>
      </div>

      {/* 2. Secondary Sidebar Panel (Collapsible) */}
      {!isCollapsed && (
        <div className="w-44 h-full bg-[#fbfbfb] dark:bg-[#18181b] border-r border-zinc-200 dark:border-zinc-800 p-3 flex flex-col justify-between text-xs transition-all duration-200 shrink-0">
          <div>
            {/* Header with PanelLeft Collapse Button */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                Routines
              </span>
              <button
                type="button"
                onClick={togglePanel}
                title="Collapse panel"
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <PanelLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* New Routine Button */}
            <button
              type="button"
              onClick={() => {
                setDraftForm({
                  name: 'New Workbench Routine',
                  instructions: 'Monitor and process scheduled batches.',
                });
                onNavigate?.('create');
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#202023] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-xs mb-3 font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>New routine</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">⌘N</span>
            </button>

            {/* Views List */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setFilterTab('all');
                  onNavigate?.('list');
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'all' && activeScreen === 'list'
                    ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span>All routines</span>
                <span className="font-mono text-zinc-400 text-[11px]">{routines.length}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterTab('scheduled');
                  onNavigate?.('list');
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'scheduled' && activeScreen === 'list'
                    ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span>Scheduled</span>
                <span className="font-mono text-zinc-400 text-[11px]">{scheduledCount}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterTab('watching');
                  onNavigate?.('list');
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'watching' && activeScreen === 'list'
                    ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span>Watching</span>
                <span className="font-mono text-zinc-400 text-[11px]">{watchingCount}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterTab('paused');
                  onNavigate?.('list');
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                  filterTab === 'paused' && activeScreen === 'list'
                    ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span>Paused</span>
                <span className="font-mono text-zinc-400 text-[11px]">{pausedCount}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-2">
            Workbench Pro v2.4
          </div>
        </div>
      )}
    </div>
  );
};
