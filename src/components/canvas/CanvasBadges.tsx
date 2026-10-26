import React, { useState } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { SlidersHorizontal, LayoutTemplate, RotateCcw, HelpCircle, X, MessageSquare } from 'lucide-react';

interface CanvasBadgesProps {
  onOpenShortcuts: () => void;
  onFocusConcept: (concept: 'day1' | 'thread-routines' | 'workbench' | 'desk') => void;
}

export const CanvasBadges: React.FC<CanvasBadgesProps> = ({
  onOpenShortcuts,
  onFocusConcept,
}) => {
  const [showDevBadge, setShowDevBadge] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const { resetBoardPositions } = useCanvasStore();

  return (
    <>
      {/* Bottom-left: Dev Cache Disabled Badge */}
      {showDevBadge && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center">
          <div className="flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-2.5 py-1.5 rounded-lg shadow-md text-xs font-medium transition-colors">
            <span className="w-4 h-4 bg-zinc-900 text-white rounded flex items-center justify-center font-bold text-[10px]">
              N
            </span>
            <span>Cache disabled</span>
            <button
              type="button"
              onClick={() => setShowDevBadge(false)}
              className="ml-1 hover:opacity-80 transition-opacity"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom-right: View Options Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            title="Canvas Navigation & Concepts"
            className="w-10 h-10 rounded-full bg-[#202020] text-zinc-300 hover:text-white flex items-center justify-center shadow-sm border border-zinc-700 transition-all hover:scale-105"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-md py-2 z-50 text-xs">
              <div className="px-3 py-1 font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                Jump to Screens (Horizontal)
              </div>

              <button
                type="button"
                onClick={() => {
                  onFocusConcept('day1');
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-medium">Thread · 1 & 2 Chat Exploration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onFocusConcept('thread-routines');
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-zinc-500" />
                <span>Thread · 13-15 Routines</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onFocusConcept('workbench');
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-zinc-500" />
                <span>Workbench · 13-15 Pro Rails</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onFocusConcept('desk');
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-zinc-500" />
                <span>Desk · 13-15 Modular Grid</span>
              </button>

              <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-1" />

              <button
                type="button"
                onClick={() => {
                  resetBoardPositions();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset board positions</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenShortcuts();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Keyboard shortcuts (?)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
