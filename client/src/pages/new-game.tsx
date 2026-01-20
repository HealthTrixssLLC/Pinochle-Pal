import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Layout, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Check, ArrowUp, ArrowDown } from "lucide-react";

export default function NewGame() {
  const [, setLocation] = useLocation();
  const { players, addPlayer, startGame } = useStore();
  
  // Form State
  const [gameType, setGameType] = useState<"2-handed" | "3-handed" | "4-handed">("3-handed");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [targetScore, setTargetScore] = useState("1000");
  const [newPlayerName, setNewPlayerName] = useState("");
  
  // Team Setup State (for 4-handed)
  // We'll store this as just the ordered list of selectedPlayers.
  // Index 0 & 2 = Team 1
  // Index 1 & 3 = Team 2

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName("");
    }
  };

  const togglePlayer = (id: string) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== id));
    } else {
      const max = gameType === "2-handed" ? 2 : gameType === "3-handed" ? 3 : 4;
      if (selectedPlayers.length < max) {
        setSelectedPlayers([...selectedPlayers, id]);
      }
    }
  };
  
  const movePlayer = (fromIndex: number, toIndex: number) => {
    const newOrder = [...selectedPlayers];
    const item = newOrder.splice(fromIndex, 1)[0];
    newOrder.splice(toIndex, 0, item);
    setSelectedPlayers(newOrder);
  };

  const handleStart = () => {
    startGame({
      type: gameType,
      targetScore: parseInt(targetScore),
      playerIds: selectedPlayers,
      teamMode: gameType === "4-handed"
    });
    setLocation("/game");
  };

  const maxPlayers = gameType === "2-handed" ? 2 : gameType === "3-handed" ? 3 : 4;
  const isReady = selectedPlayers.length === maxPlayers;
  const isTeamMode = gameType === "4-handed";

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || "Unknown";

  return (
    <Layout>
      <Header title="New Game" showBack />
      
      <div className="p-6 space-y-8 pb-24">
        
        {/* Step 1: Game Type */}
        <div className="space-y-3">
          <Label className="text-lg text-primary">Number of Players</Label>
          <div className="grid grid-cols-3 gap-3">
            {(["2-handed", "3-handed", "4-handed"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                    setGameType(type);
                    setSelectedPlayers([]); 
                }}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                  ${gameType === type 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-white/10 bg-black/20 text-muted-foreground hover:bg-white/5"}
                `}
              >
                <span className="text-2xl font-bold">{type.charAt(0)}</span>
                <span className="text-xs">{type === '4-handed' ? 'Partners' : 'Players'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Players */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-lg text-primary">Select {maxPlayers} Players</Label>
            <span className="text-xs text-muted-foreground">{selectedPlayers.length}/{maxPlayers}</span>
          </div>

          <div className="flex gap-2">
            <Input 
              placeholder="Add new player..." 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="bg-black/20 border-white/10"
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
            />
            <Button size="icon" onClick={handleAddPlayer} disabled={!newPlayerName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-40 rounded-md border border-white/10 bg-black/10 p-2">
            <div className="space-y-2">
              {players.map((player) => {
                const isSelected = selectedPlayers.includes(player.id);
                return (
                  <div 
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className={`
                      flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
                      ${isSelected ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"}
                    `}
                  >
                    <span className={isSelected ? "text-primary font-semibold" : "text-foreground"}>
                      {player.name}
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                );
              })}
              {players.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No players added yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Step 2.5: Team Setup (4-Handed Only) */}
        {isTeamMode && isReady && (
           <div className="space-y-3 bg-white/5 p-4 rounded-lg border border-white/10">
              <Label className="text-lg text-primary flex items-center gap-2">
                 Team Configuration
                 <span className="text-xs font-normal text-muted-foreground">(Drag to swap)</span>
              </Label>
              <p className="text-xs text-muted-foreground">Team 1: Players 1 & 3 • Team 2: Players 2 & 4</p>
              
              <div className="space-y-4 mt-4">
                 <div className="space-y-2">
                    <Label className="text-xs uppercase text-primary/80">Team 1</Label>
                    <div className="grid grid-cols-2 gap-2">
                       {[0, 2].map((idx) => (
                          <div key={selectedPlayers[idx]} className="bg-black/40 p-3 rounded flex justify-between items-center group">
                             <span>{getPlayerName(selectedPlayers[idx])}</span>
                             <div className="flex flex-col gap-1 opacity-50 group-hover:opacity-100">
                                {idx > 0 && <button onClick={() => movePlayer(idx, idx-1)}><ArrowUp className="h-3 w-3" /></button>}
                                {idx < 3 && <button onClick={() => movePlayer(idx, idx+1)}><ArrowDown className="h-3 w-3" /></button>}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-xs uppercase text-primary/80">Team 2</Label>
                    <div className="grid grid-cols-2 gap-2">
                       {[1, 3].map((idx) => (
                          <div key={selectedPlayers[idx]} className="bg-black/40 p-3 rounded flex justify-between items-center group">
                             <span>{getPlayerName(selectedPlayers[idx])}</span>
                             <div className="flex flex-col gap-1 opacity-50 group-hover:opacity-100">
                                {idx > 0 && <button onClick={() => movePlayer(idx, idx-1)}><ArrowUp className="h-3 w-3" /></button>}
                                {idx < 3 && <button onClick={() => movePlayer(idx, idx+1)}><ArrowDown className="h-3 w-3" /></button>}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Step 3: Target Score */}
        <div className="space-y-3">
          <Label className="text-lg text-primary">Game Point Limit</Label>
          <RadioGroup value={targetScore} onValueChange={setTargetScore} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000" id="r1" />
              <Label htmlFor="r1">1000</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1500" id="r2" />
              <Label htmlFor="r2">1500</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2000" id="r3" />
              <Label htmlFor="r3">2000</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full h-14 text-lg font-serif" 
            size="lg"
            disabled={!isReady}
            onClick={handleStart}
          >
            Start Game
          </Button>
        </div>

      </div>
    </Layout>
  );
}
