export interface BingoItem {
  text: string;
  isMarked: boolean;
}

export interface Game {
  id: string;
  name: string;
  createdBy: string;
  players: Record<string, string>;
  card: BingoItem[];
  hasWon: boolean;
}