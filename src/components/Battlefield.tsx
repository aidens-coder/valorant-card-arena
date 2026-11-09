import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ShoppingCart, Sword, Target, RotateCcw, Zap, Bomb, ShieldAlert, UserPlus, Hand } from 'lucide-react';
import { Card } from '../components/Card';
import { AGENTS, WEAPONS, MAPS } from '../data';
import { TacticalStrategy } from '../data/strategies';
import { STRATEGIES } from '../data/strategies';
import { ALL_ABILITY_CARDS } from '../data/abilities';

interface AgentInstance {
  agent: any;
  weapon: any;
  hp: number;
  isEliminated: boolean;
  activeAbility: string | null;
}

export const Battlefield: React.FC = () => {
  const [phase, setPhase] = useState<'BUY' | 'STRATEGY' | 'ENGAGEMENT' | 'RESOLUTION' | 'RESULTS'>('BUY');
  const [credits, setCredits] = useState(5000);
  const [logs, setLogs] = useState<string[]>(["Match started on Ascent", "Phase: Buy Phase"]);
  const [selectedStrategy, setSelectedStrategy] = useState<TacticalStrategy | null>(null);
  const [playerTeam, setPlayerTeam] = useState<AgentInstance[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<AgentInstance[]>([]);
  const [spikePlanted, setSpikePlanted] = useState(false);
  const [roundScore, setRoundScore] = useState({ player: 0, enemy: 0 });
  const [currentRound, setCurrentRound] = useState(1);
  const [hand, setHand] = useState<any[]>([]);

  useEffect(() => {
    setPlayerTeam(AGENTS.slice(0, 5).map(a => ({ agent: a, weapon: WEAPONS[0], hp: 100, isEliminated: false, activeAbility: null })));
    setEnemyTeam(AGENTS.slice(5, 10).map(a => ({ agent: a, weapon: WEAPONS[0], hp: 100, isEliminated: false, activeAbility: null })));
    generateHand();
  }, []);

  const generateHand = () => {
    const deck = ALL_ABILITY_CARDS;
    const newHand = [];
    for(let i=0; i<4; i++) {
      newHand.push(deck[Math.floor(Math.random() * deck.length)]);
    }
    setHand(newHand);
  };

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const nextPhase = () => {
    const phases: ('BUY' | 'STRATEGY' | 'ENGAGEMENT' | 'RESOLUTION' | 'RESULTS')[] = ['BUY', 'STRATEGY', 'ENGAGEMENT', 'RESOLUTION', 'RESULTS'];
    const nextIdx = (phases.indexOf(phase) + 1) % phases.length;
    const next = phases[nextIdx];

    if (next === 'ENGAGEMENT') {
      handleEngagement();
    }

    if (next === 'BUY') {
      setCurrentRound(prev => prev + 1);
      setPlayerTeam(prev => prev.map(m => ({ ...m, hp: 100, isEliminated: false, activeAbility: null })));
      setEnemyTeam(prev => prev.map(m => ({ ...m, hp: 100, isEliminated: false, activeAbility: null })));
      setSpikePlanted(false);
      setSelectedStrategy(null);
      generateHand();
      addLog(`--- Round ${currentRound + 1} Started ---`);
    }

    setPhase(next);
    addLog(`Entering ${next} phase...`);
  };

  const playAbility = (abilityCard: any) => {
    addLog(`Played ${abilityCard.ability.name}!`);
    setHand(prev => prev.filter(c => c.id !== abilityCard.id));
    // Effect logic would go here
  };

  const handleEngagement = () => {
    addLog("⚔️ Engagement started!");
    if (selectedStrategy) {
      addLog(`Using strategy: ${selectedStrategy.name}`);
    }

    const newPlayerTeam = [...playerTeam];
    const newEnemyTeam = [...enemyTeam];

    playerTeam.forEach((member, i) => {
      const enemy = enemyTeam[i];
      if (enemy && !member.isEliminated && !enemy.isEliminated) {
        const win = Math.random() > 0.5;
        if (win) {
          addLog(`${member.agent.name} eliminated ${enemy.agent.name}!`);
          newEnemyTeam[i].isEliminated = true;
          newEnemyTeam[i].hp = 0;
        } else {
          addLog(`${enemy.agent.name} eliminated ${member.agent.name}!`);
          newPlayerTeam[i].isEliminated = true;
          newPlayerTeam[i].hp = 0;
        }
      }
    });

    if (Math.random() > 0.7) {
      setSpikePlanted(true);
      addLog("💣 SPIKE HAS BEEN PLANTED!");
    }

    setPlayerTeam(newPlayerTeam);
    setEnemyTeam(newEnemyTeam);
  };

  return (
    <div className="h-full w-full bg-valorant-darker flex flex-col p-8 text-valorant-gray">
      <div className="flex justify-between items-center mb-8 bg-valorant-dark p-4 rounded-xl border border-white/10">
        <div className="flex gap-8 items-center">
          <div className="text-2xl font-black italic uppercase tracking-tighter">
            MAP: <span className="text-valorant-red">{MAPS[0].name}</span>
          </div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-valorant-accent/50">CREDITS:</span>
            <span className="text-valorant-red">🪙 {credits}</span>
          </div>
          {spikePlanted && (
            <div className="flex items-center gap-2 px-3 py-1 bg-valorant-red text-white rounded-full animate-pulse font-bold text-xs uppercase">
              <Bomb className="w-3 h-3" /> Spike Active
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="text-3xl font-black italic tracking-widest">
            PLAYER <span className="text-valorant-red">{roundScore.player}</span> — <span className="text-valorant-red">{roundScore.enemy}</span> ENEMY
          </div>
          <button
            onClick={nextPhase}
            className="px-6 py-2 bg-valorant-red text-white font-bold uppercase italic hover:bg-red-600 transition-colors rounded"
          >
            Next Phase
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-3 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-valorant-accent/50 uppercase tracking-widest mb-2">Your Team</h3>
          {playerTeam.map((member) => (
            <div key={member.agent.id} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${member.isEliminated ? 'bg-black/40 border-white/5 opacity-50 grayscale' : 'bg-white/5 border-white/10'}`}>
              <div className="w-12 h-12 rounded-full bg-valorant-red/20 border-2 border-valorant-red overflow-hidden">
                <img src={member.agent.portraitUrl} alt={member.agent.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-sm uppercase">{member.agent.name}</div>
                  <div className={`text-[10px] font-bold ${member.hp < 30 ? 'text-red-500' : 'text-green-400'}`}>{member.hp} HP</div>
                </div>
                <div className="text-[10px] text-valorant-accent/50 uppercase">{member.weapon.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-6 flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            {phase === 'BUY' && (
              <motion.div
                key="buy"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <ShoppingCart className="w-16 h-16 text-valorant-red mb-4 animate-bounce" />
                <h2 className="text-3xl font-black italic uppercase mb-6">Buy Phase</h2>
                <div className="grid grid-cols-3 gap-4 max-w-2xl">
                  {WEAPONS.map(weapon => (
                    <div
                      key={weapon.id}
                      className="p-4 bg-valorant-dark border border-white/10 rounded-lg cursor-pointer hover:border-valorant-red transition-all group"
                      onClick={() => {
                        if (credits >= weapon.cost) {
                          setCredits(prev => prev - weapon.cost);
                          setPlayerTeam(prev => prev.map(m => ({ ...m, weapon })));
                          addLog(`Team equipped ${weapon.name}`);
                        }
                      }}
                    >
                      <div className="font-bold uppercase text-sm group-hover:text-valorant-red">{weapon.name}</div>
                      <div className="text-xs text-valorant-accent/50">🪙 {weapon.cost}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'STRATEGY' && (
              <motion.div
                key="strategy"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <Sword className="w-16 h-16 text-valor-red mb-4" />
                <h2 className="text-3xl font-black italic uppercase mb-6">Select Strategy</h2>
                <div className="grid grid-cols-2 gap-4 max-w-2xl">
                  {STRATEGIES.map(strat => (
                    <div
                      key={strat.id}
                      className={`p-4 bg-valorant-dark border rounded-lg cursor-pointer transition-all ${selectedStrategy?.id === strat.id ? 'border-valorant-red bg-valorant-red/10' : 'border-white/10 hover:border-white/40'}`}
                      onClick={() => setSelectedStrategy(strat)}
                    >
                      <div className="font-bold uppercase text-sm">{strat.name}</div>
                      <div className="text-[10px] text-valorant-accent/60">{strat.description}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'ENGAGEMENT' && (
              <motion.div
                key="eng"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <Target className="w-16 h-16 text-valorant-red mb-4 animate-pulse" />
                <h2 className="text-3xl font-black italic uppercase mb-6">Engagement</h2>
                <div className="flex gap-4">
                  {playerTeam.filter(m => !m.isEliminated).map(member => (
                    <Card
                      key={member.agent.id}
                      name={member.agent.name}
                      role={member.agent.role}
                      image={member.agent.fullArtUrl}
                      rarity="Epic"
                      className="w-32 h-52"
                    />
                  ))}
                </div>
                <div className="mt-8 text-valorant-accent/60 italic animate-pulse">Executing tactics...</div>
              </motion.div>
            )}

            {phase === 'RESOLUTION' && (
              <motion.div
                key="res"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <RotateCcw className="w-16 h-16 text-valorant-red mb-4" />
                <h2 className="text-3xl font-black italic uppercase mb-6">Round Resolution</h2>
                <div className="text-center p-6 bg-valorant-dark rounded-xl border border-valorant-red/50 max-w-md">
                  <div className="text-xl font-bold mb-2">ROUND WINNER</div>
                  <div className="text-4xl font-black text-valorant-red italic uppercase">
                    {playerTeam.filter(m => !m.isEliminated).length > enemyTeam.filter(m => !m.isEliminated).length ? 'PLAYER TEAM' : 'ENEMY TEAM'}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'RESULTS' && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <Zap className="w-16 h-16 text-valorant-red mb-4" />
                <h2 className="text-3xl font-black italic uppercase mb-6">Round Rewards</h2>
                <div className="flex gap-4 text-center">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-xs text-valorant-accent/50 uppercase">Credits</div>
                    <div className="text-2xl font-bold text-valorant-red">+3,000</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-xs text-valorant-accent/50 uppercase">Experience</div>
                    <div className="text-2xl font-bold text-valorant-red">+200 XP</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-3 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-valorant-accent/50 uppercase tracking-widest mb-2 text-right">Enemy Team</h3>
          {enemyTeam.map((member) => (
            <div key={member.agent.id} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${member.isEliminated ? 'bg-black/40 border-white/5 opacity-50 grayscale' : 'bg-white/5 border-white/10'} flex-row-reverse text-right`}>
              <div className="w-12 h-12 rounded-full bg-valorant-red/20 border-2 border-valorant-red overflow-hidden">
                <img src={member.agent.portraitUrl} alt={member.agent.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center justify-end">
                  <div className={`text-[10px] font-bold ${member.hp < 30 ? 'text-red-500' : 'text-green-400'}`}>{member.hp} HP</div>
                  <div className="font-bold text-sm uppercase">{member.agent.name}</div>
                </div>
                <div className="text-[10px] text-valorant-accent/50 uppercase">{member.weapon.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hand System */}
      <div className="h-32 mt-8 flex items-center justify-center gap-4">
        <AnimatePresence>
          {hand.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              whileHover={{ y: -20, scale: 1.1 }}
              onClick={() => playAbility(card)}
              className="w-24 h-36 bg-valorant-dark border-2 border-white/20 rounded-lg cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-valorant-red/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-2 flex flex-col h-full justify-between">
                <div className="text-[10px] font-bold uppercase truncate">{card.ability.name}</div>
                <div className="text-[8px] text-valorant-accent/60 line-clamp-2">{card.ability.description}</div>
                <div className="text-[10px] font-bold text-valorant-red text-right">C:{card.ability.cost}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="h-32 mt-4 bg-valorant-dark rounded-xl border border-white/10 p-4 overflow-hidden flex flex-col">
        <div className="text-xs font-bold text-valorant-accent/50 uppercase mb-2 flex justify-between">
          <span className="flex items-center gap-2"><ShieldAlert className="w-3 h-3" /> Combat Log</span>
          <span className="text-valorant-red italic">Round {currentRound}</span>
        </div>
        <div className="flex-1 overflow-y-auto text-sm font-mono space-y-1 custom-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-valorant-red opacity-50">[{i + 1}]</span>
              <span className={log.includes('eliminated') || log.includes('SPIKE') ? 'text-valorant-red font-bold' : ''}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
