import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  name: string;
  role?: string;
  cost?: number;
  rarity?: string;
  image: string;
  description?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  name,
  role,
  cost,
  rarity = 'Common',
  image,
  description,
  className
}) => {
  const rarityColors: Record<string, string> = {
    Common: 'border-gray-400 text-gray-400',
    Uncommon: 'border-green-400 text-green-400',
    Rare: 'border-blue-400 text-blue-400',
    Epic: 'border-purple-400 text-purple-400',
    Legendary: 'border-yellow-400 text-yellow-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      className={cn(
        "relative w-48 h-72 rounded-xl border-4 bg-valorant-darker overflow-hidden cursor-pointer transition-all",
        rarityColors[rarity] || rarityColors.Common,
        className
      )}
    >
      {/* Card Art */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-valorant-darker via-transparent to-transparent opacity-90" />

      {/* Cost Badge */}
      {cost !== undefined && (
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-valorant-red text-white flex items-center justify-center font-bold text-sm z-10">
          {cost}
        </div>
      )}

      {/* Card Details */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-valorant-darker/80 backdrop-blur-sm">
        <h3 className="text-lg font-bold truncate uppercase tracking-wider">{name}</h3>
        {role && <p className="text-xs text-valorant-accent/60 uppercase mb-1">{role}</p>}
        {description && <p className="text-[10px] leading-tight text-valorant-accent/80 line-clamp-3">{description}</p>}
      </div>

      {/* Rarity Glow Effect */}
      <div className="absolute inset-0 pointer-events-none border-2 border-white/10 opacity-50" />
    </motion.div>
  );
};
