import { GameState } from './gameLogic';
import { TacticalStrategy } from '../data/strategies';

export class AIController {
  static selectStrategy(state: GameState, personality: 'AGGRESSIVE' | 'DEFENSIVE' | 'TACTICAL'): TacticalStrategy {
    const allStrategies = [
      { id: 'aggressive-execute', name: 'Aggressive Execute', type: 'Attack', cost: 200, power: 80, risk: 40 },
      { id: 'slow-control', name: 'Slow Control', type: 'Attack', cost: 100, power: 50, risk: 10 },
      { id: 'defensive-hold', name: 'Defensive Hold', type: 'Defense', cost: 100, power: 60, risk: 20 },
      { id: 'info-gather', name: 'Information Gathering', type: 'Info', cost: 50, power: 30, risk: 5 },
    ];

    if (personality === 'AGGRESSIVE') {
      return allStrategies.find(s => s.id === 'aggressive-execute') || allStrategies[0];
    }
    if (personality === 'DEFENSIVE') {
      return allStrategies.find(s => s.id === 'defensive-hold') || allStrategies[2];
    }
    return allStrategies[Math.floor(Math.random() * allStrategies.length)];
  }

  static decidePurchase(credits: number, teamComposition: any[]): Record<string, any> {
    const purchases: Record<string, any> = {};
    // Mock purchase logic: buy expensive weapons if credits > 3000
    return purchases;
  }
}
