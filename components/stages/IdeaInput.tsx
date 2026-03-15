'use client';
import { useState } from 'react';
import { IdeaInput } from '@/lib/types';

const CATEGORIES = ['Fintech', 'Health', 'SaaS', 'E-commerce', 'Education', 'Entertainment', 'Travel', 'Food', 'Productivity', 'Social'];
const PLATFORMS = ['iOS / Android', 'Web', 'Desktop', 'Tablet', '크로스플랫폼'];
const DEPTHS = [
  { key: 'quick', label: '빠른 분석', desc: '핵심 인사이트만\n10-15분 소요', icon: '⚡', color: '#10B981' },
  { key: 'standard', label: '표준 분석', desc: '전체 파이프라인\n30-40분 소요', icon: '🔍', color: '#4F46E5' },
  { key: 'deep', label: '심층 분석', desc: '고급 인사이트 포함\n60분 이상 소요', icon: '🧬', color: '#8B5CF6' },
];

interface Props {
  initialIdea?: IdeaInput | null;
  onSubmit: (idea: IdeaInput) => void;
}

export default function IdeaInputStage({ initialIdea, onSubmit }: Props) {
  const [description, setDescription] = useState(initialIdea?.description || '');
  const [category, setCategory] = useState(initialIdea?.category || '');
  const [platforms, setPlatforms] = useState<string[]>(initialIdea?.platforms || []);
  const [depth, setDepth] = useState<'quick' | 'standard' | 'deep'>(initialIdea?.depth || 'standard');

  function togglePlatform(p: string) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  const canSubmit = description.trim().length > 10 && category && platforms.length > 0;

  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 880, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, background: '#EEF2FF', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>✏️</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 1</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>아이디어 입력</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>
          분석할 제품 아이디어와 리서치 범위를 설정하세요
        </p>
      </div>

      {/* Product Idea */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>제품·서비스 아이디어</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 14 }}>
          해결하려는 문제와 핵심 가치 제안을 구체적으로 설명해주세요
        </div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="예: 바쁜 직장인들이 건강한 식단을 쉽게 계획하고 실행할 수 있도록 돕는 AI 기반 식단 관리 앱. 냉장고 재료 인식, 맞춤형 레시피 추천, 영양소 추적 기능을 제공합니다..."
          rows={5}
          style={{
            width: '100%', padding: '14px 16px', fontSize: 14,
            border: '1.5px solid var(--border)', borderRadius: 10,
            outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif',
            lineHeight: 1.6, color: 'var(--text-primary)',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <div style={{ color: description.length > 10 ? 'var(--success)' : 'var(--text-muted)', fontSize: 12, marginTop: 8, textAlign: 'right' }}>
          {description.length}자 {description.length > 10 ? '✓' : '(최소 10자 이상)'}
        </div>
      </div>

      {/* Category */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>제품 카테고리</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`tag-chip${category === cat ? ' selected' : ''}`}
              onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>대상 플랫폼</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 14 }}>복수 선택 가능</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PLATFORMS.map(p => (
            <button key={p} className={`tag-chip${platforms.includes(p) ? ' selected' : ''}`}
              onClick={() => togglePlatform(p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* Depth */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>분석 깊이</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {DEPTHS.map(d => (
            <div key={d.key}
              className={`depth-card${depth === d.key ? ' selected' : ''}`}
              onClick={() => setDepth(d.key as 'quick' | 'standard' | 'deep')}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{d.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: depth === d.key ? d.color : 'var(--text-primary)', marginBottom: 6 }}>
                {d.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          disabled={!canSubmit}
          onClick={() => onSubmit({ description, category, platforms, depth })}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 32px', borderRadius: 12, border: 'none',
            background: canSubmit ? 'var(--primary)' : '#CBD5E1',
            color: 'white', fontSize: 16, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => canSubmit && ((e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-hover)')}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = canSubmit ? 'var(--primary)' : '#CBD5E1'}
        >
          🚀 AI 리서치 파이프라인 시작
        </button>
      </div>
    </div>
  );
}
