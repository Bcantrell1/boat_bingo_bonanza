import { BingoItem } from '@/types';
import { allBingoItems } from './bingoItems';

export function isValidCard(card: any): card is BingoItem[] {
  return Array.isArray(card) && card.length === 25 && card.every(item => 
    typeof item === 'object' && 
    'text' in item && 
    'isMarked' in item
  );
}

export function generateCard(): BingoItem[] {
  const shuffled = [...allBingoItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 25).map(text => ({ text, isMarked: false }));
}

export function checkWin(card: BingoItem[]): boolean {
  // Check rows
  for (let i = 0; i < 5; i++) {
    if (card.slice(i*5, (i+1)*5).every(item => item.isMarked)) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 5; i++) {
    if ([0,1,2,3,4].every(j => card[i + j*5].isMarked)) {
      return true;
    }
  }

  // Check main diagonal (top-left to bottom-right)
  if ([0,6,12,18,24].every(i => card[i].isMarked)) {
    return true;
  }

  // Check secondary diagonal (top-right to bottom-left)
  if ([4,8,12,16,20].every(i => card[i].isMarked)) {
    return true;
  }

  return false;
}