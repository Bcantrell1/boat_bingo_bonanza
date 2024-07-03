export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface BingoItem {
  text: string;
  isMarked: boolean;
	markedBy?: string;
	imageUrl?: string;
}

export interface Game {
  id: string;
  name: string;
  createdBy: string;
  players: Record<string, Player>;
  card: BingoItem[];
  hasWon: boolean;
	winner?: string;
}