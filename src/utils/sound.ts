type WebkitAudioWindow = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

let sharedAudioContext: AudioContext | null = null;
let hasTriedToUnlock = false;

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextCtor =
    window.AudioContext || (window as WebkitAudioWindow).webkitAudioContext;
  if (!AudioContextCtor) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextCtor();
  }
  return sharedAudioContext;
}

/**
 * Must be called from a user gesture on iOS/Safari.
 * We keep the context around to avoid latency at playback time.
 */
export async function prepareAlarmSound(): Promise<void> {
  try {
    const audioContext = getOrCreateAudioContext();
    if (!audioContext) return;

    hasTriedToUnlock = true;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  } catch {
    // Ignore: some browsers may reject resume()
  }
}

export function playAlarmSound(durationMs = 5000): void {
  try {
    const audioContext = getOrCreateAudioContext();
    if (!audioContext) return;

    // If the context is still locked (common on mobile without gesture),
    // attempt a best-effort resume (may still fail).
    if (audioContext.state === 'suspended' && hasTriedToUnlock) {
      void audioContext.resume();
    }

    const startAt = audioContext.currentTime;
    const endAt = startAt + Math.max(0.1, durationMs / 1000);

    const outputGain = audioContext.createGain();
    outputGain.connect(audioContext.destination);

    // Soft "chime" (non-alarming): two gentle tones repeating.
    const toneA = audioContext.createOscillator();
    const toneB = audioContext.createOscillator();
    const gainA = audioContext.createGain();
    const gainB = audioContext.createGain();

    toneA.type = 'sine';
    toneB.type = 'triangle';
    toneA.frequency.setValueAtTime(523.25, startAt); // C5
    toneB.frequency.setValueAtTime(659.25, startAt); // E5

    toneA.connect(gainA);
    toneB.connect(gainB);
    gainA.connect(outputGain);
    gainB.connect(outputGain);

    const safeStart = startAt + 0.01;
    const base = 0.0001;
    const peakA = 0.10;
    const peakB = 0.07;
    gainA.gain.setValueAtTime(base, safeStart);
    gainB.gain.setValueAtTime(base, safeStart);

    // Every ~1.1s play a short, soft two-note chime.
    const interval = 1.1;
    for (let t = safeStart; t < endAt; t += interval) {
      // Note A (gentle attack/decay)
      gainA.gain.setValueAtTime(base, t);
      gainA.gain.linearRampToValueAtTime(peakA, Math.min(t + 0.06, endAt));
      gainA.gain.exponentialRampToValueAtTime(base, Math.min(t + 0.45, endAt));

      // Note B slightly after A
      const t2 = t + 0.18;
      if (t2 < endAt) {
        gainB.gain.setValueAtTime(base, t2);
        gainB.gain.linearRampToValueAtTime(peakB, Math.min(t2 + 0.06, endAt));
        gainB.gain.exponentialRampToValueAtTime(base, Math.min(t2 + 0.42, endAt));
      }
    }

    // Fade out overall output to avoid clicks.
    outputGain.gain.setValueAtTime(1, safeStart);
    outputGain.gain.setValueAtTime(1, Math.max(safeStart, endAt - 0.2));
    outputGain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    toneA.start(safeStart);
    toneB.start(safeStart);
    toneA.stop(endAt);
    toneB.stop(endAt);

    // Optional mobile-friendly haptic backup (doesn't replace sound).
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // Keep it short and non-intrusive: 5 seconds total pattern.
      const pulses: number[] = [];
      const totalMs = Math.min(5000, Math.max(0, durationMs));
      let remaining = totalMs;
      while (remaining > 0) {
        const on = Math.min(200, remaining);
        remaining -= on;
        pulses.push(on);
        if (remaining <= 0) break;
        const off = Math.min(150, remaining);
        remaining -= off;
        pulses.push(off);
      }
      navigator.vibrate(pulses);
    }
  } catch {
    // Silently fail if audio is not supported / blocked
  }
}
