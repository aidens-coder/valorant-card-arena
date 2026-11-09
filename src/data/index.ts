import { Agent, Weapon, GameMap } from '../types';
import { ALL_AGENTS } from './agents';

export const AGENTS: Agent[] = ALL_AGENTS;

export const WEAPONS: Weapon[] = [
  { id: 'classic', name: 'Classic', category: 'Sidedarm', cost: 0, damage: 20, range: 'Short', accuracy: 0.7, fireRate: 0.1, rarity: 'Common' },
  { id: 'ghost', name: 'Ghost', category: 'Sidedarm', cost: 500, damage: 35, range: 'Medium', accuracy: 0.9, fireRate: 0.15, rarity: 'Uncommon' },
  { id: 'sheriff', name: 'Sheriff', category: 'Sidedarm', cost: 800, damage: 150, range: 'Long', accuracy: 0.95, fireRate: 0.4, rarity: 'Rare' },
  { id: 'spectre', name: 'Spectre', category: 'SMG', cost: 1600, damage: 30, range: 'Short', accuracy: 0.75, fireRate: 0.05, rarity: 'Uncommon' },
  { id: 'phantom', name: 'Phantom', category: 'Rifle', cost: 2900, damage: 140, range: 'Medium', accuracy: 0.85, fireRate: 0.07, rarity: 'Epic' },
  { id: 'vandal', name: 'Vandal', category: 'Rifle', cost: 2900, damage: 160, range: 'Long', accuracy: 0.8, fireRate: 0.08, rarity: 'Epic' },
  { id: 'operator', name: 'Operator', category: 'Sniper', cost: 4700, damage: 200, range: 'Long', accuracy: 1.0, fireRate: 1.0, rarity: 'Legendary' },
];

export const MAPS: GameMap[] = [
  { id: 'ascent', name: 'Ascent', illustrationUrl: '/assets/maps/ascent_art.png', layoutUrl: '/assets/maps/ascent_layout.png', modifiers: ['MidControlImportant'] },
  { id: 'bind', name: 'Bind', illustrationUrl: '/assets/maps/bind_art.png', layoutUrl: '/assets/maps/bind_layout.png', modifiers: ['Teleporters'] },
  { id: 'haven', name: 'Haven', illustrationUrl: '/assets/maps/haven_art.png', layoutUrl: '/assets/maps/haven_layout.png', modifiers: ['ThreeSites'] },
];
