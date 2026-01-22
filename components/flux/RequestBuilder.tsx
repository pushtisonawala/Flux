'use client';

import { useState } from 'react';
import {
  Send,
  ChevronDown,
  Code,
  Plus,
  X,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RequestBuilderProps {
  requestConfig: {
    method: string;
    url: string;
    params: Record<string, string>;
    headers: Record<string, string>;
    body: string;
    auth: { type: string };
  };
  setRequestConfig: (config: any) => void;
  onSend: () => void;
  loading: boolean;
}

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export function RequestBuilder({
  requestConfig,
  setRequestConfig,
  onSend,
  loading,
}: RequestBuilderProps) {
  const [editorLanguage, setEditorLanguage] = useState<'json' | 'html' | 'text'>('json');
  const [activeUsers] = useState([
    { id: 1, name: 'You', color: 'bg-blue-500' },
    { id: 2, name: 'Sarah', color: 'bg-purple-500' },
  ]);

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
      POST: 'text-green-400 bg-green-500/10 hover:bg-green-500/20',
      PUT: 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20',
      PATCH: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20',
      DELETE: 'text-red-400 bg-red-500/10 hover:bg-red-500/20',
      HEAD: 'text-gray-400 bg-gray-500/10 hover:bg-gray-500/20',
      OPTIONS: 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20',
    };
    return colors[method] || colors.GET;
  };

  return (
    <div className="flex-1 flex flex-col bg-card border-r border-border overflow-hidden">
      {/* Top Bar - Method Selector & URL Input */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          {/* Method Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`w-24 font-mono font-bold border-border ${getMethodColor(requestConfig.method)}`}
              >
                {requestConfig.method}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {METHODS.map((method) => (
                <DropdownMenuItem
                  key={method}
                  onClick={() => setRequestConfig({ ...requestConfig, method })}
                >
                  {method}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* URL Input */}
          <Input
            placeholder="https://api.example.com/endpoint"
            value={requestConfig.url}
            onChange={(e) => setRequestConfig({ ...requestConfig, url: e.target.value })}
            className="flex-1 bg-card border-border text-foreground placeholder:text-foreground/40"
          />

          {/* Send Button */}
          <Button
            onClick={onSend}
            disabled={loading}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send'}
          </Button>

          {/* Active Users */}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
            {activeUsers.map((user, index) => (
              <div
                key={user.id}
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.color} border border-border ${
                  index > 0 ? '-ml-3' : ''
                }`}
                title={user.name}
              >
                {user.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs - Params, Auth, Headers, Body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="params" className="w-full h-full flex flex-col">
          <TabsList className="justify-start rounded-none border-b border-border bg-card px-4 py-0 h-auto">
            <TabsTrigger
              value="params"
              className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Params
            </TabsTrigger>
            <TabsTrigger
              value="auth"
              className="text-xs rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Auth
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

          {/* Params Tab */}
          <TabsContent value="params" className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Query Parameters</h3>
                <Button size="sm" variant="outline" className="h-8 gap-1 border-border bg-transparent">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-xs text-foreground/60">
                No parameters added
              </div>
            </div>
          </TabsContent>

          {/* Auth Tab */}
          <TabsContent value="auth" className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-2 block">
                  Auth Type
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-border justify-between bg-transparent"
                    >
                      {requestConfig.auth.type}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => setRequestConfig({ ...requestConfig, auth: { type: 'none' } })}>
                      None
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRequestConfig({ ...requestConfig, auth: { type: 'Bearer Token' } })}>
                      Bearer Token
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRequestConfig({ ...requestConfig, auth: { type: 'Basic Auth' } })}>
                      Basic Auth
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRequestConfig({ ...requestConfig, auth: { type: 'API Key' } })}>
                      API Key
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {requestConfig.auth.type !== 'none' && (
                <div>
                  <Input
                    placeholder={`Enter ${requestConfig.auth.type}...`}
                    className="bg-card border-border text-foreground"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Headers Tab */}
          <TabsContent value="headers" className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Headers</h3>
                <Button size="sm" variant="outline" className="h-8 gap-1 border-border bg-transparent">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(requestConfig.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key"
                      value={key}
                      readOnly
                      className="w-32 bg-card border-border text-foreground text-xs"
                    />
                    <Input
                      placeholder="Value"
                      value={value}
                      className="flex-1 bg-card border-border text-foreground text-xs"
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground/60 hover:text-foreground">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {Object.keys(requestConfig.headers).length === 0 && (
                  <div className="bg-card border border-border rounded-lg p-3 text-xs text-foreground/60">
                    No headers added
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Body Tab */}
          <TabsContent value="body" className="flex-1 overflow-hidden flex flex-col p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Request Body</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 border-border bg-transparent"
                  >
                    <Code className="h-3.5 w-3.5" />
                    {editorLanguage.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditorLanguage('json')}>
                    JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditorLanguage('html')}>
                    HTML
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditorLanguage('text')}>
                    Text
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Code Editor Placeholder */}
            <div className="flex-1 bg-slate-900 border border-border rounded-lg overflow-hidden font-mono text-sm">
              <textarea
                value={requestConfig.body}
                onChange={(e) => setRequestConfig({ ...requestConfig, body: e.target.value })}
                placeholder={editorLanguage === 'json' ? '{\n  "key": "value"\n}' : 'Enter request body...'}
                className="w-full h-full p-4 bg-slate-900 text-slate-100 border-0 outline-none resize-none"
                spellCheck="false"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
