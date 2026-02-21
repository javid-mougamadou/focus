import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CircularTimer from './CircularTimer';

describe('CircularTimer', () => {
  it('rend un SVG avec les dimensions passées', () => {
    const { container } = render(
      <CircularTimer totalMs={60000} remainingMs={30000} size={200} strokeWidth={8} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
    expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  it('utilise les valeurs par défaut size et strokeWidth', () => {
    const { container } = render(
      <CircularTimer totalMs={60000} remainingMs={30000} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
  });

  it('affiche aria-hidden', () => {
    const { container } = render(
      <CircularTimer totalMs={60000} remainingMs={30000} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
