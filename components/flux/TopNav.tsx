'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/50 border-b border-border/50">
      <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-lg font-bold tracking-tight">Flux</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-secondary/30">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Get started
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-secondary/30 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 p-4 space-y-3">
          <Link href="/docs" className="block text-sm text-muted-foreground hover:text-foreground py-2">
            Documentation
          </Link>
          <Link href="/pricing" className="block text-sm text-muted-foreground hover:text-foreground py-2">
            Pricing
          </Link>
          <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground py-2">
            Blog
          </Link>
          <div className="flex gap-2 pt-3">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Sign in
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
