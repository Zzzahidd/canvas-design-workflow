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
} from 'lucide-react';
import { useRoutineStore } from '@/store/routineStore';

interface DeskDrawerProps {
  activeScreen?: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory';
  onNavigate?: (screen: 'home' | 'chat' | 'list' | 'detail' | 'create' | 'skills' | 'memory') => void;
}

export const DeskDrawer: React.FC<DeskDrawerProps> = ({
  activeScreen = 'list',
  onNavigate,
}) => {
  const { routines, showToast } = useRoutineStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDrawer = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    showToast(next ? 'Collapsed Desk drawer' : 'Expanded Desk drawer', 'info');
  };

  if (isCollapsed) {
    return (
      <div className="w-12 flex-shrink-0 h-full bg-[#fbfbfb] dark:bg-[#151517] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between items-center py-3 select-none text-zinc-700 dark:text-zinc-300 font-sans transition-all duration-200">
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => onNavigate?.('home')}
            className="w-5 h-5 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px] cursor-pointer"
          >
            D
          </div>

          <button
            type="button"
            onClick={toggleDrawer}
            title="Expand Desk drawer"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>

          <div className="w-5 h-[1px] bg-zinc-200 dark:bg-zinc-800 my-0.5" />

          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            title="New Chat"
            className="p-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('chat')}
            title="Chat"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeScreen === 'chat'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('skills')}
            title="Skills"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeScreen === 'skills'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('memory')}
            title="Memory"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeScreen === 'memory'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('list')}
            title="Routines"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeScreen === 'list' || activeScreen === 'detail' || activeScreen === 'create'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-semibold flex items-center justify-center">
          MO
        </div>
      </div>
    );
  }

  return (
    <div className="w-52 h-full bg-[#fbfbfb] dark:bg-[#151517] border-r border-zinc-200 dark:border-zinc-800 p-3 flex flex-col justify-between flex-shrink-0 text-xs overflow-y-auto select-none transition-all duration-200">
      <div className="space-y-3">
        {/* Top Logo & Toggle */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div
              onClick={() => onNavigate?.('home')}
              className="w-5 h-5 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px] cursor-pointer"
            >
              D
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white text-xs">
              Desk
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => showToast('Search Desk folders & chats', 'info')}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleDrawer}
              title="Collapse drawer"
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors"
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* New Chat Pill */}
        <button
          type="button"
          onClick={() => onNavigate?.('home')}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-xs hover:opacity-90 shadow-xs cursor-pointer"
        >
          <span>New chat</span>
          <span className="text-[10px] opacity-60 font-mono">⌘N</span>
        </button>

        {/* Navigation Sections */}
        <div className="space-y-0.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigate?.('chat')}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeScreen === 'chat'
                ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('skills')}
            className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeScreen === 'skills'
                ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Boxes className="w-3.5 h-3.5 text-zinc-400" />
              <span>Skills</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">22</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('memory')}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeScreen === 'memory'
                ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <span>Memory</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('list')}
            className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeScreen === 'list' || activeScreen === 'detail' || activeScreen === 'create'
                ? 'bg-zinc-200/80 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Routines</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">{routines.length}</span>
          </button>
        </div>

        {/* Pinned Chats */}
        <div className="pt-2">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5 px-2">
            Pinned
          </div>
          <div className="space-y-1">
            <div
              onClick={() => onNavigate?.('chat')}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 cursor-pointer font-medium"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileText className="w-3 h-3 text-zinc-500" />
                <span className="truncate">October invoicing</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            </div>

            <div
              onClick={() => onNavigate?.('chat')}
              className="flex items-center gap-1.5 px-2 py-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <FileText className="w-3 h-3 text-zinc-400" />
              <span className="truncate">Acme MSA redlines</span>
            </div>
          </div>
        </div>

        {/* Folder Tree */}
        <div className="pt-2">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1 px-2">
            Folders
          </div>
          <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
            <div
              onClick={() => showToast('Folder: Finance (3 active drafts)', 'info')}
              className="flex items-center gap-1.5 px-2 py-1 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <ChevronDown className="w-3 h-3 text-zinc-400" />
              <Folder className="w-3.5 h-3.5 text-zinc-500" />
              <span>Finance</span>
            </div>
            <div
              onClick={() => showToast('Folder: Legal (4 agreements)', 'info')}
              className="flex items-center gap-1.5 px-2 py-1 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <Folder className="w-3.5 h-3.5 text-zinc-500" />
              <span>Legal</span>
            </div>
            <div
              onClick={() => showToast('Folder: IT support (2 open tickets)', 'info')}
              className="flex items-center gap-1.5 px-2 py-1 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <Folder className="w-3.5 h-3.5 text-zinc-500" />
              <span>IT support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-zinc-600 dark:text-zinc-400 px-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-semibold flex items-center justify-center">
            MO
          </div>
          <span className="font-medium text-zinc-900 dark:text-white text-xs">
            Maya Okafor
          </span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">Desk v1.2</span>
      </div>
    </div>
  );
};
