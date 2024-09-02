'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { SessionProvider } from 'next-auth/react';


export function Providers({ children, ...props }) {
  return (
    <SessionProvider>
      <NextThemesProvider {...props}>
          {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}
