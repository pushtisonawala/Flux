'use client';

import { useState } from 'react';
import { Plus, X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ParamItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface ParamsBuilderProps {
  params: Record<string, string>;
  onParamsChange: (params: Record<string, string>) => void;
}

export function ParamsBuilder({ params, onParamsChange }: ParamsBuilderProps) {
  const [paramsList, setParamsList] = useState<ParamItem[]>(
    Object.entries(params).map(([key, value], idx) => ({
      id: `param-${idx}`,
      key,
      value,
      enabled: true,
    }))
  );

  const addParam = () => {
    const newParam: ParamItem = {
      id: `param-${Date.now()}`,
      key: '',
      value: '',
      enabled: true,
    };
    setParamsList([...paramsList, newParam]);
  };

  const updateParam = (id: string, updates: Partial<ParamItem>) => {
    const updated = paramsList.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setParamsList(updated);
    
    // Update parent
    const newParams: Record<string, string> = {};
    updated.forEach((p) => {
      if (p.enabled && p.key) {
        newParams[p.key] = p.value;
      }
    });
    onParamsChange(newParams);
  };

  const removeParam = (id: string) => {
    const updated = paramsList.filter((p) => p.id !== id);
    setParamsList(updated);
    
    const newParams: Record<string, string> = {};
    updated.forEach((p) => {
      if (p.enabled && p.key) {
        newParams[p.key] = p.value;
      }
    });
    onParamsChange(newParams);
  };

  const buildQueryString = () => {
    const enabled = paramsList.filter((p) => p.enabled && p.key);
    return enabled.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <h3 className="text-sm font-semibold text-foreground">Query Parameters</h3>
          <span className="text-xs text-foreground/50">({paramsList.filter((p) => p.enabled && p.key).length})</span>
        </div>
        <Button size="sm" variant="outline" className="h-8 gap-1 border-border bg-transparent" onClick={addParam}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {paramsList.length > 0 ? (
        <div className="space-y-2">
          {paramsList.map((param) => (
            <div key={param.id} className="flex gap-2 items-center group">
              <Checkbox
                checked={param.enabled}
                onCheckedChange={(checked) =>
                  updateParam(param.id, { enabled: checked as boolean })
                }
                className="h-4 w-4 border-border"
              />
              <Input
                placeholder="Key"
                value={param.key}
                onChange={(e) => updateParam(param.id, { key: e.target.value })}
                className="w-32 bg-card border-border text-foreground text-xs"
              />
              <span className="text-foreground/40">=</span>
              <Input
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateParam(param.id, { value: e.target.value })}
                className="flex-1 bg-card border-border text-foreground text-xs"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-foreground/60 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeParam(param.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {buildQueryString() && (
            <div className="mt-3 p-2 bg-primary/10 border border-border rounded">
              <div className="text-xs text-foreground/60 mb-1">Query String:</div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-foreground/80 flex-1 break-all">{buildQueryString()}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => navigator.clipboard.writeText(buildQueryString())}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-3 text-xs text-foreground/60">
          No parameters added
        </div>
      )}
    </div>
  );
}
