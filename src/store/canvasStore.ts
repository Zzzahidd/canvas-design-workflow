import { create } from 'zustand';
import { BoardConfig, ToolMode, ViewportState } from '@/types/canvas';
import { INITIAL_BOARDS } from '@/lib/initialData';

interface CanvasState {
  viewport: ViewportState;
  activeTool: ToolMode;
  selectedBoardId: string | null;
  boards: BoardConfig[];
  theme: 'light' | 'dark';
  isDraggingBoard: boolean;
  isPanning: boolean;
  spacePressed: boolean;
  shiftPressed: boolean;

  // Actions
  setViewport: (viewport: Partial<ViewportState>) => void;
  setZoom: (zoom: number, focalPoint?: { x: number; y: number }) => void;
  panBy: (dx: number, dy: number) => void;
  setActiveTool: (tool: ToolMode) => void;
  selectBoard: (id: string | null) => void;
  moveBoard: (id: string, x: number, y: number) => void;
  persistBoards: () => void;
  bringToFront: (id: string) => void;
  fitAll: (viewWidth: number, viewHeight: number) => void;
  resetView: (viewWidth?: number, viewHeight?: number) => void;
  toggleTheme: () => void;
  resetBoardPositions: () => void;
  setSpacePressed: (pressed: boolean) => void;
  setShiftPressed: (pressed: boolean) => void;
  setIsPanning: (panning: boolean) => void;
}

const STORAGE_KEY_BOARDS = 'canvas_boards_layout_v2';
const STORAGE_KEY_THEME = 'canvas_theme_v2';

const getStoredBoards = (): BoardConfig[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOARDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === INITIAL_BOARDS.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored boards layout', e);
  }
  return INITIAL_BOARDS;
};

const getStoredTheme = (): 'light' | 'dark' => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME);
    if (raw === 'dark' || raw === 'light') return raw;
  } catch (e) {}
  return 'light';
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  viewport: {
    x: 60,
    y: 120,
    zoom: 0.65, // Comfortable initial zoom focused on Day 1 Home & Active chat
  },
  activeTool: 'select',
  selectedBoardId: null,
  boards: getStoredBoards(),
  theme: getStoredTheme(),
  isDraggingBoard: false,
  isPanning: false,
  spacePressed: false,
  shiftPressed: false,

  setViewport: (vp) =>
    set((state) => ({
      viewport: { ...state.viewport, ...vp },
    })),

  setZoom: (newZoom, focalPoint) =>
    set((state) => {
      const clampedZoom = Math.min(Math.max(newZoom, 0.15), 2.0);
      if (clampedZoom === state.viewport.zoom) return state;

      if (!focalPoint) {
        return {
          viewport: { ...state.viewport, zoom: clampedZoom },
        };
      }

      const currentZoom = state.viewport.zoom;
      const zoomRatio = clampedZoom / currentZoom;
      const newX = focalPoint.x - (focalPoint.x - state.viewport.x) * zoomRatio;
      const newY = focalPoint.y - (focalPoint.y - state.viewport.y) * zoomRatio;

      return {
        viewport: {
          x: Math.round(newX),
          y: Math.round(newY),
          zoom: parseFloat(clampedZoom.toFixed(3)),
        },
      };
    }),

  panBy: (dx, dy) =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        x: state.viewport.x + dx,
        y: state.viewport.y + dy,
      },
    })),

  setActiveTool: (tool) => set({ activeTool: tool }),

  selectBoard: (id) =>
    set((state) => {
      if (id && state.selectedBoardId !== id) {
        get().bringToFront(id);
      }
      return { selectedBoardId: id };
    }),

  moveBoard: (id, x, y) =>
    set((state) => {
      const updated = state.boards.map((b) => (b.id === id ? { ...b, x, y } : b));
      return { boards: updated };
    }),

  persistBoards: () => {
    try {
      localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(get().boards));
    } catch (e) {}
  },

  bringToFront: (id) =>
    set((state) => {
      const maxZ = Math.max(...state.boards.map((b) => b.zIndex), 1);
      const updated = state.boards.map((b) =>
        b.id === id ? { ...b, zIndex: maxZ + 1 } : b
      );
      return { boards: updated };
    }),

  fitAll: (viewWidth, viewHeight) =>
    set((state) => {
      if (state.boards.length === 0) return state;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const b of state.boards) {
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
      }

      const totalWidth = maxX - minX;
      const totalHeight = maxY - minY;

      const padding = 80;
      const availableW = Math.max(viewWidth - padding * 2, 400);
      const availableH = Math.max(viewHeight - padding * 2 - 80, 300);

      const scaleX = availableW / totalWidth;
      const scaleY = availableH / totalHeight;
      const fitZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.12), 1.0);

      const centerX = (viewWidth - totalWidth * fitZoom) / 2 - minX * fitZoom;
      const centerY = (viewHeight - totalHeight * fitZoom) / 2 - minY * fitZoom;

      return {
        viewport: {
          x: Math.round(centerX),
          y: Math.round(centerY),
          zoom: parseFloat(fitZoom.toFixed(3)),
        },
      };
    }),

  resetView: () =>
    set(() => ({
      viewport: {
        x: 60,
        y: 120,
        zoom: 0.65,
      },
    })),

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY_THEME, next);
      } catch (e) {}
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: next };
    }),

  resetBoardPositions: () => {
    try {
      localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(INITIAL_BOARDS));
    } catch (e) {}
    set({ boards: INITIAL_BOARDS, selectedBoardId: null });
  },

  setSpacePressed: (pressed) => set({ spacePressed: pressed }),
  setShiftPressed: (pressed) => set({ shiftPressed: pressed }),
  setIsPanning: (isPanning) => set({ isPanning }),
}));
