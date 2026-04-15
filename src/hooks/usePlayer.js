import { useEffect, useRef, useState, useCallback } from "react";
import { tracks } from "../data/data";

export const usePlayer = (initialIndex = 0) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  const shouldAutoPlayRef = useRef(false);
  const playTimeoutRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Переключение между треками
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[currentIndex].track;
    audio.onended = () => {
      if (isPlayingRef.current) {
        const nextIndex = (currentIndexRef.current + 1) % tracks.length;
        shouldAutoPlayRef.current = true;
        setCurrentIndex(nextIndex);
      }
    };

    if (isPlayingRef.current) {
      playTimeoutRef.current = setTimeout(() => {
        audio.play().catch(() => {});
      }, 50);
    } else {
      audio.pause();
    }

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, [currentIndex]);

  // Управление воспроизведением
  useEffect(() => {
    const audio = audioRef.current;

    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }

    if (isPlaying) {
      playTimeoutRef.current = setTimeout(() => {
        audio.play().catch(() => {});
      }, 50);
    } else {
      audio.pause();
    }

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const handleTrackChange = useCallback((newIndex) => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setCurrentIndex(newIndex);
    shouldAutoPlayRef.current = false;
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    currentIndex,
    isPlaying,
    togglePlay,
    handleTrackChange,
    currentTrack: tracks[currentIndex],
  };
};
