import React from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface FileCorrelationProps {
  files: string[];
}

const FileCorrelation: React.FC<FileCorrelationProps> = ({ files }) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  files.forEach((file, index) => {
    nodes.push({
      id: file,
      data: { label: file },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    });

    // This is a simplified correlation. In a real-world scenario, you'd analyze file contents.
    files.forEach((otherFile, otherIndex) => {
      if (index !== otherIndex && Math.random() > 0.7) {
        edges.push({
          id: `e${file}-${otherFile}`,
          source: file,
          target: otherFile,
          animated: true,
        });
      }
    });
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">File Correlation Visualization</h2>
      <div style={{ height: '500px' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView />
      </div>
    </div>
  );
};

export default FileCorrelation;