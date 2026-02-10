// Bookmarks store
import { Store } from '@tanstack/store'
import { loadFromLocalStorage, saveToLocalStorage, debounce } from '../utils/localStorage'

export interface Bookmark {
  surahNo: number
  ayahNo: number
  timestamp: number
  surahName?: string
  verseText?: string
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
    const exists = state.bookmarks.some(
      (b) => b.surahNo === bookmark.surahNo && b.ayahNo === bookmark.ayahNo
    )
    
    if (exists) return state

    return {
      bookmarks: [
        ...state.bookmarks,
        { ...bookmark, timestamp: Date.now() },
      ],
    }
  })
}

export function removeBookmark(surahNo: number, ayahNo: number) {
  bookmarksStore.setState((state) => ({
    bookmarks: state.bookmarks.filter(
      (b) => !(b.surahNo === surahNo && b.ayahNo === ayahNo)
    ),
  }))
}

export function isBookmarked(surahNo: number, ayahNo: number): boolean {
  return bookmarksStore.state.bookmarks.some(
    (b) => b.surahNo === surahNo && b.ayahNo === ayahNo
  )
}

export function clearBookmarks() {
  bookmarksStore.setState({ bookmarks: [] })
}
