import type { ViralityBreakdown } from '../types/index.ts';

/**
 * Virality scoring heuristics based on speech pacing, sentiment shifts,
 * and high-impact opening hook triggers.
 */

const HIGH_ENGAGEMENT_WORDS = [
  'secret', 'revealed', 'never', 'always', 'mistake', 'shocking', 'truth',
  'million', 'money', 'crazy', 'insane', 'stop', 'hack', 'genius', 'why',
  'how', 'proven', 'fail', 'rule', 'future', 'ai', 'rich', 'danger'
];

export function calculateHookScore(firstSentence: string, durationFirstClause: number): number {
  if (!firstSentence) return 50;
  
  let score = 65;
  const lower = firstSentence.toLowerCase();

  // Keyword impact bonus
  for (const word of HIGH_ENGAGEMENT_WORDS) {
    if (lower.includes(word)) {
      score += 6;
    }
  }

  // Pacing of hook (under 3.5 seconds is ideal for mobile viewers)
  if (durationFirstClause > 0 && durationFirstClause <= 3.5) {
    score += 15;
  } else if (durationFirstClause > 5.0) {
    score -= 10;
  }

  // Question or commanding imperative
  if (firstSentence.includes('?') || firstSentence.includes('!')) {
    score += 8;
  }

  return Math.min(99, Math.max(30, Math.round(score)));
}

export function computeCompositeVirality(
  hookScore: number,
  wordsPerMinute: number,
  sentimentPeakCount: number
): { score: number; breakdown: ViralityBreakdown } {
  // Optimal short-form speech pacing: 140 - 180 WPM
  let pacingScore = 70;
  if (wordsPerMinute >= 140 && wordsPerMinute <= 180) {
    pacingScore = 95;
  } else if (wordsPerMinute > 180 && wordsPerMinute <= 210) {
    pacingScore = 85;
  } else if (wordsPerMinute < 120) {
    pacingScore = 55;
  }

  const emotionalPeak = Math.min(96, Math.max(40, 60 + sentimentPeakCount * 8));
  const retentionScore = Math.round((hookScore * 0.4) + (pacingScore * 0.35) + (emotionalPeak * 0.25));

  const composite = Math.round(
    hookScore * 0.40 +
    pacingScore * 0.25 +
    emotionalPeak * 0.20 +
    retentionScore * 0.15
  );

  return {
    score: Math.min(99, Math.max(40, composite)),
    breakdown: {
      hook_score: hookScore,
      pacing_score: pacingScore,
      emotional_peak: emotionalPeak,
      retention_score: retentionScore,
    },
  };
}
