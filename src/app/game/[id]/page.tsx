'use client';

import BingoCard from '@/components/BingoCard';
import PlayerList from '@/components/PlayerList';
import { auth, database } from '@/lib/firebase';
import { checkWin, generateCard, isValidCard } from '@/lib/gameLogic';
import { BingoItem, Game } from '@/types';
import { onValue, ref, remove, set } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function GamePage({ params }: { params: { id: string } }) {
  const [user, loading] = useAuthState(auth);
  const [game, setGame] = useState<Game | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    console.log('Setting up game listener for ID:', params.id);
    const gameRef = ref(database, `games/${params.id}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGame({
          id: params.id,
          ...data,
        });
      } else {
        console.log('No game data found, redirecting to lobby');
        router.push('/lobby');
      }
    }, (error) => {
      console.error('Error fetching game:', error);
    });

    return () => {
      console.log('Unsubscribing from game listener');
      unsubscribe();
    };
  }, [params.id, user, router]);

  const handleToggleSquare = useCallback((index: number, imageUrl: string) => {
		if (!user || !game || !isValidCard(game.card)) return;
	
		const currentSquare = game.card[index];
		if (currentSquare.isMarked && currentSquare.markedBy !== user.uid) {
			return;
		}
	
		const newCard = [...game.card];
		newCard[index] = { 
			...newCard[index], 
			isMarked: true,
			markedBy: user.uid,
			imageUrl: imageUrl
		};
		const newHasWon = checkWin(newCard, user.uid);
	
		const updatedGame: Partial<Game> = {
			...game,
			card: newCard,
			hasWon: newHasWon,
		};
	
		if (newHasWon) {
			updatedGame.winner = user.uid;
		}
	
		set(ref(database, `games/${params.id}`), updatedGame)
			.then(() => {
				console.log('Game updated successfully');
			})
			.catch((error) => {
				console.error('Error updating game:', error);
			});
	}, [game, user, params.id]);

  const handleLeaveGame = useCallback(() => {
    if (!user || !game) return;

    const updatedPlayers = { ...game.players };
    delete updatedPlayers[user.uid];

    if (Object.keys(updatedPlayers).length === 0) {
      // If no players left, delete the game
      remove(ref(database, `games/${params.id}`))
        .then(() => {
          console.log('Game deleted successfully');
          router.push('/lobby');
        })
        .catch((error) => {
          console.error('Error deleting game:', error);
        });
    } else {
      // Update the game with the player removed
      const updatedGame = {
        ...game,
        players: updatedPlayers,
      };
      set(ref(database, `games/${params.id}`), updatedGame)
        .then(() => {
          console.log('Player removed from game successfully');
          router.push('/lobby');
        })
        .catch((error) => {
          console.error('Error removing player from game:', error);
        });
    }
  }, [game, user, params.id, router]);

  if (loading || !game || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 bg-black h-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">{game.name}</h1>
      <BingoCard card={game.card} onToggleSquare={handleToggleSquare} players={game.players} currentPlayerId={user.uid} />
      <button
        onClick={handleLeaveGame}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Leave Game
      </button>
      {game.hasWon && <h2 className="text-2xl font-bold mt-4 text-white">
        {game.winner === user.uid ? 'You won!' : `${game.players[game.winner!]?.name} won!`}
      </h2>}
			<PlayerList players={game.players} currentPlayerId={user.uid} />
    </div>
  );
}