import { useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, StopIcon, EditIcon, ResetIcon } from './icons';
import { THEME_BLOCK_CLASSES } from '../constants';
import type { Theme } from '../constants';
import type { Task } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { playAlarmSound } from '../utils/sound';
import CircularTimer from './CircularTimer';

type TaskTimerProps = {
  theme: Theme;
  task: Task;
  autoStart?: boolean;
  onAutoStartDone?: () => void;
  onStop: () => void;
  onEdit: () => void;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function TaskTimer({
  theme,
  task,
  autoStart,
  onAutoStartDone,
  onStop,
  onEdit,
}: TaskTimerProps) {
  const hasPlayedSound = useRef(false);

  const handleComplete = () => {
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true;
      playAlarmSound();
    }
  };

  const timer = useTimer({
    durationMs: task.durationMinutes * 60 * 1000,
    onComplete: handleComplete,
  });

  useWakeLock(timer.isRunning);

  useEffect(() => {
    if (autoStart) {
      timer.start();
      onAutoStartDone?.();
    }
  }, [autoStart]);

  useEffect(() => {
    if (timer.remainingMs > 0) {
      hasPlayedSound.current = false;
    }
  }, [timer.remainingMs]);

  const timerBlockClass = `${THEME_BLOCK_CLASSES[theme]} p-6`;
  const durationMs = task.durationMinutes * 60 * 1000;

  return (
    <div
      className={`flex w-full max-w-md flex-col items-center gap-6 ${timerBlockClass}`}
    >
      <div className="text-lg font-medium">{task.name}</div>

      <div className="relative flex items-center justify-center">
        <CircularTimer
          totalMs={durationMs}
          remainingMs={timer.remainingMs}
          size={220}
          strokeWidth={10}
          className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tabular-nums">
            {formatTime(timer.remainingMs)}
          </span>
          <span className="text-sm opacity-80">
            / {formatTime(durationMs)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {timer.isRunning ? (
          <button
            type="button"
            className="btn btn-circle"
            onClick={timer.pause}
            aria-label="Pause"
          >
            <PauseIcon />
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-circle"
            onClick={timer.remainingMs > 0 ? timer.resume : timer.start}
            aria-label="Play"
          >
            <PlayIcon />
          </button>
        )}
        <button
          type="button"
          className="btn btn-circle"
          onClick={onStop}
          aria-label="Stop"
        >
          <StopIcon />
        </button>
        <button
          type="button"
          className="btn btn-circle"
          onClick={onEdit}
          aria-label="Edit"
        >
          <EditIcon />
        </button>
        <button
          type="button"
          className="btn btn-circle"
          onClick={timer.reset}
          aria-label="Reset"
        >
          <ResetIcon />
        </button>
      </div>
    </div>
  );
}
