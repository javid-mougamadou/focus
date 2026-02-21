import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@testing-library/react';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  const defaultProps = {
    theme: 'light' as const,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  it('affiche le titre Créer une tâche', () => {
    render(<TaskForm {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Créer une tâche' })).toBeInTheDocument();
  });

  it('affiche le champ nom et durée', () => {
    render(<TaskForm {...defaultProps} />);
    expect(screen.getByLabelText(/nom de la tâche/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/durée en minutes/i)).toBeInTheDocument();
  });

  it('utilise lastDuration comme durée initiale', () => {
    render(<TaskForm {...defaultProps} lastDuration={15} />);
    const durationInput = screen.getByLabelText(/durée en minutes/i);
    expect(durationInput).toHaveValue(15);
  });

  it('utilise initialTask pour préremplir', () => {
    render(
      <TaskForm
        {...defaultProps}
        initialTask={{ name: 'Ma tâche', durationMinutes: 10 }}
      />,
    );
    expect(screen.getByDisplayValue('Ma tâche')).toBeInTheDocument();
    expect(screen.getByLabelText(/durée en minutes/i)).toHaveValue(10);
  });

  it('soumet avec Task par défaut si nom vide', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm {...defaultProps} onSubmit={onSubmit} />);
    await user.clear(screen.getByLabelText(/nom de la tâche/i));
    await user.click(screen.getByRole('button', { name: 'Créer' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Task', durationMinutes: 25 }),
    );
  });

  it('soumet avec le nom saisi', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm {...defaultProps} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/nom de la tâche/i), 'Étudier');
    await user.click(screen.getByRole('button', { name: 'Créer' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Étudier', durationMinutes: 25 }),
    );
  });

  it('affiche Annuler et appelle onCancel au clic', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<TaskForm {...defaultProps} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
