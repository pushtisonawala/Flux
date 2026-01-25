'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { createWorkspace, createRequest, executeRequest } from '@/lib/api';
import { Sidebar } from '@/components/flux/Sidebar';
import { RequestBuilder } from '@/components/flux/RequestBuilder';
import { ResponseViewer } from '@/components/flux/ResponseViewer';
import { ExecutionResponseViewer } from '@/components/flux/ExecutionResponseViewer';
import { KeyboardShortcuts } from '@/components/flux/KeyboardShortcuts';

export default function FluxApp() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [workspace, setWorkspace] = useState<any>(null);

    useEffect(() => {
      const u = getUser();
      if (!u) {
        router.replace('/home');
      } else {
        setUser(u);
        // Create a default workspace for the user
        createWorkspace('My Workspace', u._id)
          .then(ws => setWorkspace(ws))
          .catch(err => console.error('Failed to create workspace:', err));
      }
    }, [router]);
  const [activeTab, setActiveTab] = useState<'collections' | 'history' | 'executions'>('collections');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | undefined>(undefined);
  const [requestConfig, setRequestConfig] = useState({
    method: 'GET',
    url: '',
    params: {},
    headers: {},
    body: '',
    auth: { type: 'none' },
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [previousResponse, setPreviousResponse] = useState<any>(null);

  const handleSendRequest = useCallback(async () => {
    if (!requestConfig.url) {
      alert('Please enter a URL');
      return;
    }

    if (!workspace || !user) {
      alert('Workspace or user not available');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    try {
      // Save the request to the backend first
      const savedRequest = await createRequest(workspace._id, {
        folder_name: 'Default',
        url: requestConfig.url,
        method: requestConfig.method,
        headers: requestConfig.headers || {},
        body: requestConfig.body || '{}',
        user_id: user._id,
      });

      setPreviousResponse(response);
      
      const executionResult = await executeRequest(savedRequest._id);
      
      // Store the request and execution IDs for execution history
      setSelectedRequest(savedRequest);
      
      setResponse({
        status: executionResult.response.status,
        statusText: executionResult.execution.state,
        headers: executionResult.response.headers || {},
        body: typeof executionResult.response.body === 'string' 
          ? executionResult.response.body 
          : JSON.stringify(executionResult.response.body, null, 2),
        size: new Blob([JSON.stringify(executionResult.response.body)]).size,
        time: executionResult.response.latency,
      });

      // Auto-switch to executions tab to show the new execution
      setActiveTab('executions');
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
  }, [requestConfig, response, workspace, user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace('/home');
  };

  const handleSelectExecution = (executionId: string) => {
    setSelectedExecutionId(executionId);
    console.log('Selected execution:', executionId);
  };

  const handleCloseExecutionViewer = () => {
    setSelectedExecutionId(undefined);
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequest({ _id: requestId });
    console.log('Selected request:', requestId);
  };

  return (
    <>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          currentRequestId={selectedRequest?._id}
          onSelectRequest={handleSelectRequest}
          onSelectExecution={handleSelectExecution}
          selectedExecutionId={selectedExecutionId}
          userId={user?._id}
        />
        <RequestBuilder
          requestConfig={requestConfig}
          setRequestConfig={setRequestConfig}
          onSend={handleSendRequest}
          loading={loading}
        />
        {selectedExecutionId ? (
          <ExecutionResponseViewer 
            executionId={selectedExecutionId}
            onClose={handleCloseExecutionViewer}
          />
        ) : (
          <ResponseViewer 
            response={response} 
            previousResponse={previousResponse}
            loading={loading}
          />
        )}
        <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <KeyboardShortcuts onSend={handleSendRequest} />
    </>
  );
}
