// Bookmarks store
import { Store } from '@tanstack/store'
import { loadFromLocalStorage, saveToLocalStorage, debounce } from '../utils/localStorage'

export interface Bookmark {
  verseKey: string // Format: "surahNo:ayahNo"
  surahNo: number
  ayahNo: number
  timestamp: number
  surahName?: string
  arabicText?: string
}

export interface BookmarksState {
  bookmarks: Bookmark[]
}

const STORAGE_KEY = 'quran-app-bookmarks'

// Load initial state from localStorage
const initialState: BookmarksState = {
  bookmarks: loadFromLocalStorage<Bookmark[]>(STORAGE_KEY, []),
}

// Create the store
export const bookmarksStore = new Store<BookmarksState>(initialState)

// Debounced save to localStorage
const debouncedSave = debounce((state: BookmarksState) => {
  saveToLocalStorage(STORAGE_KEY, state.bookmarks)
}, 500)

// Subscribe to changes and sync to localStorage
bookmarksStore.subscribe(() => {
  debouncedSave(bookmarksStore.state)
})

// Actions
export function addBookmark(bookmark: Omit<Bookmark, 'timestamp'>) {
  bookmarksStore.setState((state) => {
    // Check if bookmark already exists
    const exists = state.bookmarks.some((b) => b.verseKey === bookmark.verseKey)
    
    if (exists) return state

    return {
      bookmarks: [
        ...state.bookmarks,
        { ...bookmark, timestamp: Date.now() },
      ],
    }
  })
}

export function removeBookmark(verseKey: string) {
  bookmarksStore.setState((state) => ({
    bookmarks: state.bookmarks.filter((b) => b.verseKey !== verseKey),
  }))
}

export function toggleBookmark(bookmark: Omit<Bookmark, 'timestamp'>) {
  const exists = bookmarksStore.state.bookmarks.some((b) => b.verseKey === bookmark.verseKey)
  
  if (exists) {
    removeBookmark(bookmark.verseKey)
  } else {
    addBookmark(bookmark)
  }
}

export function isBookmarked(verseKey: string): boolean {
  return bookmarksStore.state.bookmarks.some((b) => b.verseKey === verseKey)
}

export function clearBookmarks() {
  bookmarksStore.setState({ bookmarks: [] })
}

