import { useStore } from "@/lib/store";
import { Layout, SafeAreaTop } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useLocation, Redirect } from "wouter";
import { Plus, RotateCcw, BarChart3, ChevronLeft } from "lucide-react";
import { SUITS } from "@/lib/game-logic";

export default function Game() {
  const [, setLocation] = useLocation();
  const { activeGame, quitActiveGame, deleteLastRound, players } = useStore();

  if (!activeGame) {
    return <Redirect to="/" />;
  }

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || "Unknown";

  const isTeamGame = activeGame.config.type === '4-handed';
  const displayEntities = isTeamGame 
    ? [{ name: "Team 1", ids: [activeGame.config.playerIds[0], activeGame.config.playerIds[2]] }, { name: "Team 2", ids: [activeGame.config.playerIds[1], activeGame.config.playerIds[3]] }]
    : activeGame.config.playerIds.map(id => ({ name: getPlayerName(id), ids: [id] }));

  const totals = displayEntities.map(() => 0);
  activeGame.rounds.forEach(r => {
    if (isTeamGame) {
       totals[0] += (r.roundScores[0] + r.roundScores[2]);
       totals[1] += (r.roundScores[1] + r.roundScores[3]);
    } else {
       r.roundScores.forEach((s, i) => totals[i] += s);
    }
  });

  return (
    <Layout>
      <SafeAreaTop />
      <header className="flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
         <Button 
           variant="ghost" 
           size="sm" 
           onClick={() => { quitActiveGame(); setLocation("/"); }} 
           className="text-muted-foreground min-w-[44px] min-h-[44px]"
           data-testid="button-quit-game"
         >
           <ChevronLeft className="h-5 w-5 mr-1" />
           Quit
         </Button>
         <div className="text-center flex flex-col items-center">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase" data-testid="text-target-score">Target: {activeGame.config.targetScore}</h2>
            {activeGame.status === 'finished' && <span className="text-[10px] text-primary animate-pulse" data-testid="text-game-over">GAME OVER</span>}
         </div>
         <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={() => setLocation("/game/stats")} className="min-w-[44px] min-h-[44px]" data-testid="button-view-stats">
               <BarChart3 className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" onClick={() => setLocation("/rules")} className="min-w-[44px] min-h-[44px]" data-testid="button-view-rules">
               <span className="font-serif font-bold italic text-lg">i</span>
             </Button>
         </div>
      </header>

      <div className={`grid ${isTeamGame ? 'grid-cols-2' : `grid-cols-${displayEntities.length}`} gap-px bg-white/10 border-b border-white/10`}>
         {displayEntities.map((entity, i) => (
           <div key={i} className={`p-4 text-center bg-background/50 ${totals[i] >= activeGame.config.targetScore ? 'text-primary' : ''}`} data-testid={`score-entity-${i}`}>
             <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 truncate px-1" data-testid={`text-entity-name-${i}`}>{entity.name}</div>
             <div className="text-3xl font-serif font-bold" data-testid={`text-entity-score-${i}`}>{totals[i]}</div>
           </div>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {activeGame.rounds.map((round, idx) => (
           <div key={round.id} className="bg-card/50 rounded-lg p-3 border border-white/5 text-sm relative group" data-testid={`round-card-${idx}`}>
              <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                <span className="text-xs text-muted-foreground font-mono" data-testid={`text-round-number-${idx}`}>Round {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Bid: <span className="text-white font-bold" data-testid={`text-bid-amount-${idx}`}>{round.bidAmount}</span> by {getPlayerName(activeGame.config.playerIds[round.bidderIndex]).split(' ')[0]}
                  </span>
                  {round.wentSet && <span className="text-[10px] bg-red-500/20 text-red-400 px-1 rounded" data-testid={`badge-set-${idx}`}>SET</span>}
                  <span className={SUITS.find(s => s.value === round.trumpSuit)?.color} data-testid={`icon-trump-${idx}`}>
                    {SUITS.find(s => s.value === round.trumpSuit)?.symbol}
                  </span>
                </div>
              </div>
              
              <div className={`grid ${isTeamGame ? 'grid-cols-2' : `grid-cols-${displayEntities.length}`} gap-4 text-center`}>
                 {displayEntities.map((_, i) => {
                    let score = 0;
                    if (isTeamGame) {
                      if (i === 0) score = round.roundScores[0] + round.roundScores[2];
                      if (i === 1) score = round.roundScores[1] + round.roundScores[3];
                    } else {
                      score = round.roundScores[i];
                    }
                    
                    return (
                       <div key={i} className="flex flex-col">
                          <span className={`font-mono ${score < 0 ? 'text-red-400' : 'text-white'}`} data-testid={`text-round-score-${idx}-${i}`}>{score}</span>
                       </div>
                    );
                 })}
              </div>
           </div>
        ))}

        {activeGame.rounds.length === 0 && (
          <div className="text-center py-10 text-muted-foreground/40 italic" data-testid="text-no-rounds">
            No rounds played yet. Tap + to start.
          </div>
        )}
      </div>

      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-black/40 backdrop-blur border-t border-white/10 flex gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={deleteLastRound} 
          disabled={activeGame.rounds.length === 0} 
          className="border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 min-w-[44px] min-h-[44px]"
          data-testid="button-undo-round"
        >
           <RotateCcw className="h-5 w-5" />
        </Button>
        <Button 
           className="flex-1 h-12 text-lg font-serif bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" 
           onClick={() => setLocation("/game/round")}
           disabled={activeGame.status === 'finished'}
           data-testid="button-score-round"
        >
          {activeGame.status === 'finished' ? "Game Finished" : <><Plus className="mr-2" /> Score Round</>}
        </Button>
      </div>
    </Layout>
  );
}
