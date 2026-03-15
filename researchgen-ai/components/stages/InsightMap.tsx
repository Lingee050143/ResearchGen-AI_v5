'use client';
import { useState, useCallback } from 'react';
import ReactFlow, {
  Node, Edge, Controls, Background, BackgroundVariant,
  useNodesState, useEdgesState, NodeProps, Handle, Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { InsightMapData, InsightNode } from '@/lib/types';

const NODE_STYLES: Record<string, { bg: string; border: string; color: string; label: string }> = {
  review: { bg: '#FEF2F2', border: '#FCA5A5', color: '#DC2626', label: 'Review' },
  competitor: { bg: '#EFF6FF', border: '#93C5FD', color: '#2563EB', label: 'Competitor' },
  user: { bg: '#ECFDF5', border: '#6EE7B7', color: '#059669', label: 'User' },
  ai: { bg: '#F5F3FF', border: '#C4B5FD', color: '#7C3AED', label: 'AI' },
};

function InsightNodeComponent({ data }: NodeProps) {
  const st = NODE_STYLES[data.type] || NODE_STYLES.ai;
  return (
    <div style={{
      background: st.bg, border: `2px solid ${st.border}`,
      borderRadius: 12, padding: '10px 14px', minWidth: 160, maxWidth: 200,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: st.border }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: st.color, marginBottom: 4, letterSpacing: '0.06em' }}>{st.label.toUpperCase()}</div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', marginBottom: 4 }}>{data.title}</div>
      <div style={{ fontSize: 11, color: '#64748B' }}>증거 {data.evidenceCount}건 · {data.confidence}%</div>
      <Handle type="source" position={Position.Right} style={{ background: st.border }} />
    </div>
  );
}

const nodeTypes = { insight: InsightNodeComponent };

interface Props { data: InsightMapData }

export default function InsightMapStage({ data }: Props) {
  const [selectedNode, setSelectedNode] = useState<InsightNode | null>(null);

  const rfNodes: Node[] = data.nodes.map(n => ({
    id: n.id, type: 'insight',
    position: n.position,
    data: { ...n },
  }));
  const rfEdges: Edge[] = data.edges.map(e => ({
    id: e.id, source: e.source, target: e.target,
    style: { stroke: '#CBD5E1', strokeWidth: 2 },
    animated: false,
  }));

  const [nodes, , onNodesChange] = useNodesState(rfNodes);
  const [edges, , onEdgesChange] = useEdgesState(rfEdges);

  function onNodeClick(_: React.MouseEvent, node: Node) {
    const found = data.nodes.find(n => n.id === node.id);
    setSelectedNode(found || null);
  }

  const nodeStyle = selectedNode ? NODE_STYLES[selectedNode.type] || NODE_STYLES.ai : null;

  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🗺️</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 5</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>인사이트 맵</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>AI·경쟁사·리뷰·사용자 인사이트를 연결한 관계 지도</p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {Object.entries(NODE_STYLES).map(([key, s]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.border }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Flow Canvas */}
        <div style={{ height: 520, border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#CBD5E1" />
            <Controls />
          </ReactFlow>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedNode ? (
            <div className="card animate-fade-in" style={{ borderTop: `4px solid ${nodeStyle?.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: nodeStyle?.color, letterSpacing: '0.06em', marginBottom: 8 }}>
                {NODE_STYLES[selectedNode.type]?.label.toUpperCase()} 인사이트
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{selectedNode.title}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{selectedNode.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>증거 수</span>
                  <strong>{selectedNode.evidenceCount}건</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>신뢰도</span>
                  <strong>{selectedNode.confidence}%</strong>
                </div>
              </div>
              <div style={{ marginTop: 12, height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${selectedNode.confidence}%`, background: nodeStyle?.color }} />
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>👆</div>
              <div style={{ fontSize: 14 }}>노드를 클릭하면<br/>상세 정보가 표시됩니다</div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="card" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>인사이트 현황</div>
            {Object.entries(NODE_STYLES).map(([key, s]) => {
              const count = data.nodes.filter(n => n.type === key).length;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.border }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{count}개</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
