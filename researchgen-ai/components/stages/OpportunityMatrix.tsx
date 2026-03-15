'use client';
import { OpportunityData } from '@/lib/types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const QUADRANT_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  'quick-win': { color: '#059669', bg: '#ECFDF5', label: '⚡ 퀵윈' },
  'strategic': { color: '#4F46E5', bg: '#EEF2FF', label: '🎯 전략적' },
  'fill-in': { color: '#D97706', bg: '#FEF3C7', label: '📋 보완' },
  'low-priority': { color: '#64748B', bg: '#F1F5F9', label: '⬇ 낮은 우선순위' },
};

const SCATTER_COLORS: Record<string, string> = {
  'quick-win': '#10B981',
  'strategic': '#4F46E5',
  'fill-in': '#F59E0B',
  'low-priority': '#94A3B8',
};

interface Props { data: OpportunityData[] }

interface TooltipProps {
  active?: boolean;
  payload?: { payload: OpportunityData }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const qs = QUADRANT_STYLES[d.quadrant];
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', maxWidth: 200, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{d.title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{d.description}</div>
      <span style={{ background: qs.bg, color: qs.color, padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{qs.label}</span>
    </div>
  );
}

export default function OpportunityMatrixStage({ data }: Props) {
  const sortedByValue = [...data].sort((a, b) => b.value - a.value);

  // Summary stats
  const quickWins = data.filter(d => d.quadrant === 'quick-win').length;
  const strategic = data.filter(d => d.quadrant === 'strategic').length;

  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎯</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 8</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>기회 지도</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>가치(Value) × 노력(Effort) 우선순위 매트릭스</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {[
          { label: '전체 기회', value: data.length, color: '#4F46E5', icon: '📊' },
          { label: '퀵윈 항목', value: quickWins, color: '#10B981', icon: '⚡' },
          { label: '전략적 항목', value: strategic, color: '#7C3AED', icon: '🎯' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Scatter Chart */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>우선순위 매트릭스</div>

          {/* Quadrant labels overlay */}
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={380}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" dataKey="effort" domain={[0, 10]} name="노력">
                  <Label value="Effort (노력)" position="bottom" style={{ fontSize: 12, fill: '#94A3B8' }} />
                </XAxis>
                <YAxis type="number" dataKey="value" domain={[0, 10]} name="가치">
                  <Label value="Value (가치)" angle={-90} position="left" style={{ fontSize: 12, fill: '#94A3B8' }} />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={5} stroke="#E2E8F0" strokeDasharray="6 3" />
                <ReferenceLine y={5} stroke="#E2E8F0" strokeDasharray="6 3" />
                <Scatter
                  data={data}
                  shape={(props: { cx?: number; cy?: number; payload?: OpportunityData }) => {
                    const { cx = 0, cy = 0, payload } = props;
                    const color = payload ? SCATTER_COLORS[payload.quadrant] : '#94A3B8';
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={14} fill={color} fillOpacity={0.85} />
                        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fill="white" fontWeight={700}>
                          {payload?.title.slice(0, 4)}
                        </text>
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            {Object.entries(QUADRANT_STYLES).map(([k, s]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: SCATTER_COLORS[k] }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked List */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>기회 우선순위</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedByValue.map((opp, i) => {
              const qs = QUADRANT_STYLES[opp.quadrant];
              return (
                <div key={opp.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#F1F5F9', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{opp.title}</div>
                    </div>
                    <span style={{ background: qs.bg, color: qs.color, padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                      {qs.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', paddingLeft: 30 }}>
                    <span>가치 <strong style={{ color: 'var(--text-primary)' }}>{opp.value}/10</strong></span>
                    <span>노력 <strong style={{ color: 'var(--text-primary)' }}>{opp.effort}/10</strong></span>
                    <span>점수 <strong style={{ color: '#4F46E5' }}>{opp.value - opp.effort > 0 ? '+' : ''}{opp.value - opp.effort}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
