// Theme store for light/dark mode
import { Store } from '@tanstack/store'
import { loadFromLocalStorage, saveToLocalStorage, debounce } from '../utils/localStorage'

export type Theme = 'light' | 'dark'

export interface ThemeState {
  theme: Theme
}

const STORAGE_KEY = 'quran-app-theme'

// Load initial state from localStorage
const initialState: ThemeState = {
  theme: loadFromLocalStorage<Theme>(STORAGE_KEY, 'light'),
}

// Create the store
export const themeStore = new Store<ThemeState>(initialState)

// Debounced save to localStorage
const debouncedSave = debounce((state: ThemeState) => {
  saveToLocalStorage(STORAGE_KEY, state.theme)
}, 500)

// Subscribe to changes and sync to localStorage
themeStore.subscribe(() => {
  const state = themeStore.state
  debouncedSave(state)
  
  // Apply theme to document
  if (typeof window !== 'undefined') {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

// Actions
export function toggleTheme() {
  themeStore.setState((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  }))
}

export function setTheme(theme: Theme) {
  themeStore.setState({ theme })
}

// Initialize theme on page load
if (typeof window !== 'undefined') {
  if (themeStore.state.theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
}
