import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold mb-2">Something went wrong</h1>
              <p className="text-muted-foreground text-sm">
                Don't worry - your game data is safe. Let's get you back on track.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-black/20 rounded-lg p-4 text-left">
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Reload App
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
