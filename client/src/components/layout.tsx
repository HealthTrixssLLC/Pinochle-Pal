import React from 'react';
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import generatedImage from '@assets/generated_images/green_felt_card_table_texture.png';

export function Layout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center relative overflow-hidden bg-background text-foreground">
      {/* Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-0 mix-blend-overlay"
        style={{ 
          backgroundImage: `url(${generatedImage})`,
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

      {/* Content */}
      <div className={cn("relative z-10 w-full max-w-md flex-1 flex flex-col safe-area-bottom", className)}>
        {children}
      </div>
    </div>
  );
}

export function Header({ title, showBack = false }: { title: string, showBack?: boolean }) {
  const [, setLocation] = useLocation();
  return (
    <header className="w-full p-4 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => window.history.back()} className="text-muted-foreground hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        <h1 className="text-xl font-serif font-bold text-primary tracking-wide drop-shadow-sm">{title}</h1>
      </div>
    </header>
  );
}
