'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { step: 0, label: '대시보드', href: '/', icon: '⊞' },
  { step: 1, label: '아이디어 입력', href: '#', icon: '✏️' },
  { step: 2, label: 'AI 분석', href: '#', icon: '🧠' },
  { step: 3, label: '경쟁사 분석', href: '#', icon: '🔍' },
  { step: 4, label: '리뷰 분석', href: '#', icon: '💬' },
  { step: 5, label: '인사이트 맵', href: '#', icon: '🗺️' },
  { step: 6, label: '페르소나', href: '#', icon: '👤' },
  { step: 7, label: '사용자 여정', href: '#', icon: '🛤️' },
  { step: 8, label: '기회 지도', href: '#', icon: '🎯' },
  { step: 9, label: 'UX 보고서', href: '#', icon: '📄' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      background: 'var(--secondary)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      borderRight: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--primary)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>🔬</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>ResearchGen</div>
            <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500 }}>AI UX Research</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.step === 0 ? pathname === '/' : false;
          return (
            <Link key={item.step} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 20px', cursor: 'pointer', transition: 'all 0.15s',
                background: isActive ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                borderLeft: isActive ? '3px solid #4F46E5' : '3px solid transparent',
              }}>
                <span style={{ fontSize: 15, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  {item.step > 0 && (
                    <div style={{ color: '#475569', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 1 }}>
                      STEP {item.step}
                    </div>
                  )}
                  <div style={{
                    color: isActive ? 'white' : '#94A3B8',
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                  }}>{item.label}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          background: 'rgba(79, 70, 229, 0.15)', borderRadius: 8, padding: '10px 12px',
          border: '1px solid rgba(79, 70, 229, 0.3)',
        }}>
          <div style={{ color: '#A5B4FC', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>AI 엔진 상태</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
            <span style={{ color: '#94A3B8', fontSize: 12 }}>준비 완료</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
