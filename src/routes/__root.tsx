import {
  HeadContent,
  Scripts,
  createRootRouteWithContext
} from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';

import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Toaster } from '../components/ui/sonner';
import { GlobalAudioPlayer } from '../components/common/GlobalAudioPlayer';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'Al-Quran - Read, Listen & Study the Holy Quran'
      },
      {
        name: 'description',
        content:
          'A beautiful modern way to read, listen to, and study the Holy Quran with translations, tafsir, and audio recitations.'
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss
      }
    ]
  }),

  shellComponent: RootDocument
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className='min-h-screen flex flex-col bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
        >
          {/* Subtle background decorations */}
          <div className='fixed inset-0 pointer-events-none z-0'>
            <div className='absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-400/10 rounded-full blur-3xl' />
            <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl' />
          </div>
          <Header />
          <main className='flex-1 px-4 py-6 md:px-6 md:py-8 relative z-10'>
            {children}
          </main>
          <Footer />
          <Toaster />
          <GlobalAudioPlayer />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
