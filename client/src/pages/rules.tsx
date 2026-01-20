import { Layout } from "@/components/layout";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Rules() {
  return (
    <Layout>
      <header className="p-4 border-b border-white/10 flex items-center gap-2 sticky top-0 bg-background/80 backdrop-blur z-10">
        <button onClick={() => window.history.back()} className="text-muted-foreground hover:text-primary" data-testid="button-back">
          Back
        </button>
        <h1 className="font-serif font-bold text-xl" data-testid="text-rules-title">Pinochle Rules</h1>
      </header>
      <ScrollArea className="flex-1 p-6">
        <div className="prose prose-invert max-w-none space-y-6 pb-20">
          <section data-testid="section-deck">
            <h3 className="text-primary font-serif text-lg border-b border-primary/20 pb-1 mb-2">The Deck</h3>
            <p className="text-sm text-muted-foreground">
              A Pinochle deck consists of 48 cards: two each of Ace, Ten, King, Queen, Jack, and Nine in each of the four suits.
              <br/>Rank: A (high), 10, K, Q, J, 9 (low).
            </p>
          </section>

          <section data-testid="section-values">
            <h3 className="text-primary font-serif text-lg border-b border-primary/20 pb-1 mb-2">Card Values</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>Ace: 11 points (or 10 in simplified scoring)</li>
              <li>Ten: 10 points</li>
              <li>King: 4 points (or 5)</li>
              <li>Queen: 3 points (or 5)</li>
              <li>Jack: 2 points (or 0)</li>
              <li>Nine: 0 points (often 10 for last trick)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">
              * This app uses simplified scoring where A/10/K = 10pts, Q/J/9 = 0pts for easier mental math, or standard A=11, 10=10, K=4, Q=3, J=2. (Actually, for this app, you enter the points manually, so you can play by any house rules!)
            </p>
          </section>

          <section data-testid="section-melds">
            <h3 className="text-primary font-serif text-lg border-b border-primary/20 pb-1 mb-2">Melds</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">Class A (Suits)</h4>
                <ul className="text-xs text-muted-foreground grid grid-cols-2 gap-2 mt-1">
                  <li>Run (A,10,K,Q,J of Trump): 150</li>
                  <li>Royal Marriage (K,Q Trump): 40</li>
                  <li>Common Marriage (K,Q non-Trump): 20</li>
                  <li>Dix (9 of Trump): 10</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Class B (Numbers)</h4>
                <ul className="text-xs text-muted-foreground grid grid-cols-2 gap-2 mt-1">
                  <li>Aces Around (4 Aces diff suits): 100</li>
                  <li>Kings Around (4 Kings diff suits): 80</li>
                  <li>Queens Around (4 Queens diff suits): 60</li>
                  <li>Jacks Around (4 Jacks diff suits): 40</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Class C (Special)</h4>
                <ul className="text-xs text-muted-foreground grid grid-cols-2 gap-2 mt-1">
                  <li>Pinochle (Q♠ + J♦): 40</li>
                  <li>Double Pinochle: 300</li>
                </ul>
              </div>
            </div>
          </section>

          <section data-testid="section-scoring">
            <h3 className="text-primary font-serif text-lg border-b border-primary/20 pb-1 mb-2">Scoring</h3>
            <p className="text-sm text-muted-foreground">
              The bidder must equal or exceed their bid with (Meld + Tricks). If they fail, they go "Set" and lose the bid amount from their score. Other players score their meld (if they took a trick) plus their trick points.
            </p>
          </section>
        </div>
      </ScrollArea>
    </Layout>
  );
}
