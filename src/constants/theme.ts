export type Theme = 'light' | 'dark';

export const THEME_GRADIENT_CLASSES: Record<Theme, string> = {
  light: 'bg-gradient-to-br from-green-100 via-green-200 to-green-300',
  dark: 'bg-gradient-to-r from-[#46B83D] to-[#111E0B]',
};

export const THEME_TEXT_COLORS: Record<Theme, string> = {
  light: 'text-green-900',
  dark: 'text-green-100',
};

export const THEME_ICON_COLORS: Record<Theme, string> = {
  light: 'text-green-900',
  dark: 'text-green-100',
};

export const THEME_SUBTITLE_COLORS: Record<Theme, string> = {
  light: 'text-green-800',
  dark: 'text-green-200',
};

export const THEME_FOOTER_COLORS: Record<Theme, { text: string; link: string }> = {
  light: { text: 'text-green-900/80', link: 'text-green-900' },
  dark: { text: 'text-green-200/80', link: 'text-green-100' },
};

export const THEME_BLOCK_CLASSES: Record<Theme, string> = {
  light:
    'rounded-2xl bg-[#e8f5e9]/95 shadow-xl text-green-900 [&_input]:text-green-900 [&_input]:border-green-700/30 [&_input]:bg-white [&_.label-text]:text-green-900',
  dark: 'rounded-2xl bg-[#1a2f17]/95 shadow-xl text-green-100 [&_input]:text-green-100 [&_input]:border-green-500/50 [&_input]:bg-[#0d1a0b] [&_.label-text]:text-green-100',
};
