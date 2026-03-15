'use client';
import { AIAnalysisData } from '@/lib/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  user_preference: { bg: '#EEF2FF', text: '#4F46E5', icon: '👤' },
  psychology: { bg: '#FEF3C7', text: '#D97706', icon: '🧠' },
  accessibility: { bg: '#ECFDF5', text: '#059669', icon: '♿' },
  trend: { bg: '#EFF6FF', text: '#2563EB', icon: '📈' },
};
const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B'];

interface Props { data: AIAnalysisData }

export default function AIAnalysisStage({ data }: Props) {
  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 2</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>AI 분석</h2>
          </div>
          <span style={{ marginLeft: 'auto', background: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
            ✓ AI 분석 완료
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>
          제품 개념에서 추출한 전략적 인사이트와 타겟 사용자 세그먼트입니다
        </p>
      </div>

      {/* Problem Interpretation */}
      <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--primary)' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', marginBottom: 8, letterSpacing: '0.05em' }}>문제 해석</div>
        <p style={{ color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.7 }}>{data.problemInterpretation}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
        {/* Strategic Insights */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>전략적 인사이트</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.insights.map(insight => {
              const style = CATEGORY_COLORS[insight.category] || CATEGORY_COLORS.user_preference;
              return (
                <div key={insight.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{style.icon}</span>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{insight.title}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>신뢰도</span>
                      <div style={{
                        background: insight.confidence >= 80 ? '#ECFDF5' : '#EEF2FF',
                        color: insight.confidence >= 80 ? '#059669' : '#4F46E5',
                        padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                      }}>{insight.confidence}%</div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{insight.description}</p>
                  {/* Confidence bar */}
                  <div style={{ marginTop: 10, width: '100%', height: 4, background: '#F1F5F9', borderRadius: 2 }}>
                    <div style={{ height: '100%', borderRadius: 2, width: `${insight.confidence}%`, background: insight.confidence >= 80 ? '#10B981' : '#4F46E5' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Target Segments Pie */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>타겟 사용자 세그먼트</div>
          <div className="card">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.targetSegments} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${(entry as unknown as { name: string; percentage: number }).name} ${(entry as unknown as { name: string; percentage: number }).percentage}%`} labelLine={false} fontSize={11}>
                  {data.targetSegments.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {data.targetSegments.map((seg, i) => (
                <div key={seg.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{seg.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{seg.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HMW Questions */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>How Might We — 핵심 질문</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.hmwQuestions.map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.6 }}>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
