import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',         // controls, docs, actions, viewport
    '@storybook/addon-a11y',               // accessibility audit panel
    '@storybook/addon-interactions',       // interaction testing
    'storybook-addon-rtl',                 // RTL toggle for Arabic layouts
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  docs: {
    autodocs: 'tag',
  },
};

export default config;
