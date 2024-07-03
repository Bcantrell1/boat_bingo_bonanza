import { Player } from '@/types';
import React, { useEffect, useRef, useState } from 'react';

interface PlayerListProps {
  players: Record<string, Player>;
  currentPlayerId: string;
}

export default function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState('2.5rem'); // 10px
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('2.5rem');
    }
  }, [isExpanded, players]);

  return (
    <div 
      className={`fixed bottom-10 right-4 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out`}
      style={{
        width: isExpanded ? '16rem' : '2.5rem', // 64px or 10px
        height: height,
      }}
    >
      <button
        onClick={toggleExpand}
        className={`w-full h-10 flex items-center justify-center bg-blue-600 text-white font-bold ${isExpanded ? 'px-4' : 'p-0'}`}
      >
        {isExpanded ? (
          <>
            <span>Players ({Object.keys(players).length})</span>
            <span className="ml-2 transform rotate-180">▲</span>
          </>
        ) : (
          <span className="text-xl">👥</span>
        )}
      </button>
      <div ref={contentRef} className={`overflow-hidden`}>
        <ul className="p-4 overflow-y-auto">
          {Object.values(players).map((player) => (
            <li 
              key={player.id} 
              className="flex items-center mb-2 last:mb-0"
            >
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: player.color }}
              ></div>
							<span className={`${player.id === currentPlayerId ? 'font-bold' : ''} text-black`}>
                {player.name} {player.id === currentPlayerId ? '(You)' : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}