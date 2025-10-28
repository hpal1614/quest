// Fuzzy Answer Matching - Exact implementation from technical-architecture.md

import Fuse from 'fuse.js';

export function matchAnswer(
  userAnswer: string,
  correctAnswer: string,
  alternatives: string[] = []
): boolean {
  // Normalize strings
  const normalize = (str: string) => 
    str.toLowerCase().trim().replace(/[^\w\s]/g, '');
  
  const normalizedUser = normalize(userAnswer);
  const allAnswers = [correctAnswer, ...alternatives].map(normalize);
  
  // Exact match
  if (allAnswers.includes(normalizedUser)) return true;
  
  // Fuzzy match (typo tolerance)
  const fuse = new Fuse(allAnswers, {
    threshold: 0.3, // 70% similarity required
    includeScore: true,
    ignoreLocation: true,
    findAllMatches: true
  });
  
  const results = fuse.search(normalizedUser);
  return results.length > 0 && results[0].score !== undefined && results[0].score < 0.3;
}

/**
 * Get similarity score (0-1, where 0 is exact match)
 */
export function getSimilarityScore(userAnswer: string, correctAnswer: string): number {
  const normalize = (str: string) => 
    str.toLowerCase().trim().replace(/[^\w\s]/g, '');
  
  const fuse = new Fuse([normalize(correctAnswer)], {
    includeScore: true,
    ignoreLocation: true
  });
  
  const results = fuse.search(normalize(userAnswer));
  return results.length > 0 && results[0].score !== undefined ? results[0].score : 1;
}


