// TanStack Query hooks for QuranAPI
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  fetchSurahsList,
  fetchSurah,
  fetchVerseTafsir,
  fetchSurahTafsir,
  fetchReciters,
} from './quran'
import type { SurahInfo, SurahDetail, VerseTafsir, SurahTafsir, Reciters } from './types'

// Query keys
export const quranKeys = {
  all: ['quran'] as const,
  surahs: () => [...quranKeys.all, 'surahs'] as const,
  surah: (id: number) => [...quranKeys.all, 'surah', id] as const,
  tafsir: () => [...quranKeys.all, 'tafsir'] as const,
  verseTafsir: (surahNo: number, ayahNo: number) =>
    [...quranKeys.tafsir(), 'verse', surahNo, ayahNo] as const,
  surahTafsir: (surahNo: number) => [...quranKeys.tafsir(), 'surah', surahNo] as const,
  reciters: () => [...quranKeys.all, 'reciters'] as const,
}

// Hook to fetch all surahs list
export function useSurahsList(): UseQueryResult<SurahInfo[], Error> {
  return useQuery({
    queryKey: quranKeys.surahs(),
    queryFn: fetchSurahsList,
    staleTime: Infinity, // Surah list never changes
    gcTime: Infinity, // Keep in cache forever (formerly cacheTime)
  })
}

// Hook to fetch a specific surah
export function useSurah(surahNo: number): UseQueryResult<SurahDetail, Error> {
  return useQuery({
    queryKey: quranKeys.surah(surahNo),
    queryFn: () => fetchSurah(surahNo),
    enabled: surahNo >= 1 && surahNo <= 114,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

// Hook to fetch verse tafsir
export function useVerseTafsir(
  surahNo: number,
  ayahNo: number,
  enabled: boolean = true
): UseQueryResult<VerseTafsir, Error> {
  return useQuery({
    queryKey: quranKeys.verseTafsir(surahNo, ayahNo),
    queryFn: () => fetchVerseTafsir(surahNo, ayahNo),
    enabled: enabled && surahNo >= 1 && surahNo <= 114 && ayahNo >= 1,
    staleTime: Infinity, // Tafsir never changes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

// Hook to fetch surah tafsir
export function useSurahTafsir(
  surahNo: number,
  enabled: boolean = true
): UseQueryResult<SurahTafsir, Error> {
  return useQuery({
    queryKey: quranKeys.surahTafsir(surahNo),
    queryFn: () => fetchSurahTafsir(surahNo),
    enabled: enabled && surahNo >= 1 && surahNo <= 114,
    staleTime: Infinity, // Tafsir never changes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

// Hook to fetch reciters
export function useReciters(): UseQueryResult<Reciters, Error> {
  return useQuery({
    queryKey: quranKeys.reciters(),
    queryFn: fetchReciters,
    staleTime: Infinity, // Reciters list never changes
    gcTime: Infinity,
  })
}
