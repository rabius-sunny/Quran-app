import { createFileRoute } from '@tanstack/react-router';
import { useSurahsList } from '@/lib/api/queries';
import { SurahCard } from '@/components/quran/SurahCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, X } from 'lucide-react';
import { useState, useMemo } from 'react';

export const Route = createFileRoute('/surahs')({
  component: SurahsPage
});

function SurahsPage() {
  const { data: surahs, isLoading } = useSurahsList();
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<
    'All' | 'Mecca' | 'Madina'
  >('All');

  const filteredSurahs = useMemo(() => {
    if (!surahs) return [];

    return surahs
      .map((surah, index) => ({ surah, number: index + 1 }))
      .filter((item) => {
        // Search filter
        const matchesSearch =
          item.surah.surahName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.surah.surahNameArabic.includes(searchQuery) ||
          item.surah.surahNameTranslation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.number.toString().includes(searchQuery);

        // Revelation place filter
        const matchesRevelation =
          revelationFilter === 'All' ||
          item.surah.revelationPlace === revelationFilter;

        return matchesSearch && matchesRevelation;
      });
  }, [surahs, searchQuery, revelationFilter]);

  const stats = useMemo(() => {
    if (!surahs) return { total: 0, meccan: 0, medinan: 0 };
    return {
      total: surahs.length,
      meccan: surahs.filter((s) => s.revelationPlace === 'Mecca').length,
      medinan: surahs.filter((s) => s.revelationPlace === 'Madina').length
    };
  }, [surahs]);

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='space-y-6 mt-8 container max-w-6xl mx-auto relative overflow-hidden rounded-3xl px-4 py-8 sm:p-8 md:p-12 glass-card animate-fade-in-up'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32' />
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-32 -mb-32' />

        <div className='relative z-10 space-y-4'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent'>
                All Surahs
              </h1>
              <p className='text-lg text-muted-foreground mt-2 max-w-2xl'>
                Browse and search through all {stats.total} chapters of the Holy
                Quran with advanced filtering options.
              </p>
            </div>

            {/* Stats */}
            <div className='flex flex-col items-center gap-3'>
              <Badge
                variant='outline'
                className='text-sm py-2 px-4 glass-card bg-background/50'
              >
                <span className='font-bold text-primary mr-1'>
                  {stats.total}
                </span>
                Total Surahs
              </Badge>
              <div className='flex gap-3'>
                <Badge
                  variant='outline'
                  className='text-sm py-2 px-4 glass-card bg-background/50'
                >
                  <MapPin className='w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400' />
                  <span className='font-bold text-emerald-600 dark:text-emerald-400 mr-1'>
                    {stats.meccan}
                  </span>
                  Meccan
                </Badge>
                <Badge
                  variant='outline'
                  className='text-sm py-2 px-4 glass-card bg-background/50'
                >
                  <MapPin className='w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400' />
                  <span className='font-bold text-teal-600 dark:text-teal-400 mr-1'>
                    {stats.medinan}
                  </span>
                  Medinan
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className='sticky top-20 z-30 bg-background/80 backdrop-blur-xl p-4 -mx-4 md:mx-0 rounded-2xl  shadow-sm animate-fade-in-up'
        style={{ animationDelay: '0.1s' }}
      >
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Search */}
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60' />
            <Input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 pr-10 h-10 border-0 bg-muted/40 hover:bg-muted/60 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-emerald-500/20 transition-all duration-300 shadow-sm'
            />
            {searchQuery && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-destructive/10 hover:text-destructive'
                onClick={() => setSearchQuery('')}
              >
                <X className='w-4 h-4' />
              </Button>
            )}
          </div>

          {/* Revelation Filter */}
          <div className='flex gap-2 p-1 bg-muted/30 rounded-lg '>
            <Button
              variant={revelationFilter === 'All' ? 'default' : 'ghost'}
              onClick={() => setRevelationFilter('All')}
              size='sm'
              className={revelationFilter === 'All' ? 'shadow-sm' : ''}
            >
              All
            </Button>
            <Button
              variant={revelationFilter === 'Mecca' ? 'default' : 'ghost'}
              onClick={() => setRevelationFilter('Mecca')}
              size='sm'
              className={
                revelationFilter === 'Mecca'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  : ''
              }
            >
              Mecca
            </Button>
            <Button
              variant={revelationFilter === 'Madina' ? 'default' : 'ghost'}
              onClick={() => setRevelationFilter('Madina')}
              size='sm'
              className={
                revelationFilter === 'Madina'
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                  : ''
              }
            >
              Madina
            </Button>
          </div>
        </div>
      </div>

      {/* Surah List */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[...Array(12)].map((_, i) => (
            <Card
              key={i}
              className='glass-card'
            >
              <CardContent className='p-6'>
                <Skeleton className='h-24 w-full' />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSurahs.length === 0 ? (
        <Card className='glass-card border-dashed'>
          <CardContent className='p-16 text-center'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <Search className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>No surahs found</h3>
            <p className='text-muted-foreground max-w-sm mx-auto'>
              We couldn't find any surahs matching "{searchQuery}". Try
              adjusting your search or filters.
            </p>
            <Button
              variant='outline'
              className='mt-6'
              onClick={() => {
                setSearchQuery('');
                setRevelationFilter('All');
              }}
            >
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className='animate-fade-in-up'
          style={{ animationDelay: '0.2s' }}
        >
          <div className='text-sm text-muted-foreground mb-4 pl-1'>
            Showing {filteredSurahs.length} of {stats.total} surahs
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredSurahs.map((item) => (
              <SurahCard
                key={item.number}
                surah={item.surah}
                surahNumber={item.number}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
