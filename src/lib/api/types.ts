// TypeScript types for QuranAPI (quranapi.pages.dev)

// Surah List Types
export interface SurahInfo {
  surahName: string
  surahNameArabic: string
  surahNameArabicLong: string
  surahNameTranslation: string
  revelationPlace: 'Mecca' | 'Madina'
  totalAyah: number
}

// Full Surah Types
export interface AudioRecitation {
  reciter: string
  url: string
  originalUrl: string
}

export interface SurahDetail {
  surahName: string
  surahNameArabic: string
  surahNameArabicLong: string
  surahNameTranslation: string
  revelationPlace: 'Mecca' | 'Madina'
  totalAyah: number
  surahNo: number
  audio: Record<string, AudioRecitation> // "1", "2", etc. as keys
  english: string[]
  arabic1: string[] // With diacritics
  arabic2: string[] // Simplified
  bengali: string[]
  urdu: string[]
}

// Tafsir Types
export interface Tafsir {
  author: 'Ibn Kathir' | 'Maarif Ul Quran' | 'Tazkirul Quran'
  groupVerse: string | null
  content: string // Markdown format
}

export interface VerseTafsir {
  surahName: string
  surahNo: number
  ayahNo: number
  tafsirs: Tafsir[]
}

export interface SurahTafsir {
  surahName: string
  totalVerse: number
  tafsirs: Tafsir[][] // Array of arrays, one for each verse
}

// Reciters Types
export interface Reciters {
  [key: string]: string // "1": "Mishary Rashid Al Afasy", etc.
}

// Helper types
export type Language = 'english' | 'bengali' | 'urdu'
export type TranslationKey = 'english' | 'bengali' | 'urdu'

export interface Verse {
  ayahNo: number
  arabic: string
  arabicSimplified: string
  english: string
  bengali: string
  urdu: string
}

// Convert SurahDetail to Verse array helper
export function surahDetailToVerses(surah: SurahDetail): Verse[] {
  return surah.english.map((_, index) => ({
    ayahNo: index + 1,
    arabic: surah.arabic1[index],
    arabicSimplified: surah.arabic2[index],
    english: surah.english[index],
    bengali: surah.bengali[index],
    urdu: surah.urdu[index],
  }))
}
