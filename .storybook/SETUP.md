# Storybook Setup

Config is ready. Run this ONCE to install dependencies:

```bash
cd c:/Users/Admin/Desktop/Majestic-Next
npx storybook@latest init --skip-install
npm install --save-dev \
  @storybook/nextjs \
  @storybook/addon-essentials \
  @storybook/addon-a11y \
  @storybook/addon-interactions \
  storybook-addon-rtl
```

Then start:
```bash
npm run storybook
# → opens http://localhost:6006
```

## Writing Stories

Create `ComponentName.stories.tsx` next to any component:

```tsx
// src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Shop Now', variant: 'primary' },
};

export const Arabic: Story = {
  args: { children: 'تسوق الآن', variant: 'primary' },
  parameters: { direction: 'rtl' },
};
```

## Who Uses Storybook

| Agent | How |
|-------|-----|
| frontend-dev | Builds stories alongside components |
| ux-reviewer | Reviews interaction + state visually |
| brand-guardian | Visual brand compliance check per component |
| motion-designer | Watches animations in isolation |
| quality-guard | Runs a11y panel per component |
