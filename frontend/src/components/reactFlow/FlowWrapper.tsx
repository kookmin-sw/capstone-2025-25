import { ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { initialNodes } from '@/components/reactFlow/nodes';
import { initialEdges } from '@/components/reactFlow/edges';

function FlowWrapper() {
  return (
    <div className="w-full h-full">
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView></ReactFlow>
    </div>
  );
}

export default FlowWrapper;
