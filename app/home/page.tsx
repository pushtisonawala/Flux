'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TopNav } from '@/components/flux/TopNav';
import { Zap, Code, Medal as Zeta, Users, Rocket, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-zinc-900 rounded-full mix-blend-screen opacity-20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zinc-800 rounded-full mix-blend-screen opacity-20 blur-3xl animate-pulse delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900 rounded-full mix-blend-screen opacity-10 blur-3xl animate-pulse delay-1000" />
        </div>

        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">The Modern API Client</span>
              </div>
              <h1 className="text-6xl font-bold tracking-tight">
                API Development,
                <br />
                Supercharged
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Flux is the professional API client IDE for modern developers. Build, test, and debug APIs with lightning-fast performance and an intuitive interface.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/app">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 text-lg rounded-lg flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Launch Flux IDE
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="border-border/50 hover:bg-secondary/30 font-semibold px-8 py-3 text-lg rounded-lg bg-transparent">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Powerful Features</h2>
              <p className="text-lg text-muted-foreground">Everything you need for professional API development</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 hover:bg-card/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Advanced Code Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Syntax highlighting, JSON formatting, and intelligent code completion for request bodies.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 hover:bg-card/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Zeta className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Response Diff Viewer</h3>
                <p className="text-sm text-muted-foreground">
                  Visually compare responses with color-coded diffs to track changes between requests.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 hover:bg-card/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  See active users editing requests in real-time with presence indicators and avatars.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 hover:bg-card/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Authentication Support</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in support for Bearer tokens, Basic Auth, API Keys, and custom auth schemes.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 hover:bg-card/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Collections & History</h3>
                <p className="text-sm text-muted-foreground">
                  Organize requests into collections and access detailed request history with status codes.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 hover:bg-card/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Manage multiple environments with variable substitution across your requests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Ready to supercharge your API development?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of developers using Flux to build better APIs faster.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 text-lg rounded-lg">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/app">
                <Button variant="outline" className="border-border/50 hover:bg-secondary/30 font-semibold px-8 py-3 text-lg rounded-lg bg-transparent">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-12 px-6 mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="font-bold">Flux</span>
                </div>
                <p className="text-sm text-muted-foreground">The professional API client IDE for modern developers.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                  <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/50 pt-8 flex items-center justify-between text-sm text-muted-foreground">
              <p>© 2024 Flux. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="https://twitter.com" className="hover:text-foreground transition-colors">Twitter</Link>
                <Link href="https://github.com" className="hover:text-foreground transition-colors">GitHub</Link>
                <Link href="https://discord.com" className="hover:text-foreground transition-colors">Discord</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
