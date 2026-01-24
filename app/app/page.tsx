'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { Sidebar } from '@/components/flux/Sidebar';
import { RequestBuilder } from '@/components/flux/RequestBuilder';
import { ResponseViewer } from '@/components/flux/ResponseViewer';
import { KeyboardShortcuts } from '@/components/flux/KeyboardShortcuts';

export default function FluxApp() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      const u = getUser();
      if (!u) {
        router.replace('/home');
      } else {
        setUser(u);
      }
    }, [router]);
  const [activeTab, setActiveTab] = useState<'collections' | 'history'>('collections');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestConfig, setRequestConfig] = useState({
    method: 'GET',
    url: '',
    params: {},
    headers: {},
    body: '',
    auth: { type: 'none' },
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousResponse, setPreviousResponse] = useState(null);

  const handleSendRequest = useCallback(async () => {
    if (!requestConfig.url) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    try {
      setPreviousResponse(response);
      const res = await fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.method !== 'GET' && requestConfig.method !== 'HEAD' ? requestConfig.body : undefined,
      });

      const text = await res.text();
      const duration = Date.now() - startTime;
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: text,
        size: new Blob([text]).size,
        time: duration,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        body: error instanceof Error ? error.message : 'Unknown error',
        size: 0,
        time: duration,
      });
    } finally {
      setLoading(false);
    }
  }, [requestConfig, response]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace('/home');
  };

  return (
    <>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <RequestBuilder
          requestConfig={requestConfig}
          setRequestConfig={setRequestConfig}
          onSend={handleSendRequest}
          loading={loading}
        />
        <ResponseViewer 
          response={response} 
          previousResponse={previousResponse}
          loading={loading}
        />
        <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <KeyboardShortcuts onSend={handleSendRequest} />
    </>
  );
}
