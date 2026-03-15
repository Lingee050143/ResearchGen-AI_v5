'use client';
import { CompetitorAnalysisData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  '가능': { bg: '#ECFDF5', color: '#059669' },
  '제한': { bg: '#FEF3C7', color: '#D97706' },
  '불가': { bg: '#FEF2F2', color: '#DC2626' },
};

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  high: { bg: '#FEF2F2', color: '#DC2626' },
  medium: { bg: '#FEF3C7', color: '#D97706' },
  low: { bg: '#ECFDF5', color: '#059669' },
};
const PRIORITY_LABELS: Record<string, string> = { high: '높음', medium: '중간', low: '낮음' };
const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B'];

interface Props { data: CompetitorAnalysisData }

export default function CompetitorAnalysisStage({ data }: Props) {
  const competitorNames = data.competitors.map(c => c.name);

  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔍</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 3</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>경쟁사 분석</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>주요 경쟁사의 UX 강약점과 시장 기회 분석</p>
      </div>

      {/* Competitor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        {data.competitors.map((comp, i) => (
          <div key={comp.id} className="card" style={{ borderTop: `3px solid ${COLORS[i % COLORS.length]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{comp.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
                  {comp.platform} · 다운로드 {comp.downloads}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: COLORS[i % COLORS.length] }}>{comp.uxScore}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>UX 점수</div>
              </div>
            </div>
            {/* UX Score bar */}
            <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2, marginBottom: 14 }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${(comp.uxScore / 5) * 100}%`, background: COLORS[i % COLORS.length] }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', marginBottom: 6 }}>강점</div>
                {comp.pros.map((p, j) => <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 4 }}><span>·</span>{p}</div>)}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#DC2626', marginBottom: 6 }}>약점</div>
                {comp.cons.map((c, j) => <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 4 }}><span>·</span>{c}</div>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>기능 비교 테이블</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>기능</th>
                {competitorNames.map(name => (
                  <th key={name} style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.featureComparison.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--text-primary)' }}>{row.feature}</td>
                  {competitorNames.map(name => {
                    const status = row[name] as string;
                    const s = STATUS_STYLES[status] || { bg: '#F1F5F9', color: '#64748B' };
                    return (
                      <td key={name} style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                          {status}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* GAP Opportunities */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>시장 GAP 기회</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.gaps.map((gap, i) => {
              const ps = PRIORITY_STYLES[gap.priority];
              return (
                <div key={i} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 10, background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{gap.title}</div>
                    <span style={{ background: ps.bg, color: ps.color, padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                      {PRIORITY_LABELS[gap.priority]}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>{gap.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sentiment Chart */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>경쟁사 리뷰 감성</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.sentimentData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend formatter={(v) => v === 'positive' ? '긍정' : v === 'neutral' ? '중립' : '부정'} />
              <Bar dataKey="positive" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="긍정" />
              <Bar dataKey="neutral" stackId="a" fill="#94A3B8" name="중립" />
              <Bar dataKey="negative" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} name="부정" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
