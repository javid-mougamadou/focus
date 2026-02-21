export type Task = {
  name: string;
  durationMinutes: number;
};

export type TimerPersistedState = {
  elapsedMs: number;
  lastStartedAt: number | null;
  isPaused: boolean;
};
