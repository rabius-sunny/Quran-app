import { createFileRoute, Link } from '@tanstack/react-router'
import { useSurahsList } from '@/lib/api/queries'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, X, BookOpen, ExternalLink, MapPin } from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/search')({ 
  component: SearchPage 
})

function SearchPage() {
  const { data: surahs, isLoading } = useSurahsList()
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!surahs || !searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    
    return surahs
      .map((surah, index) => ({ surah, number: index + 1 }))
      .filter((item) => {
        return (
          item.surah.surahName.toLowerCase().includes(query) ||
          item.surah.surahNameArabic.includes(query) ||
          item.surah.surahNameTranslation.toLowerCase().includes(query) ||
          item.number.toString().includes(query) ||
          item.surah.revelationPlace.toLowerCase().includes(query)
        )
      })
      .slice(0, 20)
  }, [surahs, searchQuery])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 glass-card animate-fade-in-up">
        <div className="absolute inset-0 pattern-stars opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl -ml-36 -mt-36" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-teal-500/8 rounded-full blur-3xl -mr-28 -mb-28" />

        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Search Quran
          </h1>
          <p className="text-lg text-muted-foreground">
            Search for surahs by name, number, or translation
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Glow behind search */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/50 dark:text-emerald-400/50" />
          <Input
            type="text"
            placeholder="Type surah name, number, translation, or revelation place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-lg rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 focus:border-emerald-500/40 transition-all duration-300"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : !searchQuery.trim() ? (
        /* Empty search state */
        <Card className="ornate-card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <CardContent className="p-12 md:p-16 text-center space-y-6 relative">
            <div className="absolute inset-0 pattern-arabesque opacity-[0.03] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-full animate-breathe" />
                <div className="absolute inset-2 bg-gradient-to-br from-emerald-500/8 to-teal-500/8 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/10">
                  <Search className="w-8 h-8 text-emerald-500/50 dark:text-emerald-400/50" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Start searching</h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Type in the search box above to find surahs by name, number, translation, or revelation place
                </p>
              </div>

              <div className="gold-separator max-w-xs mx-auto" />

              {/* Quick search suggestions */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Popular searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { label: 'Al-Fatiha', query: 'Fatiha' },
                    { label: 'Yasin', query: 'Yasin' },
                    { label: 'Ar-Rahman', query: 'Rahman' },
                    { label: 'Al-Mulk', query: 'Mulk' },
                    { label: 'Meccan', query: 'Mecca' },
                    { label: 'Medinan', query: 'Madina' },
                  ].map((item) => (
                    <Badge
                      key={item.query}
                      variant="outline"
                      className="cursor-pointer py-1.5 px-3 rounded-xl bg-emerald-500/5 border-emerald-500/15 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:scale-105 transition-all duration-300"
                      onClick={() => setSearchQuery(item.query)}
                    >
                      {item.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : searchResults.length === 0 ? (
        /* No results */
        <Card className="glass-card animate-fade-in">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              We couldn't find any surahs matching "{searchQuery}". Try different keywords.
            </p>
            <Button
              variant="outline"
              className="rounded-xl mt-2"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Search results */
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground pl-1">
            Found <span className="font-semibold text-foreground">{searchResults.length}</span>{' '}
            {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </p>

          <div className="space-y-3">
            {searchResults.map((item, index) => (
              <Link 
                key={item.number} 
                to="/surah/$id" 
                params={{ id: item.number.toString() }}
                className="block"
              >
                <Card
                  className="glass-card hover:shadow-islamic-lg hover:border-emerald-500/30 transition-all duration-500 cursor-pointer group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/40 transition-all duration-500" />

                  <CardContent className="p-5 md:p-6 relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Number */}
                      <div className="surah-number-frame flex-shrink-0">
                        <span className="relative z-10 text-sm font-bold text-gradient-emerald">
                          {item.number}
                        </span>
                      </div>

                      {/* Surah Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.surah.surahName}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs rounded-lg',
                              item.surah.revelationPlace === 'Mecca'
                                ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-teal-500/5 border-teal-500/15 text-teal-600 dark:text-teal-400'
                            )}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.surah.revelationPlace}
                          </Badge>
                        </div>
                        <p className="arabic-text text-xl text-muted-foreground leading-normal !text-right">
                          {item.surah.surahNameArabic}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.surah.totalAyah} verses</span>
                          <span className="text-border">|</span>
                          <span className="truncate">{item.surah.surahNameTranslation}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ExternalLink className="w-5 h-5 text-muted-foreground/30 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-all duration-300 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
