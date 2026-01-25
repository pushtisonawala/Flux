'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  Copy,
  X
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExecutionDetails {
  _id: string;
  state: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  status_code?: number;
  latency_ms?: number;
  response_body?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExecutionResponseViewerProps {
  executionId: string;
  onClose: () => void;
}

export function ExecutionResponseViewer({ 
  executionId,
  onClose 
}: ExecutionResponseViewerProps) {
  const [execution, setExecution] = useState<ExecutionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const fetchExecutionDetails = async () => {
      if (!executionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching execution:', executionId);
        const response = await fetch(`http://localhost:4000/api/executions/${executionId}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch execution details`);
        }
        
        const data = await response.json();
        console.log('Execution data:', data);
        
        if (data.success) {
          setExecution(data.execution);
        } else {
          setError(data.message || 'Failed to load execution details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching execution details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutionDetails();
  }, [executionId]);

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
        return <CheckCircle2 className="h-4 w-4" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4" />;
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

  const formatJSON = (data: any) => {
    try {
      // If it's already an object, stringify it
      if (typeof data === 'object' && data !== null) {
        return JSON.stringify(data, null, 2);
      }
      // If it's a string, try to parse and re-stringify it
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If parsing fails, return as string
      return typeof data === 'string' ? data : String(data);
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleCopy = () => {
    if (execution?.response_body) {
      const textToCopy = typeof execution.response_body === 'string' 
        ? execution.response_body 
        : JSON.stringify(execution.response_body, null, 2);
      navigator.clipboard.writeText(textToCopy);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card border-l border-border">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8 text-blue-400" />
          <p className="text-sm text-muted-foreground">Loading execution details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card border-l border-border p-6">
        <div className="max-w-md">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-400 mb-1">Error Loading Execution</h3>
                <p className="text-xs text-red-400/80">{error}</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="mt-4 w-full"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card border-l border-border">
        <p className="text-sm text-muted-foreground">No execution details found</p>
      </div>
    );
  }

  return (
    <div className="w-96 flex flex-col bg-card border-l border-border h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-semibold">Execution Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Status</span>
            <Badge 
              variant="outline" 
              className={`text-xs font-medium border ${getStatusBadgeColor(execution.state)} flex items-center gap-1.5`}
            >
              {getStatusIcon(execution.state)}
              {execution.state}
            </Badge>
          </div>

          {/* HTTP Status Code */}
          {execution.status_code !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">HTTP Status</span>
              <span className={`text-sm font-mono font-semibold ${getStatusColor(execution.status_code)}`}>
                {execution.status_code}
              </span>
            </div>
          )}

          {/* Latency */}
          {execution.latency_ms !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Latency
              </span>
              <span className="text-sm font-mono font-medium text-foreground">
                {execution.latency_ms} ms
              </span>
            </div>
          )}

          {/* Created Time */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Created
            </span>
            <span className="text-xs font-mono text-foreground">
              {formatDateTime(execution.createdAt)}
            </span>
          </div>

          {/* Response Body */}
          {execution.response_body && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Response Body</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 text-xs"
                >
                  {copyFeedback ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
                  {formatJSON(execution.response_body)}
                </pre>
              </div>
            </div>
          )}

          {!execution.response_body && execution.state !== 'PENDING' && execution.state !== 'RUNNING' && (
            <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-border text-center">
              <p className="text-xs text-muted-foreground italic">No response body available</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
