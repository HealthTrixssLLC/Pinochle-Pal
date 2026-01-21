import { useStore } from "@/lib/store";
import { Layout, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trophy, Gamepad2 } from "lucide-react";
import { useState } from "react";

export default function Players() {
  const { players, addPlayer } = useStore();
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      addPlayer(name.trim());
      setName("");
    }
  };

  return (
    <Layout>
      <Header title="Players" showBack />
      <div className="p-6 space-y-6 flex-1 flex flex-col">
        <div className="flex gap-2">
          <Input 
            placeholder="New player name..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/20 border-white/10"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            data-testid="input-player-name"
          />
          <Button onClick={handleAdd} disabled={!name.trim()} className="min-w-[44px] min-h-[44px]" data-testid="button-add-player">Add</Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3 pb-8">
            {players.map((player, idx) => (
              <div key={player.id} className="bg-card p-4 rounded-lg border border-white/5 flex justify-between items-center" data-testid={`player-card-${idx}`}>
                <div>
                  <h3 className="font-bold text-lg" data-testid={`text-player-name-${idx}`}>{player.name}</h3>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1" data-testid={`text-games-played-${idx}`}><Gamepad2 className="h-3 w-3" /> {player.stats.gamesPlayed} Played</span>
                    <span className="flex items-center gap-1" data-testid={`text-games-won-${idx}`}><Trophy className="h-3 w-3 text-primary" /> {player.stats.gamesWon} Won</span>
                  </div>
                </div>
                <div className="text-2xl font-mono text-white/20" data-testid={`text-high-score-${idx}`}>
                  {player.stats.highScore}
                </div>
              </div>
            ))}
            {players.length === 0 && (
              <div className="text-center text-muted-foreground mt-10" data-testid="text-no-players">
                Add players to track their stats!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
}
