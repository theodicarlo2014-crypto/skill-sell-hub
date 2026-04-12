import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.skillswap',
  appName: 'SkillSwap',
  webDir: 'dist',
  server: {
    url: 'https://181406bb-0364-44f5-b8a1-b1a0037bc878.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
