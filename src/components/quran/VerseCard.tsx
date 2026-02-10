import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Share2,
  BookOpen
} from 'lucide-react';
import type { Verse } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { useStore } from '@tanstack/react-store';
import { bookmarksStore, toggleBookmark } from '@/lib/stores/bookmarks';
import { audioStore, play, pause } from '@/lib/stores/audio';

interface VerseCardProps {
  verse: Verse;
  surahNo: number;
  surahName: string;
  totalAyahs?: number;
  showTranslation?: boolean;
  translationLanguage?: 'english' | 'bengali' | 'urdu';
  onShowTafsir?: () => void;
  onShare?: () => void;
  className?: string;
}

export function VerseCard({
  verse,
  surahNo,
  surahName,
  totalAyahs,
  showTranslation = true,
  translationLanguage = 'english',
  onShowTafsir,
  onShare,
  className
}: VerseCardProps) {
  const bookmarks = useStore(bookmarksStore, (state) => state.bookmarks);
  const { isPlaying, currentVerse } = useStore(audioStore);

  const verseKey = `${surahNo}:${verse.ayahNo}`;
  const isBookmarked = bookmarks.some((b) => b.verseKey === verseKey);

  const isCurrentVersePlaying =
    isPlaying &&
    currentVerse?.surahNo === surahNo &&
    currentVerse?.ayahNo === verse.ayahNo;

  const handleToggleBookmark = () => {
    toggleBookmark({
      verseKey,
      surahNo,
      surahName,
      ayahNo: verse.ayahNo,
      arabicText: verse.arabic
    });
  };

  const handlePlayAudio = () => {
    if (isCurrentVersePlaying) {
      pause();
    } else {
      play(surahNo, verse.ayahNo, totalAyahs);
    }
  };

  const getTranslationText = () => {
    switch (translationLanguage) {
      case 'bengali':
        return verse.bengali;
      case 'urdu':
        return verse.urdu;
      default:
        return verse.english;
    }
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-500',
        'glass-card hover:shadow-islamic-lg',
        isCurrentVersePlaying &&
          'border-emerald-500/40 shadow-islamic-lg animate-glow-border',
        className
      )}
    >
      {/* Subtle pattern overlay */}
      <div className='absolute inset-0 pattern-stars opacity-[0.02] dark:opacity-[0.04] pointer-events-none' />

      {/* Top decorative gold line */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-[2px]',
          'bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent',
          isCurrentVersePlaying && 'via-emerald-400/60'
        )}
      />

      <CardContent className='p-6 md:p-8 relative z-10 space-y-5'>
        {/* Header: Verse Number + Action Buttons */}
        <div className='flex items-center justify-between'>
          {/* Verse number ornament */}
          <div className='flex items-center gap-3'>
            <div
              className={cn(
                'verse-number-ornament',
                isCurrentVersePlaying && 'animate-breathe'
              )}
            >
              <span
                className={cn(
                  'relative z-10 text-sm font-bold',
                  isCurrentVersePlaying
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-emerald-600/80 dark:text-emerald-400/80'
                )}
              >
                {verse.ayahNo}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold text-foreground/80'>
                {surahName}
              </span>
              <span className='text-xs text-muted-foreground'>
                Verse {surahNo}:{verse.ayahNo}
              </span>
            </div>
          </div>

          {/* Action Buttons - always visible on mobile, hover on desktop */}
          <div className='flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-2 md:group-hover:translate-x-0'>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'h-9 w-9 rounded-xl transition-all duration-300',
                isBookmarked
                  ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                  : 'hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              )}
              onClick={handleToggleBookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? (
                <BookmarkCheck className='h-4 w-4 fill-current' />
              ) : (
                <Bookmark className='h-4 w-4' />
              )}
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'h-9 w-9 rounded-xl transition-all duration-300',
                isCurrentVersePlaying
                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                  : 'hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              )}
              onClick={handlePlayAudio}
              aria-label={isCurrentVersePlaying ? 'Pause audio' : 'Play audio'}
            >
              {isCurrentVersePlaying ? (
                <Pause className='h-4 w-4 fill-current' />
              ) : (
                <Play className='h-4 w-4' />
              )}
            </Button>

            {onShowTafsir && (
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300'
                onClick={onShowTafsir}
                aria-label='Show tafsir'
              >
                <BookOpen className='h-4 w-4' />
              </Button>
            )}

            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300'
              onClick={onShare}
              aria-label='Share verse'
            >
              <Share2 className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Arabic Text - calligraphy area */}
        <div className='relative py-6 px-4 md:px-8'>
          {/* Decorative corner ornaments */}
          <div className='absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500/15 dark:border-emerald-400/15 rounded-tl-sm' />
          <div className='absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-500/15 dark:border-emerald-400/15 rounded-tr-sm' />
          <div className='absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-500/15 dark:border-emerald-400/15 rounded-bl-sm' />
          <div className='absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500/15 dark:border-emerald-400/15 rounded-br-sm' />

          <p
            className={cn(
              'arabic-text text-3xl md:text-4xl leading-[3rem] md:leading-[3.5rem] text-foreground/90',
              isCurrentVersePlaying && 'text-foreground'
            )}
          >
            {verse.arabic}
          </p>
        </div>

        {/* Translation */}
        {showTranslation && (
          <>
            {/* Ornate divider */}
            <div className='ornate-divider px-4'>
              <span className='text-xs text-muted-foreground/60 font-medium uppercase tracking-widest'>
                {translationLanguage === 'bengali'
                  ? 'অনুবাদ'
                  : translationLanguage === 'urdu'
                    ? 'ترجمہ'
                    : 'Translation'}
              </span>
            </div>

            <div className='px-4 md:px-8 pb-2'>
              <p
                className={cn(
                  'text-base md:text-lg leading-relaxed text-muted-foreground',
                  translationLanguage === 'bengali' && 'bangla-text',
                  translationLanguage === 'urdu' && 'text-right'
                )}
              >
                {getTranslationText()}
              </p>
            </div>
          </>
        )}
      </CardContent>

      {/* Bottom accent line on hover */}
      <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/30 transition-all duration-700' />
    </Card>
  );
}
