import { createFileRoute, Link } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { bookmarksStore, removeBookmark } from '@/lib/stores/bookmarks';
import { useSurah } from '@/lib/api/queries';
import { surahDetailToVerses } from '@/lib/api/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkX, BookOpen, ExternalLink } from 'lucide-react';

export const Route = createFileRoute('/bookmarks')({
  component: BookmarksPage
});

function BookmarkItem({ bookmark, index }: { bookmark: any; index: number }) {
  const [surahNo, ayahNo] = bookmark.verseKey.split(':').map(Number);
  const { data: surah } = useSurah(surahNo);

  const verse = surah ? surahDetailToVerses(surah)[ayahNo - 1] : null;

  return (
    <Card
      className='group glass-card hover:shadow-islamic-lg transition-all duration-500 animate-fade-in-up'
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Top accent */}
      <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent group-hover:via-amber-500/40 transition-all duration-500' />

      <CardContent className='p-6 md:p-7 space-y-4 relative z-10'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-3 flex-1'>
            {/* Verse number ornament */}
            <div className='verse-number-ornament flex-shrink-0'>
              <span className='relative z-10 text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80'>
                {ayahNo}
              </span>
            </div>

            <div className='space-y-0.5 flex-1 min-w-0'>
              <Link
                to='/surah/$id'
                params={{ id: surahNo.toString() }}
                className='inline-flex items-center gap-2 text-lg font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'
              >
                <span className='truncate'>
                  {bookmark.surahName || `Surah ${surahNo}`}
                </span>
                <Badge
                  variant='outline'
                  className='rounded-lg text-xs bg-emerald-500/5 border-emerald-500/15'
                >
                  {surahNo}:{ayahNo}
                </Badge>
                <ExternalLink className='w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground' />
              </Link>
              <p className='text-xs text-muted-foreground'>
                Bookmarked{' '}
                {new Date(bookmark.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => removeBookmark(bookmark.verseKey)}
            className='h-9 w-9 rounded-xl text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 flex-shrink-0'
          >
            <BookmarkX className='w-4 h-4' />
          </Button>
        </div>

        {verse && (
          <div className='space-y-4 pt-4'>
            <div className='gold-separator' />

            {/* Arabic text with corner ornaments */}
            <div className='relative py-4 px-3 md:px-6'>
              <div className='absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-500/12 rounded-tl-sm' />
              <div className='absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-500/12 rounded-tr-sm' />
              <div className='absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-500/12 rounded-bl-sm' />
              <div className='absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-500/12 rounded-br-sm' />

              <p className='arabic-text text-2xl md:text-3xl leading-[2.8rem] text-foreground/85'>
                {verse.arabic}
              </p>
            </div>

            <p className='text-muted-foreground leading-relaxed text-sm md:text-base'>
              {verse.english}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BookmarksPage() {
  const bookmarks = useStore(bookmarksStore, (state) => state.bookmarks);

  const sortedBookmarks = [...bookmarks].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <div className='space-y-8 container max-w-6xl mx-auto'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-3xl p-8 md:p-10 glass-card animate-fade-in-up my-8'>
        <div className='absolute inset-0 pattern-stars opacity-[0.03] dark:opacity-[0.05] pointer-events-none' />
        <div className='absolute top-0 right-0 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl -mr-32 -mt-32' />
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/8 rounded-full blur-3xl -ml-24 -mb-24' />

        <div className='relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='space-y-2'>
            <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 dark:from-amber-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent'>
              Bookmarked Verses
            </h1>
            <p className='text-muted-foreground text-lg'>
              Your saved verses for quick access and reflection
            </p>
          </div>
          <Badge
            variant='outline'
            className='text-sm py-2 px-4 glass-card bg-background/50 rounded-xl gap-2'
          >
            <Bookmark className='w-4 h-4 text-amber-500 dark:text-amber-400' />
            <span className='font-bold text-foreground'>
              {bookmarks.length}
            </span>
            {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
          </Badge>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        /* Ornate Empty State */
        <Card
          className='ornate-card animate-fade-in-up'
          style={{ animationDelay: '0.1s' }}
        >
          <CardContent className='p-12 md:p-16 text-center space-y-6 relative'>
            {/* Pattern */}
            <div className='absolute inset-0 pattern-arabesque opacity-[0.03] pointer-events-none' />

            <div className='relative z-10 space-y-6'>
              {/* Decorative icon */}
              <div className='relative w-24 h-24 mx-auto'>
                <div className='absolute inset-0 bg-gradient-to-br from-amber-500/15 to-emerald-500/15 rounded-full animate-breathe' />
                <div className='absolute inset-2 bg-gradient-to-br from-amber-500/8 to-emerald-500/8 rounded-full flex items-center justify-center backdrop-blur-sm border border-amber-500/10'>
                  <Bookmark className='w-10 h-10 text-amber-500/60 dark:text-amber-400/60' />
                </div>
              </div>

              <div className='space-y-3'>
                <h3 className='text-2xl font-bold text-foreground'>
                  No bookmarks yet
                </h3>
                <p className='text-muted-foreground max-w-md mx-auto leading-relaxed'>
                  Start bookmarking verses you want to revisit. Click the
                  bookmark icon on any verse to save it here for easy access.
                </p>
              </div>

              <div className='gold-separator max-w-xs mx-auto' />

              <p className='arabic-text text-xl text-muted-foreground/50 text-center!'>
                وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ
              </p>
              <p className='text-xs text-muted-foreground italic'>
                "And We have certainly made the Quran easy for remembrance" -
                Al-Qamar 54:17
              </p>

              <Button
                asChild
                size='lg'
                className='gradient-emerald text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 mt-2'
              >
                <Link to='/surahs'>
                  <BookOpen className='w-5 h-5 mr-2' />
                  Browse Surahs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {sortedBookmarks.map((bookmark, index) => (
            <BookmarkItem
              key={bookmark.verseKey}
              bookmark={bookmark}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
