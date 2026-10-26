import { create } from 'zustand';
import { RoutineItem, RoutineStatus } from '@/types/routine';
import { INITIAL_ROUTINES } from '@/lib/initialData';

export interface DraftRoutineForm {
  prompt: string;
  name: string;
  instructions: string;
  repeats: 'Once' | 'Daily' | 'Weekdays' | 'Weekly' | 'Monthly' | 'Every 2 weeks';
  days: string[];
  time: string;
  timezone: string;
  starts: string;
  ends: string;
  preset: string;
  skills: string[];
  sources: string[];
  sendTo: string;
  delivery: string;
  askBeforeSending: boolean;
}

export const INITIAL_DRAFT_FORM: DraftRoutineForm = {
  prompt: 'Every other Thursday, send Ines a short Lumen progress update with what shipped. Ask me first.',
  name: 'Lumen progress update',
  instructions: 'Every other Thursday at 10:00 AM, write Ines a short update on what shipped in the Lumen prototype build since the last one, with a Loom link if there is one. Ask me before sending.',
  repeats: 'Every 2 weeks',
  days: ['Thu'],
  time: '10:00 AM',
  timezone: 'Pacific Time',
  starts: 'Thu, Oct 23',
  ends: 'Never',
  preset: 'Every other Thursday',
  skills: ['Client email, startups', 'Weekly status report'],
  sources: ['Tracker: Lumen prototype build', 'Recorded work', 'Loom', 'Memory: Lumen Labs'],
  sendTo: 'Ines Duarte, cc Jonas',
  delivery: 'Email draft',
  askBeforeSending: true,
};

interface RoutineStoreState {
  routines: RoutineItem[];
  selectedRoutineId: string;
  filterTab: 'all' | 'scheduled' | 'watching' | 'paused';
  subTab: 'all' | 'yours' | 'team';
  searchQuery: string;
  draftForm: DraftRoutineForm;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;

  // Actions
  toggleRoutine: (id: string) => void;
  createRoutineFromDraft: () => RoutineItem;
  updateRoutine: (id: string, updates: Partial<RoutineItem>) => void;
  deleteRoutine: (id: string) => void;
  runRoutineNow: (id: string) => void;
  pauseRoutine: (id: string) => void;
  resumeRoutine: (id: string) => void;
  setSelectedRoutineId: (id: string) => void;
  setFilterTab: (tab: 'all' | 'scheduled' | 'watching' | 'paused') => void;
  setSubTab: (subTab: 'all' | 'yours' | 'team') => void;
  setSearchQuery: (query: string) => void;
  setDraftForm: (updates: Partial<DraftRoutineForm>) => void;
  resetDraftForm: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
  resetRoutinesToDefault: () => void;
}

const STORAGE_KEY_ROUTINES = 'canvas_routines_data_v1';

const getStoredRoutines = (): RoutineItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROUTINES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load stored routines', e);
  }
  return INITIAL_ROUTINES;
};

const saveRoutines = (routines: RoutineItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(routines));
  } catch (e) {
    // ignore
  }
};

export const useRoutineStore = create<RoutineStoreState>((set, get) => ({
  routines: getStoredRoutines(),
  selectedRoutineId: 'routine-1',
  filterTab: 'all',
  subTab: 'all',
  searchQuery: '',
  draftForm: INITIAL_DRAFT_FORM,
  toast: null,

  toggleRoutine: (id) =>
    set((state) => {
      const updated = state.routines.map((r) => {
        if (r.id !== id) return r;
        const nextEnabled = !r.enabled;
        let nextStatus: RoutineStatus = r.status;
        if (!nextEnabled) {
          nextStatus = 'paused';
        } else {
          nextStatus = r.title.toLowerCase().includes('sow') ? 'watching' : 'scheduled';
        }
        return {
          ...r,
          enabled: nextEnabled,
          status: nextStatus,
          lastRun: {
            ...r.lastRun,
            status: (nextEnabled ? 'success' : 'paused') as 'success' | 'paused',
          },
        };
      });
      saveRoutines(updated);
      const target = updated.find((r) => r.id === id);
      const actionText = target?.enabled ? 'enabled' : 'paused';
      get().showToast(`Routine "${target?.title}" is now ${actionText}.`, 'info');
      return { routines: updated };
    }),

  createRoutineFromDraft: () => {
    const { draftForm, routines } = get();
    const newId = `routine-${Date.now()}`;
    const newRoutine: RoutineItem = {
      id: newId,
      title: draftForm.name || 'Untitled routine',
      description: 'Custom automated workflow created from conversational draft.',
      instructions: draftForm.instructions,
      schedule: `${draftForm.repeats} on ${draftForm.days.join(', ')} at ${draftForm.time} ${draftForm.timezone}`,
      recurrence: {
        repeats: draftForm.repeats,
        days: draftForm.days,
        time: draftForm.time,
        timezone: draftForm.timezone,
        starts: draftForm.starts,
        ends: draftForm.ends,
        summaryText: `${draftForm.repeats} on ${draftForm.days.join(', ')} at ${draftForm.time} ${draftForm.timezone}`,
      },
      status: 'scheduled',
      enabled: true,
      lastRun: {
        summary: 'Created just now · Ready for first run',
        status: 'success',
        timestamp: 'Just now',
      },
      nextRun: `${draftForm.days[0] || 'Thu'}, Oct 23, ${draftForm.time}`,
      skills: draftForm.skills,
      owner: {
        name: 'Maya Okafor',
        initials: 'MO',
        badgeBg: 'bg-zinc-900 text-white',
      },
      steps: [
        { order: 1, text: 'Collect activity updates from tracker', tool: 'Tracker' },
        { order: 2, text: 'Draft update email with Loom link', tool: 'Mail' },
        { order: 3, text: 'Hold draft for approval before sending', tool: 'Approval' },
      ],
      history: [
        { id: `h-${Date.now()}`, date: 'Just now', summary: 'Routine created and configured', duration: '12s', status: 'success' },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      delivery: draftForm.delivery,
      sources: draftForm.sources,
      settings: {
        skipHolidays: false,
        pauseAfterUnread: true,
        emailCopy: true,
        askBeforeSending: draftForm.askBeforeSending,
      },
    };

    const updated = [newRoutine, ...routines];
    saveRoutines(updated);
    set({
      routines: updated,
      selectedRoutineId: newId,
    });
    get().showToast(`Created new routine "${newRoutine.title}"!`, 'success');
    return newRoutine;
  },

  updateRoutine: (id, updates) =>
    set((state) => {
      const updated = state.routines.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      );
      saveRoutines(updated);
      get().showToast('Routine updated successfully.', 'success');
      return { routines: updated };
    }),

  deleteRoutine: (id) =>
    set((state) => {
      const routineToDelete = state.routines.find((r) => r.id === id);
      const updated = state.routines.filter((r) => r.id !== id);
      saveRoutines(updated);
      const nextSelected = updated.length > 0 ? updated[0].id : '';
      get().showToast(`Deleted routine "${routineToDelete?.title}".`, 'info');
      return {
        routines: updated,
        selectedRoutineId: state.selectedRoutineId === id ? nextSelected : state.selectedRoutineId,
      };
    }),

  runRoutineNow: (id) =>
    set((state) => {
      const updated = state.routines.map((r) => {
        if (r.id !== id) return r;
        const newHistoryItem = {
          id: `h-run-${Date.now()}`,
          date: 'Just now',
          summary: 'Manual run triggered successfully. 2 updates prepared.',
          duration: '38s',
          status: 'success' as const,
        };
        return {
          ...r,
          lastRun: {
            summary: 'Completed manual run · 2 updates prepared',
            status: 'success' as const,
            timestamp: 'Just now',
          },
          history: [newHistoryItem, ...r.history],
        };
      });
      saveRoutines(updated);
      get().showToast('Run completed successfully!', 'success');
      return { routines: updated };
    }),

  pauseRoutine: (id) =>
    set((state) => {
      const updated = state.routines.map((r) =>
        r.id === id
          ? {
              ...r,
              enabled: false,
              status: 'paused' as RoutineStatus,
              lastRun: { ...r.lastRun, status: 'paused' as const },
            }
          : r
      );
      saveRoutines(updated);
      get().showToast('Routine paused.', 'info');
      return { routines: updated };
    }),

  resumeRoutine: (id) =>
    set((state) => {
      const updated = state.routines.map((r) =>
        r.id === id
          ? {
              ...r,
              enabled: true,
              status: 'scheduled' as RoutineStatus,
              lastRun: { ...r.lastRun, status: 'success' as const },
            }
          : r
      );
      saveRoutines(updated);
      get().showToast('Routine resumed and scheduled.', 'success');
      return { routines: updated };
    }),

  setSelectedRoutineId: (id) => set({ selectedRoutineId: id }),
  setFilterTab: (filterTab) => set({ filterTab }),
  setSubTab: (subTab) => set({ subTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setDraftForm: (updates) =>
    set((state) => ({
      draftForm: { ...state.draftForm, ...updates },
    })),

  resetDraftForm: () => set({ draftForm: INITIAL_DRAFT_FORM }),

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      const current = get().toast;
      if (current?.message === message) {
        set({ toast: null });
      }
    }, 3200);
  },

  clearToast: () => set({ toast: null }),

  resetRoutinesToDefault: () => {
    saveRoutines(INITIAL_ROUTINES);
    set({
      routines: INITIAL_ROUTINES,
      selectedRoutineId: 'routine-1',
      draftForm: INITIAL_DRAFT_FORM,
    });
    get().showToast('Reset all routine data to default.', 'info');
  },
}));
