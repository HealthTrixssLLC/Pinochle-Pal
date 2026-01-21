import React from 'react';
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import generatedImage from '@assets/generated_images/green_felt_card_table_texture.png';
import { ChevronLeft } from "lucide-react";

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
      <div className={cn("relative z-10 w-full max-w-md flex-1 flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
}

export function SafeAreaTop() {
  return (
    <div 
      className="w-full bg-black/40 backdrop-blur-sm shrink-0"
      style={{ 
        height: 'env(safe-area-inset-top, 48px)',
        minHeight: '48px'
      }}
    />
  );
}

export function Header({ title, showBack = false }: { title: string, showBack?: boolean }) {
  const [, setLocation] = useLocation();
  
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };
  
  return (
    <>
      <SafeAreaTop />
      <header className="w-full px-4 py-3 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 min-h-[44px]">
          {showBack && (
            <button 
              onClick={handleBack} 
              className="text-muted-foreground hover:text-primary transition-colors p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              data-testid="button-back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-xl font-serif font-bold text-primary tracking-wide drop-shadow-sm">{title}</h1>
        </div>
      </header>
    </>
  );
}
