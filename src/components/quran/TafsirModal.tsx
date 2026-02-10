import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { useVerseTafsir } from '@/lib/api/queries';
import type { Tafsir } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface TafsirModalProps {
  surahNo: number;
  ayahNo: number;
  surahName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Simple markdown-to-HTML converter for tafsir content */
function renderMarkdown(markdown: string): string {
  return (
    markdown
      // Headers
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-base font-semibold mt-4 mb-2 text-foreground">$1</h3>'
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-lg font-bold mt-5 mb-2 text-foreground">$1</h2>'
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-xl font-bold mt-6 mb-3 text-foreground">$1</h1>'
      )
      // Bold
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-foreground">$1</strong>'
      )
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Line breaks (double newline = paragraph)
      .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed">')
      // Single newline = <br>
      .replace(/\n/g, '<br />')
      // Wrap in paragraph
      .replace(/^(.+)/, '<p class="mb-3 leading-relaxed">$1</p>')
  );
}

function TafsirContent({ tafsir }: { tafsir: Tafsir }) {
  return (
    <div className='space-y-4'>
      {/* Group Verse indicator */}
      {tafsir.groupVerse && (
        <Badge
          variant='outline'
          className='bg-emerald-50 dark:bg-emerald-500/8 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl py-1.5 px-3'
        >
          Verses: {tafsir.groupVerse}
        </Badge>
      )}

      {/* Rendered markdown content */}
      <div
        className='text-sm md:text-base text-foreground/75 dark:text-muted-foreground prose-sm max-w-none'
        dangerouslySetInnerHTML={{ __html: renderMarkdown(tafsir.content) }}
      />
    </div>
  );
}

function TafsirSkeleton() {
  return (
    <div className='space-y-4 p-2'>
      <Skeleton className='h-5 w-48 rounded-lg' />
      <Skeleton className='h-4 w-full rounded-lg' />
      <Skeleton className='h-4 w-full rounded-lg' />
      <Skeleton className='h-4 w-3/4 rounded-lg' />
      <Skeleton className='h-4 w-full rounded-lg' />
      <Skeleton className='h-4 w-5/6 rounded-lg' />
      <Skeleton className='h-4 w-full rounded-lg' />
    </div>
  );
}

const AUTHOR_SHORT: Record<string, string> = {
  'Ibn Kathir': 'Ibn Kathir',
  'Maarif Ul Quran': 'Maarif',
  'Tazkirul Quran': 'Tazkir'
};

export function TafsirModal({
  surahNo,
  ayahNo,
  surahName,
  open,
  onOpenChange
}: TafsirModalProps) {
  const {
    data: verseTafsir,
    isLoading,
    error
  } = useVerseTafsir(surahNo, ayahNo, open);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={cn(
          'sm:max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl',
          'border border-emerald-200/60 dark:border-emerald-400/15',
          'bg-white dark:bg-background/95 dark:backdrop-blur-xl',
          'shadow-lg shadow-emerald-900/5 dark:shadow-emerald-900/20'
        )}
      >
        {/* Decorative top line */}
        <div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-emerald-500 z-10' />

        {/* Subtle pattern overlay */}
        <div className='absolute inset-0 pattern-stars opacity-[0.03] dark:opacity-[0.04] pointer-events-none' />

        {/* Header */}
        <DialogHeader className='relative z-10 px-6 pt-6 pb-4 border-b border-emerald-100 dark:border-border/50 bg-gradient-to-b from-emerald-50/60 to-transparent dark:from-emerald-950/20 dark:to-transparent'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-teal-500/15 border border-emerald-200/60 dark:border-emerald-500/10'>
              <BookOpen className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div>
              <DialogTitle className='text-lg font-bold text-foreground'>
                Tafsir — {surahName} {surahNo}:{ayahNo}
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground mt-0.5'>
                Quranic commentary and interpretation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content area */}
        <div className='relative z-10 flex-1 overflow-hidden'>
          {isLoading && (
            <div className='p-6'>
              <TafsirSkeleton />
            </div>
          )}

          {error && (
            <div className='p-6 text-center space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Could not load tafsir for this verse.
              </p>
            </div>
          )}

          {verseTafsir && verseTafsir.tafsirs.length > 0 && (
            <Tabs
              defaultValue={verseTafsir.tafsirs[0].author}
              className='flex flex-col h-full gap-0'
            >
              {/* Author tabs */}
              <div className='px-6 pt-4 pb-0'>
                <TabsList className='w-full bg-emerald-50/80 dark:bg-white/20 border border-emerald-100/80 dark:border-transparent rounded-xl p-1 h-auto'>
                  {verseTafsir.tafsirs.map((tafsir) => (
                    <TabsTrigger
                      key={tafsir.author}
                      value={tafsir.author}
                      className={cn(
                        'flex-1 rounded-lg py-2 px-3 text-xs md:text-sm font-medium transition-all',
                        'data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-emerald-505 dark:data-[state=active]:shadow-sm',
                        'data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400',
                        'data-[state=active]:border-emerald-200/60 dark:data-[state=active]:border-transparent'
                      )}
                    >
                      {AUTHOR_SHORT[tafsir.author] ?? tafsir.author}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab content with scroll */}
              {verseTafsir.tafsirs.map((tafsir) => (
                <TabsContent
                  key={tafsir.author}
                  value={tafsir.author}
                  className='flex-1 overflow-hidden mt-0'
                >
                  <ScrollArea className='h-[50vh] md:h-[55vh]'>
                    <div className='px-6 py-4'>
                      <TafsirContent tafsir={tafsir} />
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}

          {verseTafsir && verseTafsir.tafsirs.length === 0 && (
            <div className='p-6 text-center space-y-3'>
              <p className='text-sm text-muted-foreground'>
                No tafsir available for this verse.
              </p>
            </div>
          )}
        </div>

        {/* Bottom decorative line */}
        <div className='h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent' />
      </DialogContent>
    </Dialog>
  );
}
