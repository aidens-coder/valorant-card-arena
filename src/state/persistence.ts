import { Agent, Weapon, GameMap, PlayerProfile } from '../types';

export interface MatchHistory {
  id: string;
  mode: 'Swiftplay' | 'Unrated' | 'Competitive';
  map: string;
  result: 'Victory' | 'Defeat';
  score: string;
  rrChange: number;
  date: string;
}

export const INITIAL_PLAYER_STATE: Partial<PlayerProfile> = {
  username: 'Player One',
  level: 1,
  xp: 0,
  credits: 5000,
  rank: 'Iron',
  currentRR: 0,
  inventory: ['jett', 'sage', 'sova', 'omen', 'cypher'],
};

export const saveGame = (state: any) => {
  localStorage.setItem('val_arena_save', JSON.stringify(state));
};

export const loadGame = () => {
  const saved = localStorage.getItem('val_arena_save');
  return saved ? JSON.parse(saved) : INITIAL_PLAYER_STATE;
};
