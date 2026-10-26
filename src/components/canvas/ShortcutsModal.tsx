import React from 'react';
import { X, Command, Move, ZoomIn, LayoutGrid, MousePointer } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#1a1a1c] border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Canvas Shortcuts & Gestures
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Move className="w-3.5 h-3.5 text-zinc-400" />
              <span>Pan Canvas</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 font-mono">
                Mouse Scroll
              </kbd>
              <span className="text-zinc-400">or</span>
              <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 font-mono">
                Space + Drag
              </kbd>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <ZoomIn className="w-3.5 h-3.5 text-zinc-400" />
              <span>Zoom to Cursor</span>
            </div>
            <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 font-mono">
              Ctrl + Scroll / Pinch
            </kbd>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <span>Fit All 11 Boards</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 font-mono">
                Shift + 1
              </kbd>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <MousePointer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reposition Boards</span>
            </div>
            <span className="text-zinc-500 dark:text-zinc-400">
              Drag top header <code className="font-mono">:::</code>
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-700 dark:text-zinc-300">Reset View (Day 1 Focus)</span>
            <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 font-mono">
              Shift + 0
            </kbd>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-700 dark:text-zinc-300">Toggle Theme</span>
            <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 font-mono">
              T
            </kbd>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium text-xs hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
