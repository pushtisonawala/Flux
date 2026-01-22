'use client';

import { useState, useMemo } from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    size: number;
    time: number;
  } | null;
  previousResponse: any;
  loading: boolean;
}

export function ResponseViewer({
  response,
  previousResponse,
  loading,
}: ResponseViewerProps) {
  const [showDiff, setShowDiff] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status >= 300 && status < 400) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (status >= 400 && status < 500) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const parseJSON = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  const formatJSON = (data: any): string => {
    return JSON.stringify(data, null, 2);
  };

  const parsedBody = response ? parseJSON(response.body) : null;
  const previousParsedBody = previousResponse ? parseJSON(previousResponse.body) : null;

  const computedDiff = useMemo(() => {
    if (!parsedBody || !previousParsedBody) return null;

    const current = formatJSON(parsedBody);
    const previous = formatJSON(previousParsedBody);

    const currentLines = current.split('\n');
    const previousLines = previous.split('\n');

    const diff = {
      added: [] as string[],
      removed: [] as string[],
      modified: [] as Array<{ prev: string; curr: string }>,
    };

    // Simple diff logic - identify additions and removals
    const previousSet = new Set(previousLines);
    const currentSet = new Set(currentLines);

    currentLines.forEach((line) => {
      if (!previousSet.has(line)) {
        diff.added.push(line);
      }
    });

    previousLines.forEach((line) => {
      if (!currentSet.has(line)) {
        diff.removed.push(line);
      }
    });

    return diff;
  }, [parsedBody, previousParsedBody, showDiff]);

  const handleCopy = () => {
    if (response?.body) {
      navigator.clipboard.writeText(response.body);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  return (
    <div className="w-96 flex flex-col bg-card border-l border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Response</h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setShowDiff(!showDiff)}
              disabled={!previousResponse}
              title="Show diff with previous response"
            >
              <ArrowRightLeft className="h-4 w-4 text-foreground/60" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleCopy}
              disabled={!response}
            >
              <Copy className="h-4 w-4 text-foreground/60" />
            </Button>
          </div>
        </div>

        {/* Status Info */}
        {loading ? (
          <div className="flex items-center gap-2 text-foreground/60">
            <Loader className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        ) : response ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded text-sm font-bold border ${getStatusColor(response.status)}`}>
                {response.status} {response.statusText}
              </div>
            </div>
            <div className="flex gap-6 text-xs text-foreground/60">
              <div className="flex items-center gap-1">
                <span>Time:</span>
                <span className="font-mono font-semibold text-foreground">{response.time}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Size:</span>
                <span className="font-mono font-semibold text-foreground">
                  {(response.size / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-foreground/40 italic">No response yet</div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {response ? (
          <Tabs defaultValue="pretty" className="w-full h-full flex flex-col">
            <TabsList className="justify-start rounded-none border-b border-border bg-card px-4 py-0 h-auto">
              <TabsTrigger
                value="pretty"
                className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Pretty
              </TabsTrigger>
              <TabsTrigger
                value="raw"
                className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Raw
              </TabsTrigger>
              <TabsTrigger
                value="headers"
                className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Headers
              </TabsTrigger>
              {previousResponse && showDiff && (
                <TabsTrigger
                  value="diff"
                  className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  Diff
                </TabsTrigger>
              )}
            </TabsList>

            {/* Pretty Tab */}
            <TabsContent value="pretty" className="flex-1 overflow-auto p-4">
              {parsedBody ? (
                <div className="space-y-1 font-mono text-xs">
                  <JSONViewer data={parsedBody} />
                </div>
              ) : (
                <div className="text-foreground/60 text-xs">
                  {response.body || 'Empty response'}
                </div>
              )}
            </TabsContent>

            {/* Raw Tab */}
            <TabsContent value="raw" className="flex-1 overflow-auto p-4">
              <pre className="font-mono text-xs text-foreground/80 whitespace-pre-wrap break-words">
                {response.body}
              </pre>
            </TabsContent>

            {/* Headers Tab */}
            <TabsContent value="headers" className="flex-1 overflow-auto p-4">
              <div className="space-y-2">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="border-b border-border/50 pb-2 last:border-0">
                    <div className="text-xs font-mono font-bold text-blue-400">{key}</div>
                    <div className="text-xs text-foreground/70 truncate">{String(value)}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Diff Tab */}
            {previousResponse && showDiff && computedDiff && (
              <TabsContent value="diff" className="flex-1 overflow-auto p-4">
                <div className="space-y-1 font-mono text-xs">
                  {(computedDiff.removed?.length ?? 0) > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-bold text-red-400 mb-1">Removed:</div>
                      {computedDiff.removed.map((line, idx) => (
                        <div key={`rem-${idx}`} className="text-red-400 opacity-80 pl-2">
                          {`- ${line}`}
                        </div>
                      ))}
                    </div>
                  )}
                  {(computedDiff.added?.length ?? 0) > 0 && (
                    <div>
                      <div className="text-xs font-bold text-green-400 mb-1">Added:</div>
                      {computedDiff.added.map((line, idx) => (
                        <div key={`add-${idx}`} className="text-green-400 opacity-80 pl-2">
                          {`+ ${line}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Eye className="h-8 w-8 text-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-foreground/40">Send a request to view response</p>
            </div>
          </div>
        )}
      </div>

      {/* Copy Feedback */}
      {copyFeedback && (
        <div className="absolute bottom-4 right-4 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded text-xs">
          Copied to clipboard
        </div>
      )}
    </div>
  );
}

function JSONViewer({ data, depth = 0 }: { data: any; depth?: number }) {
  if (data === null) return <span className="text-gray-400">null</span>;
  if (typeof data === 'boolean') return <span className="text-yellow-400">{String(data)}</span>;
  if (typeof data === 'number') return <span className="text-cyan-400">{data}</span>;
  if (typeof data === 'string') return <span className="text-green-400">"{data}"</span>;

  if (Array.isArray(data)) {
    return (
      <div>
        <span className="text-foreground">[</span>
        {data.length > 0 && (
          <div className="ml-4">
            {data.map((item, idx) => (
              <div key={idx}>
                <JSONViewer data={item} depth={depth + 1} />
                {idx < data.length - 1 && <span className="text-foreground">,</span>}
              </div>
            ))}
          </div>
        )}
        <span className="text-foreground">]</span>
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div>
        <span className="text-foreground">{'{'}</span>
        {Object.entries(data).length > 0 && (
          <div className="ml-4">
            {Object.entries(data).map(([key, value], idx, arr) => (
              <div key={key}>
                <span className="text-blue-400">"{key}"</span>
                <span className="text-foreground">: </span>
                <JSONViewer data={value} depth={depth + 1} />
                {idx < arr.length - 1 && <span className="text-foreground">,</span>}
              </div>
            ))}
          </div>
        )}
        <span className="text-foreground">{'}'}</span>
      </div>
    );
  }

  return <span className="text-foreground">{String(data)}</span>;
}
