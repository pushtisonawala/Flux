'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsProps {
  onSend?: () => void;
}

export function KeyboardShortcuts({ onSend }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to show help
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
      // Cmd+Enter or Ctrl+Enter to send
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onSend?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp, onSend]);

  return (
    <>
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Keyboard Shortcuts</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowHelp(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Send request</span>
                <kbd className="px-2 py-1 bg-primary/20 border border-border rounded text-xs font-mono">
                  Cmd+Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Show help</span>
                <kbd className="px-2 py-1 bg-primary/20 border border-border rounded text-xs font-mono">
                  Cmd+K
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Switch environment</span>
                <kbd className="px-2 py-1 bg-primary/20 border border-border rounded text-xs font-mono">
                  Cmd+Shift+E
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
