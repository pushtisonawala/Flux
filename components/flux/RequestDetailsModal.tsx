'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
    auth: { type: string };
  } | null;
}

export function RequestDetailsModal({
  isOpen,
  onClose,
  request,
}: RequestDetailsModalProps) {
  if (!isOpen || !request) return null;

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-blue-400',
      POST: 'text-green-400',
      PUT: 'text-yellow-400',
      PATCH: 'text-purple-400',
      DELETE: 'text-red-400',
      HEAD: 'text-gray-400',
      OPTIONS: 'text-cyan-400',
    };
    return colors[method] || colors.GET;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-3/4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`font-mono text-sm font-bold ${getMethodColor(request.method)}`}>
              {request.method}
            </span>
            <span className="text-sm text-foreground/70 truncate">{request.url}</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <TabsList className="justify-start rounded-none border-b border-border bg-card px-4 py-0 h-auto">
              <TabsTrigger
                value="overview"
                className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="headers"
                className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Headers
              </TabsTrigger>
              <TabsTrigger
                value="body"
                className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Body
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground/60 mb-2 block">
                    URL
                  </label>
                  <div className="bg-primary/10 border border-border rounded p-2 text-xs text-foreground font-mono break-all">
                    {request.url}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/60 mb-2 block">
                    Method
                  </label>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${getMethodColor(request.method)}`}>
                    {request.method}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/60 mb-2 block">
                    Authentication
                  </label>
                  <div className="bg-primary/10 border border-border rounded p-2 text-xs text-foreground">
                    {request.auth.type || 'None'}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="headers" className="flex-1 overflow-auto p-4">
              <div className="space-y-2">
                {Object.entries(request.headers).length > 0 ? (
                  Object.entries(request.headers).map(([key, value]) => (
                    <div key={key} className="border-b border-border pb-2 last:border-0">
                      <div className="text-xs font-mono font-bold text-blue-400">{key}</div>
                      <div className="text-xs text-foreground/70 break-all">{String(value)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-foreground/60">No headers added</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="body" className="flex-1 overflow-auto p-4">
              {request.body ? (
                <pre className="font-mono text-xs text-foreground/80 whitespace-pre-wrap break-words">
                  {request.body}
                </pre>
              ) : (
                <div className="text-xs text-foreground/60">No body content</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
