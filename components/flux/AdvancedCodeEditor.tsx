'use client';

import { useState, useEffect } from 'react';
import { Code, Copy, Maximize2, Minimize2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdvancedCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'json' | 'html' | 'text' | 'xml' | 'javascript';
  placeholder?: string;
  isFullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;
}

export function AdvancedCodeEditor({
  value,
  onChange,
  language,
  placeholder = 'Enter request body...',
  isFullscreen = false,
  onFullscreenChange,
}: AdvancedCodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleFormat = () => {
    try {
      if (language === 'json') {
        const parsed = JSON.parse(value);
        onChange(JSON.stringify(parsed, null, 2));
      }
    } catch (error) {
      console.error('Failed to format:', error);
    }
  };

  const getLineCount = () => value.split('\n').length;

  const languages = ['json', 'html', 'text', 'xml', 'javascript'] as const;

  return (
    <div className={`flex flex-col bg-slate-900 border border-border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-40' : ''}`}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between bg-slate-800/50 border-b border-border px-3 py-2 gap-2">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-mono font-bold text-slate-300">{language.toUpperCase()}</span>
          <span className="text-xs text-slate-500 ml-2">{getLineCount()} lines</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Format Button */}
          {language === 'json' && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-slate-400 hover:text-slate-200"
              onClick={handleFormat}
              title="Format code"
            >
              <Zap className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Copy Button */}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-slate-400 hover:text-slate-200"
            onClick={handleCopy}
            title="Copy code"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Options Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-slate-400 hover:text-slate-200"
              >
                <span className="text-xs">⋮</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setLineNumbers(!lineNumbers)}>
                {lineNumbers ? '✓' : ''} Line Numbers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWordWrap(!wordWrap)}>
                {wordWrap ? '✓' : ''} Word Wrap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowMinimap(!showMinimap)}>
                {showMinimap ? '✓' : ''} Minimap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize(Math.max(11, fontSize - 1))}>
                Decrease Font
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize(Math.min(18, fontSize + 1))}>
                Increase Font
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen Button */}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-slate-400 hover:text-slate-200"
            onClick={() => onFullscreenChange?.(!isFullscreen)}
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className={`flex-1 overflow-hidden flex relative ${isFullscreen ? '' : ''}`}>
        {/* Line Numbers */}
        {lineNumbers && (
          <div className="bg-slate-950 border-r border-slate-700 select-none text-right px-3 py-4 text-xs font-mono text-slate-600">
            {Array.from({ length: getLineCount() }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-slate-900 text-slate-100 p-4 font-mono outline-none resize-none border-0 focus:outline-none focus:ring-0"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.5',
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            wordWrap: wordWrap ? 'break-word' : 'normal',
            overflowX: wordWrap ? 'hidden' : 'auto',
          }}
          spellCheck="false"
        />

        {/* Minimap */}
        {showMinimap && value && (
          <div className="w-12 bg-slate-950 border-l border-slate-700 opacity-30 hover:opacity-50 transition-opacity">
            <div className="text-xs font-mono text-slate-600 p-1 space-y-0.5 h-full overflow-hidden">
              {value
                .split('\n')
                .slice(0, 50)
                .map((line, i) => (
                  <div key={i} className="h-1 bg-slate-600 rounded-sm opacity-60" />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy Feedback */}
      {copyFeedback && (
        <div className="absolute bottom-4 right-4 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded text-xs">
          Copied
        </div>
      )}
    </div>
  );
}
