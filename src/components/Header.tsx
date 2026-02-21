import { SunIcon, MoonIcon, MenuIcon } from './icons';
import { THEME_ICON_COLORS, THEME_TEXT_COLORS } from '../constants';
import type { Theme } from '../constants';

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

const getThemeToggleLabel = (theme: Theme): string =>
  theme === 'dark' ? 'Enable light mode' : 'Enable dark mode';

const getThemeMenuLabel = (theme: Theme): string =>
  theme === 'dark' ? 'Light mode' : 'Dark mode';

const ThemeIconButton = ({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) => {
  const iconClassName = THEME_ICON_COLORS[theme];
  const isDarkMode = theme === 'dark';

  return (
    <button
      type="button"
      className="btn btn-circle btn-ghost"
      onClick={onToggleTheme}
      aria-label={getThemeToggleLabel(theme)}
    >
      {isDarkMode ? <SunIcon className={iconClassName} /> : <MoonIcon className={iconClassName} />}
    </button>
  );
};

const ThemeMenuButton = ({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) => {
  const iconClassName = THEME_ICON_COLORS[theme];
  const isDarkMode = theme === 'dark';

  return (
    <button type="button" onClick={onToggleTheme} className="flex items-center justify-between">
      <span>{getThemeMenuLabel(theme)}</span>
      {isDarkMode ? (
        <SunIcon className={iconClassName} size="sm" />
      ) : (
        <MoonIcon className={iconClassName} size="sm" />
      )}
    </button>
  );
};

const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  const textColor = THEME_TEXT_COLORS[theme];
  const iconColor = THEME_ICON_COLORS[theme];

  return (
    <header className="navbar fixed top-0 z-50 w-full bg-transparent backdrop-blur-sm">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4">
        <div className="flex-none">
          <a href="/" className={`btn btn-ghost text-xl font-bold ${textColor}`}>
            Focus
          </a>
        </div>

        <div className="hidden flex-none md:block">
          <ThemeIconButton theme={theme} onToggleTheme={onToggleTheme} />
        </div>

        <div className="dropdown dropdown-end flex-none md:hidden">
          <label tabIndex={0} className={`btn btn-circle btn-ghost ${iconColor}`} aria-label="Menu">
            <MenuIcon />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg"
          >
            <li>
              <ThemeMenuButton theme={theme} onToggleTheme={onToggleTheme} />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
