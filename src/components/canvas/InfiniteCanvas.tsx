import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { BoardWrapper } from './BoardWrapper';
import { ThreadBoardContainer } from '@/components/thread/ThreadBoardContainer';
import { WorkbenchBoardContainer } from '@/components/workbench/WorkbenchBoardContainer';
import { DeskBoardContainer } from '@/components/desk/DeskBoardContainer';

export const InfiniteCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);

  const {
    viewport,
    setViewport,
    boards,
    selectBoard,
    setSpacePressed,
  } = useCanvasStore();

  // Mutable transform ref for 60 FPS zero-react-render panning & zooming
  const currentTransform = useRef({
    x: viewport.x,
    y: viewport.y,
    zoom: viewport.zoom,
  });

  const isSpaceDownRef = useRef(false);
  const isPanningRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const debounceSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Directly mutate DOM transform with crisp subpixel 2D transform (ensures zero blur at any zoom level)
  const applyTransformDirect = useCallback((x: number, y: number, zoom: number) => {
    if (planeRef.current) {
      planeRef.current.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    }
  }, []);

  // Sync to Zustand store (debounced so toolbar percentages update without CPU lag)
  const syncToStore = useCallback((x: number, y: number, zoom: number) => {
    if (debounceSyncRef.current) clearTimeout(debounceSyncRef.current);
    debounceSyncRef.current = setTimeout(() => {
      setViewport({
        x: Math.round(x),
        y: Math.round(y),
        zoom: parseFloat(zoom.toFixed(3)),
      });
      setVirtualView({ x, y, zoom });
    }, 100);
  }, [setViewport]);

  // Virtualization state: updated ONLY when panning stops or on external change!
  const [virtualView, setVirtualView] = useState({
    x: viewport.x,
    y: viewport.y,
    zoom: viewport.zoom,
  });

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial transform apply on mount
  useEffect(() => {
    applyTransformDirect(viewport.x, viewport.y, viewport.zoom);
  }, [applyTransformDirect, viewport.x, viewport.y, viewport.zoom]);

  // Sync from external store changes (Fit All, Reset, Jump navigation pills)
  useEffect(() => {
    const cur = currentTransform.current;
    if (
      Math.abs(cur.x - viewport.x) > 1 ||
      Math.abs(cur.y - viewport.y) > 1 ||
      Math.abs(cur.zoom - viewport.zoom) > 0.005
    ) {
      cur.x = viewport.x;
      cur.y = viewport.y;
      cur.zoom = viewport.zoom;
      applyTransformDirect(viewport.x, viewport.y, viewport.zoom);
      setVirtualView({
        x: viewport.x,
        y: viewport.y,
        zoom: viewport.zoom,
      });
    }
  }, [viewport.x, viewport.y, viewport.zoom, applyTransformDirect]);

  // Track Spacebar for hand cursor & pan activation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input, textarea, [contenteditable="true"]')
      ) {
        return;
      }

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        isSpaceDownRef.current = true;
        document.body.classList.add('canvas-space-pressed');
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpaceDownRef.current = false;
        document.body.classList.remove('canvas-space-pressed');
        if (!isPanningRef.current) {
          document.body.classList.remove('canvas-is-panning');
        }
        setSpacePressed(false);
      }
    };

    const handleWindowBlur = () => {
      isSpaceDownRef.current = false;
      isPanningRef.current = false;
      document.body.classList.remove('canvas-space-pressed');
      document.body.classList.remove('canvas-is-panning');
      setSpacePressed(false);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleWindowBlur);
      document.body.classList.remove('canvas-space-pressed');
      document.body.classList.remove('canvas-is-panning');
    };
  }, [setSpacePressed]);

  // Non-passive Wheel Listener: Intercepts Ctrl + Wheel to prevent browser zoom and zoom canvas!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // ALWAYS prevent default Chrome browser zoom!
        e.preventDefault();

        const zoomFactor = e.deltaY < 0 ? 1.09 : 0.91;
        const curZoom = currentTransform.current.zoom;
        const newZoom = Math.min(Math.max(curZoom * zoomFactor, 0.12), 2.5);
        if (Math.abs(newZoom - curZoom) < 0.001) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const ratio = newZoom / curZoom;
        const newX = mouseX - (mouseX - currentTransform.current.x) * ratio;
        const newY = mouseY - (mouseY - currentTransform.current.y) * ratio;

        currentTransform.current.x = newX;
        currentTransform.current.y = newY;
        currentTransform.current.zoom = newZoom;

        applyTransformDirect(newX, newY, newZoom);
        syncToStore(newX, newY, newZoom);
        return;
      }

      // If Ctrl is NOT pressed:
      // Check if mouse is over an element with scrollable overflow
      let el: HTMLElement | null = e.target as HTMLElement;
      let hasScrollableParent = false;
      while (el && el !== container && el !== planeRef.current) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const canScrollY =
          (overflowY === 'auto' || overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight;
        if (canScrollY) {
          hasScrollableParent = true;
          break;
        }
        el = el.parentElement;
      }

      if (hasScrollableParent) {
        // Let user scroll the internal list / chat natively
        return;
      }

      // Otherwise, pan the canvas with wheel
      e.preventDefault();
      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      const dy = e.shiftKey ? 0 : e.deltaY;

      currentTransform.current.x -= dx;
      currentTransform.current.y -= dy;
      applyTransformDirect(
        currentTransform.current.x,
        currentTransform.current.y,
        currentTransform.current.zoom
      );
      syncToStore(
        currentTransform.current.x,
        currentTransform.current.y,
        currentTransform.current.zoom
      );
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [applyTransformDirect, syncToStore]);

  // Pointer Drag Pan Handler (Space + Drag, Middle Click, or Drag on background)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const isMiddleClick = e.button === 1;
      const isLeftClick = e.button === 0;
      const isSpaceHeld = isSpaceDownRef.current;

      const target = e.target as HTMLElement;
      const isDragHandle = target.closest('.drag-handle');
      if (isDragHandle) {
        return; // Let board header handle move its own board
      }

      const isCanvasBackground =
        target === containerRef.current ||
        target === planeRef.current ||
        target.classList.contains('canvas-background') ||
        target.classList.contains('canvas-plane-surface');

      // Pan conditions:
      // 1. Middle click anywhere
      // 2. Space held + left click anywhere
      // 3. Left click directly on empty canvas background
      if (isMiddleClick || (isLeftClick && (isSpaceHeld || isCanvasBackground))) {
        e.preventDefault();
        isPanningRef.current = true;
        pointerStartRef.current = { x: e.clientX, y: e.clientY };
        document.body.classList.add('canvas-is-panning');

        if (isCanvasBackground) {
          selectBoard(null);
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPanningRef.current) return;
      e.preventDefault();

      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };

      currentTransform.current.x += dx;
      currentTransform.current.y += dy;

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          applyTransformDirect(
            currentTransform.current.x,
            currentTransform.current.y,
            currentTransform.current.zoom
          );
          rafIdRef.current = null;
        });
      }
    };

    const handlePointerUp = () => {
      if (!isPanningRef.current) return;
      isPanningRef.current = false;
      document.body.classList.remove('canvas-is-panning');

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      applyTransformDirect(
        currentTransform.current.x,
        currentTransform.current.y,
        currentTransform.current.zoom
      );

      syncToStore(
        currentTransform.current.x,
        currentTransform.current.y,
        currentTransform.current.zoom
      );
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [applyTransformDirect, syncToStore, selectBoard]);

  // Viewport Virtualization: Calculated ONLY when pan ends or on external navigation
  const visibleBoardMap = useMemo(() => {
    const zoom = Math.max(virtualView.zoom, 0.1);
    const viewLeft = -virtualView.x / zoom;
    const viewRight = (-virtualView.x + windowWidth) / zoom;
    const buffer = 1500; // 1 full board width buffer

    const map: Record<string, boolean> = {};
    for (const b of boards) {
      const isVisible =
        b.x + b.width >= viewLeft - buffer &&
        b.x <= viewRight + buffer;
      map[b.id] = isVisible;
    }
    return map;
  }, [virtualView.x, virtualView.zoom, windowWidth, boards]);

  // Render board content with fully interactive product containers
  const renderBoardContent = (boardId: string) => {
    switch (boardId) {
      // 1. Thread Chat Exploration (Day 1)
      case 'board-thread-home':
        return <ThreadBoardContainer initialScreen="home" />;
      case 'board-thread-chat':
        return <ThreadBoardContainer initialScreen="chat" />;

      // 2. Thread Routines (Day 3)
      case 'board-thread-list':
        return <ThreadBoardContainer initialScreen="list" />;
      case 'board-thread-detail':
        return <ThreadBoardContainer initialScreen="detail" />;
      case 'board-thread-create':
        return <ThreadBoardContainer initialScreen="create" />;

      // 3. Workbench
      case 'board-workbench-list':
        return <WorkbenchBoardContainer initialScreen="list" />;
      case 'board-workbench-detail':
        return <WorkbenchBoardContainer initialScreen="detail" />;
      case 'board-workbench-create':
        return <WorkbenchBoardContainer initialScreen="create" />;

      // 4. Desk
      case 'board-desk-list':
        return <DeskBoardContainer initialScreen="list" />;
      case 'board-desk-detail':
        return <DeskBoardContainer initialScreen="detail" />;
      case 'board-desk-create':
        return <DeskBoardContainer initialScreen="create" />;

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="canvas-container-root fixed inset-0 w-screen h-screen overflow-hidden bg-[#f5f5f7] dark:bg-[#121214] select-none touch-none"
    >
      {/* Lightweight Static Canvas Background (Zero CPU repaints) */}
      <div
        className="canvas-background absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle, #a1a1aa 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Infinite Canvas Crisp Vector Surface */}
      <div
        ref={planeRef}
        className="infinite-canvas-plane canvas-plane-surface absolute top-0 left-0 w-0 h-0"
      >
        {boards.map((board) => {
          const isVisible = !!visibleBoardMap[board.id];
          return (
            <BoardWrapper
              key={board.id}
              board={board}
              isVisible={isVisible}
            >
              {isVisible ? renderBoardContent(board.id) : null}
            </BoardWrapper>
          );
        })}
      </div>
    </div>
  );
};
