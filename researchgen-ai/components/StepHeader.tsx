'use client';

const STEPS = [
  { n: 1, label: '아이디어 입력' },
  { n: 2, label: 'AI 분석' },
  { n: 3, label: '경쟁사 분석' },
  { n: 4, label: '리뷰 분석' },
  { n: 5, label: '인사이트 맵' },
  { n: 6, label: '페르소나' },
  { n: 7, label: '사용자 여정' },
  { n: 8, label: '기회 지도' },
  { n: 9, label: 'UX 보고서' },
];

interface StepHeaderProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepHeader({ currentStep, onStepClick }: StepHeaderProps) {
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 64,
        gap: 0,
        maxWidth: 1100,
        overflowX: 'auto',
      }}>
        {STEPS.map((step, idx) => {
          const done = step.n < currentStep;
          const active = step.n === currentStep;
          const future = step.n > currentStep;

          return (
            <div key={step.n} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {/* Connector Line */}
              {idx > 0 && (
                <div style={{
                  width: 20, height: 2, flexShrink: 0,
                  background: done ? 'var(--primary)' : active ? 'var(--primary)' : '#E2E8F0',
                }} />
              )}

              <button
                onClick={() => onStepClick?.(step.n)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 4, cursor: onStepClick ? 'pointer' : 'default',
                  background: 'none', border: 'none', padding: '4px 8px',
                }}
              >
                {/* Circle */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                  background: done ? 'var(--primary)' : active ? 'var(--primary)' : 'white',
                  color: done || active ? 'white' : '#94A3B8',
                  border: future ? '2px solid #E2E8F0' : active ? '2px solid var(--primary)' : 'none',
                  boxShadow: active ? '0 0 0 4px #EEF2FF' : 'none',
                }}>
                  {done ? '✓' : step.n}
                </div>
                {/* Label */}
                <div style={{
                  fontSize: 10, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap',
                  color: active ? 'var(--primary)' : done ? '#64748B' : '#94A3B8',
                }}>
                  {step.label}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
