'use client';

import CreateGameForm from '@/components/CreateGameForm';
import GameList from '@/components/GameList';
import { useLobby } from '@/hooks/useLobby';

export default function Lobby() {
  const { user, loading, games, createGame, joinGame, deleteGame } = useLobby();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Please log in to access the lobby.</div>;
  }

  return (
    <div className="flex flex-col items-center h-auto bg-black p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Game Lobby</h1>
      <CreateGameForm onCreateGame={createGame} />
      <div className="w-full max-w-md">
        <h2 className="text-lg sm:text-xl text-center font-semibold mb-4 text-white">Available Games:</h2>
        <GameList
          games={games}
          onJoinGame={joinGame}
          onDeleteGame={deleteGame}
          currentUserId={user.uid}
        />
      </div>
    </div>
  );
}