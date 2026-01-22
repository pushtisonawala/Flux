'use client';

import { useState, useCallback } from 'react';

export interface HistoryItem {
  id: string;
  method: string;
  url: string;
  status: number;
  time: string;
  timestamp: number;
  body?: string;
  headers?: Record<string, string>;
}

export function useRequestHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = useCallback((
    method: string,
    url: string,
    status: number,
    time: number,
    body?: string,
    headers?: Record<string, string>
  ) => {
    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      method,
      url,
      status,
      time: `${time}ms`,
      timestamp: Date.now(),
      body,
      headers,
    };

    setHistory((prev) => [item, ...prev.slice(0, 49)]); // Keep last 50 items
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getHistoryByStatus = useCallback((status: number) => {
    return history.filter((item) => item.status === status);
  }, [history]);

  return {
    history,
    addToHistory,
    clearHistory,
    getHistoryByStatus,
  };
}
