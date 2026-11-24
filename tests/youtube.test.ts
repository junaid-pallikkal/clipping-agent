import test from 'node:test';
import assert from 'node:assert';
import { extractYouTubeId, isYouTubeUrl, getYouTubeThumbnail } from '../src/lib/youtube.ts';

test('extractYouTubeId extracts standard watch?v= query parameter', () => {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  assert.strictEqual(extractYouTubeId(url), 'dQw4w9WgXcQ');
});

test('extractYouTubeId extracts youtu.be shortlinks', () => {
  const url = 'https://youtu.be/dQw4w9WgXcQ';
  assert.strictEqual(extractYouTubeId(url), 'dQw4w9WgXcQ');
});

test('extractYouTubeId extracts YouTube Shorts links', () => {
  const url = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
  assert.strictEqual(extractYouTubeId(url), 'dQw4w9WgXcQ');
});

test('extractYouTubeId returns null for invalid or empty inputs', () => {
  assert.strictEqual(extractYouTubeId(''), null);
  assert.strictEqual(extractYouTubeId('https://vimeo.com/12345'), null);
});

test('isYouTubeUrl accurately identifies YouTube URLs', () => {
  assert.strictEqual(isYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), true);
  assert.strictEqual(isYouTubeUrl('https://google.com'), false);
});

test('getYouTubeThumbnail constructs correct high-quality thumbnail URL', () => {
  assert.strictEqual(
    getYouTubeThumbnail('dQw4w9WgXcQ'),
    'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
  );
});
