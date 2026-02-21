import { useState } from 'react';
import { THEME_BLOCK_CLASSES } from '../constants';
import type { Theme } from '../constants';
import type { Task } from '../types';

const MIN_DURATION = 1;
const MAX_DURATION = 60;
const DURATION_STEP = 5;

const roundToStep = (value: number) => Math.round(value / DURATION_STEP) * DURATION_STEP;
const clampDuration = (value: number) =>
  roundToStep(Math.max(MIN_DURATION, Math.min(MAX_DURATION, value)));
const clampOnly = (value: number) =>
  Math.max(MIN_DURATION, Math.min(MAX_DURATION, Math.floor(value)));

type TaskFormProps = {
  theme: Theme;
  initialTask?: Task | null;
  lastDuration?: number;
  onSubmit: (task: Task) => void;
  onCancel?: () => void;
};

export default function TaskForm({
  theme,
  initialTask,
  lastDuration = 25,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [name, setName] = useState(initialTask?.name ?? '');
  const [durationMinutes, setDurationMinutes] = useState(() =>
    clampDuration(initialTask?.durationMinutes ?? lastDuration),
  );
  const formBlockClass = `${THEME_BLOCK_CLASSES[theme]} p-6`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    onSubmit({ name: trimmed || 'Task', durationMinutes });
  };

  const incrementDuration = () => {
    setDurationMinutes((d) => clampDuration(d + DURATION_STEP));
  };

  const decrementDuration = () => {
    setDurationMinutes((d) => clampDuration(d - DURATION_STEP));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setDurationMinutes(MIN_DURATION);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) {
      setDurationMinutes(clampOnly(parsed));
    }
  };

  const handleDurationBlur = () => {
    setDurationMinutes((d) => clampOnly(d));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-md flex-col items-center gap-6 ${formBlockClass}`}
    >
      <h2 className="text-xl font-semibold">Créer une tâche</h2>

      <div className="w-full">
        <label htmlFor="task-name" className="label">
          <span className="label-text">Nom de la tâche</span>
        </label>
        <input
          id="task-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Étudier, Méditer, Travailler..."
          className="input input-bordered w-full"
          autoFocus
        />
      </div>

      <div className="w-full">
        <label htmlFor="task-duration" className="label">
          <span className="label-text">Durée (minutes)</span>
        </label>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            className="btn btn-circle"
            onClick={decrementDuration}
            aria-label="Réduire la durée"
          >
            −
          </button>
          <input
            id="task-duration"
            type="number"
            min={MIN_DURATION}
            max={MAX_DURATION}
            step={1}
            value={durationMinutes}
            onChange={handleDurationChange}
            onBlur={handleDurationBlur}
            className="input input-bordered w-20 text-center text-lg"
            aria-label="Durée en minutes"
          />
          <button
            type="button"
            className="btn btn-circle"
            onClick={incrementDuration}
            aria-label="Augmenter la durée"
          >
            +
          </button>
        </div>
        <p className="mt-1 text-center text-xs opacity-70">
          {MIN_DURATION}–{MAX_DURATION} min
        </p>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </div>
    </form>
  );
}
