'use client';

import { useState, useEffect } from 'react';
import {
  Folder,
  History,
  Settings,
  ChevronDown,
  Plus,
  Search,
  MoreVertical,
  Globe,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExecutionHistory } from './ExecutionHistory';

interface SidebarProps {
  activeTab: 'collections' | 'history' | 'executions';
  setActiveTab: (tab: 'collections' | 'history' | 'executions') => void;
  currentRequestId?: string;
  onSelectExecution?: (executionId: string) => void;
  selectedExecutionId?: string;
  userId?: string;
}

export function Sidebar({ 
  activeTab, 
  setActiveTab,
  currentRequestId,
  onSelectExecution,
  selectedExecutionId,
  userId
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [environment, setEnvironment] = useState('Development');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['API Endpoints']));
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch request history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      
      try {
        setHistoryLoading(true);
        const response = await fetch(`http://localhost:4000/api/users/${userId}/history`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHistory(data.history);
          }
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [userId, activeTab]);

  const collections = [
    {
      name: 'API Endpoints',
      requests: [
        { id: '1', name: 'GET Users', method: 'GET', url: 'https://api.example.com/users' },
        { id: '2', name: 'Create User', method: 'POST', url: 'https://api.example.com/users' },
        { id: '3', name: 'Update Profile', method: 'PUT', url: 'https://api.example.com/users/:id' },
      ],
    },
    {
      name: 'Authentication',
      requests: [
        { id: '4', name: 'Login', method: 'POST', url: 'https://api.example.com/auth/login' },
        { id: '5', name: 'Refresh Token', method: 'POST', url: 'https://api.example.com/auth/refresh' },
      ],
    },
  ];

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500/20 text-green-400';
    if (status >= 300 && status < 400) return 'bg-blue-500/20 text-blue-400';
    if (status >= 400 && status < 500) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-blue-400',
      POST: 'text-green-400',
      PUT: 'text-yellow-400',
      DELETE: 'text-red-400',
      PATCH: 'text-purple-400',
    };
    return colors[method] || 'text-gray-400';
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden backdrop-blur-sm bg-opacity-90">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">Flux</h2>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Environment Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <span className="text-xs">{environment}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => setEnvironment('Development')}>
              Development
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEnvironment('Staging')}>
              Staging
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEnvironment('Production')}>
              Production
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sidebar-border">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'collections'
              ? 'border-blue-500 text-sidebar-foreground'
              : 'border-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground/80'
          }`}
        >
          Collections
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-500 text-sidebar-foreground'
              : 'border-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground/80'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('executions')}
          className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'executions'
              ? 'border-blue-500 text-sidebar-foreground'
              : 'border-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground/80'
          }`}
        >
          <Activity className="h-3 w-3" />
          Runs
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'collections' && (
          <div className="p-2">
            {/* Search */}
            <div className="mb-3 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-sidebar-foreground/50" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
              />
            </div>

            {/* Collections Tree */}
            {collections.map((collection) => (
              <div key={collection.name} className="mb-1">
                <button
                  onClick={() => toggleFolder(collection.name)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      expandedFolders.has(collection.name) ? '' : '-rotate-90'
                    }`}
                  />
                  <Folder className="h-3.5 w-3.5" />
                  <span>{collection.name}</span>
                </button>

                {expandedFolders.has(collection.name) && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {collection.requests.map((req) => (
                      <button
                        key={req.id}
                        className="w-full flex items-center gap-2 px-2 py-1 rounded text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/60 transition-colors group"
                      >
                        <span className={`font-mono text-xs font-bold w-10 ${getMethodColor(req.method)}`}>
                          {req.method}
                        </span>
                        <span className="truncate flex-1 text-left">{req.name}</span>
                        <MoreVertical className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-2">
            {/* Search */}
            <div className="mb-3 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-sidebar-foreground/50" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
              />
            </div>

            {/* History Items */}
            {historyLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-xs text-sidebar-foreground/60">Loading history...</div>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <History className="h-12 w-12 text-sidebar-foreground/30 mb-3" />
                <p className="text-xs text-sidebar-foreground/60">No request history yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/60 transition-colors group"
                  >
                    <span className={`font-mono text-xs font-bold w-10 ${getMethodColor(item.method)}`}>
                      {item.method}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="truncate text-sidebar-foreground/80">{item.url}</p>
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                    <span className="text-sidebar-foreground/50 text-xs w-12 text-right">{item.time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'executions' && (
          <>
            {currentRequestId ? (
              <ExecutionHistory
                requestId={currentRequestId}
                onSelectExecution={onSelectExecution || (() => {})}
                selectedExecutionId={selectedExecutionId}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Activity className="h-12 w-12 text-sidebar-foreground/30 mb-3" />
                <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-1">
                  No Request Selected
                </h3>
                <p className="text-xs text-sidebar-foreground/50">
                  Select a request to view execution history
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 flex gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
