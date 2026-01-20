import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Layout, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SUITS, Suit } from "@/lib/game-logic";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

export default function RoundWizard() {
  const [, setLocation] = useLocation();
  const { activeGame, addRound, players } = useStore();
  const [step, setStep] = useState<"bid" | "trump" | "scores">("bid");

  if (!activeGame) return null;

  // Local state for the round
  const [bidderIndex, setBidderIndex] = useState<number>(0);
  const [bidAmount, setBidAmount] = useState<string>("250"); // String for keypad input
  const [trumpSuit, setTrumpSuit] = useState<Suit>("spades");
  
  // Scores state
  // We need to store Meld and Tricks for each player/team.
  // Even in team mode, we can input per team? 
  // Let's stick to per-player input for flexibility, but group them visually if team.
  const [meldScores, setMeldScores] = useState<number[]>(new Array(activeGame.config.playerIds.length).fill(0));
  const [trickScores, setTrickScores] = useState<number[]>(new Array(activeGame.config.playerIds.length).fill(0));

  const getPlayerName = (idx: number) => {
    const id = activeGame.config.playerIds[idx];
    return players.find(p => p.id === id)?.name || `Player ${idx + 1}`;
  };

  const handleNext = () => {
    if (step === "bid") setStep("trump");
    else if (step === "trump") setStep("scores");
    else submitRound();
  };

  const submitRound = () => {
    addRound({
      bidderIndex,
      bidAmount: parseInt(bidAmount) || 0,
      trumpSuit,
      meld: meldScores,
      tricks: trickScores
    });
    setLocation("/game");
  };

  // Numpad Component
  const Numpad = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
    <div className="grid grid-cols-3 gap-2 mt-4 max-w-xs mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, "00", 0, "C"].map((key) => (
        <button
          key={key}
          onClick={() => {
            if (key === "C") onChange(value.slice(0, -1));
            else onChange(value + key.toString());
          }}
          className="h-14 rounded-lg bg-white/5 border border-white/10 text-xl font-bold active:bg-white/20 transition-colors"
        >
          {key === "C" ? "⌫" : key}
        </button>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Step Indicator */}
        <div className="p-4 bg-black/20 flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest">
           <button onClick={() => setStep("bid")} className={step === 'bid' ? "text-primary font-bold" : ""}>1. Bid</button>
           <span className="opacity-20">/</span>
           <button onClick={() => setStep("trump")} className={step === 'trump' ? "text-primary font-bold" : ""}>2. Suit</button>
           <span className="opacity-20">/</span>
           <button onClick={() => setStep("scores")} className={step === 'scores' ? "text-primary font-bold" : ""}>3. Score</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: BID */}
            {step === "bid" && (
              <motion.div 
                key="bid"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center pt-8"
              >
                <div>
                   <label className="text-muted-foreground text-sm uppercase tracking-wide">Who took the bid?</label>
                   <div className="flex flex-wrap justify-center gap-3 mt-4">
                     {activeGame.config.playerIds.map((id, idx) => (
                        <button
                          key={id}
                          onClick={() => setBidderIndex(idx)}
                          className={`
                            px-4 py-2 rounded-full border transition-all text-sm font-bold
                            ${bidderIndex === idx 
                                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(234,179,8,0.4)]" 
                                : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5"}
                          `}
                        >
                          {getPlayerName(idx)}
                        </button>
                     ))}
                   </div>
                </div>

                <div>
                  <label className="text-muted-foreground text-sm uppercase tracking-wide">Bid Amount</label>
                  <div className="text-6xl font-serif font-bold text-white mt-2 mb-4 tracking-tighter">
                     {bidAmount || "0"}
                  </div>
                  <Numpad value={bidAmount} onChange={setBidAmount} />
                </div>
              </motion.div>
            )}

            {/* STEP 2: TRUMP */}
            {step === "trump" && (
              <motion.div 
                 key="trump"
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 className="space-y-8 text-center pt-12"
              >
                 <h2 className="text-2xl font-serif">Select Trump Suit</h2>
                 <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    {SUITS.map((s) => (
                       <button
                         key={s.value}
                         onClick={() => setTrumpSuit(s.value)}
                         className={`
                           aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all
                           ${trumpSuit === s.value
                             ? "border-primary bg-primary/10 scale-105 shadow-lg"
                             : "border-white/10 bg-black/20 opacity-70 grayscale hover:grayscale-0 hover:opacity-100"}
                         `}
                       >
                          <span className={`text-6xl mb-2 ${s.color}`}>{s.symbol}</span>
                          <span className="text-xs uppercase tracking-widest font-bold">{s.label}</span>
                       </button>
                    ))}
                 </div>
              </motion.div>
            )}

            {/* STEP 3: SCORES */}
            {step === "scores" && (
              <motion.div 
                 key="scores"
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
              >
                 {activeGame.config.playerIds.map((id, idx) => (
                    <div key={id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                       <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-lg flex items-center gap-2">
                            {getPlayerName(idx)}
                            {idx === bidderIndex && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase">Bidder</span>}
                          </span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-muted-foreground uppercase">Meld</label>
                            <input 
                              type="number" 
                              pattern="[0-9]*"
                              inputMode="numeric"
                              className="w-full bg-black/20 border border-white/10 rounded p-3 text-xl font-mono focus:border-primary outline-none"
                              value={meldScores[idx] || ""}
                              onChange={(e) => {
                                 const newMelds = [...meldScores];
                                 newMelds[idx] = parseInt(e.target.value) || 0;
                                 setMeldScores(newMelds);
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground uppercase">Tricks</label>
                            <input 
                              type="number"
                              pattern="[0-9]*"
                              inputMode="numeric"
                              className="w-full bg-black/20 border border-white/10 rounded p-3 text-xl font-mono focus:border-primary outline-none"
                              value={trickScores[idx] || ""}
                              onChange={(e) => {
                                 const newTricks = [...trickScores];
                                 newTricks[idx] = parseInt(e.target.value) || 0;
                                 setTrickScores(newTricks);
                              }}
                              placeholder="0"
                            />
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 <div className="text-center text-sm text-muted-foreground">
                    Total Trick Points: {trickScores.reduce((a,b) => a+b, 0)} (Should be ~250)
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Floating Action Button area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-white/10">
           <div className="flex gap-4">
             {step !== 'bid' && (
               <Button variant="outline" onClick={() => {
                 if(step === 'scores') setStep('trump');
                 if(step === 'trump') setStep('bid');
               }} className="h-14 aspect-square rounded-full border-white/10">
                 <ChevronLeft />
               </Button>
             )}
             
             <Button className="flex-1 h-14 rounded-full text-lg font-serif bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" onClick={handleNext}>
                {step === 'scores' ? "Finish Round" : "Next"} <ChevronRight className="ml-2" />
             </Button>
           </div>
        </div>
      </div>
    </Layout>
  );
}
