import { BingoItem, Player } from '@/types';
import { useState } from 'react';
import ImageModal from './ImageModal';
import ImageUploader from './ImageUploader';

interface BingoCardProps {
  card: BingoItem[];
  onToggleSquare: (index: number, imageUrl: string) => void;
  players: Record<string, Player>;
  currentPlayerId: string;
}

export default function BingoCard({ card, onToggleSquare, players, currentPlayerId }: BingoCardProps) {
  const [tooltip, setTooltip] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!Array.isArray(card) || card.length !== 25) {
    return <div>Invalid card data</div>;
  }

  const letters = ['B', 'I', 'N', 'G', 'O'];

  const handleSquareClick = (index: number) => {
    const item = card[index];
    if (item.imageUrl) {
      setSelectedImage(item.imageUrl);
    } else if (!item.isMarked || item.markedBy === currentPlayerId) {
      setSelectedSquare(index);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (selectedSquare !== null) {
      onToggleSquare(selectedSquare, imageUrl);
      setSelectedSquare(null);
    }
  };

  return (
    <div className="relative max-w-md mx-auto bg-blue-800 p-2 rounded-lg shadow-lg">
      <div className="grid grid-cols-5 gap-1 mb-1">
        {letters.map((letter) => (
          <div key={letter} className="bg-white text-blue-800 font-bold text-center py-2 rounded">
            {letter}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {card.map((item, index) => (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center p-1 border-2 border-blue-800 cursor-pointer rounded ${
              item.isMarked ? (players[item.markedBy!]?.color || 'bg-gray-300') : 'bg-white'
            }`}
            style={{ backgroundColor: item.isMarked ? players[item.markedBy!]?.color : 'white' }}
            onClick={() => handleSquareClick(index)}
            onMouseEnter={() => setTooltip({ text: item.text, visible: true })}
            onMouseLeave={() => setTooltip({ text: '', visible: false })}
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-[10px] sm:text-[10px] md:text-xs text-center text-black font-semibold">
                {item.text}
              </p>
              {item.imageUrl && (
                <div className="w-4 h-4 mt-1 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {tooltip.visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded shadow-lg">
          {tooltip.text}
        </div>
      )}
      {selectedSquare !== null && (
        <ImageUploader 
          onImageUploaded={handleImageUploaded}
          onCancel={() => setSelectedSquare(null)}
        />
      )}
      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
}