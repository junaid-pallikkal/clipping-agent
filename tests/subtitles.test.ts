import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveSubtitleBatch, SUBTITLE_PRESETS } from '../src/lib/subtitles.ts';
import type { WordCue } from '../src/types/index.ts';

const SAMPLE_WORDS: WordCue[] = [
  { word: 'One', start: 0.0, end: 0.5 },
  { word: 'video', start: 0.51, end: 1.0 },
  { word: 'multiple', start: 1.01, end: 1.5 },
  { word: 'clips', start: 1.51, end: 2.0 },
  { word: 'multiple', start: 2.01, end: 2.5 },
  { word: 'accounts', start: 2.51, end: 3.0 },
];

test('getActiveSubtitleBatch selects correct batch and active word index', () => {
  // At 0.25s, active word is 'One' (index 0) in batch of 2
  const result1 = getActiveSubtitleBatch(SAMPLE_WORDS, 0.25, 2);
  assert.ok(result1 !== null);
  assert.equal(result1.batchWords.length, 2);
  assert.equal(result1.batchWords[0].word, 'One');
  assert.equal(result1.activeWordIndex, 0);

  // At 0.75s, active word is 'video' (index 1) in batch of 2
  const result2 = getActiveSubtitleBatch(SAMPLE_WORDS, 0.75, 2);
  assert.ok(result2 !== null);
  assert.equal(result2.activeWordIndex, 1);

  // At 1.25s, active word is 'multiple' (batch 2 starts, activeWordIndex is 0)
  const result3 = getActiveSubtitleBatch(SAMPLE_WORDS, 1.25, 2);
  assert.ok(result3 !== null);
  assert.equal(result3.batchWords[0].word, 'multiple');
  assert.equal(result3.activeWordIndex, 0);
});

test('getActiveSubtitleBatch returns null when currentTime is out of bounds', () => {
  const beforeStart = getActiveSubtitleBatch(SAMPLE_WORDS, -1.0, 2);
  assert.equal(beforeStart, null);

  const wayAfterEnd = getActiveSubtitleBatch(SAMPLE_WORDS, 10.0, 2);
  assert.equal(wayAfterEnd, null);
});

test('SUBTITLE_PRESETS contains valid configuration contracts', () => {
  assert.ok(SUBTITLE_PRESETS.hormozi_bold !== undefined);
  assert.ok(SUBTITLE_PRESETS.mrbeast_pop !== undefined);
  assert.ok(SUBTITLE_PRESETS.minimal_clean !== undefined);
  assert.ok(SUBTITLE_PRESETS.cyber_glow !== undefined);

  assert.equal(SUBTITLE_PRESETS.mrbeast_pop.highlight_color, '#E54848');
  assert.equal(SUBTITLE_PRESETS.hormozi_bold.highlight_color, '#FACC15');
});
