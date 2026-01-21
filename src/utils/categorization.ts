import { CategoryName } from './types.ts';
import { foodWordList, whimWordList } from './categoryRules.ts';

export const categorize = (productName: string | null): CategoryName => {
  if (!productName) return 'other';
  const normalized: string = productName.toLowerCase().replace(/  +/g, ' ');
  const tokenized: string[] = normalized.split(' ');

  const foodScore: number = getScore(tokenized, foodWordList);
  const whimScore: number = getScore(tokenized, whimWordList);

  const tolerance: number = 0.3;

  const greatestScore: number = foodScore > whimScore ? foodScore : whimScore;

  if (greatestScore <= tolerance) return 'other';

  return foodScore > whimScore ? 'food' : 'whims';
};

const getScore = (tokenized: string[], ruleWordList: string[]): number => {
  const wordCount: number = tokenized.length;
  let coincidences: number = 0;

  for (const string of tokenized) {
    if (ruleWordList.includes(string)) coincidences += 1;
  }
  return coincidences / wordCount;
};
