import { useEffect, useRef } from 'react';
import { useStore } from '@tanstack/react-store';
import { audioStore, stop, nextVerse } from '@/lib/stores/audio';
import { toast } from 'sonner';

export function GlobalAudioPlayer() {
  const { isPlaying, currentVerse, volume, playbackSpeed, reciterId } =
    useStore(audioStore);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio object
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      // Handle when audio ends — advance to the next verse
      audioRef.current.addEventListener('ended', () => {
        const state = audioStore.state;
        if (state.autoPlayNext && state.totalAyahs > 0) {
          nextVerse(state.totalAyahs);
        } else {
          stop();
        }
      });

      audioRef.current.addEventListener('error', () => {
        toast.error('Failed to play audio');
        stop();
      });
    }
  }, []);

  // Handle Playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentVerse && isPlaying) {
      const { surahNo, ayahNo } = currentVerse;
      const padSurah = surahNo.toString().padStart(3, '0');
      const padAyah = ayahNo.toString().padStart(3, '0');

      // Default to Mishary (Alafasy) for now, can map reciterId later
      const url = `https://everyayah.com/data/Alafasy_128kbps/${padSurah}${padAyah}.mp3`;

      // Only change source if it's different to prevent reloading
      // We check if the current src ends with the expected filename
      const expectedFile = `${padSurah}${padAyah}.mp3`;
      if (!audio.src.endsWith(expectedFile)) {
        audio.src = url;
        audio.load();
      }

      audio.playbackRate = playbackSpeed;
      audio.volume = volume;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Audio play error:', error);
          // Don't show toast for AbortError (happens when skipping fast)
          if (error.name !== 'AbortError') {
            toast.error('Could not play audio');
            stop();
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [currentVerse, isPlaying, reciterId]);

  // Handle Volume & Speed changes on the fly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed]);

  return null; // This is a logic-only component
}
