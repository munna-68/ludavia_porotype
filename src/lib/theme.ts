import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral';

export const ludaviaTheme = defineTheme({
  name: 'ludavia',
  extends: neutralTheme,
  color: {
    accent: '#4e1d8e',
    neutralStyle: 'neutral',
    contrast: 'standard',
  },
  tokens: {
    '--color-accent': ['#4e1d8e', '#4e1d8e'],
    '--color-accent-muted': ['#4e1d8e1a', '#4e1d8e33'],
    '--color-on-accent': ['#ffffff', '#ffffff'],
    '--color-background-body': ['#f5f3f7', '#0b0a0d'],
    '--color-background-surface': ['#ffffff', '#141217'],
    '--color-background-card': ['#ffffff', '#1b171f'],
    '--color-background-popover': ['#ffffff', '#211b27'],
    '--color-background-muted': ['#f0edf2', '#18131b'],
    '--color-text-primary': ['#1d1821', '#f6f0f7'],
    '--color-text-secondary': ['#6d6572', '#b9adb9'],
    '--color-text-disabled': ['#aaa1ad', '#716875'],
    '--color-text-accent': 'var(--color-accent)',
    '--color-icon-accent': 'var(--color-accent)',
    '--color-icon-primary': ['#1d1821', '#f6f0f7'],
    '--color-icon-secondary': ['#6d6572', '#b9adb9'],
    '--color-icon-disabled': ['#aaa1ad', '#716875'],
    '--color-border': ['#2e25331a', '#f6f0f71f'],
    '--color-border-emphasized': ['#c9becd', '#5a4d60'],
    '--color-skeleton': ['#c9becd', '#5a4d60'],
    '--color-track': ['#c9becd', '#5a4d60'],
    '--color-overlay': ['#130d1a66', '#050406cc'],
    '--color-overlay-hover': ['#2e25330d', '#ffffff0d'],
    '--color-overlay-pressed': ['#2e25331a', '#ffffff1a'],
    '--color-shadow': ['#0000001a', '#00000066'],
  },
});
