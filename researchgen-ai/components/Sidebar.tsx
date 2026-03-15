'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getApiKey, setApiKey, clearApiKey, validateApiKey } from '@/lib/apiKeyStorage';

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
  const [showModal, setShowModal] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationMsg, setValidationMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setStoredKey(getApiKey());
  }, []);

  function openModal() {
    setInputKey(getApiKey() || '');
    setValidationMsg(null);
    setShowKey(false);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setValidationMsg(null);
  }

  async function handleValidate() {
    if (!inputKey.trim()) return;
    setValidating(true);
    setValidationMsg(null);
    const ok = await validateApiKey(inputKey.trim());
    setValidating(false);
    if (ok) {
      setValidationMsg({ type: 'ok', text: '✓ API 키가 유효합니다' });
    } else {
      setValidationMsg({ type: 'error', text: '✗ 유효하지 않은 API 키입니다' });
    }
  }

  function handleSave() {
    if (!inputKey.trim()) return;
    setApiKey(inputKey.trim());
    setStoredKey(inputKey.trim());
    closeModal();
  }

  function handleClear() {
    clearApiKey();
    setStoredKey(null);
    setInputKey('');
    closeModal();
  }

  const hasKey = !!storedKey;
  const maskedKey = storedKey
    ? storedKey.slice(0, 7) + '•••••••••••••' + storedKey.slice(-4)
    : '';

  return (
    <>
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

        {/* Footer — API Key Status */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={openModal}
            style={{
              width: '100%',
              background: hasKey ? 'rgba(16, 185, 129, 0.12)' : 'rgba(79, 70, 229, 0.15)',
              border: `1px solid ${hasKey ? 'rgba(16, 185, 129, 0.35)' : 'rgba(79, 70, 229, 0.3)'}`,
              borderRadius: 8,
              padding: '10px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <div style={{ color: hasKey ? '#6EE7B7' : '#A5B4FC', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
              AI 엔진
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: hasKey ? '#10B981' : '#F59E0B',
              }} />
              <span style={{ color: '#94A3B8', fontSize: 12 }}>
                {hasKey ? '실제 AI 연동됨' : 'API 키 설정 필요'}
              </span>
            </div>
            {hasKey && (
              <div style={{ color: '#475569', fontSize: 10, marginTop: 4, fontFamily: 'monospace' }}>
                {maskedKey}
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* API Key Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'white', borderRadius: 20, padding: 32,
              width: 480, boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
              border: '1px solid #E2E8F0',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>🔑</div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Anthropic API 키 설정</h2>
                <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Claude AI로 실제 UX 리서치를 생성합니다</p>
              </div>
            </div>

            {/* Info Banner */}
            <div style={{
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20, marginTop: 12,
              fontSize: 12, color: '#166534', lineHeight: 1.6,
            }}>
              API 키는 브라우저 로컬 스토리지에만 저장되며 외부로 전송되지 않습니다.<br />
              <span style={{ color: '#64748B' }}>키가 없다면 </span>
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#4F46E5', fontWeight: 600 }}
              >
                console.anthropic.com
              </a>
              <span style={{ color: '#64748B' }}>에서 발급받으세요</span>
            </div>

            {/* Current Key Status */}
            {hasKey && (
              <div style={{
                background: '#EEF2FF', border: '1px solid #C7D2FE',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#4F46E5', fontFamily: 'monospace', flex: 1 }}>{maskedKey}</span>
                <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>연동됨</span>
              </div>
            )}

            {/* Input */}
            <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 8 }}>
              API 키 입력
            </label>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <input
                autoFocus
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={e => { setInputKey(e.target.value); setValidationMsg(null); }}
                placeholder="sk-ant-api03-..."
                style={{
                  width: '100%', padding: '12px 44px 12px 14px',
                  fontSize: 14, border: '1.5px solid #E2E8F0', borderRadius: 10,
                  outline: 'none', fontFamily: 'monospace', letterSpacing: '0.04em',
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                  background: '#FAFAFA',
                }}
                onFocus={e => (e.target.style.borderColor = '#4F46E5')}
                onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <button
                onClick={() => setShowKey(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94A3B8', fontSize: 16, padding: 2, lineHeight: 1,
                }}
                title={showKey ? '숨기기' : '보기'}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Validation Button */}
            <button
              onClick={handleValidate}
              disabled={!inputKey.trim() || validating}
              style={{
                width: '100%', padding: '10px', marginBottom: 8,
                border: '1.5px solid #E2E8F0', borderRadius: 8,
                background: !inputKey.trim() || validating ? '#F8FAFC' : 'white',
                color: !inputKey.trim() || validating ? '#94A3B8' : '#4F46E5',
                fontSize: 13, fontWeight: 600, cursor: !inputKey.trim() || validating ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {validating ? '검증 중...' : '🔍 API 키 검증'}
            </button>

            {/* Validation Result */}
            {validationMsg && (
              <div style={{
                padding: '8px 12px', borderRadius: 8, marginBottom: 12,
                background: validationMsg.type === 'ok' ? '#F0FDF4' : '#FFF1F2',
                color: validationMsg.type === 'ok' ? '#166534' : '#9F1239',
                fontSize: 13, fontWeight: 600,
                border: `1px solid ${validationMsg.type === 'ok' ? '#BBF7D0' : '#FECDD3'}`,
              }}>
                {validationMsg.text}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {hasKey && (
                <button
                  onClick={handleClear}
                  style={{
                    padding: '10px 16px', borderRadius: 8,
                    border: '1.5px solid #FECDD3', background: '#FFF1F2',
                    color: '#E11D48', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  삭제
                </button>
              )}
              <button
                onClick={closeModal}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  border: '1.5px solid #E2E8F0', background: 'white',
                  color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!inputKey.trim()}
                style={{
                  flex: 2, padding: '10px', borderRadius: 8, border: 'none',
                  background: inputKey.trim()
                    ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                    : '#CBD5E1',
                  color: 'white', fontSize: 13, fontWeight: 700,
                  cursor: inputKey.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
