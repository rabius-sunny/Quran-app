import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Book,
  BookOpen,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSurahsList, useSurah } from '@/lib/api/queries';
import { surahDetailToVerses } from '@/lib/api/types';
import { Skeleton } from '@/components/ui/skeleton';
import { SurahCard } from '@/components/quran/SurahCard';
import { VerseCard } from '@/components/quran/VerseCard';
import { useMemo } from 'react';

export const Route = createFileRoute('/')({
  component: HomePage
});

function HomePage() {
  const { data: surahs, isLoading: surahsLoading } = useSurahsList();

  // Verse of the Day logic - changes daily
  const verseOfDay = useMemo(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('quran-verse-of-day');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        return { surahNo: parsed.surahNo, ayahNo: parsed.ayahNo };
      }
    }

    // Generate new random verse
    const surahNo = Math.floor(Math.random() * 114) + 1;
    const ayahNo = Math.floor(Math.random() * 10) + 1; // First 10 verses to keep it manageable
    localStorage.setItem(
      'quran-verse-of-day',
      JSON.stringify({ date: today, surahNo, ayahNo })
    );
    return { surahNo, ayahNo };
  }, []);

  const { data: verseOfDaySurah } = useSurah(verseOfDay.surahNo);
  const verseOfDayData = useMemo(() => {
    if (!verseOfDaySurah) return null;
    const verses = surahDetailToVerses(verseOfDaySurah);
    return verses[verseOfDay.ayahNo - 1];
  }, [verseOfDaySurah, verseOfDay.ayahNo]);

  // Popular surahs (most commonly read)
  const popularSurahs = useMemo(() => {
    if (!surahs) return [];
    // Al-Fatiha (1), Yasin (36), Ar-Rahman (55), Al-Waqiah (56), Al-Mulk (67), Al-Kahf (18)
    const popularIds = [1, 36, 55, 56, 67, 18];
    return popularIds
      .map((id) => ({ surah: surahs[id - 1], number: id }))
      .filter((item) => item.surah);
  }, [surahs]);

  return (
    <div className='space-y-12 pb-8'>
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — Immersive Islamic-themed landing
          ═══════════════════════════════════════════════════════ */}
      <section className='hero-section relative -mt-6 -mx-4 pb-30  md:-mx-6 overflow-hidden isolate'>
        {/* ── Multi-layer background ── */}
        <div className='absolute inset-0 bg-gradient-to-b from-emerald-50 via-[#f0faf4] to-background dark:from-[#040818] dark:via-[#061020] dark:to-background' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgb(var(--emerald-light)/0.18),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgb(var(--emerald)/0.12),transparent_70%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgb(var(--teal-light)/0.08),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgb(var(--gold-light)/0.06),transparent_50%)]' />

        {/* ── Islamic geometric pattern overlay ── */}
        <div className='absolute inset-0 pattern-arabesque opacity-40 dark:opacity-20' />
        <div className='absolute inset-0 pattern-stars opacity-[0.06] dark:opacity-[0.08]' />

        {/* ── Floating decorative shapes ── */}
        {/* Large emerald orb top-right */}
        <div className='absolute -top-24 -right-24 w-[28rem] h-[28rem] bg-gradient-to-br from-emerald-400/20 to-teal-300/10 dark:from-emerald-500/10 dark:to-teal-600/5 rounded-full blur-3xl animate-float' />
        {/* Gold orb bottom-left */}
        <div
          className='absolute -bottom-32 -left-20 w-[22rem] h-[22rem] bg-gradient-to-tr from-amber-300/12 to-yellow-200/8 dark:from-amber-500/8 dark:to-yellow-600/4 rounded-full blur-3xl animate-float'
          style={{ animationDelay: '3s' }}
        />
        {/* Teal orb center-left */}
        <div className='absolute top-1/3 -left-40 w-80 h-80 bg-teal-400/8 dark:bg-teal-500/5 rounded-full blur-3xl animate-float-slow' />

        {/* ── Decorative eight-pointed stars (SVG) ── */}
        <svg
          className='absolute top-16 left-[8%] w-12 h-12 text-emerald-500/15 dark:text-emerald-400/10 animate-spin-slow'
          viewBox='0 0 100 100'
          fill='currentColor'
        >
          <polygon points='50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35' />
        </svg>
        <svg
          className='absolute top-32 right-[12%] w-8 h-8 text-amber-500/20 dark:text-amber-400/10 animate-spin-slow'
          style={{ animationDirection: 'reverse' }}
          viewBox='0 0 100 100'
          fill='currentColor'
        >
          <polygon points='50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35' />
        </svg>
        <svg
          className='absolute bottom-40 left-[15%] w-10 h-10 text-teal-500/12 dark:text-teal-400/8 animate-spin-slow'
          style={{ animationDuration: '30s' }}
          viewBox='0 0 100 100'
          fill='currentColor'
        >
          <polygon points='50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35' />
        </svg>
        <svg
          className='absolute bottom-52 right-[8%] w-14 h-14 text-emerald-600/10 dark:text-emerald-300/8 animate-spin-slow'
          style={{ animationDuration: '25s' }}
          viewBox='0 0 100 100'
          fill='currentColor'
        >
          <polygon points='50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35' />
        </svg>

        {/* ── Small floating diamond accents ── */}
        <div className='absolute top-1/4 right-[20%] w-3 h-3 bg-emerald-500/25 dark:bg-emerald-400/15 rotate-45 rounded-sm animate-breathe' />
        <div
          className='absolute top-[60%] left-[10%] w-2 h-2 bg-amber-500/30 dark:bg-amber-400/15 rotate-45 rounded-sm animate-breathe'
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className='absolute top-[45%] right-[6%] w-2.5 h-2.5 bg-teal-500/20 dark:bg-teal-400/12 rotate-45 rounded-sm animate-breathe'
          style={{ animationDelay: '2.5s' }}
        />

        {/* ── Horizontal ornamental band (top) ── */}
        <div className='absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent' />
        <div className='absolute top-[3px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent' />

        {/* ═════ HERO CONTENT ═════ */}
        <div className='relative z-10 px-4 md:px-6 pt-20 pb-44 md:pt-28 md:pb-52'>
          <div className='max-w-5xl mx-auto text-center'>
            {/* ── Central ornamental icon ── */}
            <div className='hero-visible mb-10 flex justify-center'>
              <div className='relative group cursor-default'>
                {/* Outer glow ring */}
                <div className='absolute -inset-5 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 dark:from-emerald-400/15 dark:via-teal-400/15 dark:to-emerald-400/15 blur-xl animate-pulse-glow' />
                {/* Diamond frame */}
                <div className='absolute -inset-3 rotate-45 rounded-xl border-2 border-emerald-500/15 dark:border-emerald-400/10 animate-breathe' />
                <div
                  className='absolute -inset-6 rotate-[22.5deg] rounded-xl border border-amber-500/10 dark:border-amber-400/8 animate-breathe'
                  style={{ animationDelay: '1s' }}
                />
                {/* Icon container */}
                <div className='relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-500 dark:via-emerald-600 dark:to-teal-600 p-7 md:p-8 rounded-3xl shadow-2xl shadow-emerald-900/30 dark:shadow-emerald-500/20 border border-emerald-400/20'>
                  {/* Inner shimmer */}
                  <div className='absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-white/5' />
                  <BookOpen className='relative w-14 h-14 md:w-16 md:h-16 text-white drop-shadow-lg' />
                </div>
              </div>
            </div>

            {/* ── Arabic calligraphy title ── */}
            <div className='hero-visible my-6'>
              <h1 className='arabic-text text-center! text-6xl md:text-8xl lg:text-9xl text-foreground/90 dark:text-foreground/80 drop-shadow-sm leading-tight'>
                القرآن الكريم
              </h1>
            </div>

            {/* ── Ornamental divider ── */}
            <div className='hero-visible flex items-center justify-center gap-3 mb-6'>
              <div className='h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-emerald-500/40' />
              <svg
                className='w-4 h-4 text-amber-500/60 dark:text-amber-400/50'
                viewBox='0 0 16 16'
                fill='currentColor'
              >
                <path d='M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5z' />
              </svg>
              <div className='w-1.5 h-1.5 rounded-full bg-emerald-500/40' />
              <svg
                className='w-3 h-3 text-amber-500/50 dark:text-amber-400/40'
                viewBox='0 0 16 16'
                fill='currentColor'
              >
                <path d='M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5z' />
              </svg>
              <div className='h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-emerald-500/40' />
            </div>

            {/* ── English title ── */}
            <div className='hero-visible mb-4'>
              <h2 className='text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight'>
                <span className='bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent'>
                  Al-Quran Al-Kareem
                </span>
              </h2>
            </div>

            {/* ── Subtitle ── */}
            <div className='hero-visible mb-12'>
              <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                Read, listen, and study the Holy Quran with translations,
                tafsir, and beautiful recitations
              </p>
            </div>

            {/* ── CTA Buttons ── */}
            <div className='hero-visible flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'>
              <Button
                asChild
                size='lg'
                className='h-14 text-lg px-10 shadow-xl shadow-emerald-600/20 dark:shadow-emerald-500/15 gradient-emerald text-white hover:opacity-90 hover:scale-[1.03] active:scale-100 transition-all duration-300 rounded-full border border-emerald-400/20'
              >
                <Link to='/surahs'>
                  <BookOpen className='w-5 h-5 mr-2' />
                  Browse All Surahs
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='h-14 text-lg px-10 rounded-full border-emerald-200/60 dark:border-emerald-500/20 bg-white/60 dark:bg-white/5 backdrop-blur-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-400/30 hover:text-emerald-700 dark:hover:text-emerald-300 hover:scale-[1.03] active:scale-100 transition-all duration-300 shadow-lg shadow-black/5 dark:shadow-black/20'
              >
                <Link to='/search'>
                  <Sparkles className='w-5 h-5 mr-2' />
                  Search Verses
                </Link>
              </Button>
            </div>

            {/* ── Stats row ── */}
            <div className='hero-visible'>
              <div className='inline-flex items-center gap-4 md:gap-8 bg-white/50 dark:bg-white/[0.04] backdrop-blur-md rounded-2xl px-8 py-5 border border-emerald-100/60 dark:border-emerald-500/10 shadow-lg shadow-emerald-900/5 dark:shadow-emerald-900/20'>
                <div className='text-center group cursor-default'>
                  <div className='text-3xl md:text-4xl font-bold text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform'>
                    114
                  </div>
                  <div className='text-[11px] md:text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5'>
                    Surahs
                  </div>
                </div>
                <div className='w-px h-12 bg-gradient-to-b from-transparent via-emerald-300/40 dark:via-emerald-500/20 to-transparent' />
                <div className='text-center group cursor-default'>
                  <div className='text-3xl md:text-4xl font-bold text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform'>
                    6,236
                  </div>
                  <div className='text-[11px] md:text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5'>
                    Verses
                  </div>
                </div>
                <div className='w-px h-12 bg-gradient-to-b from-transparent via-emerald-300/40 dark:via-emerald-500/20 to-transparent' />
                <div className='text-center group cursor-default'>
                  <div className='text-3xl md:text-4xl font-bold text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform'>
                    3
                  </div>
                  <div className='text-[11px] md:text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5'>
                    Languages
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verse of the Day */}
      <section className='relative z-20 -mt-60 -mx-4 md:-mx-6 pointer-events-none'>
        {/* ── Mosque dome top edge (SVG Header) ── */}
        <div className='relative w-full overflow-hidden h-[90px] md:h-[160px]'>
          <svg
            className='block w-full h-full drop-shadow-2xl relative z-10'
            viewBox='0 0 1440 160'
            preserveAspectRatio='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            {/* Ornate Ogee (Mosque) Arch */}
            <path
              d='M0,160 
                 C 320,160 500,50 720,0 
                 C 940,50 1120,160 1440,160 
                 V 160 H 0 Z'
              className='fill-emerald-50 dark:fill-[#0c1a2f]'
            />

            {/* Inner accent line */}
            <path
              d='M0,160 
                 C 320,160 500,50 720,0 
                 C 940,50 1120,160 1440,160'
              fill='none'
              stroke='url(#dome-gradient)'
              strokeWidth='2'
              className='opacity-60'
            />
            <defs>
              <linearGradient
                id='dome-gradient'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop
                  offset='0%'
                  stopColor='transparent'
                />
                <stop
                  offset='20%'
                  stopColor='#10b981'
                  stopOpacity='0.2'
                />
                <stop
                  offset='50%'
                  stopColor='#d97706'
                  stopOpacity='0.8'
                />
                <stop
                  offset='80%'
                  stopColor='#10b981'
                  stopOpacity='0.2'
                />
                <stop
                  offset='100%'
                  stopColor='transparent'
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── Section Main Content Area ── */}
        <div className='relative bg-emerald-50 dark:bg-[#0c1a2f] pt-0 pb-20 -mt-1'>
          {/* 
               Content Container
               Pull up (-mt) to place header inside the dome area
               pointer-events-auto needed because section has pointer-events-none
            */}
          <div className='container max-w-6xl mx-auto space-y-8 px-4 md:px-6 relative pointer-events-auto'>
            <div className='flex flex-col items-center justify-center gap-4'>
              <div className='p-3 bg-gradient-to-br mt-2 from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-teal-500/15 rounded-2xl'>
                <Sparkles className='w-8 h-8 text-emerald-600 dark:text-emerald-400' />
              </div>
              <h2 className='text-3xl md:text-4xl font-bold'>
                Verse of the Day
              </h2>
            </div>

            <div>
              {!verseOfDayData || !verseOfDaySurah ? (
                <Card className='glass-card'>
                  <CardContent className='p-10 space-y-6'>
                    <Skeleton className='h-40 w-full rounded-2xl' />
                    <Skeleton className='h-24 w-full rounded-xl' />
                  </CardContent>
                </Card>
              ) : (
                <VerseCard
                  verse={verseOfDayData}
                  surahNo={verseOfDay.surahNo}
                  surahName={verseOfDaySurah.surahName}
                  showTranslation={true}
                  className='shadow-xl border-primary/20 bg-white/80 dark:bg-black/20'
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom edge mirror (inverted dome) ── */}
        <div
          className='relative w-full overflow-hidden rotate-180'
          style={{ height: '80px' }}
        >
          <svg
            className='absolute bottom-0 left-0 w-full h-full'
            viewBox='0 0 1440 80'
            preserveAspectRatio='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M0,80 C400,80 550,0 720,0 C890,0 1040,80 1440,80 V80 H0 Z'
              className='fill-emerald-50/80 dark:fill-emerald-950/30'
            />
          </svg>
        </div>
      </section>

      {/* Popular Surahs */}
      <section className='space-y-8 container max-w-6xl mx-auto'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-teal-500/15 rounded-2xl border border-emerald-200/50 dark:border-emerald-500/10'>
              <TrendingUp className='w-8 h-8 text-emerald-600 dark:text-emerald-400' />
            </div>
            <h2 className='text-3xl md:text-4xl font-bold'>Popular Surahs</h2>
          </div>
          <Button
            asChild
            variant='ghost'
            className='hover:bg-primary/5 hover:text-primary'
          >
            <Link to='/surahs'>
              View All <ArrowRight className='w-4 h-4 ml-2' />
            </Link>
          </Button>
        </div>

        {surahsLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className='glass-card'
              >
                <CardContent className='p-8'>
                  <Skeleton className='h-24 w-full' />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {popularSurahs.map((item, i) => (
              <div
                key={item.number}
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <SurahCard
                  surah={item.surah}
                  surahNumber={item.number}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      {/* Features */}
      <section className='container max-w-6xl mx-auto pb-12'>
        <div className='relative overflow-hidden rounded-3xl border border-emerald-100/60 dark:border-emerald-500/10 bg-gradient-to-br from-white/80 via-emerald-50/30 to-teal-50/20 dark:from-white/[0.03] dark:via-emerald-950/20 dark:to-teal-950/10 p-1'>
          {/* Pattern inside features */}
          <div className='absolute inset-0 pattern-stars opacity-[0.03] dark:opacity-[0.05] pointer-events-none' />
          <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent' />

          <div className='grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative z-10'>
            {/* Feature 1 */}
            <div className='group p-8 md:p-10 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/[0.04] transition-colors duration-500 md:border-r border-b md:border-b-0 border-emerald-100/60 dark:border-emerald-500/10'>
              <div className='space-y-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 group-hover:shadow-emerald-600/30 transition-all duration-300'>
                  <BookOpen className='w-7 h-7 text-white' />
                </div>
                <h3 className='text-xl font-bold'>Multiple Translations</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Read translations in English, Bengali, and Urdu alongside the
                  original Arabic text
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className='group p-8 md:p-10 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/[0.04] transition-colors duration-500 md:border-r border-b md:border-b-0 border-emerald-100/60 dark:border-emerald-500/10'>
              <div className='space-y-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:scale-110 group-hover:shadow-teal-600/30 transition-all duration-300'>
                  <Book className='w-7 h-7 text-white' />
                </div>
                <h3 className='text-xl font-bold'>Tafsir & Commentary</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Access detailed explanations from renowned scholars including
                  Ibn Kathir
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className='group p-8 md:p-10 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/[0.04] transition-colors duration-500'>
              <div className='space-y-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/20 group-hover:scale-110 group-hover:shadow-amber-600/30 transition-all duration-300'>
                  <Headphones className='w-7 h-7 text-white' />
                </div>
                <h3 className='text-xl font-bold'>Audio Recitations</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Listen to beautiful recitations with auto-play, repeat modes,
                  and adjustable speed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
