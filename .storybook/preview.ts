import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    // Responsive viewports matching our Playwright breakpoints
    viewport: {
      viewports: {
        desktop: {
          name: 'Desktop (1440)',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
        tablet: {
          name: 'Tablet (1024)',
          styles: { width: '1024px', height: '768px' },
          type: 'tablet',
        },
        mobile: {
          name: 'Mobile (390)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
      defaultViewport: 'desktop',
    },

    // Accessibility defaults
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },

    // Docs theme
    docs: {
      theme: undefined,
    },

    // Backgrounds matching brand
    backgrounds: {
      default: 'sage',
      values: [
        { name: 'sage',  value: '#F0F5F0' },
        { name: 'white', value: '#F5F5F5' },
        { name: 'dark',  value: '#2C2C2C' },
      ],
    },
  },

  // Global decorators
  decorators: [
    (Story, context) => {
      // RTL toggle via storybook-addon-rtl
      const dir = context.globals?.direction || 'ltr';
      return `<div dir="${dir}" lang="${dir === 'rtl' ? 'ar' : 'en'}" style="font-family: 'Alyamama', sans-serif;">${Story()}</div>`;
    },
  ],

  globalTypes: {
    direction: {
      name: 'Direction',
      description: 'Text direction — LTR (EN) or RTL (AR)',
      defaultValue: 'ltr',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'ltr', title: 'LTR — English' },
          { value: 'rtl', title: 'RTL — Arabic' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
