type NotificationPermissionValue = 'default' | 'denied' | 'granted';

function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

function isServiceWorkerSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

export async function requestTimerNotificationPermission(): Promise<NotificationPermissionValue> {
  if (!isNotificationSupported()) return 'denied';

  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }

  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return Notification.permission;
  }
}

export async function showTimerFinishedNotification(): Promise<void> {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  const title = 'Timer is finished';
  const options: NotificationOptions = {
    body: 'Nice work. Take a short break, then start the next session.',
    tag: 'focus-timer-finished',
    renotify: true,
  };

  // Prefer service-worker notifications (best for installed PWAs).
  if (isServiceWorkerSupported()) {
    try {
      const readyReg = await navigator.serviceWorker.ready;
      await readyReg.showNotification(title, options);
      return;
    } catch {
      // fall through
    }
  }

  // Fallback: foreground notification (may not work on all iOS contexts).
  try {
    // eslint-disable-next-line no-new
    new Notification(title, options);
  } catch {
    // ignore
  }
}

