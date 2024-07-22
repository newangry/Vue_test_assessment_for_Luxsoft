import nspell from 'nspell';

async function fetchDictionaryFile(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}

export async function createSpellChecker() {
  const affFile = await fetchDictionaryFile('/dictionaries/index.aff');
  const dicFile = await fetchDictionaryFile('/dictionaries/index.dic');
  return nspell(affFile, dicFile);
}

export async function correctSpelling(text: string): Promise<string> {
  const spell = await createSpellChecker();
  const words = text.split(' ');
  const correctedWords = words.map(word => {
    if (!spell.correct(word)) {
      const suggestions = spell.suggest(word);
      return suggestions.length > 0 ? suggestions[0] : word;
    }
    return word;
  });
  return correctedWords.join(' ');
}
