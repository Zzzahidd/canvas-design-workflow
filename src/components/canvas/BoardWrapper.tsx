import React, { useRef, useState } from 'react';
import { BoardConfig } from '@/types/canvas';
import { useCanvasStore } from '@/store/canvasStore';
import { GripVertical } from 'lucide-react';

interface BoardWrapperProps {
  board: BoardConfig;
  isVisible?: boolean;
  children: React.ReactNode;
}

export const BoardWrapper: React.FC<BoardWrapperProps> = ({
  board,
  isVisible = true,
  children,
}) => {
  const {
    selectedBoardId,
    selectBoard,
    moveBoard,
    persistBoards,
    viewport,
  } = useCanvasStore();

  const isSelected = selectedBoardId === board.id;
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; boardX: number; boardY: number }>({
    mouseX: 0,
    mouseY: 0,
    boardX: board.x,
    boardY: board.y,
  });

  const handlePointerDownHeader = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    selectBoard(board.id);
    setIsDragging(true);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      boardX: board.x,
      boardY: board.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();

    const dx = (e.clientX - dragStartRef.current.mouseX) / viewport.zoom;
    const dy = (e.clientY - dragStartRef.current.mouseY) / viewport.zoom;

    const newX = Math.round(dragStartRef.current.boardX + dx);
    const newY = Math.round(dragStartRef.current.boardY + dy);

    moveBoard(board.id, newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    persistBoards();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const conceptName =
    board.concept === 'thread'
      ? 'Thread'
      : board.concept === 'workbench'
      ? 'Workbench'
      : 'Desk';

  // Lightweight skeleton placeholder for off-screen boards on potato PCs
  if (!isVisible) {
    return (
      <div
        style={{
          transform: `translate3d(${board.x}px, ${board.y}px, 0px)`,
          width: `${board.width}px`,
          height: `${board.height}px`,
        }}
        className="absolute top-0 left-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-[#18181b]/60 flex flex-col items-center justify-center text-zinc-400 select-none pointer-events-none"
      >
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          ::: {conceptName} · {board.labelNumber} {board.labelTitle}
        </div>
        <div className="text-[11px] text-zinc-400 mt-1">
          Scroll near to view interface
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: `translate3d(${board.x}px, ${board.y}px, 0px)`,
        width: `${board.width}px`,
        zIndex: isSelected ? 50 : board.zIndex,
      }}
      className="absolute top-0 left-0 select-none"
      onClick={() => selectBoard(board.id)}
    >
      {/* Board Label Header */}
      <div
        onPointerDown={handlePointerDownHeader}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`drag-handle inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded-md text-xs font-medium cursor-grab active:cursor-grabbing ${
          isSelected
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
        }`}
      >
        <GripVertical className="w-3.5 h-3.5 opacity-60" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          ::: {conceptName} · {board.labelNumber} {board.labelTitle}
        </span>
      </div>

      {/* Screen Frame Container */}
      <div
        style={{
          width: `${board.width}px`,
          height: `${board.height}px`,
        }}
        className={`screen-frame-inner relative rounded-xl overflow-hidden bg-white dark:bg-[#18181b] border ${
          isSelected
            ? 'ring-2 ring-zinc-900 dark:ring-white border-transparent'
            : 'border-zinc-300 dark:border-zinc-800'
        }`}
      >
        <div className="board-content-interactive w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
