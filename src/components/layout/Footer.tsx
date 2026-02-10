import { Link } from '@tanstack/react-router';
import { Heart, Book, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className='relative mt-20 overflow-hidden'>
      {/* Decorative top border */}
      <div className='gold-separator' />

      {/* Background layers */}
      <div className='absolute inset-0 bg-gradient-to-b from-card/40 to-card/80' />
      <div className='absolute inset-0 pattern-arabesque opacity-30' />
      <div className='absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-3xl' />
      <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/[0.03] rounded-full blur-3xl' />

      <div className='relative container mx-auto px-4 py-12 md:px-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {/* About */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-xl shadow-lg shadow-emerald-600/15'>
                <Book className='w-4 h-4 text-white' />
              </div>
              <h3 className='text-lg font-bold text-gradient-emerald'>
                Al-Quran
              </h3>
            </div>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              A beautiful and modern way to read, listen, and study the Holy
              Quran. Access translations, tafsir, and recitations all in one
              place.
            </p>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground/80'>
              Quick Links
            </h3>
            <ul className='space-y-2.5 text-sm'>
              {[
                { to: '/surahs', label: 'Browse Surahs' },
                { to: '/bookmarks', label: 'My Bookmarks' },
                { to: '/progress', label: 'Reading Progress' },
                { to: '/search', label: 'Search' }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className='text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group'
                  >
                    <span className='w-1 h-1 rounded-full bg-emerald-500/40 group-hover:bg-emerald-500 group-hover:shadow-sm group-hover:shadow-emerald-500/50 transition-all' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className='space-y-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-foreground/80'>
              Quran Stats
            </h3>
            <div className='grid grid-cols-2 gap-3'>
              <div className='premium-card p-4 text-center'>
                <div className='text-2xl font-bold text-gradient-emerald'>
                  114
                </div>
                <div className='text-xs text-muted-foreground mt-0.5'>
                  Surahs
                </div>
              </div>
              <div className='premium-card p-4 text-center'>
                <div className='text-2xl font-bold text-gradient-emerald'>
                  6,236
                </div>
                <div className='text-xs text-muted-foreground mt-0.5'>
                  Verses
                </div>
              </div>
              <div className='premium-card p-4 text-center'>
                <div className='text-2xl font-bold text-gradient-emerald'>
                  30
                </div>
                <div className='text-xs text-muted-foreground mt-0.5'>Juz</div>
              </div>
              <div className='premium-card p-4 text-center'>
                <div className='text-2xl font-bold text-gradient-emerald'>
                  7
                </div>
                <div className='text-xs text-muted-foreground mt-0.5'>
                  Manzil
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-13 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
          <div
            className='gold-separator w-full absolute left-0 right-0 mb-10'
            style={{ marginTop: '-24px' }}
          />
          <p className='flex items-center gap-1.5'>
            Made with{' '}
            <Heart className='size-5 text-red-500 fill-current animate-pulse' />{' '}
            for the Muslim Ummah
          </p>
          <div className='flex items-center gap-1.5 text-muted-foreground/60'>
            <a
              href='https://rabiussunny.com'
              target='_blank'
              className='flex items-center gap-2 justify-center text-emerald-600 dark:text-emerald-400 font-medium hover:underline'
            >
              <span>Muhammad Rabius Sunny</span>
              <ExternalLink className='w-3 h-3 text-muted-foreground' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
