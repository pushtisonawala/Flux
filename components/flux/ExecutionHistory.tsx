'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Execution {
  _id: string;
  state: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  status_code?: number;
  latency_ms?: number;
  createdAt: string;
}

interface ExecutionHistoryProps {
  requestId: string;
  onSelectExecution: (executionId: string) => void;
  selectedExecutionId?: string;
}

export function ExecutionHistory({ 
  requestId, 
  onSelectExecution,
  selectedExecutionId 
}: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutions = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:4000/api/requests/${requestId}/executions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch executions');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setExecutions(data.executions || []);
        } else {
          setError('Failed to load execution history');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching executions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutions();
  }, [requestId]);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const getStatusBadgeColor = (state: string) => {
    switch (state) {
      case 'SUCCESS':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PENDING':
      case 'RUNNING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'SUCCESS':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'FAILED':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'PENDING':
      case 'RUNNING':
        return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: number) => {
    if (!status) return 'text-gray-400';
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-blue-400';
    if (status >= 400 && status < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="h-6 w-6 text-blue-400" />
          <p className="text-xs text-sidebar-foreground/60">Loading executions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Clock className="h-12 w-12 text-sidebar-foreground/30 mb-3" />
        <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-1">
          No Executions Yet
        </h3>
        <p className="text-xs text-sidebar-foreground/50">
          Execute this request to see history
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      <div className="px-2 py-1 mb-2">
        <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wide">
          Execution History
        </h3>
        <p className="text-xs text-sidebar-foreground/50 mt-0.5">
          {executions.length} {executions.length === 1 ? 'execution' : 'executions'}
        </p>
      </div>
      
      {executions.map((execution) => (
        <button
          key={execution._id}
          onClick={() => onSelectExecution(execution._id)}
          className={`w-full rounded-lg p-3 text-left transition-all border ${
            selectedExecutionId === execution._id
              ? 'bg-blue-500/20 border-blue-500/50 shadow-md'
              : 'bg-sidebar-accent/40 border-sidebar-border hover:bg-sidebar-accent/70 hover:border-sidebar-border/80'
          }`}
        >
          {/* Header: Status Badge and Time */}
          <div className="flex items-center justify-between mb-2">
            <Badge 
              variant="outline" 
              className={`text-xs font-medium border ${getStatusBadgeColor(execution.state)} flex items-center gap-1.5`}
            >
              {getStatusIcon(execution.state)}
              {execution.state}
            </Badge>
            <span className="text-xs text-sidebar-foreground/50">
              {getRelativeTime(execution.createdAt)}
            </span>
          </div>

          {/* Details: Status Code and Latency */}
          <div className="flex items-center gap-3">
            {execution.status_code && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-sidebar-foreground/60">Status:</span>
                <span className={`text-xs font-mono font-semibold ${getStatusColor(execution.status_code)}`}>
                  {execution.status_code}
                </span>
              </div>
            )}
            
            {execution.latency_ms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-sidebar-foreground/60" />
                <span className="text-xs font-mono text-sidebar-foreground/70">
                  {execution.latency_ms}ms
                </span>
              </div>
            )}

            {!execution.status_code && !execution.latency_ms && (
              <span className="text-xs text-sidebar-foreground/50 italic">
                In progress...
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
