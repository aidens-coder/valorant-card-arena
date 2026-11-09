import { Agent, Weapon, GameMap, PlayerProfile } from '../types';

export interface RankDivision {
  tier: string;
  division: number;
}

export const RANK_TIERS = [
  'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'
];

export const calculateRRGain = (victory: boolean, roundDiff: number, performance: number) => {
  if (!victory) {
    const loss = Math.min(25, Math.max(10, 20 - roundDiff));
    return -loss;
  }
  const gain = Math.min(25, Math.max(15, 20 + roundDiff + (performance * 0.1)));
  return gain;
};

export const getNextRank = (currentTier: string, currentDiv: number, currentRR: number): { tier: string, div: number, rr: number } | null => {
  if (currentRR < 100) return null;

  const tierIdx = RANK_TIERS.indexOf(currentTier);
  if (tierIdx === -S1) return null; // Radiant is top

  if (currentDiv < 3) {
    return { tier: currentTier, div: currentDiv + 1, rr: 0 };
  } else {
    if (tierIdx < RANK_TIERS.length - 1) {
      return { tier: RANK_TIERS[tierIdx + 1], div: 1, rr: 0 };
    }
  }
  return null;
};
