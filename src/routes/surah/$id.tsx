import { createFileRoute, Link } from '@tanstack/react-router';
import { useSurah } from '@/lib/api/queries';
import { surahDetailToVerses } from '@/lib/api/types';
import { VerseCard } from '@/components/quran/VerseCard';
import { TafsirModal } from '@/components/quran/TafsirModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  MapPin,
  BookOpen,
  Languages,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { markVerseAsRead } from '@/lib/stores/progress';
import { toast } from 'sonner';

export const Route = createFileRoute('/surah/$id')({
  component: SurahDetailPage
});

function SurahDetailPage() {
  const { id } = Route.useParams();
  const surahNumber = parseInt(id, 10);

  const { data: surah, isLoading, error } = useSurah(surahNumber);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationLanguage, setTranslationLanguage] = useState<
    'english' | 'bengali' | 'urdu'
  >('english');

  // Tafsir modal state
  const [tafsirVerse, setTafsirVerse] = useState<{ ayahNo: number } | null>(
    null
  );

  const verses = useMemo(() => {
    if (!surah) return [];
    return surahDetailToVerses(surah);
  }, [surah]);

  // Progress tracking: IntersectionObserver to mark verses as read
  const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const readTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const setVerseRef = useCallback(
    (ayahNo: number, el: HTMLDivElement | null) => {
      if (el) {
        verseRefs.current.set(ayahNo, el);
      } else {
        verseRefs.current.delete(ayahNo);
      }
    },
    []
  );

  useEffect(() => {
    if (!surah || verses.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const ayahNo = Number(entry.target.getAttribute('data-ayah'));
          if (Number.isNaN(ayahNo)) continue;

          if (entry.isIntersecting) {
            // Start a 2-second timer — verse must stay visible to count as "read"
            if (!readTimers.current.has(ayahNo)) {
              const timer = setTimeout(() => {
                markVerseAsRead(surahNumber, ayahNo, surah.surahName);
                readTimers.current.delete(ayahNo);
              }, 2000);
              readTimers.current.set(ayahNo, timer);
            }
          } else {
            // Scrolled away before 2 s — cancel
            const timer = readTimers.current.get(ayahNo);
            if (timer) {
              clearTimeout(timer);
              readTimers.current.delete(ayahNo);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    for (const [, el] of verseRefs.current) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      for (const timer of readTimers.current.values()) clearTimeout(timer);
      readTimers.current.clear();
    };
  }, [surah, verses, surahNumber]);

  // Share handler
  const handleShare = useCallback(
    async (ayahNo: number) => {
      if (!surah) return;
      const verse = verses.find((v) => v.ayahNo === ayahNo);
      if (!verse) return;

      const text = `${verse.arabic}\n\n${verse.english}\n\n— ${surah.surahName} (${surahNumber}:${ayahNo})`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `${surah.surahName} ${surahNumber}:${ayahNo}`,
            text
          });
        } catch {
          // User cancelled share — ignore
        }
      } else {
        try {
          await navigator.clipboard.writeText(text);
          toast.success('Verse copied to clipboard');
        } catch {
          toast.error('Failed to copy verse');
        }
      }
    },
    [surah, verses, surahNumber]
  );

  if (isLoading) {
    return (
      <div className='space-y-6 animate-fade-in'>
        <Skeleton className='h-10 w-32 rounded-xl' />
        <Skeleton className='h-56 w-full rounded-2xl' />
        <Skeleton className='h-20 w-full rounded-2xl' />
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            className='h-48 w-full rounded-2xl'
          />
        ))}
      </div>
    );
  }

  if (error || !surah) {
    return (
      <Card className='glass-card'>
        <CardContent className='p-12 text-center space-y-6'>
          <div className='w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full flex items-center justify-center'>
            <BookOpen className='w-10 h-10 text-muted-foreground' />
          </div>
          <h2 className='text-2xl font-bold'>Surah not found</h2>
          <p className='text-muted-foreground max-w-md mx-auto'>
            The surah you're looking for doesn't exist or could not be loaded.
          </p>
          <Button
            asChild
            className='gradient-emerald text-white'
          >
            <Link to='/surahs'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Surahs
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-8 animate-fade-in'>
      {/* Back Button */}
      <Button
        asChild
        variant='ghost'
        size='sm'
        className='hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl'
      >
        <Link to='/surahs'>
          <ChevronLeft className='w-4 h-4 mr-1' />
          All Surahs
        </Link>
      </Button>

      {/* Ornate Surah Header */}
      <div className='relative overflow-hidden rounded-3xl animate-fade-in-up'>
        {/* Background layers */}
        <div className='absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/80 to-transparent dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent' />
        <div className='absolute inset-0 pattern-arabesque opacity-30 dark:opacity-20' />
        <div className='absolute top-0 right-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl -mr-20 -mt-20' />
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl -ml-16 -mb-16' />

        {/* Gold accent top line */}
        <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent' />

        <div className='relative z-10 p-8 md:p-12'>
          <div className='flex flex-col md:flex-row md:items-start justify-between gap-8'>
            {/* Left: Surah Info */}
            <div className='space-y-5 flex-1'>
              {/* Number + English Name */}
              <div className='flex items-center gap-4'>
                <div className='surah-number-frame'>
                  <span className='relative z-10 text-lg font-bold text-gradient-emerald'>
                    {surahNumber}
                  </span>
                </div>
                <div>
                  <h1 className='text-3xl md:text-4xl font-bold text-foreground'>
                    {surah.surahName}
                  </h1>
                  <p className='text-sm text-muted-foreground mt-0.5'>
                    {surah.surahNameTranslation}
                  </p>
                </div>
              </div>

              {/* Arabic Name - large calligraphy */}
              <p className='arabic-text text-4xl md:text-5xl text-foreground/80 leading-relaxed'>
                {surah.surahNameArabicLong}
              </p>

              {/* Metadata badges */}
              <div className='flex flex-wrap items-center gap-3'>
                <Badge
                  variant='outline'
                  className={cn(
                    'py-1.5 px-3 gap-1.5 rounded-xl backdrop-blur-sm',
                    surah.revelationPlace === 'Mecca'
                      ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-teal-500/8 border-teal-500/20 text-teal-700 dark:text-teal-300'
                  )}
                >
                  <MapPin className='w-3.5 h-3.5' />
                  {surah.revelationPlace}
                </Badge>
                <Badge
                  variant='outline'
                  className='py-1.5 px-3 gap-1.5 rounded-xl bg-muted/50 backdrop-blur-sm'
                >
                  <BookOpen className='w-3.5 h-3.5' />
                  {surah.totalAyah} Verses
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent' />
      </div>

      {/* Bismillah (for all surahs except At-Tawbah #9) */}
      {surahNumber !== 9 && surahNumber !== 1 && (
        <div
          className='text-center py-6 animate-fade-in-up'
          style={{ animationDelay: '0.1s' }}
        >
          <p className='arabic-text text-3xl md:text-4xl text-foreground/70'>
            بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </p>
          <div className='gold-separator mt-4 mx-auto max-w-xs' />
        </div>
      )}

      {/* Translation Controls */}
      <Card
        className='glass-card animate-fade-in-up sticky top-20 z-30'
        style={{ animationDelay: '0.15s' }}
      >
        <CardContent className='p-5'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
            {/* Show Translation Toggle */}
            <div className='flex items-center space-x-3'>
              <Switch
                id='show-translation'
                checked={showTranslation}
                onCheckedChange={setShowTranslation}
              />
              <Label
                htmlFor='show-translation'
                className='font-medium cursor-pointer text-sm'
              >
                Show Translation
              </Label>
            </div>

            {/* Translation Language Selector */}
            {showTranslation && (
              <>
                <div className='hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent' />
                <div className='flex items-center gap-3 flex-1'>
                  <Languages className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                  <Select
                    value={translationLanguage}
                    onValueChange={(value: any) =>
                      setTranslationLanguage(value)
                    }
                  >
                    <SelectTrigger className='w-[180px] rounded-xl bg-background/50 border-border/50'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white dark:bg-background'>
                      <SelectItem value='english'>English</SelectItem>
                      <SelectItem value='bengali'>বাংলা (Bengali)</SelectItem>
                      <SelectItem value='urdu'>اردو (Urdu)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verses */}
      <div className='space-y-5'>
        {verses.map((verse, index) => (
          <div
            key={verse.ayahNo}
            ref={(el) => setVerseRef(verse.ayahNo, el)}
            data-ayah={verse.ayahNo}
            className='animate-fade-in-up'
            style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
          >
            <VerseCard
              verse={verse}
              surahNo={surahNumber}
              surahName={surah.surahName}
              totalAyahs={surah.totalAyah}
              showTranslation={showTranslation}
              translationLanguage={translationLanguage}
              onShowTafsir={() => setTafsirVerse({ ayahNo: verse.ayahNo })}
              onShare={() => handleShare(verse.ayahNo)}
            />
          </div>
        ))}
      </div>

      {/* Tafsir Modal */}
      {tafsirVerse && (
        <TafsirModal
          surahNo={surahNumber}
          ayahNo={tafsirVerse.ayahNo}
          surahName={surah.surahName}
          open={!!tafsirVerse}
          onOpenChange={(open) => {
            if (!open) setTafsirVerse(null);
          }}
        />
      )}

      {/* Navigation to next/previous surah */}
      <div className='relative pt-8'>
        <div className='gold-separator mb-8' />
        <div className='flex justify-between items-center'>
          {surahNumber > 1 ? (
            <Button
              asChild
              variant='outline'
              className='rounded-xl border-border/50 hover:border-emerald-500/30 hover:bg-emerald-500/5 gap-2 transition-all duration-300'
            >
              <Link
                to='/surah/$id'
                params={{ id: (surahNumber - 1).toString() }}
              >
                <ChevronLeft className='w-4 h-4' />
                Previous Surah
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {surahNumber < 114 && (
            <Button
              asChild
              className='rounded-xl gradient-emerald text-white gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300'
            >
              <Link
                to='/surah/$id'
                params={{ id: (surahNumber + 1).toString() }}
              >
                Next Surah
                <ChevronRight className='w-4 h-4' />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
