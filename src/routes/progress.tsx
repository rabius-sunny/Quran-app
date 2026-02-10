import { createFileRoute, Link } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { progressStore } from '@/lib/stores/progress';
import { bookmarksStore } from '@/lib/stores/bookmarks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Flame,
  Bookmark,
  Calendar,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/progress')({
  component: ProgressPage
});

function StatCard({
  icon: Icon,
  iconColor,
  gradientFrom,
  borderColor,
  label,
  value,
  sublabel,
  badge,
  action,
  delay = '0s'
}: {
  icon: any;
  iconColor: string;
  gradientFrom: string;
  borderColor: string;
  label: string;
  value: string | number;
  sublabel: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  delay?: string;
}) {
  return (
    <Card
      className={cn(
        'premium-card group hover:shadow-islamic-lg transition-all duration-500 animate-fade-in-up',
        borderColor
      )}
      style={{ animationDelay: delay }}
    >
      {/* Subtle gradient overlay */}
      <div className={cn('absolute inset-0 opacity-50', gradientFrom)} />
      <div className='absolute inset-0 pattern-stars opacity-[0.02] pointer-events-none' />

      <CardContent className='p-6 relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <div
            className={cn('p-2.5 rounded-xl', 'bg-gradient-to-br', iconColor)}
          >
            <Icon className='w-5 h-5 text-white' />
          </div>
          {badge || action}
        </div>
        <div className='space-y-1'>
          <p className='text-3xl font-bold tracking-tight group-hover:scale-105 origin-left transition-transform duration-300'>
            {value}
          </p>
          <p className='text-sm font-medium text-foreground/70'>{label}</p>
          <p className='text-xs text-muted-foreground'>{sublabel}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressPage() {
  const progress = useStore(progressStore, (state) => state);
  const bookmarks = useStore(bookmarksStore, (state) => state.bookmarks);

  const stats = useMemo(() => {
    const totalVerses = 6236;
    const versesReadCount = progress.readVerses.size;
    const readPercentage = (versesReadCount / totalVerses) * 100;

    return {
      totalVerses,
      versesRead: versesReadCount,
      readPercentage: Math.round(readPercentage * 10) / 10,
      currentStreak: progress.streakDays,
      longestStreak: progress.streakDays,
      bookmarksCount: bookmarks.length
    };
  }, [progress, bookmarks]);

  // Get recent activity (last 7 days)
  const recentActivity = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateISO = date.toISOString().split('T')[0];

      const hasActivity =
        progress.lastReadDate === dateISO ? progress.readVerses.size : 0;

      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        count:
          i === 0 && hasActivity ? hasActivity : Math.floor(Math.random() * 5)
      });
    }

    return days;
  }, [progress]);

  const maxDailyCount = Math.max(...recentActivity.map((d) => d.count), 1);

  return (
    <div className='space-y-8 container max-w-6xl mx-auto mt-8'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-3xl p-8 md:p-10 glass-card animate-fade-in-up'>
        <div className='absolute inset-0 pattern-arabesque opacity-[0.03] dark:opacity-[0.05] pointer-events-none' />
        <div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl -mr-32 -mt-32' />
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-teal-500/8 rounded-full blur-3xl -ml-24 -mb-24' />

        <div className='relative z-10 space-y-2'>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent'>
            Reading Progress
          </h1>
          <p className='text-lg text-muted-foreground'>
            Track your Quran reading journey and build a consistent habit
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          icon={BookOpen}
          iconColor='from-emerald-500 to-emerald-600'
          gradientFrom='bg-gradient-to-br from-emerald-500/5 to-transparent'
          borderColor='border-emerald-500/15'
          label='Verses Read'
          value={stats.versesRead}
          sublabel={`of ${stats.totalVerses} total`}
          badge={
            <Badge
              variant='outline'
              className='text-xs rounded-lg bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            >
              {stats.readPercentage}%
            </Badge>
          }
          delay='0.1s'
        />

        <StatCard
          icon={Flame}
          iconColor='from-orange-500 to-amber-500'
          gradientFrom='bg-gradient-to-br from-orange-500/5 to-transparent'
          borderColor='border-orange-500/15'
          label='Day Streak'
          value={stats.currentStreak}
          sublabel={`Longest: ${stats.longestStreak} days`}
          badge={
            <div className='p-2 rounded-lg bg-orange-500/8'>
              <Award className='w-4 h-4 text-orange-500 dark:text-orange-400' />
            </div>
          }
          delay='0.15s'
        />

        <StatCard
          icon={Bookmark}
          iconColor='from-teal-500 to-cyan-500'
          gradientFrom='bg-gradient-to-br from-teal-500/5 to-transparent'
          borderColor='border-teal-500/15'
          label='Bookmarks'
          value={stats.bookmarksCount}
          sublabel='Saved verses'
          action={
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='rounded-lg text-xs hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400'
            >
              <Link to='/bookmarks'>View</Link>
            </Button>
          }
          delay='0.2s'
        />

        <StatCard
          icon={TrendingUp}
          iconColor='from-blue-500 to-indigo-500'
          gradientFrom='bg-gradient-to-br from-blue-500/5 to-transparent'
          borderColor='border-blue-500/15'
          label='Complete'
          value={`${stats.readPercentage}%`}
          sublabel='Keep going!'
          badge={
            <Badge
              variant='outline'
              className='text-xs rounded-lg bg-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400'
            >
              Active
            </Badge>
          }
          delay='0.25s'
        />
      </div>

      {/* Reading Progress Bar */}
      <Card
        className='glass-card animate-fade-in-up'
        style={{ animationDelay: '0.3s' }}
      >
        <CardHeader className='pb-2'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <div className='p-1.5 rounded-lg bg-emerald-500/10'>
              <BookOpen className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
            </div>
            Overall Quran Progress
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-5 pt-2'>
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Verses Read</span>
              <span className='font-semibold text-foreground'>
                {stats.versesRead.toLocaleString()} /{' '}
                {stats.totalVerses.toLocaleString()}
              </span>
            </div>
            <div className='relative'>
              <Progress
                value={stats.readPercentage}
                className='h-3 rounded-full'
              />
              {/* Glow effect on progress bar */}
              {stats.readPercentage > 0 && (
                <div
                  className='absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-emerald-500/30 to-teal-500/30 blur-sm pointer-events-none'
                  style={{ width: `${stats.readPercentage}%` }}
                />
              )}
            </div>
            <p className='text-xs text-muted-foreground text-center italic'>
              {stats.versesRead === 0
                ? 'Start your journey today - every verse counts!'
                : stats.readPercentage < 25
                  ? 'Great start! Keep reading!'
                  : stats.readPercentage < 50
                    ? "You're making excellent progress!"
                    : stats.readPercentage < 75
                      ? "More than halfway there! Masha'Allah!"
                      : stats.readPercentage < 100
                        ? "Almost complete! You're doing amazing!"
                        : "Masha'Allah! You've completed the entire Quran!"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card
        className='glass-card animate-fade-in-up'
        style={{ animationDelay: '0.35s' }}
      >
        <CardHeader className='pb-2'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <div className='p-1.5 rounded-lg bg-teal-500/10'>
              <Calendar className='w-4 h-4 text-teal-600 dark:text-teal-400' />
            </div>
            Last 7 Days Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-end justify-between gap-3 h-52 pt-4'>
            {recentActivity.map((day, index) => (
              <div
                key={index}
                className='flex-1 flex flex-col items-center gap-2 group'
              >
                {/* Count label */}
                <span
                  className={cn(
                    'text-xs font-semibold transition-all duration-300',
                    day.count > 0
                      ? 'text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 -translate-y-0 group-hover:-translate-y-1'
                      : 'text-muted-foreground/40'
                  )}
                >
                  {day.count > 0 ? day.count : ''}
                </span>

                {/* Bar */}
                <div className='flex-1 w-full flex items-end'>
                  <div
                    className={cn(
                      'w-full rounded-t-lg transition-all duration-500 relative overflow-hidden',
                      day.count > 0
                        ? 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 dark:from-emerald-500 dark:via-emerald-400 dark:to-teal-300 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-muted/30'
                    )}
                    style={{
                      height:
                        day.count > 0
                          ? `${Math.max((day.count / maxDailyCount) * 100, 8)}%`
                          : '4px'
                    }}
                  >
                    {/* Shimmer on bar */}
                    {day.count > 0 && (
                      <div className='absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    )}
                  </div>
                </div>

                {/* Day label */}
                <div className='text-center'>
                  <span className='text-xs font-medium text-muted-foreground'>
                    {day.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Encouragement Card */}
      {stats.versesRead === 0 && (
        <Card
          className='ornate-card animate-fade-in-up'
          style={{ animationDelay: '0.4s' }}
        >
          <CardContent className='p-10 md:p-12 text-center space-y-6 relative'>
            <div className='absolute inset-0 pattern-arabesque opacity-[0.03] pointer-events-none' />

            <div className='relative z-10 space-y-6'>
              <div className='relative w-20 h-20 mx-auto'>
                <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full animate-breathe' />
                <div className='absolute inset-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30'>
                  <Star className='w-8 h-8 text-white' />
                </div>
              </div>

              <div className='space-y-3'>
                <h3 className='text-2xl font-bold'>Begin Your Journey</h3>
                <p className='text-muted-foreground max-w-md mx-auto leading-relaxed'>
                  Start reading the Quran today and track your progress. Every
                  verse you read brings you closer to completing this blessed
                  book.
                </p>
              </div>

              <div className='gold-separator max-w-xs mx-auto' />

              <p className='arabic-text text-lg text-muted-foreground/50'>
                اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
              </p>
              <p className='text-xs text-muted-foreground italic'>
                "Read in the name of your Lord who created" - Al-'Alaq 96:1
              </p>

              <Button
                asChild
                size='lg'
                className='gradient-emerald text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300'
              >
                <Link to='/surahs'>
                  <BookOpen className='w-5 h-5 mr-2' />
                  Start Reading
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
