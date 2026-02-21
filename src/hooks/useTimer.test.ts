import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer, clearTimerStorage, TIMER_STORAGE_KEY } from './useTimer';

describe('useTimer', () => {
  const DURATION_MS = 60000; // 1 min

  beforeEach(() => {
    localStorage.clear();
    clearTimerStorage();
  });

  it('retourne remainingMs initial à la durée totale', () => {
    const { result } = renderHook(() =>
      useTimer({ durationMs: DURATION_MS, onComplete: vi.fn() }),
    );
    expect(result.current.remainingMs).toBe(DURATION_MS);
  });

  it('retourne isPaused true initialement', () => {
    const { result } = renderHook(() =>
      useTimer({ durationMs: DURATION_MS, onComplete: vi.fn() }),
    );
    expect(result.current.isPaused).toBe(true);
    expect(result.current.isRunning).toBe(false);
  });

  it('start met isRunning à true', () => {
    const { result } = renderHook(() =>
      useTimer({ durationMs: DURATION_MS, onComplete: vi.fn() }),
    );
    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);
  });

  it('pause met isPaused à true', () => {
    const { result } = renderHook(() =>
      useTimer({ durationMs: DURATION_MS, onComplete: vi.fn() }),
    );
    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.pause();
    });
    expect(result.current.isPaused).toBe(true);
    expect(result.current.isRunning).toBe(false);
  });

  it('reset remet remainingMs à la durée', () => {
    const { result } = renderHook(() =>
      useTimer({ durationMs: DURATION_MS, onComplete: vi.fn() }),
    );
    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.remainingMs).toBeGreaterThanOrEqual(DURATION_MS - 200);
  });
});
