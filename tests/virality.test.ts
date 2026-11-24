import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHookScore, computeCompositeVirality } from '../src/lib/virality.ts';

test('calculateHookScore rewards high-impact power words', () => {
  const genericHook = calculateHookScore('This is a video about tech.', 4.0);
  const powerHook = calculateHookScore('The secret truth why founders fail in 2026 revealed!', 2.8);

  assert.ok(powerHook > genericHook, 'Power hook should score significantly higher than generic');
  assert.ok(powerHook >= 90, 'Power hook with optimal pacing under 3s should achieve 90+');
});

test('calculateHookScore penalizes long meandering opening clauses', () => {
  const shortHook = calculateHookScore('Stop making this mistake!', 2.2);
  const slowHook = calculateHookScore('Stop making this mistake!', 6.5);

  assert.ok(shortHook > slowHook, 'Pacing under 3.5s should outperform slow hooks');
});

test('computeCompositeVirality scores optimal short-form pacing between 140-180 WPM', () => {
  const optimalPacing = computeCompositeVirality(90, 160, 4);
  const slowPacing = computeCompositeVirality(90, 100, 4);

  assert.equal(optimalPacing.breakdown.pacing_score, 95);
  assert.equal(slowPacing.breakdown.pacing_score, 55);
  assert.ok(optimalPacing.score > slowPacing.score);
});
