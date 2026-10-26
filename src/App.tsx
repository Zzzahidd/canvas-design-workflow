import React, { useState, useEffect, useCallback } from 'react';
import { InfiniteCanvas } from '@/components/canvas/InfiniteCanvas';
import { CanvasToolbarBottom } from '@/components/canvas/CanvasToolbarBottom';
import { CanvasBadges } from '@/components/canvas/CanvasBadges';
import { ShortcutsModal } from '@/components/canvas/ShortcutsModal';
import { useCanvasStore } from '@/store/canvasStore';
import { useRoutineStore } from '@/store/routineStore';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';

export const App: React.FC = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const {
    viewport,
    setViewport,
    setZoom,
    fitAll,
    resetView,
    toggleTheme,
  } = useCanvasStore();

  const { toast, clearToast, showToast } = useRoutineStore();

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Shift + 1: Fit all boards
      if (e.shiftKey && e.key === '!') {
        e.preventDefault();
        fitAll(window.innerWidth, window.innerHeight);
        showToast('Fitted all 11 boards to screen', 'info');
      }

      // Shift + 0: Reset view to Day 1
      if (e.shiftKey && e.key === ')') {
        e.preventDefault();
        resetView();
        showToast('Reset view to Day 1 Chat Exploration', 'info');
      }

      // Zoom keys with Ctrl
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(viewport.zoom + 0.05);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        setZoom(viewport.zoom - 0.05);
      }

      // Shortcuts modal toggle
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }

      // Theme toggle
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewport.zoom, fitAll, resetView, setZoom, toggleTheme, showToast]);

  // Handle focus concept navigation across horizontal strip
  const handleFocusConcept = useCallback(
    (concept: 'day1' | 'thread-routines' | 'workbench' | 'desk') => {
      const zoom = 0.65;
      const targetY = 120;
      let targetX = 60;

      if (concept === 'day1') {
        targetX = 60;
        showToast('Viewing Day 1: Thread Chat (Home & Active Chat)', 'info');
      } else if (concept === 'thread-routines') {
        targetX = -1580;
        showToast('Viewing Thread Routines (13, 14, 15)', 'info');
      } else if (concept === 'workbench') {
        targetX = -4050;
        showToast('Viewing Workbench (Pro Dual-Rail Workstation)', 'info');
      } else if (concept === 'desk') {
        targetX = -6550;
        showToast('Viewing Desk (Clean Modular Grid)', 'info');
      }

      setViewport({ x: targetX, y: targetY, zoom });
    },
    [setViewport, showToast]
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#f5f5f7] dark:bg-[#121214] text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Main Interactive Infinite Canvas */}
      <main className="w-full h-full">
        <InfiniteCanvas />
      </main>

      {/* Bottom Floating Zoom & Fit Pill Dock */}
      <CanvasToolbarBottom
        onFitAll={() => fitAll(window.innerWidth, window.innerHeight)}
        onResetView={() => {
          resetView();
          handleFocusConcept('day1');
        }}
      />

      {/* Badges & Floating Quick Menu */}
      <CanvasBadges
        onOpenShortcuts={() => setShowShortcuts(true)}
        onFocusConcept={handleFocusConcept}
      />

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Global Interactive Notification Toast */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs shadow-md border border-zinc-700"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={clearToast}
            className="ml-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
};

export default App;
