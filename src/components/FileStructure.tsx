import React from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface FileStructureProps {
  files: string[];
}

const FileStructure: React.FC<FileStructureProps> = ({ files }) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  files.forEach((file, index) => {
    const parts = file.split('/');
    let parentId = '';
    parts.forEach((part, i) => {
      const id = parentId ? `${parentId}/${part}` : part;
      if (!nodes.some(node => node.id === id)) {
        nodes.push({
          id,
          data: { label: part },
          position: { x: i * 150, y: index * 50 },
        });
        if (parentId) {
          edges.push({
            id: `e${parentId}-${id}`,
            source: parentId,
            target: id,
          });
        }
      }
      parentId = id;
    });
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">File Structure Visualization</h2>
      <div style={{ height: '500px' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView />
      </div>
    </div>
  );
};

export default FileStructure;