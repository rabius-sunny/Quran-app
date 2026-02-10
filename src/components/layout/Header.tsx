import { Link } from '@tanstack/react-router';
import {
  Book,
  Bookmark,
  TrendingUp,
  Search,
  Menu,
  ExternalLink
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: <Book className='w-4 h-4' /> },
    { to: '/surahs', label: 'Surahs', icon: <Book className='w-4 h-4' /> },
    {
      to: '/bookmarks',
      label: 'Bookmarks',
      icon: <Bookmark className='w-4 h-4' />
    },
    {
      to: '/progress',
      label: 'Progress',
      icon: <TrendingUp className='w-4 h-4' />
    },
    { to: '/search', label: 'Search', icon: <Search className='w-4 h-4' /> }
  ];

  return (
    <header className='sticky top-0 z-50 w-full'>
      {/* Glassmorphism background */}
      <div className='absolute inset-0 bg-background/70 backdrop-blur-xl' />

      {/* Subtle pattern */}
      <div className='absolute inset-0 pattern-stars opacity-40' />

      {/* Top gold accent line */}
      <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent' />

      <div className='relative container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center gap-3 group'
        >
          <div className='relative'>
            {/* Glow behind logo */}
            <div className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500' />
            <div className='relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 dark:from-emerald-500 dark:via-teal-500 dark:to-emerald-400 p-2 rounded-xl shadow-lg shadow-emerald-600/20'>
              <Book className='w-5 h-5 text-white drop-shadow-sm' />
            </div>
          </div>
          <div className='flex flex-col'>
            <span className='arabic-text !text-xl !leading-tight font-bold text-gradient-emerald'>
              القرآن
            </span>
            <span className='text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground -mt-0.5'>
              Al-Quran
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center'>
          <div className='flex items-center gap-1 bg-muted/30 dark:bg-muted/20 backdrop-blur-sm rounded-2xl p-1 border border-border/30'>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-emerald-500/8 dark:hover:bg-emerald-400/8 hover:text-emerald-700 dark:hover:text-emerald-300 text-muted-foreground'
                activeProps={{
                  className:
                    'px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500/12 to-teal-500/12 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/15 dark:border-emerald-400/15'
                }}
              >
                <span className='flex items-center gap-2'>
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Right side: Theme toggle + Mobile menu */}
        <div className='flex items-center gap-1.5'>
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
          >
            <SheetTrigger
              asChild
              className='md:hidden'
            >
              <Button
                variant='ghost'
                size='icon'
                className='rounded-xl'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-72 bg-white dark:bg-background backdrop-blur-2xl border-l-4 px-3 border-emerald-500'
            >
              {/* Decorative header in sheet */}
              <div className='mt-4 mb-8'>
                <div className='flex items-center gap-3 mb-6 justify-center'>
                  <div>
                    <span className='arabic-text !leading-tight block text-gradient-emerald h-12'>
                      القرآن الكريم
                    </span>
                    <span className='text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground'>
                      Al-Quran Al-Kareem
                    </span>
                  </div>
                </div>
                <div className='gold-separator' />
              </div>

              <div className='flex flex-col gap-2'>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className='flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-emerald-500/8 dark:hover:bg-emerald-400/8 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-300 group'
                    activeProps={{
                      className:
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/15 dark:border-emerald-400/15 shadow-sm'
                    }}
                  >
                    <span className='flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/8 dark:bg-emerald-400/8 group-hover:bg-emerald-500/15 transition-colors'>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Bottom decorative element */}
              <div className='absolute bottom-8 left-6 right-6'>
                <div className='gold-separator mb-4' />
                <p className='text-center text-muted-foreground/60 text-xs'>
                  <span className='block font-semibold text-muted-foreground mb-1'>
                    Developed by
                  </span>
                  <a
                    href='https://rabiussunny.com'
                    className='flex items-center gap-2 justify-center text-emerald-600 dark:text-emerald-400 font-medium hover:underline'
                  >
                    <span>Muhammad Rabius Sunny</span>
                    <ExternalLink className='w-3 h-3 text-muted-foreground' />
                  </a>
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className='absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent' />
    </header>
  );
}
