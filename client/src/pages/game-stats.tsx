import { useStore } from "@/lib/store";
import { Layout, Header } from "@/components/layout";
import { useLocation, Redirect } from "wouter";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GameStats() {
  const [, setLocation] = useLocation();
  const { activeGame, players } = useStore();

  if (!activeGame) {
    return <Redirect to="/" />;
  }

  const isTeamGame = activeGame.config.type === '4-handed';
  const playerNames = activeGame.config.playerIds.map(id => players.find(p => p.id === id)?.name || "Unknown");
  
  const meldTotals = new Array(activeGame.config.playerIds.length).fill(0);
  const trickTotals = new Array(activeGame.config.playerIds.length).fill(0);
  const bidWins = new Array(activeGame.config.playerIds.length).fill(0);
  const setsTaken = new Array(activeGame.config.playerIds.length).fill(0);

  activeGame.rounds.forEach(round => {
     bidWins[round.bidderIndex]++;
     if (round.wentSet) setsTaken[round.bidderIndex]++;
     
     round.meld.forEach((m, i) => {
        meldTotals[i] += m;
     });
     round.tricks.forEach((t, i) => trickTotals[i] += t);
  });
  
  const scoreCompositionData = playerNames.map((name, i) => ({
      name: isTeamGame ? (i % 2 === 0 ? "Team 1" : "Team 2") : name.split(' ')[0],
      Meld: meldTotals[i],
      Tricks: trickTotals[i],
      playerIdx: i
  }));
  
  let finalChartData = scoreCompositionData;
  if (isTeamGame) {
      finalChartData = [
          { name: "Team 1", Meld: meldTotals[0] + meldTotals[2], Tricks: trickTotals[0] + trickTotals[2], playerIdx: 0 },
          { name: "Team 2", Meld: meldTotals[1] + meldTotals[3], Tricks: trickTotals[1] + trickTotals[3], playerIdx: 1 }
      ];
  }

  const bidData = playerNames.map((name, i) => ({
      name: name.split(' ')[0],
      Won: bidWins[i],
      Set: setsTaken[i]
  }));

  return (
    <Layout>
      <Header title="Game Analytics" showBack />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 pb-20">
          
          <div className="w-full h-16 bg-white/5 border border-white/10 border-dashed rounded flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest" data-testid="ad-placeholder">
             Ad Space
          </div>

          <Tabs defaultValue="scores">
            <TabsList className="w-full bg-black/20">
               <TabsTrigger value="scores" className="flex-1" data-testid="tab-scores">Scoring</TabsTrigger>
               <TabsTrigger value="bids" className="flex-1" data-testid="tab-bids">Bidding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scores" className="space-y-4 mt-4">
               <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                     <CardTitle className="text-sm uppercase text-muted-foreground">Points Composition</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64" data-testid="chart-points">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={finalChartData} layout="vertical" margin={{ left: -20 }}>
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" width={80} tick={{fill: 'white', fontSize: 10}} />
                           <Tooltip 
                             contentStyle={{ backgroundColor: '#1a2e26', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                             cursor={{fill: 'rgba(255,255,255,0.05)'}}
                           />
                           <Bar dataKey="Meld" stackId="a" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                           <Bar dataKey="Tricks" stackId="a" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                           <Legend />
                        </BarChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-2 gap-4">
                  {finalChartData.map((d, i) => (
                      <Card key={i} className="bg-white/5 border-white/10" data-testid={`stat-card-${i}`}>
                         <CardContent className="p-4 text-center">
                            <div className="text-xs text-muted-foreground uppercase mb-1">{d.name}</div>
                            <div className="text-2xl font-bold mb-2" data-testid={`text-total-points-${i}`}>
                               {d.Meld + d.Tricks} <span className="text-xs font-normal text-muted-foreground">pts</span>
                            </div>
                            <div className="flex justify-center gap-2 text-xs">
                               <span className="text-primary" data-testid={`text-meld-pct-${i}`}>{Math.round((d.Meld / (d.Meld + d.Tricks || 1)) * 100)}% Meld</span>
                               <span className="text-white/40">•</span>
                               <span className="text-secondary-foreground" data-testid={`text-tricks-pct-${i}`}>{Math.round((d.Tricks / (d.Meld + d.Tricks || 1)) * 100)}% Tricks</span>
                            </div>
                         </CardContent>
                      </Card>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="bids" className="space-y-4 mt-4">
               <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                     <CardTitle className="text-sm uppercase text-muted-foreground">Bid Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64" data-testid="chart-bids">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bidData}>
                           <XAxis dataKey="name" tick={{fill: 'white', fontSize: 10}} />
                           <YAxis hide />
                           <Tooltip 
                             contentStyle={{ backgroundColor: '#1a2e26', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                             cursor={{fill: 'rgba(255,255,255,0.05)'}}
                           />
                           <Bar dataKey="Won" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                           <Bar dataKey="Set" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>

        </div>
      </ScrollArea>
    </Layout>
  );
}
