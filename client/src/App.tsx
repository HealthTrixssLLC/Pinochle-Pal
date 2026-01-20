import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import NewGame from "@/pages/new-game";
import Game from "@/pages/game";
import RoundWizard from "@/pages/round-wizard";
import Rules from "@/pages/rules";
import Players from "@/pages/players";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/new-game" component={NewGame} />
      <Route path="/game" component={Game} />
      <Route path="/game/round" component={RoundWizard} />
      <Route path="/rules" component={Rules} />
      <Route path="/players" component={Players} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
