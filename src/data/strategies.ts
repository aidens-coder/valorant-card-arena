import { AgentRole, CardRarity } from '../types';

export interface TacticalStrategy {
  id: string;
  name: string;
  description: string;
  type: 'Attack' | 'Defense' | 'Rotation' | 'Info';
  cost: number;
  power: number;
  risk: number;
}

export const STRATEGIES: TacticalStrategy[] = [
  { id: 'aggressive-execute', name: 'Aggressive Execute', description: 'Fast push onto site with high pressure', type: 'Attack', cost: 200, power: 80, risk: 40 },
  { id: 'slow-control', name: 'Slow Control', description: 'Gradually taking map control', type: 'Attack', cost: 100, power: 50, risk: 10 },
  { id: 'defensive-hold', name: 'Defensive Hold', description: 'Solid positioning to prevent entry', type: 'Defense', cost: 100, power: 60, risk: 20 },
  { id: 'fake-push', name: 'Fake Push', description: 'Mislead enemies to rotate away from the real target', type: 'Rotation', cost: 150, power: 40, risk: 30 },
  { id: 'info-gather', name: 'Information Gathering', description: 'Use utility to reveal enemy positions', type: 'Info', cost: 50, power: 30, risk: 5 },
];
