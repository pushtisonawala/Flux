'use client';

import { useState, useEffect } from 'react';
import { Users, Dot, Eye, Edit2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ActiveUser {
  id: string;
  name: string;
  color: string;
  email?: string;
  status: 'viewing' | 'editing' | 'idle';
  lastActive: number;
  cursorPosition?: { line: number; column: number };
}

interface CollaborationPanelProps {
  users: ActiveUser[];
  currentUserId: string;
}

export function CollaborationPanel({ users, currentUserId }: CollaborationPanelProps) {
  const [onlineUsers, setOnlineUsers] = useState<ActiveUser[]>(users);

  useEffect(() => {
    setOnlineUsers(users);
  }, [users]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'editing':
        return <Edit2 className="h-2.5 w-2.5" />;
      case 'viewing':
        return <Eye className="h-2.5 w-2.5" />;
      default:
        return <Dot className="h-2.5 w-2.5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'editing':
        return 'Editing';
      case 'viewing':
        return 'Viewing';
      default:
        return 'Idle';
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {/* Active Users Count */}
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-foreground/60" />
          <span className="text-xs text-foreground/60">{onlineUsers.length}</span>
        </div>

        {/* User Avatars */}
        <div className="flex items-center -space-x-3">
          {onlineUsers.slice(0, 3).map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-card cursor-pointer transition-transform hover:scale-110 ${user.color}`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-foreground/70 flex items-center gap-1">
                    {getStatusIcon(user.status)}
                    {getStatusLabel(user.status)}
                  </div>
                  {user.email && <div className="text-xs text-foreground/60">{user.email}</div>}
                  {user.cursorPosition && (
                    <div className="text-xs text-foreground/60">
                      Line {user.cursorPosition.line}:{user.cursorPosition.column}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Overflow indicator */}
          {onlineUsers.length > 3 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-primary border-2 border-card">
                  +{onlineUsers.length - 3}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 max-w-xs">
                  {onlineUsers.slice(3).map((user) => (
                    <div key={user.id} className="text-xs">
                      {user.name} - {getStatusLabel(user.status)}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Activity Feed */}
        <div className="text-xs text-foreground/60 pl-2 border-l border-border">
          {onlineUsers.some((u) => u.status === 'editing') ? (
            <span className="flex items-center gap-1">
              <Dot className="h-2 w-2 text-green-400 animate-pulse" />
              Editing
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Dot className="h-2 w-2 text-blue-400" />
              Viewing
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
