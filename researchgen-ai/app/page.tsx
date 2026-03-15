'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects, createProject, deleteProject } from '@/lib/storage';
import { Project } from '@/lib/types';

const STEP_LABELS: Record<number, string> = {
  1: '아이디어 입력', 2: 'AI 분석', 3: '경쟁사 분석', 4: '리뷰 분석',
  5: '인사이트 맵', 6: '페르소나', 7: '사용자 여정', 8: '기회 지도', 9: 'UX 보고서',
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  function handleCreate() {
    if (!newName.trim()) return;
    const project = createProject(newName.trim());
    setProjects(getProjects());
    setShowModal(false);
    setNewName('');
    router.push(`/project?id=${project.id}`);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
              프로젝트 대시보드
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              UX 리서치 프로젝트를 생성하고 관리하세요
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--primary)', color: 'white',
              border: 'none', borderRadius: 10, padding: '12px 22px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
          >
            <span style={{ fontSize: 18 }}>+</span> 새 프로젝트 시작
          </button>
        </div>

        {/* Stats Row */}
        {projects.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
            {[
              { label: '전체 프로젝트', value: projects.length, color: '#4F46E5' },
              { label: '완료된 분석', value: projects.filter(p => p.lastStep === 9).length, color: '#10B981' },
              { label: '진행 중', value: projects.filter(p => p.lastStep > 1 && p.lastStep < 9).length, color: '#F59E0B' },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div style={{ width: 4, height: 40, background: stat.color, borderRadius: 2 }} />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          border: '2px dashed var(--border)', borderRadius: 16,
          background: 'white',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔬</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            아직 프로젝트가 없습니다
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
            첫 번째 UX 리서치 프로젝트를 시작해보세요
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'var(--primary)', color: 'white', border: 'none',
              borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer'
            }}
          >
            새 프로젝트 시작
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="card"
              onClick={() => router.push(`/project?id=${project.id}`)}
              style={{
                cursor: 'pointer', transition: 'all 0.2s',
                borderTop: `4px solid var(--primary)`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 28 }}>📋</div>
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94A3B8', fontSize: 18, padding: '2px 6px', borderRadius: 4,
                  }}
                  title="삭제"
                >×</button>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                {project.name}
              </h3>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>진행도</span>
                  <span>Step {project.lastStep} / 9</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${(project.lastStep / 9) * 100}%`,
                    background: 'var(--primary)', transition: 'width 0.3s',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 999,
                  background: '#EEF2FF', color: 'var(--primary)', fontWeight: 500,
                }}>
                  {STEP_LABELS[project.lastStep] || 'AI 분석'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {formatDate(project.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white', borderRadius: 16, padding: 32,
              width: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>새 프로젝트 만들기</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
              분석할 제품 또는 서비스의 이름을 입력하세요
            </p>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="예: 헬스케어 앱, B2B SaaS 플랫폼..."
              style={{
                width: '100%', padding: '12px 16px', fontSize: 15,
                border: '1.5px solid var(--border)', borderRadius: 10,
                outline: 'none', marginBottom: 20, fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: '1.5px solid var(--border)',
                  background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                }}
              >취소</button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                style={{
                  padding: '10px 24px', borderRadius: 8, border: 'none',
                  background: newName.trim() ? 'var(--primary)' : '#CBD5E1',
                  color: 'white', cursor: newName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 14, fontWeight: 600,
                }}
              >프로젝트 시작 →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
