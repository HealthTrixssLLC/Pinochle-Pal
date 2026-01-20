import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Player, GameConfig, GameType, Round, calculateRoundScores } from './game-logic';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  players: Player[];
  activeGame: GameState | null;
  savedGames: GameState[]; // History
  
  // Actions
  addPlayer: (name: string) => void;
  updatePlayerStats: (playerId: string, won: boolean, score: number) => void;
  
  startGame: (config: GameConfig) => void;
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

      addPlayer: (name) => set((state) => ({
        players: [
          ...state.players,
          {
            id: uuidv4(),
            name,
            stats: { gamesPlayed: 0, gamesWon: 0, highScore: 0 }
          }
        ]
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
        const newGame: GameState = {
          id: uuidv4(),
          config,
          rounds: [],
          status: 'playing',
          createdAt: Date.now(),
        };
        set({ activeGame: newGame });
      },

      resumeGame: (gameId) => {
        const game = get().savedGames.find(g => g.id === gameId);
        if (game) {
          set({ activeGame: game });
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

        // Check for Winner
        // Calculate totals
        const totals = new Array(activeGame.config.playerIds.length).fill(0);
        updatedGame.rounds.forEach(r => {
          r.roundScores.forEach((s, i) => totals[i] += s);
        });

        const target = activeGame.config.targetScore;
        let winnerIndex = -1;
        
        // Simple win check: Highest score >= target
        // Pinochle rule: If both cross target, bidder wins if they were the bidder on the last hand? 
        // Or highest score? Let's stick to highest score for now, but mark game finished.
        
        const potentialWinners = totals.map((s, i) => ({ score: s, index: i })).filter(p => p.score >= target);
        
        if (potentialWinners.length > 0) {
           updatedGame.status = 'finished';
           // If multiple cross, usually current bidder wins if they are one of them.
           // Otherwise highest score.
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
           status: 'playing' as const, // Re-open if it was finished
           winnerIndex: undefined
         };
         
         set({ activeGame: updatedGame });
      }
    }),
    {
      name: 'pinochle-storage',
    }
  )
);
