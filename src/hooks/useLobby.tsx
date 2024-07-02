import { auth, database } from '@/lib/firebase';
import { generateCard } from '@/lib/gameLogic';
import { Game } from '@/types';
import { onValue, push, ref, remove, set } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useLobby() {
  const [user, loading] = useAuthState(auth);
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    console.log('Setting up games listener');
    const gamesRef = ref(database, 'games');
    const unsubscribe = onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Received games data:', data);
      if (data) {
        const gameList = Object.entries(data).map(([id, game]) => ({
          id,
          ...(game as Omit<Game, 'id'>),
        }));
        console.log('Processed game list:', gameList);
        setGames(gameList);
      } else {
        console.log('No games available');
        setGames([]);
      }
    }, (error) => {
      console.error('Error fetching games:', error);
    });

    return () => {
      console.log('Unsubscribing from games listener');
      unsubscribe();
    };
  }, [user]);

  const createGame = (gameName: string) => {
    if (!user) return;
    const gamesRef = ref(database, 'games');
    const newGameRef = push(gamesRef);
    const newGameKey = newGameRef.key;
    if (!newGameKey) {
      console.error('Failed to generate new game key');
      return;
    }
    const newGame = {
      name: gameName,
      createdBy: user.uid,
      players: {
        [user.uid]: user.displayName,
      },
      card: generateCard(),
      hasWon: false,
    };
    set(newGameRef, newGame)
      .then(() => {
        console.log('New game created:', newGame);
        router.push(`/game/${newGameKey}`);
      })
      .catch((error) => {
        console.error('Error creating game:', error);
      });
  };

  const joinGame = (gameId: string) => {
    if (!user) return;
    const gameRef = ref(database, `games/${gameId}/players/${user.uid}`);
    set(gameRef, user.displayName)
      .then(() => {
        console.log('Joined game:', gameId);
        router.push(`/game/${gameId}`);
      })
      .catch((error) => {
        console.error('Error joining game:', error);
      });
  };

  const deleteGame = (gameId: string) => {
    if (!user) return;
    const gameRef = ref(database, `games/${gameId}`);
    remove(gameRef)
      .then(() => {
        console.log('Game deleted:', gameId);
      })
      .catch((error) => {
        console.error('Error deleting game:', error);
      });
  };

  return { user, loading, games, createGame, joinGame, deleteGame };
}