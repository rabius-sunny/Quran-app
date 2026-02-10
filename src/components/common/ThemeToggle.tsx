// Theme toggle component with Islamic styling
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative h-10 w-10 rounded-xl overflow-hidden',
        'bg-gradient-to-br from-emerald-500/5 to-teal-500/5',
        'border border-emerald-500/10 hover:border-emerald-500/30',
        'hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-teal-500/10',
        'transition-all duration-500 group'
      )}
      aria-label="Toggle theme"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-emerald-400/10 dark:from-indigo-400/10 dark:via-transparent dark:to-emerald-400/10" />
      </div>

      {/* Sun icon - light mode */}
      <Sun className={cn(
        'h-5 w-5 transition-all duration-500 absolute',
        'text-amber-500 dark:text-amber-400',
        'rotate-0 scale-100 dark:-rotate-90 dark:scale-0',
        'drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]'
      )} />

      {/* Moon icon - dark mode */}
      <Moon className={cn(
        'h-5 w-5 transition-all duration-500 absolute',
        'text-indigo-300',
        'rotate-90 scale-0 dark:rotate-0 dark:scale-100',
        'dark:drop-shadow-[0_0_6px_rgba(165,180,252,0.4)]'
      )} />

      {/* Tiny decorative stars that appear in dark mode */}
      <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-indigo-300/0 dark:bg-indigo-300/60 transition-all duration-700 dark:animate-pulse" />
      <div className="absolute bottom-2 left-1.5 w-0.5 h-0.5 rounded-full bg-indigo-300/0 dark:bg-indigo-300/40 transition-all duration-700 delay-150 dark:animate-pulse" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
