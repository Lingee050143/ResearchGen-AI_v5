'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StepHeader from '@/components/StepHeader';
import IdeaInputStage from '@/components/stages/IdeaInput';
import AIAnalysisStage from '@/components/stages/AIAnalysis';
import CompetitorAnalysisStage from '@/components/stages/CompetitorAnalysis';
import ReviewAnalysisStage from '@/components/stages/ReviewAnalysis';
import InsightMapStage from '@/components/stages/InsightMap';
import PersonaStage from '@/components/stages/Persona';
import JourneyMapStage from '@/components/stages/JourneyMap';
import OpportunityMatrixStage from '@/components/stages/OpportunityMatrix';
import UXReportStage from '@/components/stages/UXReport';
import { getProject, saveIdeaInput, saveResearchRun, saveLastStep } from '@/lib/storage';
import { generateResearch } from '@/lib/mockEngine';
import { generateResearchWithClaude } from '@/lib/claudeEngine';
import { getApiKey } from '@/lib/apiKeyStorage';
import { Project, IdeaInput, ResearchRun } from '@/lib/types';

const ANALYSIS_STEPS = [
  '아이디어 분석 중...',
  'AI 경쟁사 데이터 수집 중...',
  '리뷰 패턴 분석 중...',
  '인사이트 맵 구성 중...',
  '페르소나 생성 중...',
  '사용자 여정 맵핑 중...',
  '기회 지도 작성 중...',
  'UX 보고서 생성 중...',
];

function ProjectContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [research, setResearch] = useState<ResearchRun | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [usingRealAI, setUsingRealAI] = useState(false);

  useEffect(() => {
    if (!id) { router.push('/'); return; }
    const p = getProject(id);
    if (!p) { router.push('/'); return; }
    setProject(p);
    setCurrentStep(p.lastStep || 1);
    setResearch(p.research || null);
  }, [id, router]);

  async function handleIdeaSubmit(idea: IdeaInput) {
    if (!id) return;
    setAnalyzing(true);
    setAnalysisError(null);
    saveIdeaInput(id, idea);

    const apiKey = getApiKey();

    if (apiKey) {
      // Real Claude AI path
      setUsingRealAI(true);
      setAnalysisProgress('Claude AI에 연결 중...');
      setAnalysisStep(0);

      // Cycle through descriptive steps while waiting
      const stepInterval = setInterval(() => {
        setAnalysisStep(prev => {
          const next = prev + 1;
          if (next < ANALYSIS_STEPS.length) {
            setAnalysisProgress(ANALYSIS_STEPS[next]);
            return next;
          }
          return prev;
        });
      }, 4000);

      try {
        const run = await generateResearchWithClaude(idea, apiKey, (msg) => {
          setAnalysisProgress(msg);
        });
        clearInterval(stepInterval);
        saveResearchRun(id, run);
        setResearch(run);
        saveLastStep(id, 2);
        setCurrentStep(2);
        setProject(prev => prev ? { ...prev, idea, research: run, lastStep: 2 } : prev);
      } catch (err) {
        clearInterval(stepInterval);
        const msg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setAnalysisError(msg);
      } finally {
        setAnalyzing(false);
        setUsingRealAI(false);
        setAnalysisProgress('');
        setAnalysisStep(0);
      }
    } else {
      // Mock fallback path
      setUsingRealAI(false);
      setAnalysisProgress('Mock 데이터 생성 중...');
      setTimeout(() => {
        const run = generateResearch(idea);
        saveResearchRun(id, run);
        setResearch(run);
        saveLastStep(id, 2);
        setCurrentStep(2);
        setAnalyzing(false);
        setAnalysisProgress('');
        setProject(prev => prev ? { ...prev, idea, research: run, lastStep: 2 } : prev);
      }, 1800);
    }
  }

  function goToStep(step: number) {
    if (!id) return;
    if (step < 1 || step > 9) return;
    if (step > 1 && !research) return;
    setCurrentStep(step);
    saveLastStep(id, step);
    setProject(prev => prev ? { ...prev, lastStep: step } : prev);
  }

  if (!project) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ color: 'var(--text-secondary)' }}>프로젝트 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // Analysis Error State
  if (analysisError) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: 20, padding: 48,
      }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#0F172A', textAlign: 'center' }}>
          AI 분석 중 오류가 발생했습니다
        </div>
        <div style={{
          background: '#FFF1F2', border: '1px solid #FECDD3',
          borderRadius: 12, padding: '14px 20px',
          color: '#9F1239', fontSize: 14, maxWidth: 480, textAlign: 'center', lineHeight: 1.6,
        }}>
          {analysisError}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setAnalysisError(null)}
            style={{
              padding: '12px 24px', borderRadius: 10, border: '1.5px solid #E2E8F0',
              background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            다시 시도
          </button>
          <button
            onClick={() => {
              setAnalysisError(null);
              // Fallback to mock
              if (project?.idea) {
                setAnalyzing(true);
                setAnalysisProgress('Mock 데이터로 분석 중...');
                setTimeout(() => {
                  const run = generateResearch(project.idea!);
                  saveResearchRun(id, run);
                  setResearch(run);
                  saveLastStep(id, 2);
                  setCurrentStep(2);
                  setAnalyzing(false);
                  setAnalysisProgress('');
                  setProject(prev => prev ? { ...prev, research: run, lastStep: 2 } : prev);
                }, 1500);
              }
            }}
            style={{
              padding: '12px 24px', borderRadius: 10, border: 'none',
              background: 'var(--primary)', color: 'white',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            Mock 데이터로 계속하기
          </button>
        </div>
      </div>
    );
  }

  // Analyzing State
  if (analyzing) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: 28,
      }}>
        {/* Spinner */}
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            border: '3px solid #EEF2FF',
            borderTopColor: usingRealAI ? '#8B5CF6' : 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>
            {usingRealAI ? '✨' : '🔬'}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8, color: '#0F172A' }}>
            {usingRealAI ? 'Claude AI 리서치 생성 중' : 'AI 리서치 파이프라인 실행 중'}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
            {usingRealAI
              ? '실제 Claude AI가 제품을 분석하고 인사이트를 생성합니다\n보통 30-60초 소요됩니다'
              : '아이디어를 분석하고 인사이트를 생성하고 있습니다...'}
          </div>

          {/* Progress Label */}
          {analysisProgress && (
            <div style={{
              background: usingRealAI ? '#F5F3FF' : '#EEF2FF',
              border: `1px solid ${usingRealAI ? '#DDD6FE' : '#C7D2FE'}`,
              borderRadius: 10, padding: '10px 16px',
              color: usingRealAI ? '#7C3AED' : '#4F46E5',
              fontSize: 13, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ animation: 'pulse-dot 1.5s infinite' }}>●</span>
              {analysisProgress}
            </div>
          )}

          {/* Step Progress Dots (real AI only) */}
          {usingRealAI && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
              {ANALYSIS_STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === analysisStep ? 20 : 8,
                    height: 8, borderRadius: 4,
                    background: i < analysisStep ? '#10B981' : i === analysisStep ? '#8B5CF6' : '#E2E8F0',
                    transition: 'all 0.4s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {usingRealAI && (
          <div style={{
            background: '#FFFBEB', border: '1px solid #FDE68A',
            borderRadius: 10, padding: '10px 16px',
            color: '#92400E', fontSize: 12, maxWidth: 360, textAlign: 'center',
          }}>
            Claude AI가 실제로 분석 중입니다. 잠시만 기다려주세요.
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Step Header */}
      <StepHeader currentStep={currentStep} onStepClick={(s) => s === 1 || research ? goToStep(s) : undefined} />

      {/* Project Title Bar */}
      <div style={{
        background: 'white', borderBottom: '1px solid var(--border)',
        padding: '10px 32px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← 대시보드
        </button>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{project.name}</span>
        {research && (
          <span style={{
            marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 999,
            background: getApiKey() ? '#F5F3FF' : '#EEF2FF',
            color: getApiKey() ? '#7C3AED' : '#4F46E5',
            fontWeight: 600,
          }}>
            {getApiKey() ? '✨ Real AI' : '🔬 Mock'}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>Step {currentStep} / 9</span>
      </div>

      {/* Stage Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentStep === 1 && (
          <IdeaInputStage initialIdea={project.idea} onSubmit={handleIdeaSubmit} />
        )}
        {currentStep === 2 && research && <AIAnalysisStage data={research.aiAnalysis} />}
        {currentStep === 3 && research && <CompetitorAnalysisStage data={research.competitorAnalysis} />}
        {currentStep === 4 && research && (
          <ReviewAnalysisStage
            data={research.reviewAnalysis}
            onDataUpdate={(updated) => {
              const newResearch = { ...research, reviewAnalysis: updated };
              setResearch(newResearch);
              saveResearchRun(id, newResearch);
            }}
          />
        )}
        {currentStep === 5 && research && <InsightMapStage data={research.insightMap} />}
        {currentStep === 6 && research && <PersonaStage data={research.personas} />}
        {currentStep === 7 && research && <JourneyMapStage data={research.journey} />}
        {currentStep === 8 && research && <OpportunityMatrixStage data={research.opportunities} />}
        {currentStep === 9 && research && <UXReportStage data={research.report} />}

        {/* No research, step > 1 */}
        {currentStep > 1 && !research && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 16, padding: 48 }}>
            <div style={{ fontSize: 48 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>아직 분석이 시작되지 않았습니다</div>
            <button onClick={() => goToStep(1)} style={{ padding: '10px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Step 1로 돌아가기
            </button>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      {(research || currentStep === 1) && (
        <div style={{
          background: 'white', borderTop: '1px solid var(--border)',
          padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 1}
            style={{
              padding: '10px 24px', border: '1.5px solid var(--border)', borderRadius: 8,
              background: 'white', cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, color: currentStep === 1 ? '#CBD5E1' : 'var(--text-primary)',
            }}
          >
            ← 이전 단계
          </button>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {currentStep} / 9
          </span>
          <button
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === 9 || !research}
            style={{
              padding: '10px 24px', border: 'none', borderRadius: 8,
              background: (currentStep === 9 || !research) ? '#CBD5E1' : 'var(--primary)',
              cursor: (currentStep === 9 || !research) ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, color: 'white',
            }}
          >
            다음 단계 →
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--text-secondary)' }}>로딩 중...</div>
      </div>
    }>
      <ProjectContent />
    </Suspense>
  );
}
