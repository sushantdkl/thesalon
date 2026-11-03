import type { ReactNode } from 'react';
import type { Viewport } from 'next';

// Public site only: draw under the iPhone notch/home bar (the mobile contact bar pads itself with
// safe-area insets) and tint the Android/iOS browser bars to the site's night colour.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#141110',
  colorScheme: 'dark',
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return children;
}
