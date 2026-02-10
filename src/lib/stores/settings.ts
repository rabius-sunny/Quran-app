// Settings store for user preferences
import { Store } from '@tanstack/store'
import { loadFromLocalStorage, saveToLocalStorage, debounce } from '../utils/localStorage'
import type { Language } from '../api/types'

export type FontSize = 'small' | 'medium' | 'large'
export type ArabicFont = 'amiri' | 'scheherazade' | 'uthmanic'

export interface SettingsState {
  preferredLanguage: Language
  arabicFont: ArabicFont
  fontSize: FontSize
  showTransliteration: boolean
  autoPlayNext: boolean
}

const STORAGE_KEY = 'quran-app-settings'

// Load initial state from localStorage
const initialState: SettingsState = {
  preferredLanguage: 'english',
  arabicFont: 'amiri',
  fontSize: 'medium',
  showTransliteration: true,
  autoPlayNext: true,
  ...loadFromLocalStorage<Partial<SettingsState>>(STORAGE_KEY, {}),
}

// Create the store
export const settingsStore = new Store<SettingsState>(initialState)

// Debounced save to localStorage
const debouncedSave = debounce((state: SettingsState) => {
  saveToLocalStorage(STORAGE_KEY, state)
}, 500)

// Subscribe to changes and sync to localStorage
settingsStore.subscribe(() => {
  debouncedSave(settingsStore.state)
})

// Actions
export function setPreferredLanguage(language: Language) {
  settingsStore.setState((state) => ({
    ...state,
    preferredLanguage: language,
  }))
}

export function setArabicFont(font: ArabicFont) {
  settingsStore.setState((state) => ({
    ...state,
    arabicFont: font,
  }))
}

export function setFontSize(size: FontSize) {
  settingsStore.setState((state) => ({
    ...state,
    fontSize: size,
  }))
}

export function toggleTransliteration() {
  settingsStore.setState((state) => ({
    ...state,
    showTransliteration: !state.showTransliteration,
  }))
}

export function setSettingsAutoPlayNext(autoPlay: boolean) {
  settingsStore.setState((state) => ({
    ...state,
    autoPlayNext: autoPlay,
  }))
}
