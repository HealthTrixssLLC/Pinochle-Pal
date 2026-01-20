import { useStore } from "@/lib/store";
import { Layout, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, AlertCircle, RotateCcw, BarChart3 } from "lucide-react";
import { SUITS } from "@/lib/game-logic";

export default function Game() {
  const [, setLocation] = useLocation();
  const { activeGame, quitActiveGame, deleteLastRound, players } = useStore();

  if (!activeGame) {
    // Redirect if no game
    setTimeout(() => setLocation("/"), 0);
    return null;
  }

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || "Unknown";

  const isTeamGame = activeGame.config.type === '4-handed';
  const displayEntities = isTeamGame 
    ? [{ name: "Team 1", ids: [activeGame.config.playerIds[0], activeGame.config.playerIds[2]] }, { name: "Team 2", ids: [activeGame.config.playerIds[1], activeGame.config.playerIds[3]] }]
    : activeGame.config.playerIds.map(id => ({ name: getPlayerName(id), ids: [id] }));

  // Calculate Totals
  const totals = displayEntities.map(() => 0);
  activeGame.rounds.forEach(r => {
    // If team game, combine 0+2 into index 0, and 1+3 into index 1
    if (isTeamGame) {
       totals[0] += (r.roundScores[0] + r.roundScores[2]);
       totals[1] += (r.roundScores[1] + r.roundScores[3]);
    } else {
       r.roundScores.forEach((s, i) => totals[i] += s);
    }
  });

  return (
    <Layout>
      <header className="flex items-center justify-between p-4 bg-black/20 border-b border-white/10">
         <Button variant="ghost" size="sm" onClick={() => { quitActiveGame(); setLocation("/"); }} className="text-muted-foreground">
           Quit
         </Button>
         <div className="text-center flex flex-col items-center">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase">Target: {activeGame.config.targetScore}</h2>
            {activeGame.status === 'finished' && <span className="text-[10px] text-primary animate-pulse">GAME OVER</span>}
         </div>
         <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={() => setLocation("/game/stats")}>
               <BarChart3 className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" onClick={() => setLocation("/rules")}>
               {/* Using a simple ? for rules if needed, or keep text */}
               <span className="font-serif font-bold italic">i</span>
             </Button>
         </div>
      </header>

      {/* Ad Harness (Placeholder) */}
      {/* <div className="w-full h-12 bg-white/5 border-b border-white/10 flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-widest">Ad Space</div> */}

      {/* Scoreboard Header */}
      <div className={`grid ${isTeamGame ? 'grid-cols-2' : `grid-cols-${displayEntities.length}`} gap-px bg-white/10 border-b border-white/10`}>
         {displayEntities.map((entity, i) => (
           <div key={i} className={`p-4 text-center bg-background/50 ${totals[i] >= activeGame.config.targetScore ? 'text-primary' : ''}`}>
             <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 truncate px-1">{entity.name}</div>
             <div className="text-3xl font-serif font-bold">{totals[i]}</div>
           </div>
         ))}
      </div>

      {/* Rounds List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {activeGame.rounds.map((round, idx) => (
           <div key={round.id} className="bg-card/50 rounded-lg p-3 border border-white/5 text-sm relative group">
              <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                <span className="text-xs text-muted-foreground font-mono">Round {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Bid: <span className="text-white font-bold">{round.bidAmount}</span> by {getPlayerName(activeGame.config.playerIds[round.bidderIndex]).split(' ')[0]}
                  </span>
                  {round.wentSet && <span className="text-[10px] bg-red-500/20 text-red-400 px-1 rounded">SET</span>}
                  <span className={SUITS.find(s => s.value === round.trumpSuit)?.color}>
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
                          <span className={`font-mono ${score < 0 ? 'text-red-400' : 'text-white'}`}>{score}</span>
                       </div>
                    );
                 })}
              </div>
           </div>
        ))}

        {activeGame.rounds.length === 0 && (
          <div className="text-center py-10 text-muted-foreground/40 italic">
            No rounds played yet. Tap + to start.
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-black/40 backdrop-blur border-t border-white/10 flex gap-4 safe-area-bottom">
        <Button variant="outline" size="icon" onClick={deleteLastRound} disabled={activeGame.rounds.length === 0} className="border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50">
           <RotateCcw className="h-5 w-5" />
        </Button>
        <Button 
           className="flex-1 h-12 text-lg font-serif bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" 
           onClick={() => setLocation("/game/round")}
           disabled={activeGame.status === 'finished'}
        >
          {activeGame.status === 'finished' ? "Game Finished" : <><Plus className="mr-2" /> Score Round</>}
        </Button>
      </div>
    </Layout>
  );
}
