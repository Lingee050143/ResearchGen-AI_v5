'use client';
import { PersonaData } from '@/lib/types';

interface Props { data: PersonaData[] }

function TraitBar({ name, value }: { name: string; value: number }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3 }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${value}%`, background: 'var(--primary)', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export default function PersonaStage({ data }: Props) {
  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 6</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>페르소나</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>인사이트 클러스터에서 도출된 핵심 사용자 페르소나</p>
      </div>

      {/* User Ecosystem Matrix */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>사용자 생태계 매트릭스 (전문성 × 참여도)</div>
        <div style={{ position: 'relative', height: 240, background: '#FAFAFA', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Quadrant labels */}
          <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 11, color: '#94A3B8' }}>저 전문성 / 높은 참여도</div>
          <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 11, color: '#94A3B8', textAlign: 'right' }}>고 전문성 / 높은 참여도</div>
          <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 11, color: '#94A3B8' }}>저 전문성 / 낮은 참여도</div>
          <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 11, color: '#94A3B8', textAlign: 'right' }}>고 전문성 / 낮은 참여도</div>
          {/* Center lines */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#E2E8F0' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#E2E8F0' }} />
          {/* Persona bubbles */}
          {data.map(p => (
            <div
              key={p.id}
              title={`${p.name} (전문성: ${p.expertise}/10, 참여도: ${p.engagement}/10)`}
              style={{
                position: 'absolute',
                left: `${(p.expertise / 10) * 90 + 5}%`,
                top: `${(1 - p.engagement / 10) * 80 + 10}%`,
                transform: 'translate(-50%, -50%)',
                width: 48, height: 48, borderRadius: '50%',
                background: p.avatarColor, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, cursor: 'default',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 1,
              }}
            >
              {p.name.charAt(0)}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
          {data.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.avatarColor }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Persona Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {data.map(persona => (
          <div key={persona.id} className="card" style={{ borderTop: `4px solid ${persona.avatarColor}` }}>
            {/* Avatar & Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: persona.avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 18, fontWeight: 700, flexShrink: 0,
              }}>{persona.name.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{persona.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{persona.age}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{persona.location}</div>
              </div>
            </div>

            {/* Quote */}
            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 12px', marginBottom: 14, borderLeft: `3px solid ${persona.avatarColor}` }}>
              <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{persona.quote}</p>
            </div>

            {/* Traits */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>특성 분석</div>
              {persona.traits.map(t => <TraitBar key={t.name} name={t.name} value={t.value} />)}
            </div>

            {/* Goals */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#059669', marginBottom: 6 }}>목표</div>
              {persona.goals.map((g, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 6 }}>
                  <span style={{ color: '#059669' }}>✓</span>{g}
                </div>
              ))}
            </div>

            {/* Pain Points */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#DC2626', marginBottom: 6 }}>불편 사항</div>
              {persona.painPoints.map((p, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 6 }}>
                  <span style={{ color: '#DC2626' }}>✗</span>{p}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
