export type RoutineStatus = 'scheduled' | 'watching' | 'paused';

export interface RoutineStep {
  order: number;
  text: string;
  tool: string;
}

export interface RoutineRunHistory {
  id: string;
  date: string;
  summary: string;
  duration: string;
  status: 'success' | 'warning' | 'error';
}

export interface RoutineNeedReviewItem {
  id: string;
  name: string;
  company: string;
  initials: string;
  message: string;
  action: string;
  actionType: 'reply' | 'review' | 'asked';
}

export interface RoutineCalendarItem {
  id: string;
  time: string;
  title: string;
  statusText?: string;
  statusType?: 'ready' | 'none';
}

export interface RoutineRecurrence {
  repeats: 'Once' | 'Daily' | 'Weekdays' | 'Weekly' | 'Monthly' | 'Every 2 weeks';
  days: string[];
  time: string;
  timezone: string;
  starts: string;
  ends: string;
  summaryText: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  schedule: string;
  recurrence: RoutineRecurrence;
  status: RoutineStatus;
  enabled: boolean;
  lastRun: {
    summary: string;
    status: 'success' | 'needs_review' | 'no_change' | 'paused' | 'error';
    timestamp?: string;
  };
  nextRun: string;
  skills: string[];
  owner: {
    name: string;
    initials: string;
    badgeBg?: string;
  };
  steps: RoutineStep[];
  history: RoutineRunHistory[];
  needsReply?: RoutineNeedReviewItem[];
  todaySchedule?: RoutineCalendarItem[];
  settings?: {
    skipHolidays: boolean;
    pauseAfterUnread: boolean;
    emailCopy: boolean;
    askBeforeSending: boolean;
  };
  sources?: string[];
  delivery?: string;
  createdAt: string;
}

export interface RoutineFilterState {
  tab: 'all' | 'scheduled' | 'watching' | 'paused';
  subTab?: 'all' | 'yours' | 'team';
  searchQuery: string;
}
