import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Play, Users, BookOpen, RotateCcw, History as HistoryIcon } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { activeGame, resumeGame, savedGames } = useStore();

  const hasActiveGame = !!activeGame;

  return (
    <Layout className="justify-center p-6 gap-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="w-20 h-32 mx-auto bg-primary/20 border-2 border-primary/50 rounded-lg transform -rotate-6 mb-6 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 border border-primary/30 rounded-lg m-1"></div>
            <span className="text-4xl">♠️</span>
        </div>
        <h1 className="text-5xl font-serif text-primary drop-shadow-md">Pinochle</h1>
        <p className="text-muted-foreground text-lg">Scorekeeper</p>
      </motion.div>

      <div className="space-y-4 w-full">
        {hasActiveGame && (
          <Button 
            size="lg" 
            className="w-full h-16 text-lg font-serif bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg border-2 border-primary/20"
            onClick={() => setLocation("/game")}
          >
            <Play className="mr-2 h-6 w-6" /> Resume Game
          </Button>
        )}

        <Button 
          variant={hasActiveGame ? "secondary" : "default"}
          size="lg" 
          className={hasActiveGame 
            ? "w-full h-14 text-lg font-serif bg-white/10 hover:bg-white/20"
            : "w-full h-16 text-lg font-serif bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          }
          onClick={() => setLocation("/new-game")}
        >
          {hasActiveGame ? "Start New Game" : "Start Game"}
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2 border-white/10 bg-black/20 hover:bg-black/30 hover:text-primary transition-all"
            onClick={() => setLocation("/history")}
          >
            <HistoryIcon className="h-6 w-6" />
            <span>History</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex-col gap-2 border-white/10 bg-black/20 hover:bg-black/30 hover:text-primary transition-all"
            onClick={() => setLocation("/players")}
          >
            <Users className="h-6 w-6" />
            <span>Players</span>
          </Button>
        </div>
        
        <Button 
           variant="ghost" 
           className="w-full text-muted-foreground hover:text-primary mt-2"
           onClick={() => setLocation("/rules")}
        >
           <BookOpen className="h-4 w-4 mr-2" /> Rules & Help
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground/50 mt-auto pt-8">
        Designed for iPhone
      </div>
    </Layout>
  );
}
