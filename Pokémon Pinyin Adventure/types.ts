
export interface Pokemon {
  id: number;
  name: string;
  level: number;
  url: string;
}

export interface PinyinData {
  pinyin: string;
  char: string;
}

export type GameState = 'START' | 'ENCOUNTER' | 'BATTLE' | 'CAUGHT' | 'POKEDEX';

export interface CaughtRecord {
  pokemon: Pokemon;
  caughtAt: string;
}
