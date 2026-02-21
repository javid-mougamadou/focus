import { useState } from 'react';
import { Header, Footer, TaskForm, TaskTimer } from './components';
import { useTheme } from './hooks/useTheme';
import { usePageTracking } from './hooks/useAnalytics';
import { usePersistentState } from './hooks/usePersistentState';
import { clearTimerStorage } from './hooks/useTimer';
import type { Task } from './types';

const TASK_STORAGE_KEY = 'focus.task-v1';
const LAST_DURATION_KEY = 'focus.last-duration-v1';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  usePageTracking('/', 'Focus | Javid Mougamadou');
  const [task, setTask, clearTask] = usePersistentState<Task | null>({
    key: TASK_STORAGE_KEY,
    defaultValue: null,
  });
  const [lastDuration, setLastDuration] = usePersistentState<number>({
    key: LAST_DURATION_KEY,
    defaultValue: 25,
  });
  const [showForm, setShowForm] = useState(false);
  const [autoStartTimer, setAutoStartTimer] = useState(false);

  const handleCreateTask = (newTask: Task) => {
    clearTimerStorage();
    setTask(newTask);
    setLastDuration(newTask.durationMinutes);
    setShowForm(false);
    setAutoStartTimer(true);
  };

  const handleStopTask = () => {
    clearTask();
    clearTimerStorage();
  };

  const handleEditTask = () => {
    setShowForm(true);
  };

  const appBackground =
    theme === 'dark'
      ? 'linear-gradient(90deg, #46B83D, #111E0B)'
      : 'linear-gradient(90deg, #6EEE87, #5FC52E)';

  const createBlockClass =
    theme === 'dark'
      ? 'rounded-2xl bg-[#1a2f17]/95 px-8 py-4 text-lg font-medium shadow-xl transition hover:bg-[#243d1f] text-green-100'
      : 'rounded-2xl bg-[#e8f5e9]/95 px-8 py-4 text-lg font-medium shadow-xl transition hover:bg-[#c8e6c9] text-green-900';

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: appBackground }}
    >
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex flex-1 flex-col items-center px-4 pt-20 pb-12">
        {showForm ? (
          <div className="flex w-full flex-1 items-center justify-center">
            <TaskForm
              theme={theme}
              initialTask={task ?? undefined}
              lastDuration={lastDuration}
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : !task ? (
          <button
            type="button"
            className="flex flex-1 items-center justify-center"
            onClick={() => setShowForm(true)}
          >
            <span className={createBlockClass}>
              Créer une tâche
            </span>
          </button>
        ) : (
          <div className="flex w-full flex-1 items-center justify-center">
            <TaskTimer
              theme={theme}
              task={task}
              autoStart={autoStartTimer}
              onAutoStartDone={() => setAutoStartTimer(false)}
              onStop={handleStopTask}
              onEdit={handleEditTask}
            />
          </div>
        )}
        <Footer theme={theme} />
      </main>
    </div>
  );
};

export default App;
