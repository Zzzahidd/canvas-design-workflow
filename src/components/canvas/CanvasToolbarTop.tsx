import React from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { ToolMode } from '@/types/canvas';
import {
  MousePointer,
  Spline,
  BoxSelect,
  Layers,
  Ruler,
  LayoutGrid,
  Smartphone,
  Pipette,
  Camera,
  PlusCircle,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface CanvasToolbarTopProps {
  onOpenSettings: () => void;
  onTakeSnapshot: () => void;
}

export const CanvasToolbarTop: React.FC<CanvasToolbarTopProps> = ({
  onOpenSettings,
  onTakeSnapshot,
}) => {
  const { activeTool, setActiveTool } = useCanvasStore();

  const handleToolClick = (tool: ToolMode) => {
    setActiveTool(tool);
  };

  return (
    <div className="fixed top-5 left-6 z-50 flex items-center">
      <div className="flex items-center gap-1 bg-[#202020] text-zinc-400 p-1 rounded-xl shadow-dock border border-zinc-800/80 backdrop-blur-md">
        {/* 1. Inspect / Pointer Tool */}
        <button
          type="button"
          onClick={() => handleToolClick('measure')}
          title="Inspect & Measure (V)"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'measure' || activeTool === 'select'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <MousePointer className="w-4 h-4" />
        </button>

        {/* 2. Freehand / Spline */}
        <button
          type="button"
          onClick={() => handleToolClick('draw')}
          title="Freehand Spline (P)"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'draw'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Spline className="w-4 h-4" />
        </button>

        {/* 3. Marquee Select */}
        <button
          type="button"
          onClick={() => handleToolClick('marquee')}
          title="Marquee Selection (M)"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'marquee'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <BoxSelect className="w-4 h-4" />
        </button>

        {/* 4. Layers */}
        <button
          type="button"
          onClick={() => handleToolClick('layers')}
          title="Canvas Layers (L)"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'layers'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* 5. Ruler with dropdown */}
        <button
          type="button"
          onClick={() => handleToolClick('ruler')}
          title="Rulers & Guides (R)"
          className={`px-1.5 py-2 rounded-lg transition-colors flex items-center gap-0.5 ${
            activeTool === 'ruler'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {/* 6. Grid */}
        <button
          type="button"
          onClick={() => handleToolClick('grid')}
          title="Layout Grid (G)"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'grid'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* 7. Device Frames */}
        <button
          type="button"
          onClick={() => handleToolClick('device')}
          title="Device Frames & Viewports (D)"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'device'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
        </button>

        {/* 8. Eyedropper */}
        <button
          type="button"
          onClick={() => handleToolClick('eyedropper')}
          title="Color Eyedropper (I)"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'eyedropper'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Pipette className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-zinc-700/80 mx-1" />

        {/* 9. Snapshot / Camera */}
        <button
          type="button"
          onClick={onTakeSnapshot}
          title="Export Canvas Frame (Shift+E)"
          className="px-1.5 py-2 rounded-lg transition-colors flex items-center gap-0.5 hover:text-zinc-200 hover:bg-zinc-800/60"
        >
          <Camera className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {/* 10. Add / Plus */}
        <button
          type="button"
          onClick={() => handleToolClick('add')}
          title="Insert Board or Component (A)"
          className={`px-1.5 py-2 rounded-lg transition-colors flex items-center gap-0.5 ${
            activeTool === 'add'
              ? 'bg-[#333333] text-white'
              : 'hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-zinc-700/80 mx-1" />

        {/* 11. Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="Workspace Settings & Shortcuts (?)"
          className="p-2 rounded-lg transition-colors flex items-center justify-center hover:text-zinc-200 hover:bg-zinc-800/60"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
