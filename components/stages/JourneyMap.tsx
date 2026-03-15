'use client';
import { JourneyData } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

interface Props { data: JourneyData }

const EMOTION_COLORS = {
  high: '#10B981', mid: '#F59E0B', low: '#EF4444'
};

export default function JourneyMapStage({ data }: Props) {
  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛤️</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 7</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>사용자 여정</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>사용자 경험 흐름과 감성 변화 곡선</p>
      </div>

      {/* Emotion Curve */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>감성 곡선 (감정 점수)</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data.emotionCurve} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="stage" tick={{ fontSize: 13 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [`${v}점`, '감성 점수']} />
            <ReferenceLine y={50} stroke="#E2E8F0" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#4F46E5', r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Journey Stages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {data.stages.map((stage, i) => {
          const score = data.emotionCurve[i]?.score || 50;
          const sentColor = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
          const sentBg = score >= 70 ? '#ECFDF5' : score >= 40 ? '#FEF3C7' : '#FEF2F2';
          return (
            <div key={stage.name} className="card" style={{ padding: 16, borderTop: `4px solid ${sentColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>STAGE {i + 1}</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{stage.koreanName}</div>
                </div>
                <div style={{ background: sentBg, color: sentColor, padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                  {score}점
                </div>
              </div>

              {/* Actions */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>행동</div>
                {stage.actions.map((a, j) => (
                  <div key={j} style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 4 }}>
                    <span>→</span>{a}
                  </div>
                ))}
              </div>

              {/* Pains */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#DC2626', marginBottom: 4 }}>불편 사항</div>
                {stage.pains.map((p, j) => (
                  <div key={j} style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 4 }}>
                    <span style={{ color: '#DC2626' }}>!</span>{p}
                  </div>
                ))}
              </div>

              {/* Expectations */}
              <div style={{ background: '#F8FAFC', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', marginBottom: 4 }}>기대</div>
                {stage.expectations.map((e, j) => (
                  <div key={j} style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: j < stage.expectations.length - 1 ? 2 : 0 }}>
                    {e}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, color: '#DC2626', marginBottom: 12 }}>핵심 불편 사항</div>
          {data.coreIssues.map((issue, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: i < data.coreIssues.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{issue}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, color: '#059669', marginBottom: 12 }}>AI 개선 권고사항</div>
          {data.aiRecommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: i < data.aiRecommendations.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
