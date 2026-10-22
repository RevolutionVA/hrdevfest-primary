export type ThemeName = '2024' | '2026' | 'archive';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  cssScope: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const themes: Record<ThemeName, ThemeConfig> = {
  '2024': {
    name: '2024',
    displayName: 'DevFest 2024',
    cssScope: 'theme-2024',
    colors: {
      primary: '#052831',
      secondary: '#123F4E',
      accent: '#4DB7B9',
      background: '#F3F4F6',
      text: '#000000',
    },
  },
  '2026': {
    name: '2026',
    displayName: 'DevFest 2026',
    cssScope: 'theme-2026',
    colors: {
      primary: '#052831',
      secondary: '#123F4E',
      accent: '#4DB7B9',
      background: '#F3F4F6',
      text: '#000000',
    },
  },
  archive: {
    name: 'archive',
    displayName: 'DevFest Archive',
    cssScope: 'theme-archive',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#3b82f6',
      background: '#f9fafb',
      text: '#111827',
    },
  },
};

export function getThemeForYear(year: number): ThemeName {
  if (year === 2024) return '2024';
  if (year === 2026) return '2026';
  if (year >= 2015 && year <= 2023) return 'archive';
  return '2026';
}

export function getAllEventYears(): number[] {
  return [2015, 2016, 2017, 2018, 2024, 2026];
}

export function getArchiveYears(): number[] {
  return [2015, 2016, 2017, 2018];
}
