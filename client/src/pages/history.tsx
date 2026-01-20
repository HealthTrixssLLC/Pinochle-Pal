import { useStore } from "@/lib/store";
import { Layout, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Gamepad2, Trophy, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const [, setLocation] = useLocation();
  const { savedGames, resumeGame } = useStore();

  // Sort by newest first
  const sortedGames = [...savedGames].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Layout>
      <Header title="Game History" showBack />
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {sortedGames.map((game) => {
          const date = new Date(game.createdAt);
          const winnerId = game.winnerIndex !== undefined ? game.config.playerIds[game.winnerIndex] : null;
          // Note: winnerIndex logic in store might need refinement for teams, but assuming it works:
          
          return (
            <div 
              key={game.id}
              onClick={() => {
                resumeGame(game.id);
                setLocation("/game");
              }}
              className="bg-card p-4 rounded-lg border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {game.config.type === '4-handed' ? 'Partnership' : `${game.config.type}`}
                    {game.status === 'finished' && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase">Finished</span>}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" /> {format(date, 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              
              <div className="bg-black/20 rounded p-2 mt-2 text-sm grid grid-cols-2 gap-2">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-muted-foreground uppercase">Rounds</span>
                   <span className="font-mono">{game.rounds.length}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] text-muted-foreground uppercase">Target</span>
                   <span className="font-mono">{game.config.targetScore}</span>
                 </div>
              </div>
            </div>
          );
        })}

        {sortedGames.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No games played yet.</p>
            <Button variant="link" onClick={() => setLocation("/new-game")}>Start a Game</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
