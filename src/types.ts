export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  players: Player[];
  status: 'setup' | 'assigning' | 'playing' | 'voting' | 'results';
  currentWord: string | { en: string; es: string };
  impostorIds: string[];
  currentPlayerIndex: number;
  revealedToCurrent: boolean;
  hasRevealedOnce: boolean;
  revealOrder: string[];
  category: string;
  language: 'en' | 'es';
  theme: 'light' | 'dark';
  customCategories: Record<string, string[]>;
}

export const CATEGORIES = ['Personality', 'Object', 'Idea', 'Place', 'Movie', 'Animal', 'All'];
