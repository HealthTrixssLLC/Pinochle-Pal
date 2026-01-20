export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type GameType = '2-handed' | '3-handed' | '4-handed';

export interface Player {
  id: string;
  name: string;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    highScore: number;
  };
}

export interface Round {
  id: string;
  bidderIndex: number;
  bidAmount: number;
  trumpSuit: Suit;
  meld: number[];
  tricks: number[];
  roundScores: number[]; // Net score for this round (after checking set)
  wentSet: boolean;
}

export interface GameConfig {
  type: GameType;
  targetScore: number;
  playerIds: string[];
  teamMode: boolean; // True for 4-handed partnership
}

export interface GameState {
  id: string;
  config: GameConfig;
  rounds: Round[];
  status: 'setup' | 'playing' | 'finished';
  winnerIndex?: number;
  createdAt: number;
}

// Logic Helpers

export const calculateRoundScores = (
  type: GameType,
  bidderIndex: number,
  bidAmount: number,
  meld: number[],
  tricks: number[]
): { scores: number[]; wentSet: boolean } => {
  const playerCount = meld.length;
  const scores = new Array(playerCount).fill(0);
  let wentSet = false;

  // Basic summation first
  for (let i = 0; i < playerCount; i++) {
    scores[i] = meld[i] + tricks[i];
  }

  // Check if bidder made their bid
  const bidderTotal = scores[bidderIndex];
  
  // In partnership (4-handed), usually the partner's score counts towards the bid?
  // User asked for "4 handed pinochle", usually implies partnership.
  // "Forehanded" in prompt likely typo for "Four handed".
  // Standard rule: Bidder needs (Meld + Tricks) >= Bid.
  
  if (bidderTotal < bidAmount) {
    wentSet = true;
    // If set, score is usually -BidAmount.
    // Meld is lost? Rules vary. Standard: If bid fails, entire score for that hand is subtracted?
    // "Single Deck Partnership Pinochle": If bid fails, the amount of the bid is subtracted from the bidding side's score. They get no credit for tricks or meld.
    scores[bidderIndex] = -bidAmount;
  }

  // Partnership handling would happen at the game level (summing indices 0+2 and 1+3), 
  // but for raw round calculation, we return individual/team index scores.
  // If 4-handed, we assume inputs are already combined per team? 
  // Let's assume the UI handles "Team A" and "Team B" inputs for 4-handed.
  
  return { scores, wentSet };
};

export const SUITS: { value: Suit; label: string; symbol: string; color: string }[] = [
  { value: 'hearts', label: 'Hearts', symbol: '♥', color: 'text-red-500' },
  { value: 'diamonds', label: 'Diamonds', symbol: '♦', color: 'text-blue-500' }, // Standard US decks sometimes use blue/orange, but let's stick to standard Red for now, or maybe Orange for Diamonds to distinguish? 
  // Actually, standard pinochle: H/D red, S/C black.
  // Let's use standard colors.
  { value: 'clubs', label: 'Clubs', symbol: '♣', color: 'text-slate-900 dark:text-slate-100' },
  { value: 'spades', label: 'Spades', symbol: '♠', color: 'text-slate-900 dark:text-slate-100' },
];

// Override for diamond color if desired, standard is red.
