// Reading progress store
import { Store } from '@tanstack/store'
import { loadFromLocalStorage, saveToLocalStorage, debounce } from '../utils/localStorage'

export interface LastRead {
  surahNo: number
  ayahNo: number
  surahName: string
  timestamp: number
}

export interface ProgressState {
  readVerses: Set<string> // Format: "surahNo:ayahNo"
  lastRead: LastRead | null
  streakDays: number
  lastReadDate: string | null // ISO date string (YYYY-MM-DD)
}

const STORAGE_KEY = 'quran-app-progress'

// Helper to convert stored data to Set
function deserializeProgress(data: any): ProgressState {
  return {
    readVerses: new Set(data.readVerses || []),
    lastRead: data.lastRead || null,
    streakDays: data.streakDays || 0,
    lastReadDate: data.lastReadDate || null,
  }
}

// Helper to convert Set to array for storage
function serializeProgress(state: ProgressState): any {
  return {
    readVerses: Array.from(state.readVerses),
    lastRead: state.lastRead,
    streakDays: state.streakDays,
    lastReadDate: state.lastReadDate,
  }
}

// Load initial state from localStorage
const storedData = loadFromLocalStorage<any>(STORAGE_KEY, {})
const initialState: ProgressState = deserializeProgress(storedData)

// Create the store
export const progressStore = new Store<ProgressState>(initialState)

// Debounced save to localStorage
const debouncedSave = debounce((state: ProgressState) => {
  saveToLocalStorage(STORAGE_KEY, serializeProgress(state))
}, 500)

// Subscribe to changes and sync to localStorage
progressStore.subscribe(() => {
  debouncedSave(progressStore.state)
})

// Helper to get today's date as ISO string
function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

// Helper to calculate day difference
function getDayDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Actions
export function markVerseAsRead(surahNo: number, ayahNo: number, surahName: string) {
  progressStore.setState((state) => {
    const verseKey = `${surahNo}:${ayahNo}`
    const newReadVerses = new Set(state.readVerses)
    newReadVerses.add(verseKey)

    const today = getTodayISO()
    let newStreakDays = state.streakDays

    // Update streak
    if (state.lastReadDate) {
      const dayDiff = getDayDifference(state.lastReadDate, today)
      if (dayDiff === 0) {
        // Same day, keep streak
        newStreakDays = state.streakDays
      } else if (dayDiff === 1) {
        // Consecutive day, increment streak
        newStreakDays = state.streakDays + 1
      } else {
        // Streak broken, restart
        newStreakDays = 1
      }
    } else {
      // First read
      newStreakDays = 1
    }

    return {
      readVerses: newReadVerses,
      lastRead: {
        surahNo,
        ayahNo,
        surahName,
        timestamp: Date.now(),
      },
      streakDays: newStreakDays,
      lastReadDate: today,
    }
  })
}

export function isVerseRead(surahNo: number, ayahNo: number): boolean {
  const verseKey = `${surahNo}:${ayahNo}`
  return progressStore.state.readVerses.has(verseKey)
}

export function getReadCount(): number {
  return progressStore.state.readVerses.size
}

export function clearProgress() {
  progressStore.setState({
    readVerses: new Set<string>(),
    lastRead: null,
    streakDays: 0,
    lastReadDate: null,
  })
}
