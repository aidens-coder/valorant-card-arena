import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, User, BookOpen, Shield, Trophy, Settings as SettingsIcon, Zap, Star, Lock, Package, TrendingUp, Award, History, Save } from 'lucide-react';
import { Card } from './components/Card';
import { Battlefield } from './components/Battlefield';
import { AGENTS } from './data';
import { RANK_TIERS } from './engine/rankLogic';
import { loadGame, saveGame, INITIAL_PLAYER_STATE } from './state/persistence';

export default function App() {
  // Using a simple state first to ensure the app renders, then hydrating from local storage
  const [view, setView] = useState<'menu' | 'play' | 'collection' | 'profile' | 'match' | 'packs' | 'career'>('menu');
  const [player, setPlayer] = useState({
    level: 1,
    xp: 0,
    credits: 5000,
    rank: 'Iron',
    division: 1,
    rr: 0,
    peakRank: 'Iron 1',
    inventory: AGENTS.map(a => a.id)
  });

  useEffect(() => {
    try {
      const saved = loadGame();
      if (saved) {
        setPlayer(prev => ({
          ...INITIAL_PLAYER_STATE,
          ...saved,
          division: saved.division || 1,
          peakRank: saved.peakRank || 'Iron 1',
          inventory: saved.inventory || INITIAL_PLAYER_STATE.inventory,
        }));
      }
    } catch (e) {
      console.error("Critical Error loading save", e);
    }
  }, []);

  useEffect(() => {
    try {
      saveGame(player);
    } catch (e) {
      console.error("Critical Error saving state", e);
    }
  }, [player]);

  const menuItems = [
    { id: 'play', label: 'PLAY', icon: Play, color: 'text-valorant-red' },
    { id: 'collection', label: 'COLLECTION', icon: BookOpen, color: 'text-valorant-accent' },
    { id: 'profile', label: 'User', icon: User, color: 'text-valorant-accent' },
  ];

  const openPack = () => {
    if (player.credits < 1000) {
      alert("Not enough credits!");
      return;
    }
    const rewardAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    setPlayer(prev => ({
      ...prev,
      credits: prev.credits - 1000,
      inventory: [...new Set([...prev.inventory, rewardAgent.id])]
    }));
    alert(`You pulled: ${rewardAgent.name}!`);
  };

  return (
    <div className="h-screen w-screen bg-valorant-darker text-valorant-gray overflow-hidden font-sans selection:bg-valorant-red">
      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full w-full flex flex-col justify-center items-start pl-20"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-valorant-red/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-valorant-red/5 rounded-full blur-3xl pointer-events-none" />

            <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="text-2xl font-black tracking-tighter italic">VALORANT <span className="text-valorant-red">ARENA</span></div>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-valorant-accent/50">LEVEL {player.level}</div>
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-valorant-red" style={{ width: `${((player.xp || 0) / 5000) * 100}%` }} />
                  </div>
                  <div className="text-xs font-bold">{player.xp}/5000 XP</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-sm font-bold">
                  🪙 {(player.credits || 0).toLocaleString()}
                </div>
                <SettingsIcon className="w-5 h-5 cursor-pointer hover:text-valorant-red transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-4 z-10">
              <h1 className="text-6xl font-black italic tracking-tighter mb-8 opacity-20">MAIN MENU</h1>
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 20 }}
                  onClick={() => setView(item.id as any)}
                  className="flex items-center gap-4 group text-left"
                >
                  <div className={`w-12 h-12 rounded bg-white/5 flex items-center justify-center border border-white/10 transition-all group-hover:border-valorant-red group-hover:bg-valorant-red/10 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-bold tracking-widest uppercase transition-all group-hover:text-valorant-red">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'play' && (
          <motion.div
            key="play"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full w-full p-12 flex flex-col"
          >
            <button
              onClick={() => setView('menu')}
              className="mb-8 text-sm font-bold hover:text-valorant-red transition-colors flex items-center gap-2"
            >
              ← BACK TO MENU
            </button>
            <h2 className="text-4xl font-black italic mb-12">SELECT GAME MODE</h2>
            <div className="grid grid-cols-3 gap-6 max-w-5xl">
              {[
                { id: 'swiftplay', label: 'SWIFTPLAY', desc: 'Fast-paced introductory matches', locked: false },
                { id: 'unrated', label: 'UNRATED', desc: 'The standard tactical experience', locked: false },
                { id: 'competitive', label: 'COMPETITIVE', desc: 'Climb the ranks to Radiant', locked: (player.level || 1) < 20 },
              ].map((mode) => (
                <motion.div
                  key={mode.id}
                  whileHover={!mode.locked ? { scale: 1.02 } : {}}
                  className={`relative p-8 rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${mode.locked ? 'bg-white/5 border-white/10 opacity-60 cursor-not-allowed' : 'bg-valorant-dark border-white/20 hover:border-valorant-red'}`}
                  onClick={() => !mode.locked && setView('match')}
                >
                  {mode.locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                      <Lock className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2 italic">{mode.label}</h3>
                  <p className="text-sm text-valorant-accent/60">{mode.desc}</p>
                  {!mode.locked && (
                    <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-valorant-red flex items-center justify-center text-white">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'collection' && (
          <motion.div
            key="collection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full w-full p-12 flex flex-col"
          >
            <button
              onClick={() => setView('menu')}
              className="mb-8 text-sm font-bold hover:text-valorant-red transition-colors flex items-center gap-2"
            >
              ← BACK TO MENU
            </button>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black italic">CARD COLLECTION</h2>
                <p className="text-valorant-accent/60">Manage your agents and tactical assets</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setView('packs')}
                  className="px-4 py-2 bg-valorant-red text-white rounded font-bold text-xs uppercase flex items-center gap-2 hover:bg-red-600 transition-colors"
                >
                  <Package className="w-4 h-4" /> Buy Packs
                </button>
                <div className="px-4 py-2 bg-white/5 rounded border border-white/10 text-xs font-bold">
                  COLLECTED: {(player.inventory || []).length} / 24
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              <div className="grid grid-cols-4 gap-8 justify-items-center">
                {AGENTS.filter(a => (player.inventory || []).includes(a.id)).map(agent => (
                  <Card
                    key={agent.id}
                    name={agent.name}
                    role={agent.role}
                    image={agent.fullArtUrl}
                    rarity="Epic"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'packs' && (
          <motion.div
            key="packs"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="h-full w-full p-12 flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setView('collection')}
              className="mb-8 text-sm font-bold hover:text-valorant-red transition-colors flex items-center gap-2"
            >
              ← BACK TO COLLECTION
            </button>
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black italic mb-4">CARD SHOP</h2>
              <p className="text-valorant-accent/60">Expand your roster with premium packs</p>
            </div>
            <div className="grid grid-cols-1 gap-8 max-w-md w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-valorant-dark border-2 border-valorant-red/50 rounded-2xl flex items-center justify-between gap-8 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-32 bg-valorant-red/20 rounded-lg border-2 border-valorant-red flex items-center justify-center group-hover:bg-valorant-red/30 transition-colors">
                    <Package className="w-12 h-12 text-valorant-red" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold italic">RECRUIT PACK</h3>
                    <p className="text-xs text-valorant-accent/50 uppercase">Guaranteed 1 Rare+</p>
                  </div>
                </div>
                <button
                  onClick={openPack}
                  className="px-6 py-3 bg-valorant-red text-white rounded font-bold text-sm uppercase hover:bg-red-600 transition-colors"
                >
                  🪙 1,000
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {view === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full p-12 flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setView('menu')}
              className="mb-8 text-sm font-bold hover:text-valorant-red transition-colors flex items-center gap-2"
            >
              ← BACK TO MENU
            </button>
            <div className="w-full max-w-2xl bg-valorant-dark p-12 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-valorant-red/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-32 h-32 rounded-full bg-valorant-darker border-4 border-valorant-red overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Player One</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-valorant-red font-bold">LEVEL {player.level || 1}</div>
                    <div className="text-valorant-accent/40">•</div>
                    <div className="text-valorant-accent font-bold uppercase tracking-widest text-sm">{player.rank || 'Iron'} {player.division || 1}</div>
                  </div>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <div className="text-xs text-valorant-accent/50 uppercase font-bold mb-1">Total Wins</div>
                  <div className="text-2xl font-black italic">124</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <div className="text-xs text-valorant-accent/50 uppercase font-bold mb-1">Win Rate</div>
                  <div className="text-2xl font-black italic">64%</div>
                </div>
                <div className="p-4 bg-valorant-red/10 rounded-xl border border-white/10 text-center">
                  <div className="text-xs text-valorant-red/50 uppercase font-bold mb-1">Peak Rank</div>
                  <div className="text-2xl font-black italic">{player.peakRank || 'Iron 1'}</div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setView('career')}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-bold text-xs uppercase transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" /> View Career
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'career' && (
          <motion.div
            key="career"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full p-12 flex flex-col"
          >
            <button
              onClick={() => setView('profile')}
              className="mb-8 text-sm font-bold hover:text-valorant-red transition-colors flex items-center gap-2"
            >
              ← BACK TO PROFILE
            </button>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black italic">COMPETITIVE CAREER</h2>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-valorant-dark rounded border border-white/10 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold uppercase">{player.rank || 'Iron'} {player.division || 1}</span>
                </div>
                <div className="px-4 py-2 bg-valorant-dark rounded border border-white/10 text-sm font-bold">
                  {player.rr || 0}/100 RR
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-4 bg-valorant-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold italic mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-valorant-red" /> Progress Track
                </h3>
                <div className="flex flex-col gap-3">
                  {RANK_TIERS.map((tier, i) => (
                    <div
                      key={tier}
                      className={`flex justify-between items-center p-3 rounded transition-all ${player.rank === tier ? 'bg-valorant-red/20 border border-valorant-red' : 'bg-white/5 border border-transparent'}`}
                    >
                      <span className={`font-bold uppercase tracking-widest ${player.rank === tier ? 'text-valorant-red' : 'text-valorant-accent/50'}`}>{tier}</span>
                      {player.rank === tier && <Award className="w-4 h-4 text-valorant-red" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-8 bg-valorant-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold italic mb-6">Recent Match History</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(m => (
                    <div key={m} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-8 rounded-full ${m % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="font-bold uppercase text-sm">{m % 2 === 0 ? 'Victory' : 'Defeat'}</div>
                          <div className="text-[10px] text-valorant-accent/50 uppercase">Ascent • 13-11</div>
                        </div>
                      </div>
                      <div className="font-bold text-valorant-red">{m % 2 === 0 ? '+22' : '-18'} RR</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'match' && (
          <motion.div
            key="match"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <Battlefield />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
