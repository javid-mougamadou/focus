import { useCallback, useEffect, useRef, useState } from 'react';
import { usePersistentState } from './usePersistentState';
import type { TimerPersistedState } from '../types';

export const TIMER_STORAGE_KEY = 'focus.timer-v1';

export function clearTimerStorage(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TIMER_STORAGE_KEY);
  }
}

type UseTimerOptions = {
  durationMs: number;
  onComplete: () => void;
};

export function useTimer({ durationMs, onComplete }: UseTimerOptions) {
  const [persisted, setPersisted, resetPersisted] = usePersistentState<TimerPersistedState>({
    key: TIMER_STORAGE_KEY,
    defaultValue: {
      elapsedMs: 0,
      lastStartedAt: null,
      isPaused: true,
    },
  });

  const [remainingMs, setRemainingMs] = useState(durationMs);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);
  onCompleteRef.current = onComplete;

  const getCurrentElapsed = useCallback(() => {
    if (persisted.isPaused) {
      return persisted.elapsedMs;
    }
    if (persisted.lastStartedAt === null) {
      return persisted.elapsedMs;
    }
    return persisted.elapsedMs + (Date.now() - persisted.lastStartedAt);
  }, [persisted.elapsedMs, persisted.isPaused, persisted.lastStartedAt]);

  const updateRemaining = useCallback(() => {
    const elapsed = getCurrentElapsed();
    const remaining = Math.max(0, durationMs - elapsed);
    setRemainingMs(remaining);

    if (remaining <= 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCompleteRef.current();
    }
    if (remaining <= 0 && !persisted.isPaused) {
      setPersisted({
        elapsedMs: durationMs,
        lastStartedAt: null,
        isPaused: true,
      });
    }
  }, [durationMs, getCurrentElapsed, persisted.isPaused, setPersisted]);

  useEffect(() => {
    updateRemaining();
    const interval = setInterval(updateRemaining, 100);
    return () => clearInterval(interval);
  }, [updateRemaining, persisted]);

  const start = useCallback(() => {
    const elapsed = getCurrentElapsed();
    setPersisted({
      elapsedMs: elapsed,
      lastStartedAt: Date.now(),
      isPaused: false,
    });
  }, [getCurrentElapsed, setPersisted]);

  const pause = useCallback(() => {
    const elapsed = getCurrentElapsed();
    setPersisted({
      elapsedMs: elapsed,
      lastStartedAt: null,
      isPaused: true,
    });
  }, [getCurrentElapsed, setPersisted]);

  const resume = useCallback(() => {
    setPersisted({
      elapsedMs: persisted.elapsedMs,
      lastStartedAt: Date.now(),
      isPaused: false,
    });
  }, [persisted.elapsedMs, setPersisted]);

  const stop = useCallback(() => {
    resetPersisted();
    setRemainingMs(durationMs);
  }, [durationMs, resetPersisted]);

  const reset = useCallback(() => {
    setPersisted({
      elapsedMs: 0,
      lastStartedAt: Date.now(),
      isPaused: false,
    });
    setRemainingMs(durationMs);
    hasCompletedRef.current = false;
  }, [durationMs, setPersisted]);

  const isRunning = !persisted.isPaused && persisted.lastStartedAt !== null;

  return {
    remainingMs,
    isRunning,
    isPaused: persisted.isPaused,
    elapsedMs: getCurrentElapsed(),
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
