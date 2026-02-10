// Audio player store
import { Store } from '@tanstack/store';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  debounce
} from '../utils/localStorage';

export type RepeatMode = 'none' | 'verse' | 'surah';

export interface AudioState {
  isPlaying: boolean;
  currentVerse: {
    surahNo: number;
    ayahNo: number;
  } | null;
  totalAyahs: number; // Total ayahs of the current surah (needed for auto-advance)
  reciterId: string; // "1", "2", etc.
  playbackSpeed: number;
  repeatMode: RepeatMode;
  volume: number; // 0-1
  autoPlayNext: boolean;
}

const STORAGE_KEY = 'quran-app-audio';

// Load initial state from localStorage
const initialState: AudioState = {
  ...{
    isPlaying: false,
    currentVerse: null,
    totalAyahs: 0,
    reciterId: '1', // Default: Mishary Rashid Al Afasy
    playbackSpeed: 1.0,
    repeatMode: 'none',
    volume: 1.0,
    autoPlayNext: true
  },
  ...loadFromLocalStorage<Partial<AudioState>>(STORAGE_KEY, {}),
  // Always start with not playing
  isPlaying: false
};

// Create the store
export const audioStore = new Store<AudioState>(initialState);

// Debounced save to localStorage (don't save isPlaying, currentVerse, and totalAyahs)
const debouncedSave = debounce((state: AudioState) => {
  const { isPlaying, currentVerse, totalAyahs, ...persistedState } = state;
  saveToLocalStorage(STORAGE_KEY, persistedState);
}, 500);

// Subscribe to changes and sync to localStorage
audioStore.subscribe(() => {
  debouncedSave(audioStore.state);
});

// Actions
export function play(surahNo: number, ayahNo: number, totalAyahs?: number) {
  audioStore.setState((state) => ({
    ...state,
    isPlaying: true,
    currentVerse: { surahNo, ayahNo },
    totalAyahs: totalAyahs ?? state.totalAyahs
  }));
}

export function pause() {
  audioStore.setState((state) => ({
    ...state,
    isPlaying: false
  }));
}

export function togglePlay() {
  audioStore.setState((state) => ({
    ...state,
    isPlaying: !state.isPlaying
  }));
}

export function stop() {
  audioStore.setState((state) => ({
    ...state,
    isPlaying: false,
    currentVerse: null
  }));
}

export function setReciter(reciterId: string) {
  audioStore.setState((state) => ({
    ...state,
    reciterId
  }));
}

export function setPlaybackSpeed(speed: number) {
  audioStore.setState((state) => ({
    ...state,
    playbackSpeed: Math.max(0.25, Math.min(2.0, speed))
  }));
}

export function setRepeatMode(mode: RepeatMode) {
  audioStore.setState((state) => ({
    ...state,
    repeatMode: mode
  }));
}

export function setVolume(volume: number) {
  audioStore.setState((state) => ({
    ...state,
    volume: Math.max(0, Math.min(1, volume))
  }));
}

export function setAudioAutoPlayNext(autoPlay: boolean) {
  audioStore.setState((state) => ({
    ...state,
    autoPlayNext: autoPlay
  }));
}

export function nextVerse(totalAyahs: number) {
  audioStore.setState((state) => {
    if (!state.currentVerse) return state;

    const { surahNo, ayahNo } = state.currentVerse;

    // If repeat verse mode, stay on same verse
    if (state.repeatMode === 'verse') {
      return state;
    }

    // Move to next verse if not at end
    if (ayahNo < totalAyahs) {
      return {
        ...state,
        currentVerse: { surahNo, ayahNo: ayahNo + 1 }
      };
    }

    // If repeat surah mode, go back to verse 1
    if (state.repeatMode === 'surah') {
      return {
        ...state,
        currentVerse: { surahNo, ayahNo: 1 }
      };
    }

    // Otherwise stop at end of surah
    return {
      ...state,
      isPlaying: false,
      currentVerse: null
    };
  });
}

export function previousVerse() {
  audioStore.setState((state) => {
    if (!state.currentVerse) return state;

    const { surahNo, ayahNo } = state.currentVerse;

    if (ayahNo > 1) {
      return {
        ...state,
        currentVerse: { surahNo, ayahNo: ayahNo - 1 }
      };
    }

    return state;
  });
}
