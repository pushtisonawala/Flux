'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/flux/Sidebar';
import { RequestBuilder } from '@/components/flux/RequestBuilder';
import { ResponseViewer } from '@/components/flux/ResponseViewer';
import { KeyboardShortcuts } from '@/components/flux/KeyboardShortcuts';

export default function Home() {
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

  return (
    <>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        {/* Left Sidebar - Navigator */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Middle Pane - Request Builder */}
        <RequestBuilder
          requestConfig={requestConfig}
          setRequestConfig={setRequestConfig}
          onSend={handleSendRequest}
          loading={loading}
        />

        {/* Right Pane - Response Viewer */}
        <ResponseViewer 
          response={response} 
          previousResponse={previousResponse}
          loading={loading}
        />
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts onSend={handleSendRequest} />
    </>
  );
}
