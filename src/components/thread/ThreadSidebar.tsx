import React, { useState } from 'react';
import {
  Search,
  PanelLeft,
  Plus,
  MessageSquare,
  Boxes,
  Cpu,
  RefreshCw,
  Folder,
  ChevronDown,
  ChevronRight,
  FileText,
  ChevronsUpDown,
  Check,
} from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface ThreadSidebarProps {
  activeScreen?: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory';
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const ThreadSidebar: React.FC<ThreadSidebarProps> = ({
  activeScreen = 'list',
  onNavigate,
}) => {
  const { routines, showToast } = useRoutineStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('Northwind Studio');
  const routineCount = routines.length;

  const workspaces = [
    { name: 'Northwind Studio', tier: 'Pro Plan · 14 members' },
    { name: 'Acme Corp Staging', tier: 'Client Portal · Guest' },
    { name: 'Personal Workspace', tier: 'Maya Okafor · Free' },
  ];

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    showToast(next ? 'Sidebar collapsed' : 'Sidebar expanded', 'info');
  };

  // Collapsed Icon-Rail Mode
  if (isCollapsed) {
    return (
      <div className="w-14 flex-shrink-0 h-full bg-[#fbfbfb] dark:bg-[#18181a] border-r border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between items-center py-3 select-none text-zinc-700 dark:text-zinc-300 font-sans transition-all duration-200">
        {/* Top Controls */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {/* Logo */}
          <div
            onClick={() => onNavigate?.('home')}
            className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-xs cursor-pointer hover:opacity-90"
            title="Go to Home"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
              <path fillRule="evenodd" d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 2.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Expand Sidebar Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand sidebar panel"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="w-6 h-[1px] bg-zinc-200 dark:bg-zinc-800 my-1" />

          {/* New Chat Icon */}
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            title="New chat (⌘N)"
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors cursor-pointer ${
              activeScreen === 'home'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs'
                : 'border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#202023] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Chat Icon */}
          <button
            type="button"
            onClick={() => onNavigate?.('chat')}
            title="Active Chat"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'chat'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Skills Icon */}
          <button
            type="button"
            onClick={() => onNavigate?.('skills')}
            title="Skills Catalog (22)"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'skills'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
          </button>

          {/* Memory Icon */}
          <button
            type="button"
            onClick={() => onNavigate?.('memory')}
            title="Memory & Learned Rules"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'memory'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
          </button>

          {/* Routines Icon */}
          <button
            type="button"
            onClick={() => onNavigate?.('list')}
            title={`Routines (${routineCount})`}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeScreen === 'list' || activeScreen === 'detail' || activeScreen === 'create'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Avatar */}
        <div
          onClick={() => onNavigate?.('home')}
          title="Maya Okafor · Northwind Studio"
          className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold flex items-center justify-center text-[10px] cursor-pointer hover:opacity-90 shadow-xs"
        >
          MO
        </div>
      </div>
    );
  }

  // Expanded Full Sidebar Mode
  return (
    <div className="w-[240px] flex-shrink-0 h-full bg-[#fbfbfb] dark:bg-[#18181a] border-r border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between text-xs text-zinc-700 dark:text-zinc-300 font-sans select-none relative transition-all duration-200">
      {/* Top Header & Navigation */}
      <div className="p-3 flex-1 overflow-y-auto">
        {/* App Logo & Controls */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div
            onClick={() => onNavigate?.('home')}
            className="w-6 h-6 rounded-lg bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-xs cursor-pointer hover:opacity-90"
            title="Go to Home"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <path fillRule="evenodd" d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 2.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
            <button
              type="button"
              onClick={() => showToast('Search entire workspace', 'info')}
              className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Collapse sidebar panel"
              className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={() => onNavigate?.('home')}
          className={`w-full mb-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-colors shadow-xs cursor-pointer ${
            activeScreen === 'home'
              ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium'
              : 'border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#202023] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <Plus className="w-3.5 h-3.5" />
            <span>New chat</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">⌘ N</span>
        </button>

        {/* Core Sections */}
        <div className="space-y-0.5 mb-4">
          <button
            type="button"
            onClick={() => onNavigate?.('chat')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeScreen === 'chat'
                ? 'bg-zinc-200/70 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              <span>Chat</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Active</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('skills')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeScreen === 'skills'
                ? 'bg-zinc-200/70 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Boxes className="w-3.5 h-3.5 text-zinc-400" />
              <span>Skills</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">22</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('memory')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeScreen === 'memory'
                ? 'bg-zinc-200/70 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              <span>Memory</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('list')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeScreen === 'list' || activeScreen === 'detail' || activeScreen === 'create'
                ? 'bg-zinc-200/70 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Routines</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">{routineCount}</span>
          </button>
        </div>

        {/* Saved Items */}
        <div className="mb-4">
          <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            Saved
          </div>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => onNavigate?.('chat')}
              className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-[8px]">
                  O
                </span>
                <span className="truncate">October invoicing</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                showToast('Opened conversation: Acme MSA redlines', 'info');
                onNavigate?.('chat');
              }}
              className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3 h-3 text-zinc-400" />
                <span className="truncate">Acme MSA redlines</span>
              </div>
            </button>
          </div>
        </div>

        {/* Folders */}
        <div className="mb-4">
          <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            Folders
          </div>
          <div className="space-y-1">
            <div>
              <div className="flex items-center gap-1.5 px-2 py-1 text-zinc-600 dark:text-zinc-400 font-medium">
                <ChevronDown className="w-3 h-3 text-zinc-400" />
                <Folder className="w-3 h-3 text-zinc-400" />
                <span>Finance</span>
              </div>
              <div className="pl-6 space-y-0.5 text-zinc-600 dark:text-zinc-400">
                <div
                  onClick={() => onNavigate?.('chat')}
                  className="flex items-center justify-between py-0.5 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                >
                  <span className="truncate">October invoicing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                </div>
                <div
                  onClick={() => onNavigate?.('list')}
                  className="py-0.5 truncate hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                >
                  Expense reconciliation, ...
                </div>
                <div
                  onClick={() => onNavigate?.('home')}
                  className="py-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>New chat in Finance</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => showToast('Folder: Legal (4 agreements)', 'info')}
              className="flex items-center gap-1.5 px-2 py-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <Folder className="w-3 h-3 text-zinc-400" />
              <span>Legal</span>
            </div>

            <div
              onClick={() => showToast('Folder: IT support (2 open tickets)', 'info')}
              className="flex items-center gap-1.5 px-2 py-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <Folder className="w-3 h-3 text-zinc-400" />
              <span>IT support</span>
            </div>
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            Recent
          </div>
          <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
            <div
              onClick={() => onNavigate?.('chat')}
              className="flex items-center justify-between px-2 py-0.5 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <span className="truncate">Weekly status, week 42</span>
              <span className="text-[10px] text-zinc-400 font-mono">Fri</span>
            </div>
            <div
              onClick={() => onNavigate?.('chat')}
              className="flex items-center justify-between px-2 py-0.5 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <span className="truncate">Reply to Priya about renewal</span>
              <span className="text-[10px] text-zinc-400 font-mono">Thu</span>
            </div>
            <div
              onClick={() => onNavigate?.('chat')}
              className="flex items-center justify-between px-2 py-0.5 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <span className="truncate">Candidate outreach, design l...</span>
              <span className="text-[10px] text-zinc-400 font-mono">Wed</span>
            </div>
            <div
              onClick={() => onNavigate?.('chat')}
              className="flex items-center justify-between px-2 py-0.5 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <span className="truncate">Onboard Fieldline as a ven...</span>
              <span className="text-[10px] text-zinc-400 font-mono">Oct 14</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User & Stats Bar with Workspace Dropdown */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800 bg-[#f9f9fa] dark:bg-[#151517] relative">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span>11.5h saved · 1.4M tokens</span>
          </div>
          <span className="font-mono text-zinc-400">7d</span>
        </div>

        <button
          type="button"
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="w-full flex items-center justify-between pt-1 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/60 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold flex items-center justify-center text-[10px]">
              MO
            </div>
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100 text-[11px] leading-tight">
                Maya Okafor
              </div>
              <div className="text-[10px] text-zinc-400 leading-tight">
                {activeWorkspace}
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {/* Workspace Switcher Popover */}
        {showWorkspaceMenu && (
          <div className="absolute bottom-full mb-2 left-2 right-2 bg-white dark:bg-[#1e1e22] border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-xl p-1.5 z-40 text-xs animate-fade-in">
            <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Switch Workspace
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.name}
                type="button"
                onClick={() => {
                  setActiveWorkspace(ws.name);
                  setShowWorkspaceMenu(false);
                  showToast(`Switched workspace to: ${ws.name}`, 'success');
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                  activeWorkspace === ws.name
                    ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div>
                  <div className="text-xs">{ws.name}</div>
                  <div className="text-[10px] text-zinc-400">{ws.tier}</div>
                </div>
                {activeWorkspace === ws.name && (
                  <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
