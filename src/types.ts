export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  players: Player[];
  status: 'setup' | 'assigning' | 'playing' | 'voting' | 'results';
  currentWord: string;
  impostorIds: string[];
  currentPlayerIndex: number;
  revealedToCurrent: boolean;
  category: string;
  language: 'en' | 'es';
  theme: 'light' | 'dark';
  customCategories: Record<string, string[]>;
}

export const CATEGORIES = ['Personality', 'Object', 'Idea', 'Place', 'Movie', 'Animal', 'All'];
