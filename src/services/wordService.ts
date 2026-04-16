import { WORD_PAIRS } from '../constants/words';

export async function getSecretWord(
  category: string, 
  language: 'en' | 'es', 
  customCategories: Record<string, string[]> = {}
): Promise<string | { en: string; es: string }> {
  // Simulate a small delay to keep the "Starting..." feel
  await new Promise(resolve => setTimeout(resolve, 800));

  let wordList: Array<string | { en: string; es: string }> = [];

  if (customCategories[category]) {
    wordList = customCategories[category];
  } else if (category === 'All') {
    // Combine all pairs
    const allPairs = Object.values(WORD_PAIRS).flat();
    const allCustom = Object.entries(customCategories).flatMap(([cat, words]) => words);
    wordList = [...allPairs, ...allCustom];
  } else {
    wordList = WORD_PAIRS[category] || WORD_PAIRS['Object'];
  }

  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}
