import React, { useState } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import {
  Minus,
  Plus,
  Scan,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';

interface CanvasToolbarBottomProps {
  onFitAll: () => void;
  onResetView: () => void;
}

export const CanvasToolbarBottom: React.FC<CanvasToolbarBottomProps> = ({
  onFitAll,
  onResetView,
}) => {
  const { viewport, setZoom, theme, toggleTheme } = useCanvasStore();
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const zoomPercent = Math.round(viewport.zoom * 100);

  const handleZoomOut = () => {
    setZoom(viewport.zoom - 0.05);
  };

  const handleZoomIn = () => {
    setZoom(viewport.zoom + 0.05);
  };

  const setSpecificZoom = (val: number) => {
    setZoom(val / 100);
    setShowZoomMenu(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center">
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#1a1a1c] text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-full shadow-sm border border-zinc-300 dark:border-zinc-700 text-xs font-medium">
        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (Ctrl -)"
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Percentage */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            title="Click to select zoom level"
            className="w-12 text-center py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium text-zinc-800 dark:text-zinc-200"
          >
            {zoomPercent}%
          </button>

          {showZoomMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1c1c1f] border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-md py-1 w-24 text-center z-50">
              {[25, 34, 50, 75, 100, 125, 150, 200].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpecificZoom(lvl)}
                  className={`w-full py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 block ${
                    zoomPercent === lvl ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {lvl}%
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (Ctrl +)"
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-3.5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Fit All Button */}
        <button
          type="button"
          onClick={onFitAll}
          title="Fit all boards to screen (Shift 1)"
          className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-800 dark:text-zinc-200"
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Fit all</span>
        </button>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={onResetView}
          title="Reset zoom to 100% (Shift 0)"
          className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-800 dark:text-zinc-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-3.5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Theme Switcher */}
        <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => theme !== 'light' && toggleTheme()}
            title="Light Theme"
            className={`p-1 rounded-full transition-colors ${
              theme === 'light'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <Sun className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => theme !== 'dark' && toggleTheme()}
            title="Dark Theme"
            className={`p-1 rounded-full transition-colors ${
              theme === 'dark'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <Moon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
