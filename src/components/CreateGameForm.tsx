import { useState } from 'react';

interface CreateGameFormProps {
  onCreateGame: (gameName: string) => void;
}

export default function CreateGameForm({ onCreateGame }: CreateGameFormProps) {
  const [newGameName, setNewGameName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGameName.trim()) {
      onCreateGame(newGameName);
      setNewGameName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-6">
      <input
        type="text"
        value={newGameName}
        onChange={(e) => setNewGameName(e.target.value)}
        placeholder="Enter game name"
        className="w-full px-4 py-2 mb-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Game
      </button>
    </form>
  );
}