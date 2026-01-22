'use client';

import { useState } from 'react';
import { Settings, Plus, X, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface Environment {
  name: string;
  variables: Record<string, string>;
}

interface EnvironmentManagerProps {
  environments: Environment[];
  activeEnvironment: string;
  onEnvironmentChange: (name: string) => void;
  onEnvironmentsUpdate: (environments: Environment[]) => void;
}

export function EnvironmentManager({
  environments,
  activeEnvironment,
  onEnvironmentChange,
  onEnvironmentsUpdate,
}: EnvironmentManagerProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);

  const addEnvironment = (name: string) => {
    const newEnv: Environment = {
      name,
      variables: {},
    };
    onEnvironmentsUpdate([...environments, newEnv]);
  };

  const updateEnvironment = (name: string, variables: Record<string, string>) => {
    onEnvironmentsUpdate(
      environments.map((env) => (env.name === name ? { ...env, variables } : env))
    );
  };

  const deleteEnvironment = (name: string) => {
    onEnvironmentsUpdate(environments.filter((env) => env.name !== name));
    if (activeEnvironment === name) {
      const remaining = environments.filter((env) => env.name !== name);
      onEnvironmentChange(remaining[0]?.name || '');
    }
  };

  const exportEnvironment = (env: Environment) => {
    const json = JSON.stringify(env, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${env.name}-env.json`;
    a.click();
  };

  const activeEnv = environments.find((env) => env.name === activeEnvironment);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-foreground/60 hover:text-foreground"
          title="Environment Manager"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <div className="text-xs font-semibold text-foreground mb-2">Environments</div>
          {environments.map((env) => (
            <div
              key={env.name}
              className={`px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                activeEnvironment === env.name
                  ? 'bg-primary/20 text-foreground'
                  : 'text-foreground/70 hover:bg-primary/10'
              }`}
              onClick={() => onEnvironmentChange(env.name)}
            >
              <div className="flex items-center justify-between">
                <span>{env.name}</span>
                {activeEnvironment === env.name && <span className="text-green-400">✓</span>}
              </div>
            </div>
          ))}
        </div>

        <DropdownMenuSeparator />

        {activeEnv && (
          <>
            <DropdownMenuItem onClick={() => exportEnvironment(activeEnv)}>
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteEnvironment(activeEnv.name)}>
              <X className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
