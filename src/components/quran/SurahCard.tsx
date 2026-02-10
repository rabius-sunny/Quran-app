import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, BookOpen } from 'lucide-react'
import type { SurahInfo } from '@/lib/api/types'
import { cn } from '@/lib/utils'

interface SurahCardProps {
  surah: SurahInfo
  surahNumber: number
  className?: string
}

export function SurahCard({ surah, surahNumber, className }: SurahCardProps) {
  return (
    <Link
      to="/surah/$id"
      params={{ id: surahNumber.toString() }}
      className="group"
    >
      <Card
        className={cn(
          'h-full transition-all duration-300 hover:scale-[1.02]',
          'glass-card border-border/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/50',
          'cursor-pointer relative overflow-hidden group',
          className
        )}
      >
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none pattern-overlay group-hover:opacity-[0.07] transition-opacity" />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start gap-4">
            {/* Surah Number Badge */}
            <div className="flex-shrink-0">
              <div className="relative group-hover:animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    {surahNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Surah Info */}
            <div className="flex-1 space-y-2">
              {/* English and Arabic Names */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {surah.surahName}
                  </h3>
                  <span className="arabic-text text-2xl text-muted-foreground group-hover:text-primary/80 transition-colors leading-none">
                    {surah.surahNameArabic}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className={cn(
                    surah.revelationPlace === 'Mecca'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-teal-600 dark:text-teal-400'
                  )}>
                    {surah.revelationPlace}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{surah.totalAyah} Verses</span>
                </div>
              </div>

              {/* Translation Badge */}
              <Badge variant="secondary" className="text-xs font-normal">
                {surah.surahNameTranslation}
              </Badge>
            </div>
          </div>

          {/* Hover Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </CardContent>
      </Card>
    </Link>
  )
}
