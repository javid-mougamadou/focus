import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche le bouton Créer une tâche quand aucune tâche', async () => {
    render(<App />);
    expect(screen.getByText('Créer une tâche')).toBeInTheDocument();
  });

  it('affiche le formulaire après clic sur Créer une tâche', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Créer une tâche'));
    expect(screen.getByText('Nom de la tâche')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /tâche/i })).toBeInTheDocument();
  });
});
