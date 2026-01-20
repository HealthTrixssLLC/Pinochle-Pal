import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Player, GameConfig, Round, calculateRoundScores } from './game-logic';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  players: Player[];
  activeGame: GameState | null;
  savedGames: GameState[];
  
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerStats: (playerId: string, won: boolean, score: number) => void;
  
  startGame: (config: GameConfig) => boolean;
  resumeGame: (gameId: string) => void;
  quitActiveGame: () => void;
  
  addRound: (roundData: Omit<Round, 'id' | 'roundScores' | 'wentSet'>) => void;
  deleteLastRound: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      players: [],
      activeGame: null,
      savedGames: [],

      addPlayer: (name) => {
        if (!name || name.trim().length === 0) return;
        
        set((state) => ({
          players: [
            ...state.players,
            {
              id: uuidv4(),
              name: name.trim(),
              stats: { gamesPlayed: 0, gamesWon: 0, highScore: 0 }
            }
          ]
        }));
      },

      removePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id)
      })),

      updatePlayerStats: (playerId, won, score) => set((state) => ({
        players: state.players.map(p => {
          if (p.id !== playerId) return p;
          return {
            ...p,
            stats: {
              gamesPlayed: p.stats.gamesPlayed + 1,
              gamesWon: p.stats.gamesWon + (won ? 1 : 0),
              highScore: Math.max(p.stats.highScore, score)
            }
          };
        })
      })),

      startGame: (config) => {
        // Validation
        if (!config.playerIds || config.playerIds.length === 0) {
          console.error('Cannot start game: No players selected');
          return false;
        }
        
        const expectedPlayerCount = config.type === '2-handed' ? 2 : config.type === '3-handed' ? 3 : 4;
        if (config.playerIds.length !== expectedPlayerCount) {
          console.error(`Cannot start game: Expected ${expectedPlayerCount} players, got ${config.playerIds.length}`);
          return false;
        }
        
        if (!config.targetScore || config.targetScore < 100) {
          console.error('Cannot start game: Invalid target score');
          return false;
        }

        const newGame: GameState = {
          id: uuidv4(),
          config,
          rounds: [],
          status: 'playing',
          createdAt: Date.now(),
        };
        set({ activeGame: newGame });
        return true;
      },

      resumeGame: (gameId) => {
        const game = get().savedGames.find(g => g.id === gameId);
        if (game) {
          set((state) => ({
            activeGame: game,
            savedGames: state.savedGames.filter(g => g.id !== gameId)
          }));
        }
      },

      quitActiveGame: () => {
        const active = get().activeGame;
        if (active) {
          set((state) => ({
            activeGame: null,
            savedGames: [...state.savedGames.filter(g => g.id !== active.id), active]
          }));
        }
      },

      addRound: (roundData) => {
        const { activeGame } = get();
        if (!activeGame) return;

        // Validate round data
        if (roundData.bidderIndex < 0 || roundData.bidderIndex >= activeGame.config.playerIds.length) {
          console.error('Invalid bidder index');
          return;
        }
        
        if (roundData.bidAmount < 0) {
          console.error('Invalid bid amount');
          return;
        }

        const { scores, wentSet } = calculateRoundScores(
          activeGame.config.type,
          roundData.bidderIndex,
          roundData.bidAmount,
          roundData.meld,
          roundData.tricks
        );

        const newRound: Round = {
          id: uuidv4(),
          ...roundData,
          roundScores: scores,
          wentSet
        };

        const updatedGame = {
          ...activeGame,
          rounds: [...activeGame.rounds, newRound]
        };

        const totals = new Array(activeGame.config.playerIds.length).fill(0);
        updatedGame.rounds.forEach(r => {
          r.roundScores.forEach((s, i) => totals[i] += s);
        });

        const target = activeGame.config.targetScore;
        
        // For team games, check team totals
        let teamTotals = totals;
        if (activeGame.config.type === '4-handed') {
          teamTotals = [
            totals[0] + totals[2],
            totals[1] + totals[3]
          ];
        }
        
        const potentialWinners = teamTotals.map((s, i) => ({ score: s, index: i })).filter(p => p.score >= target);
        
        if (potentialWinners.length > 0) {
           updatedGame.status = 'finished';
           potentialWinners.sort((a, b) => b.score - a.score);
           updatedGame.winnerIndex = potentialWinners[0].index;
        }

        set({ activeGame: updatedGame });
      },

      deleteLastRound: () => {
         const { activeGame } = get();
         if (!activeGame || activeGame.rounds.length === 0) return;
         
         const updatedGame = {
           ...activeGame,
           rounds: activeGame.rounds.slice(0, -1),
           status: 'playing' as const,
           winnerIndex: undefined
         };
         
         set({ activeGame: updatedGame });
      }
    }),
    {
      name: 'pinochle-storage',
      version: 1,
    }
  )
);
