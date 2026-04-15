import { LOCAL_WORDS } from '../constants/words';

export async function getSecretWord(
  category: string, 
  language: 'en' | 'es', 
  customCategories: Record<string, string[]> = {}
): Promise<string> {
  // Simulate a small delay to keep the "Generating..." feel
  await new Promise(resolve => setTimeout(resolve, 800));

  const langWords = LOCAL_WORDS[language];
  let wordList: string[] = [];

  if (customCategories[category]) {
    wordList = customCategories[category];
  } else if (category === 'All') {
    // Combine local words and custom categories for 'All'
    const allLocal = Object.values(langWords).flat();
    const allCustom = Object.values(customCategories).flat();
    wordList = [...allLocal, ...allCustom];
  } else {
    wordList = langWords[category] || langWords['Object'];
  }

  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}
