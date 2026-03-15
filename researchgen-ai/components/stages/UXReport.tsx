'use client';
import { UXReportData } from '@/lib/types';

interface Props { data: UXReportData }

export default function UXReportStage({ data }: Props) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 1060, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📄</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 9</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>UX 보고서</h2>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 8, border: '1.5px solid var(--border)',
                background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
              }}
            >
              🖨️ PDF 출력
            </button>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 8, border: 'none',
                background: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'white',
              }}
            >
              📤 공유하기
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 24, color: 'white',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10, opacity: 0.8 }}>EXECUTIVE SUMMARY</div>
        <p style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.95 }}>{data.executiveSummary}</p>
      </div>

      {/* Key Insights Grid */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>핵심 인사이트</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {data.keyInsights.map((ins, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{ins.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: 'var(--text-primary)' }}>{ins.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ins.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunity Mapping */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>기회 우선순위 매핑</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.opportunityMapping.map((opp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#F8FAFC', borderRadius: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#EEF2FF', color: 'var(--primary)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{opp.title}</div>
              <span style={{ fontSize: 13 }}>{opp.priority}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{opp.impact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>전략적 권고사항</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', background: '#F8FAFC' }}>
                {['영역', '실행 방안', '타임라인', '우선순위'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recommendations.map((rec, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{rec.area}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec.action}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--primary)', fontWeight: 600 }}>{rec.timeline}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      background: rec.priority === '긴급' ? '#FEF2F2' : rec.priority === '높음' ? '#FEF3C7' : '#EEF2FF',
                      color: rec.priority === '긴급' ? '#DC2626' : rec.priority === '높음' ? '#D97706' : '#4F46E5',
                      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                    }}>{rec.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Steps Timeline */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>다음 단계 · 릴리즈 로드맵</div>
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 115, top: 0, bottom: 0, width: 2, background: '#E2E8F0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {data.nextSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ width: 115, textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'inline-block', background: '#EEF2FF', color: 'var(--primary)', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                    {step.timeline}
                  </div>
                </div>
                <div style={{ position: 'relative', width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4, zIndex: 1 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: 'var(--primary)' }}>{step.phase}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {step.items.map((item, j) => (
                      <span key={j} style={{ background: '#F1F5F9', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
