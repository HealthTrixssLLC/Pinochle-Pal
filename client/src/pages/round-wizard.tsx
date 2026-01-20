import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { SUITS, Suit, MELD_TYPES } from "@/lib/game-logic";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Calculator, X, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RoundWizard() {
  const [, setLocation] = useLocation();
  const { activeGame, addRound, players } = useStore();
  const [step, setStep] = useState<"bid" | "trump" | "scores">("bid");

  if (!activeGame) return null;

  const isTeamGame = activeGame.config.type === '4-handed';

  // Local state for the round
  const [bidderIndex, setBidderIndex] = useState<number>(0);
  const [bidAmount, setBidAmount] = useState<string>("250"); 
  const [trumpSuit, setTrumpSuit] = useState<Suit>("spades");
  
  const [meldScores, setMeldScores] = useState<number[]>(new Array(activeGame.config.playerIds.length).fill(0));
  const [trickScores, setTrickScores] = useState<number[]>(new Array(activeGame.config.playerIds.length).fill(0));

  // Meld Calculator State
  const [activeMeldPlayerIdx, setActiveMeldPlayerIdx] = useState<number | null>(null);
  const [meldCounts, setMeldCounts] = useState<Record<string, number>>({}); 

  // Validation State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const getPlayerName = (idx: number) => {
    const id = activeGame.config.playerIds[idx];
    return players.find(p => p.id === id)?.name || `Player ${idx + 1}`;
  };

  const handleNext = () => {
    if (step === "bid") setStep("trump");
    else if (step === "trump") setStep("scores");
    else validateAndSubmit();
  };

  const validateAndSubmit = () => {
      // Validation Logic
      const totalTricks = trickScores.reduce((a, b) => a + b, 0);
      const warnings: string[] = [];

      // 1. Trick Total Check (Standard is 250)
      if (totalTricks !== 250) {
          warnings.push(`Total trick points equal ${totalTricks}, but standard is 250.`);
      }

      // 2. Outlier Checks
      // Meld > 400 is rare in single deck (Double Run + others? Double Run is 150+150=300? No, Double Run is 1500 in some, 150 in others? 
      // In this app Run is 150. Double Run isn't explicitly in list, but Double Pinochle is 300.
      // 400 is a safe "suspiciously high" threshold for warning.
      if (meldScores.some(m => m > 500)) {
          warnings.push("One or more players has an unusually high meld score (> 500).");
      }
      
      // Tricks > 250 is impossible
      if (trickScores.some(t => t > 250)) {
          warnings.push("One player has > 250 trick points, which is impossible.");
      }

      if (warnings.length > 0) {
          setValidationError(warnings.join("\n"));
          setShowValidationDialog(true);
      } else {
          submitRound();
      }
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

  // Meld Logic
  const openMeldCalculator = (playerIdx: number) => {
    setActiveMeldPlayerIdx(playerIdx);
    setMeldCounts({}); // Reset temporary counts
  };

  const addMeldItem = (meldId: string, points: number) => {
     setMeldCounts(prev => ({
        ...prev,
        [meldId]: (prev[meldId] || 0) + 1
     }));
  };

  const removeMeldItem = (meldId: string) => {
     setMeldCounts(prev => ({
        ...prev,
        [meldId]: 0 // "X to clear it out" as requested
     }));
  };

  const confirmMeldCalc = () => {
    if (activeMeldPlayerIdx === null) return;
    
    let total = 0;
    Object.entries(meldCounts).forEach(([id, count]) => {
       const type = MELD_TYPES.find(m => m.id === id);
       if (type) total += type.points * count;
    });

    const newMelds = [...meldScores];
    newMelds[activeMeldPlayerIdx] = total;
    setMeldScores(newMelds);
    setActiveMeldPlayerIdx(null);
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
                 {activeGame.config.playerIds.map((id, idx) => {
                    let teamLabel = "";
                    if (isTeamGame) {
                        const teamNum = (idx % 2) + 1;
                        teamLabel = `Team ${teamNum}`;
                    }

                    return (
                    <div key={id} className={`bg-white/5 rounded-lg p-4 border ${idx === bidderIndex ? 'border-primary/50' : 'border-white/10'}`}>
                       <div className="flex justify-between items-center mb-4">
                          <div className="flex flex-col">
                              {teamLabel && <span className="text-[10px] text-muted-foreground uppercase">{teamLabel}</span>}
                              <span className="font-bold text-lg flex items-center gap-2">
                                {getPlayerName(idx)}
                                {idx === bidderIndex && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase">Bidder</span>}
                              </span>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-muted-foreground uppercase flex items-center gap-2 mb-1">
                                Meld
                                <span className="text-[10px] bg-white/10 px-1 rounded text-white/50">Tap to Calc</span>
                            </label>
                            <button 
                               onClick={() => openMeldCalculator(idx)}
                               className="w-full bg-black/20 border border-white/10 rounded p-3 text-xl font-mono text-left flex justify-between items-center hover:bg-white/5 active:bg-white/10 transition-colors"
                            >
                               {meldScores[idx] || "0"}
                               <Calculator className="h-4 w-4 text-primary opacity-50" />
                            </button>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground uppercase mb-1 block">Tricks</label>
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
                 )})}
                 
                 <div className={`text-center text-sm ${trickScores.reduce((a,b) => a+b, 0) !== 250 ? 'text-red-400 font-bold' : 'text-muted-foreground'}`}>
                    Total Trick Points: {trickScores.reduce((a,b) => a+b, 0)} {trickScores.reduce((a,b) => a+b, 0) !== 250 && "(Should be 250)"}
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

        {/* Meld Calculator Dialog/Sheet */}
        <Dialog open={activeMeldPlayerIdx !== null} onOpenChange={(open) => !open && setActiveMeldPlayerIdx(null)}>
           <DialogContent className="h-[80vh] flex flex-col p-0 gap-0 bg-background border-white/10">
              <DialogHeader className="p-4 border-b border-white/10 bg-black/20">
                 <DialogTitle className="flex justify-between items-center">
                    <span>Calculate Meld</span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {activeMeldPlayerIdx !== null && getPlayerName(activeMeldPlayerIdx)}
                    </span>
                 </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="flex-1 p-4">
                 <div className="space-y-6">
                    {(['class-a', 'class-b', 'class-c'] as const).map(group => (
                        <div key={group}>
                            <h4 className="text-xs uppercase text-primary font-bold mb-3 tracking-wider">
                                {group === 'class-a' ? 'Runs & Marriages' : group === 'class-b' ? 'Arounds' : 'Special'}
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {MELD_TYPES.filter(m => m.group === group).map(meld => {
                                    const count = meldCounts[meld.id] || 0;
                                    return (
                                        <button 
                                            key={meld.id}
                                            onClick={() => addMeldItem(meld.id, meld.points)}
                                            className={`
                                                relative p-3 rounded-xl border text-left transition-all
                                                ${count > 0 ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-2xl">{meld.icon}</span>
                                                {count > 0 && (
                                                    <div 
                                                        onClick={(e) => { e.stopPropagation(); removeMeldItem(meld.id); }}
                                                        className="bg-black/40 hover:bg-red-500/80 rounded-full p-1 -mr-1 -mt-1 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-bold text-sm leading-tight">{meld.label}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{meld.points} pts</div>
                                            
                                            {count > 0 && (
                                                <div className="absolute top-2 right-8 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                                    x{count}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                 </div>
              </ScrollArea>

              <div className="p-4 border-t border-white/10 bg-black/20 safe-area-bottom">
                 <div className="flex justify-between items-center mb-4 px-2">
                    <span className="text-sm text-muted-foreground">Total Meld</span>
                    <span className="text-3xl font-mono font-bold text-primary">
                        {Object.entries(meldCounts).reduce((acc, [id, count]) => {
                            const type = MELD_TYPES.find(m => m.id === id);
                            return acc + (type ? type.points * count : 0);
                        }, 0)}
                    </span>
                 </div>
                 <Button className="w-full h-12 text-lg font-serif" onClick={confirmMeldCalc}>
                    Confirm Meld
                 </Button>
              </div>
           </DialogContent>
        </Dialog>

        {/* Validation Error Dialog */}
        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
            <DialogContent className="bg-background border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-yellow-500">
                        <AlertTriangle className="h-5 w-5" />
                        Check Scores
                    </DialogTitle>
                    <DialogDescription className="whitespace-pre-line pt-2">
                        {validationError}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:justify-start">
                    <Button variant="ghost" onClick={() => setShowValidationDialog(false)}>Go Back & Fix</Button>
                    <Button variant="destructive" onClick={() => { setShowValidationDialog(false); submitRound(); }}>Submit Anyway</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
