import { Game } from '@/types';

interface GameListProps {
  games: Game[];
  onJoinGame: (gameId: string) => void;
  onDeleteGame: (gameId: string) => void;
  currentUserId: string;
}

export default function GameList({ games, onJoinGame, onDeleteGame, currentUserId }: GameListProps) {
  if (games.length === 0) {
    return <p className='text-center text-white'>No games available. Create a new one!</p>;
  }

  return (
    <ul className="space-y-2">
      {games.map((game) => (
        <li key={game.id} className="bg-white p-3 rounded-md shadow">
          <div className="flex justify-between items-center mb-2">
            <span className='text-black text-sm'>{game.name}</span>
            <span className='text-gray-600 text-xs'>{Object.keys(game.players).length} player(s)</span>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onJoinGame(game.id)}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Join
            </button>
            {game.createdBy === currentUserId && (
              <button
                onClick={() => onDeleteGame(game.id)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}