/**
 * ExecutionHistory Component - Usage Example
 * 
 * This component displays a vertical list of execution history for a given request.
 * It fetches data from GET /api/requests/:requestId/executions
 */

import { useState } from 'react';
import { ExecutionHistory } from './ExecutionHistory';

export function ExecutionHistoryExample() {
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>();

  // Example: Replace with actual requestId from your route params or props
  const requestId = '69739fbad146bb5b3c6ce666';

  const handleSelectExecution = (executionId: string) => {
    setSelectedExecutionId(executionId);
    console.log('Selected execution:', executionId);
    
    // You can fetch execution details here
    // fetch(`/api/executions/${executionId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     // Display execution details in your UI
    //   });
  };

  return (
    <div className="w-80 h-screen bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-bold">Execution History</h2>
      </div>
      
      <ExecutionHistory
        requestId={requestId}
        onSelectExecution={handleSelectExecution}
        selectedExecutionId={selectedExecutionId}
      />
    </div>
  );
}

/**
 * Integration with Sidebar:
 * 
 * import { Sidebar } from '@/components/flux/Sidebar';
 * 
 * function MyApp() {
 *   const [activeTab, setActiveTab] = useState('executions');
 *   const [selectedExecution, setSelectedExecution] = useState<string>();
 *   const currentRequestId = '69739fbad146bb5b3c6ce666'; // from route or state
 * 
 *   return (
 *     <Sidebar
 *       activeTab={activeTab}
 *       setActiveTab={setActiveTab}
 *       currentRequestId={currentRequestId}
 *       onSelectExecution={setSelectedExecution}
 *       selectedExecutionId={selectedExecution}
 *     />
 *   );
 * }
 */
