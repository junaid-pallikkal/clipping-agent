import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTimecode, formatPreciseTime, parsePreciseTime } from '../src/lib/timecode.ts';

test('formatTimecode accurately formats seconds without hours', () => {
  assert.equal(formatTimecode(0), '00:00');
  assert.equal(formatTimecode(45), '00:45');
  assert.equal(formatTimecode(65), '01:05');
  assert.equal(formatTimecode(725), '12:05');
});

test('formatTimecode includes hours when duration exceeds 1 hour or flag is passed', () => {
  assert.equal(formatTimecode(3661), '01:01:01');
  assert.equal(formatTimecode(45, true), '00:00:45');
});

test('formatTimecode handles edge cases like negative or NaN', () => {
  assert.equal(formatTimecode(-10), '00:00');
  assert.equal(formatTimecode(NaN), '00:00');
});

test('formatPreciseTime maintains 2 decimal places precision', () => {
  assert.equal(formatPreciseTime(12.345), '00:12.35');
  assert.equal(formatPreciseTime(75.5), '01:15.50');
});

test('parsePreciseTime correctly converts formatted string back to seconds', () => {
  assert.equal(parsePreciseTime('01:15.50'), 75.50);
  assert.equal(parsePreciseTime('01:00:00'), 3600);
});
