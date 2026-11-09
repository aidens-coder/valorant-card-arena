export type AgentRole = 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel';
export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type CardVariant = 'Standard' | 'FullArt' | 'Holographic' | 'AnimatedFoil' | 'Metallic' | 'Premium';

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: 'Signature' | 'Tactical' | 'Ultimate';
  cost: number;
  effect: (state: any) => void;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  origin: string;
  abilities: Ability[];
  passive?: string;
  portraitUrl: string;
  fullArtUrl: string;
}

export interface Weapon {
  id: string;
  name: string;
  category: 'Sidedarm' | 'SMG' | 'Shotgun' | 'Rifle' | 'Sniper' | 'MachineGun' | 'Melee';
  cost: number;
  damage: number;
  range: 'Short' | 'Medium' | 'Long';
  accuracy: number;
  fireRate: number;
  rarity: CardRarity;
}

export interface GameMap {
  id: string;
  name: string;
  illustrationUrl: string;
  layoutUrl: string;
  modifiers: string[];
}

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  credits: number;
  currentRank: string;
  currentRR: number;
  peakRank: string;
  inventory: string[];
  decks: any[];
}
