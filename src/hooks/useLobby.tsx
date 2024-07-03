import { auth, database } from '@/lib/firebase';
import { generateCard } from '@/lib/gameLogic';
import { Game, Player } from '@/types';
import { get, onValue, push, ref, remove, set } from 'firebase/database';
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

	function getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
	}

	function getUniqueColor(existingColors: string[]): string {
			let newColor = getRandomColor();

			while (existingColors.includes(newColor)) {
					newColor = getRandomColor();
			}

			existingColors.push(newColor);
			return newColor;
}

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
        [user.uid]: {
					id: user.uid,
					name: user.displayName || 'Anonymous',
					color: getUniqueColor([]),
				},
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
		const gameRef = ref(database, `games/${gameId}`);
		get(gameRef).then((snapshot: any) => {
			if (snapshot.exists()) {
				const gameData = snapshot.val();
				const existingColors = Object.values(gameData.players).map((p: any) => p.color);
				const newColor = getUniqueColor(existingColors);
				const playerData: Player = {
					id: user.uid,
					name: user.displayName || 'Anonymous',
					color: newColor,
				};
				set(ref(database, `games/${gameId}/players/${user.uid}`), playerData)
					.then(() => {
						console.log('Joined game:', gameId);
						router.push(`/game/${gameId}`);
					})
					.catch((error) => {
						console.error('Error joining game:', error);
					});
			} else {
				console.error('Game not found');
			}
		}).catch((error: any) => {
			console.error('Error fetching game data:', error);
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