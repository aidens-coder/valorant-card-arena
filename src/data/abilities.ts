import { Ability } from '../types';

export interface AbilityCard {
  id: string;
  agentId: string;
  ability: Ability;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

export const ALL_ABILITY_CARDS: AbilityCard[] = [
  // Jett
  { id: 'jett-cloud', agentId: 'jett', rarity: 'Common', ability: { id: 'cloudburst', name: 'Cloudburst', description: 'Reduces enemy accuracy by 30%', type: 'Tactical', cost: 1, effect: () => {} } },
  { id: 'jett-tail', agentId: 'jett', rarity: 'Rare', ability: { id: 'tailwind', name: 'Tailwind', description: 'Avoids next incoming attack', type: 'Signature', cost: 0, effect: () => {} } },
  { id: 'jett-ult', agentId: 'jett', rarity: 'Legendary', ability: { id: 'blade-storm', name: 'Blade Storm', description: 'Guaranteed crits for 2 turns', type: 'Ultimate', cost: 8, effect: () => {} } },
  // Sage
  { id: 'sage-heal', agentId: 'sage', rarity: 'Common', ability: { id: 'healing-orb', name: 'Healing Orb', description: 'Restores 50 HP to ally', type: 'Signature', cost: 0, effect: () => {} } },
  { id: 'sage-wall', agentId: 'sage', rarity: 'Rare', ability: { id: 'barrier-orb', name: 'Barrier Orb', description: 'Blocks site entry for 1 turn', type: 'Tactical', cost: 1, effect: () => {} } },
  { id: 'sage-ult', agentId: 'sage', rarity: 'Legendary', ability: { id: 'resurrection', name: 'Resurrection', description: 'Revives eliminated ally', type: 'Ultimate', cost: 8, effect: () => {} } },
  // Sova
  { id: 'sova-recon', agentId: 'sova', rarity: 'Common', ability: { id: 'recon-bolt', name: 'Recon Bolt', description: 'Reveals enemy strategy', type: 'Signature', cost: 0, effect: () => {} } },
  { id: 'sova-ult', agentId: 'sova', rarity: 'Legendary', ability: { id: 'hunters-fury', name: 'Hunter\'s Fury', description: 'AoE High Damage', type: 'Ultimate', cost: 8, effect: () => {} } },
];
