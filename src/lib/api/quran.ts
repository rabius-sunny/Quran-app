// API client for QuranAPI (quranapi.pages.dev)
import type { SurahInfo, SurahDetail, VerseTafsir, SurahTafsir, Reciters } from './types'

const API_BASE_URL = 'https://quranapi.pages.dev/api'

// Fetch all surahs list
export async function fetchSurahsList(): Promise<SurahInfo[]> {
  const response = await fetch(`${API_BASE_URL}/surah.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch surahs list')
  }
  return response.json()
}

// Fetch a specific surah with all verses
export async function fetchSurah(surahNo: number): Promise<SurahDetail> {
  if (surahNo < 1 || surahNo > 114) {
    throw new Error('Invalid surah number. Must be between 1 and 114')
  }
  const response = await fetch(`${API_BASE_URL}/${surahNo}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch surah ${surahNo}`)
  }
  return response.json()
}

// Fetch tafsir for a specific verse
export async function fetchVerseTafsir(
  surahNo: number,
  ayahNo: number
): Promise<VerseTafsir> {
  const response = await fetch(`${API_BASE_URL}/tafsir/${surahNo}_${ayahNo}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch tafsir for ${surahNo}:${ayahNo}`)
  }
  return response.json()
}

// Fetch tafsir for entire surah
export async function fetchSurahTafsir(surahNo: number): Promise<SurahTafsir> {
  const response = await fetch(`${API_BASE_URL}/tafsir/${surahNo}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch tafsir for surah ${surahNo}`)
  }
  return response.json()
}

// Fetch available reciters
export async function fetchReciters(): Promise<Reciters> {
  const response = await fetch(`${API_BASE_URL}/reciters.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch reciters')
  }
  return response.json()
}

// Get audio URL for a specific verse and reciter
export function getVerseAudioUrl(
  surahNo: number,
  ayahNo: number,
  _reciterId: string = '1'
): string {
  // Note: This is a constructed URL. The API provides audio per surah, not per verse.
  // For verse-by-verse, we'll need to use the chapter audio and track timing
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNo}/${ayahNo}.mp3`
}
