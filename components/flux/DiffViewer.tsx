'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiffLine {
  type: 'added' | 'removed' | 'context' | 'header';
  content: string;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  language?: 'json' | 'text';
  splitView?: boolean;
}

export function DiffViewer({
  oldContent,
  newContent,
  language = 'text',
  splitView = false,
}: DiffViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const diff = useMemo(() => {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');

    const lines: DiffLine[] = [];

    // Simple line-by-line diff
    const maxLines = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === newLine) {
        lines.push({
          type: 'context',
          content: oldLine || '',
          oldLineNumber: i + 1,
          newLineNumber: i + 1,
        });
      } else {
        if (oldLine !== undefined) {
          lines.push({
            type: 'removed',
            content: oldLine,
            oldLineNumber: i + 1,
          });
        }
        if (newLine !== undefined) {
          lines.push({
            type: 'added',
            content: newLine,
            newLineNumber: i + 1,
          });
        }
      }
    }

    return lines;
  }, [oldContent, newContent]);

  const copyDiff = () => {
    const diffText = diff
      .map((line) => {
        const prefix =
          line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
        return prefix + line.content;
      })
      .join('\n');

    navigator.clipboard.writeText(diffText);
  };

  const stats = {
    added: diff.filter((l) => l.type === 'added').length,
    removed: diff.filter((l) => l.type === 'removed').length,
    modified: Math.min(
      diff.filter((l) => l.type === 'added').length,
      diff.filter((l) => l.type === 'removed').length
    ),
  };

  if (splitView) {
    return (
      <div className="flex gap-1 h-full">
        {/* Old Content */}
        <div className="flex-1 overflow-auto bg-slate-950 border border-border rounded-lg">
          <div className="font-mono text-xs text-slate-100">
            <div className="sticky top-0 bg-slate-900 border-b border-border px-3 py-2 text-slate-400">
              Before
            </div>
            {oldContent.split('\n').map((line, i) => (
              <div
                key={`old-${i}`}
                className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex">
                  <div className="w-12 text-right px-2 py-1 bg-slate-900/50 text-slate-600 select-none">
                    {i + 1}
                  </div>
                  <div className="flex-1 px-4 py-1 text-red-400/80">{line}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Content */}
        <div className="flex-1 overflow-auto bg-slate-950 border border-border rounded-lg">
          <div className="font-mono text-xs text-slate-100">
            <div className="sticky top-0 bg-slate-900 border-b border-border px-3 py-2 text-slate-400">
              After
            </div>
            {newContent.split('\n').map((line, i) => (
              <div
                key={`new-${i}`}
                className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex">
                  <div className="w-12 text-right px-2 py-1 bg-slate-900/50 text-slate-600 select-none">
                    {i + 1}
                  </div>
                  <div className="flex-1 px-4 py-1 text-green-400/80">{line}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/5 border border-border rounded-lg">
        <div className="flex gap-4">
          <div className="text-xs">
            <span className="text-green-400 font-bold">+{stats.added}</span>
            <span className="text-foreground/60 ml-1">added</span>
          </div>
          <div className="text-xs">
            <span className="text-red-400 font-bold">-{stats.removed}</span>
            <span className="text-foreground/60 ml-1">removed</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 border-border bg-transparent"
          onClick={copyDiff}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
      </div>

      {/* Diff Content */}
      <div className="bg-slate-950 border border-border rounded-lg overflow-auto">
        <div className="font-mono text-xs text-slate-100">
          {diff.map((line, i) => (
            <div
              key={i}
              className={`border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors ${
                line.type === 'added'
                  ? 'bg-green-500/5'
                  : line.type === 'removed'
                    ? 'bg-red-500/5'
                    : ''
              }`}
            >
              <div className="flex">
                {line.oldLineNumber && (
                  <div className="w-10 text-right px-2 py-1 bg-slate-900/50 text-slate-600 select-none border-r border-slate-800/30">
                    {line.oldLineNumber}
                  </div>
                )}
                {line.newLineNumber && (
                  <div className="w-10 text-right px-2 py-1 bg-slate-900/50 text-slate-600 select-none border-r border-slate-800/30">
                    {line.newLineNumber}
                  </div>
                )}
                <div
                  className={`flex-1 px-4 py-1 ${
                    line.type === 'added'
                      ? 'text-green-400'
                      : line.type === 'removed'
                        ? 'text-red-400'
                        : 'text-slate-400'
                  }`}
                >
                  <span className={`w-4 inline-block text-center font-bold`}>
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  {line.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
