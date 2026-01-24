// API utility for workspaces and requests

const API_BASE = 'http://localhost:4000';

export async function createWorkspace(name: string, ownerId: string) {
  const res = await fetch(`${API_BASE}/api/workspaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, ownerId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create workspace');
  }
  return data.workspace;
}

export async function createRequest(
  workspaceId: string,
  requestData: {
    folder_name: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
    user_id: string;
  }
) {
  const res = await fetch(`${API_BASE}/api/requests/${workspaceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create request');
  }
  return data.created;
}

export async function getRequests(workspaceId: string) {
  const res = await fetch(`${API_BASE}/api/requests/${workspaceId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to get requests');
  }
  return data.getReq;
}

export async function executeRequest(requestId: string) {
  const res = await fetch(`${API_BASE}/api/${requestId}/execution`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to execute request');
  }
  return data;
}

