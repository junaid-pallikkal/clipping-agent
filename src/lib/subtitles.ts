import type { WordCue, SubtitleStyleConfig } from '../types/index.ts';

export const SUBTITLE_PRESETS: Record<SubtitleStyleConfig['preset'], SubtitleStyleConfig> = {
  hormozi_bold: {
    preset: 'hormozi_bold',
    font_family: 'Impact, Inter, sans-serif',
    font_size: 34,
    font_color: '#FFFFFF',
    highlight_color: '#FACC15', // Vibrant yellow highlight
    stroke_color: '#000000',
    stroke_width: 5,
    position_y_percent: 74,
    words_per_batch: 2,
    uppercase: true,
    active_animation: 'bounce',
  },
  mrbeast_pop: {
    preset: 'mrbeast_pop',
    font_family: 'Inter, sans-serif',
    font_size: 36,
    font_color: '#FFFFFF',
    highlight_color: '#E54848', // Brand Red highlight
    stroke_color: '#000000',
    stroke_width: 6,
    position_y_percent: 70,
    words_per_batch: 3,
    uppercase: true,
    active_animation: 'zoom',
  },
  minimal_clean: {
    preset: 'minimal_clean',
    font_family: 'Inter, sans-serif',
    font_size: 26,
    font_color: '#FFFFFF',
    highlight_color: '#E54848',
    stroke_color: 'rgba(0,0,0,0.8)',
    stroke_width: 2,
    position_y_percent: 80,
    words_per_batch: 4,
    uppercase: false,
    active_animation: 'none',
  },
  cyber_glow: {
    preset: 'cyber_glow',
    font_family: 'JetBrains Mono, monospace',
    font_size: 30,
    font_color: '#38BDF8', // Cyan
    highlight_color: '#F43F5E', // Neon Pink
    stroke_color: '#0F172A',
    stroke_width: 4,
    position_y_percent: 75,
    words_per_batch: 2,
    uppercase: true,
    active_animation: 'glow',
  },
};

/**
 * Given word cues and current playback time, finds the active batch of words
 * and identifies the index of the currently spoken word.
 */
export function getActiveSubtitleBatch(
  words: WordCue[],
  currentTime: number,
  batchSize: number = 3
): {
  batchWords: WordCue[];
  activeWordIndex: number;
} | null {
  if (!words || words.length === 0) return null;

  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  // Out of bounds check
  if (currentTime < firstWord.start || currentTime > lastWord.end + 0.5) {
    return null;
  }

  // Find index of word matching currentTime
  let targetIdx = words.findIndex((w) => currentTime >= w.start && currentTime <= w.end);
  
  // If in between words within the sentence range
  if (targetIdx === -1) {
    targetIdx = words.findIndex((w, i) => {
      const nextWord = words[i + 1];
      return currentTime >= w.end && nextWord && currentTime < nextWord.start;
    });
  }

  if (targetIdx === -1) {
    return null;
  }

  // Calculate batch range
  const batchStart = Math.floor(targetIdx / batchSize) * batchSize;
  const batchWords = words.slice(batchStart, batchStart + batchSize);
  const activeWordIndex = targetIdx - batchStart;

  return { batchWords, activeWordIndex };
}
