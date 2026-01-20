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

// Meld Definitions
export interface MeldType {
  id: string;
  label: string;
  points: number;
  icon?: string; // Emoji or Lucide icon name
  group: 'class-a' | 'class-b' | 'class-c';
}

export const MELD_TYPES: MeldType[] = [
  // Class A (Suits)
  { id: 'run', label: 'Run', points: 150, group: 'class-a', icon: '🏃' },
  { id: 'royal-marriage', label: 'Royal Marriage', points: 40, group: 'class-a', icon: '👑' },
  { id: 'common-marriage', label: 'Common Marriage', points: 20, group: 'class-a', icon: '💍' },
  { id: 'dix', label: 'Dix (9 of Trump)', points: 10, group: 'class-a', icon: '9️⃣' },
  
  // Class B (Numbers)
  { id: 'aces-around', label: 'Aces Around', points: 100, group: 'class-b', icon: '🅰️' },
  { id: 'kings-around', label: 'Kings Around', points: 80, group: 'class-b', icon: '🤴' },
  { id: 'queens-around', label: 'Queens Around', points: 60, group: 'class-b', icon: '👸' },
  { id: 'jacks-around', label: 'Jacks Around', points: 40, group: 'class-b', icon: '👶' },

  // Class C (Special)
  { id: 'pinochle', label: 'Pinochle', points: 40, group: 'class-c', icon: '🃏' },
  { id: 'double-pinochle', label: 'Double Pinochle', points: 300, group: 'class-c', icon: '🎭' },
];

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
  // In 4-handed partnership, we need to sum the team's score to check against bid
  let bidderScoreToCheck = scores[bidderIndex];
  
  if (type === '4-handed') {
     // Identify partner index
     // If bidder is 0 (Team 1), partner is 2.
     // If bidder is 1 (Team 2), partner is 3.
     // If bidder is 2 (Team 1), partner is 0.
     // If bidder is 3 (Team 2), partner is 1.
     const partnerIndex = (bidderIndex + 2) % 4;
     bidderScoreToCheck = scores[bidderIndex] + scores[partnerIndex];
  }

  if (bidderScoreToCheck < bidAmount) {
    wentSet = true;
    
    // Calculate penalty
    // 4-handed: Subtract bid amount from the TEAM score.
    // 3-handed/2-handed: Subtract bid amount from PLAYER score.
    
    // Implementation:
    // We modify the scores array directly.
    // However, the `scores` array currently holds individual totals (meld + tricks).
    // If set, the team gets 0 points for meld/tricks, and loses the bid amount.
    
    if (type === '4-handed') {
        const partnerIndex = (bidderIndex + 2) % 4;
        // Reset both partners to 0 first (they lose meld/tricks)
        // Wait, rule variations exist. Standard: "If the bidding side fails to make the bid, the amount of the bid is subtracted from their score. They receive no credit for any melds or tricks won."
        scores[bidderIndex] = 0;
        scores[partnerIndex] = 0;
        
        // Apply penalty to the bidder's slot (so it sums correctly later)
        // Or split it? Usually applied to the team total.
        // Let's apply -Bid to the bidder, and 0 to partner. 
        // When summed for team display, it will be correct (-Bid + 0 = -Bid).
        scores[bidderIndex] = -bidAmount;
    } else {
        // Individual play
        scores[bidderIndex] = -bidAmount;
    }
  }

  return { scores, wentSet };
};

export const SUITS: { value: Suit; label: string; symbol: string; color: string }[] = [
  { value: 'hearts', label: 'Hearts', symbol: '♥', color: 'text-red-500' },
  { value: 'diamonds', label: 'Diamonds', symbol: '♦', color: 'text-blue-500' }, 
  { value: 'clubs', label: 'Clubs', symbol: '♣', color: 'text-slate-900 dark:text-slate-100' },
  { value: 'spades', label: 'Spades', symbol: '♠', color: 'text-slate-900 dark:text-slate-100' },
];
