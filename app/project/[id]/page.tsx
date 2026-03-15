'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Project, IdeaInput, ResearchRun } from '@/lib/types';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [research, setResearch] = useState<ResearchRun | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const p = getProject(id);
    if (!p) { router.push('/'); return; }
    setProject(p);
    setCurrentStep(p.lastStep || 1);
    setResearch(p.research || null);
  }, [id, router]);

  function handleIdeaSubmit(idea: IdeaInput) {
    setAnalyzing(true);
    saveIdeaInput(id, idea);
    // Simulate loading
    setTimeout(() => {
      const run = generateResearch(idea);
      saveResearchRun(id, run);
      setResearch(run);
      saveLastStep(id, 2);
      setCurrentStep(2);
      setAnalyzing(false);
      setProject(prev => prev ? { ...prev, idea, research: run, lastStep: 2 } : prev);
    }, 1800);
  }

  function goToStep(step: number) {
    if (step < 1 || step > 9) return;
    if (step > 1 && !research) return;
    setCurrentStep(step);
    saveLastStep(id, step);
    setProject(prev => prev ? { ...prev, lastStep: step } : prev);
  }

  if (!project) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ color: 'var(--text-secondary)' }}>프로젝트 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          border: '4px solid #EEF2FF', borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>AI 리서치 파이프라인 실행 중</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>아이디어를 분석하고 인사이트를 생성하고 있습니다...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
