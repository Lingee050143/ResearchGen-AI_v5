// ================================================================
// ResearchGen AI — Deterministic Mock Data Engine
// Generates realistic Korean UX research data from user inputs
// ================================================================

import {
  ResearchRun, AIAnalysisData, CompetitorAnalysisData, ReviewAnalysisData,
  InsightMapData, PersonaData, JourneyData, OpportunityData, UXReportData,
  InsightNode, InsightEdge, Competitor, StrategicInsight
} from './types';
import { IdeaInput } from './types';

// Simple hash for seeding random values
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number, idx: number): number {
  const x = Math.sin(seed + idx) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number, idx: number): T {
  return arr[Math.floor(seededRandom(seed, idx) * arr.length)];
}

// ================================================================
export function generateResearch(idea: IdeaInput): ResearchRun {
  const seed = hashStr(idea.description + idea.category + idea.platforms.join(''));
  return {
    aiAnalysis: generateAIAnalysis(idea, seed),
    competitorAnalysis: generateCompetitorAnalysis(idea, seed),
    reviewAnalysis: generateReviewAnalysis(idea, seed),
    insightMap: generateInsightMap(seed),
    personas: generatePersonas(seed),
    journey: generateJourney(seed),
    opportunities: generateOpportunities(seed),
    report: generateReport(seed),
  };
}

// ================================================================ Stage 2
function generateAIAnalysis(idea: IdeaInput, seed: number): AIAnalysisData {
  const problemInterpretations = [
    `${idea.category} 분야에서 사용자들이 기존 솔루션의 복잡성과 낮은 접근성으로 인해 불편함을 겪고 있습니다. "${idea.description.slice(0, 40)}..."은 이러한 문제를 해결할 잠재력이 있습니다.`,
    `현재 ${idea.category} 시장은 사용자 경험보다 기능 중심 설계에 치우쳐 있습니다. 이 아이디어는 사용자 중심 접근 방식으로 차별화할 수 있는 기회를 제공합니다.`,
    `${idea.category} 분야의 핵심 문제는 데이터 분산과 의사결정 지원 부족입니다. 제안된 솔루션은 통합된 인터페이스를 통해 효율성을 높일 수 있습니다.`,
  ];

  const allSegments = [
    [{ name: '얼리어답터', percentage: 35 }, { name: '전문 직장인', percentage: 28 }, { name: '소규모 팀', percentage: 22 }, { name: '일반 사용자', percentage: 15 }],
    [{ name: 'MZ세대', percentage: 42 }, { name: '3040 직장인', percentage: 33 }, { name: '프리랜서', percentage: 25 }],
    [{ name: '기업 사용자', percentage: 38 }, { name: '개인 사용자', percentage: 32 }, { name: '학생·연구자', percentage: 30 }],
  ];

  const insights: StrategicInsight[] = [
    {
      id: 'i1',
      title: '사용자 선호도 패턴',
      description: '사용자들은 복잡한 기능보다 직관적인 워크플로우를 선호합니다. 온보딩 3단계 이내 완료 경험이 재방문율을 67% 높입니다.',
      confidence: 82 + Math.floor(seededRandom(seed, 1) * 12),
      category: 'user_preference',
    },
    {
      id: 'i2',
      title: '심리적 전환 장벽',
      description: '기존 도구에서의 전환 비용(학습 시간, 데이터 이관)이 주요 마찰 요인입니다. 원클릭 가져오기 기능이 핵심 해결책입니다.',
      confidence: 74 + Math.floor(seededRandom(seed, 2) * 15),
      category: 'psychology',
    },
    {
      id: 'i3',
      title: '접근성 격차',
      description: `${idea.platforms.includes('Mobile') ? '모바일' : '웹'} 플랫폼에서 접근성 지원이 경쟁사 대비 43% 낮습니다. WCAG 2.1 AA 준수 시 신규 사용자 도달 범위가 28% 확장됩니다.`,
      confidence: 68 + Math.floor(seededRandom(seed, 3) * 18),
      category: 'accessibility',
    },
    {
      id: 'i4',
      title: 'UX 트렌드 정렬',
      description: 'AI 자동화 기능에 대한 수요가 전년 대비 156% 증가했습니다. 스마트 추천과 자동 완성 기능이 핵심 차별화 요소입니다.',
      confidence: 88 + Math.floor(seededRandom(seed, 4) * 8),
      category: 'trend',
    },
  ];

  const hmwQuestions = [
    'HMW: 신규 사용자가 5분 안에 핵심 가치를 경험하게 할 수 있을까?',
    'HMW: 기존 워크플로우를 방해하지 않고 팀 협업을 향상시킬 수 있을까?',
    'HMW: 데이터 기반 의사결정을 비기술 사용자도 쉽게 활용할 수 있게 할까?',
    'HMW: 사용자가 성과를 실시간으로 시각적으로 확인하게 함으로써 만족감을 높일 수 있을까?',
    'HMW: 개인화된 경험을 제공하면서도 프라이버시 우려를 해소할 수 있을까?',
  ];

  return {
    problemInterpretation: pick(problemInterpretations, seed, 0),
    targetSegments: pick(allSegments, seed, 1),
    insights,
    hmwQuestions,
  };
}

// ================================================================ Stage 3
function generateCompetitorAnalysis(idea: IdeaInput, seed: number): CompetitorAnalysisData {
  const competitors: Competitor[] = [
    { id: 'c1', name: 'Notion', platform: 'Web/Mobile', uxScore: 4.2, downloads: '2,000만+', pros: ['직관적인 블록 편집기', '강력한 데이터베이스 기능', '풍부한 템플릿 생태계'], cons: ['모바일 성능 저하', '복잡한 권한 관리', '느린 로딩 속도'] },
    { id: 'c2', name: 'Figma', platform: 'Web', uxScore: 4.5, downloads: '800만+', pros: ['실시간 협업', '플러그인 생태계', '프로토타이핑 통합'], cons: ['오프라인 미지원', '무거운 파일 처리', '높은 학습 곡선'] },
    { id: 'c3', name: '카카오워크', platform: 'Web/Mobile', uxScore: 3.8, downloads: '1,200만+', pros: ['국내 최적화 경험', '카카오 생태계 연동', '한국어 지원'], cons: ['기능 제한적', 'B2B 집중으로 개인 사용 불편', '커스터마이징 부족'] },
    { id: 'c4', name: 'Linear', platform: 'Web/Mobile', uxScore: 4.6, downloads: '500만+', pros: ['고속 키보드 네비게이션', '깔끔한 미니멀 디자인', 'Git 통합'], cons: ['기업 규모 확장 제한', '보고서 기능 부족', '한국어 미지원'] },
  ];

  const featureComparison = [
    { feature: 'AI 자동 분석', Notion: '제한', Figma: '불가', '카카오워크': '불가', Linear: '제한' },
    { feature: '실시간 협업', Notion: '가능', Figma: '가능', '카카오워크': '가능', Linear: '가능' },
    { feature: '데이터 시각화', Notion: '제한', Figma: '가능', '카카오워크': '불가', Linear: '제한' },
    { feature: 'CSV 가져오기', Notion: '가능', Figma: '불가', '카카오워크': '불가', Linear: '가능' },
    { feature: '오프라인 모드', Notion: '제한', Figma: '불가', '카카오워크': '제한', Linear: '제한' },
    { feature: '한국어 최적화', Notion: '제한', Figma: '불가', '카카오워크': '가능', Linear: '불가' },
  ];

  const gaps = [
    { title: 'AI 주도 자동화 공백', description: '현재 경쟁사 중 AI 기반 자동 분석을 완전 지원하는 서비스가 없습니다. 이 영역이 가장 큰 시장 기회입니다.', priority: 'high' as const },
    { title: '한국어 UX 최적화', description: '글로벌 서비스들은 한국 사용자 경험을 충분히 고려하지 않습니다. 로컬라이제이션 강화로 국내 시장을 선점할 수 있습니다.', priority: 'high' as const },
    { title: '통합 데이터 파이프라인', description: '각 도구가 데이터 사일로를 형성하고 있습니다. 통합된 워크스페이스로 의사결정 속도를 40% 향상할 수 있습니다.', priority: 'medium' as const },
  ];

  const sentimentData = [
    { name: 'Notion', positive: 68, neutral: 20, negative: 12 },
    { name: 'Figma', positive: 74, neutral: 17, negative: 9 },
    { name: '카카오워크', positive: 52, neutral: 25, negative: 23 },
    { name: 'Linear', positive: 81, neutral: 13, negative: 6 },
  ];

  return { competitors, featureComparison, gaps, sentimentData };
}

// ================================================================ Stage 4
function generateReviewAnalysis(idea: IdeaInput, seed: number): ReviewAnalysisData {
  const positive = 45 + Math.floor(seededRandom(seed, 10) * 20);
  const negative = 15 + Math.floor(seededRandom(seed, 11) * 20);
  const neutral = 100 - positive - negative;

  const reviews = [
    { id: 'r1', content: '인터페이스가 직관적이라 처음 써봤는데도 바로 사용할 수 있었어요. 특히 대시보드 구성이 마음에 들었습니다.', sentiment: 'positive' as const, rating: 5 },
    { id: 'r2', content: '기능은 많은데 어디서 뭘 찾아야 할지 모르겠어요. 온보딩 가이드가 더 친절했으면 좋겠습니다.', sentiment: 'negative' as const, rating: 2 },
    { id: 'r3', content: '협업 기능이 생각보다 좋았어요. 팀원들과 실시간으로 작업하는 게 편리합니다.', sentiment: 'positive' as const, rating: 4 },
    { id: 'r4', content: '모바일에서 사용하기가 너무 불편해요. 데스크탑 버전과 경험 차이가 너무 큽니다.', sentiment: 'negative' as const, rating: 2 },
    { id: 'r5', content: '데이터 내보내기 기능이 있어서 좋은데 형식이 제한적입니다. PDF와 Excel 동시 지원이 필요해요.', sentiment: 'neutral' as const, rating: 3 },
    { id: 'r6', content: '로딩 속도가 많이 개선됐네요. 예전보다 훨씬 빠릅니다!', sentiment: 'positive' as const, rating: 5 },
    { id: 'r7', content: '가격 대비 기능이 훌륭합니다. 팀 요금제로 업그레이드할 예정입니다.', sentiment: 'positive' as const, rating: 4 },
    { id: 'r8', content: '한국어 번역이 어색한 부분이 많아요. 자연스러운 한국어 지원이 필요합니다.', sentiment: 'negative' as const, rating: 3 },
  ];

  return {
    sentiment: { positive, neutral, negative },
    topComplaints: ['온보딩 경험 부족', '모바일 UX 저하', '한국어 번역 품질', '느린 초기 로딩 속도', '복잡한 권한 설정'],
    praisedFeatures: ['실시간 협업 기능', '깔끔한 대시보드 UI', '다양한 데이터 내보내기', '빠른 검색 기능', '유연한 커스터마이징'],
    featureRequests: ['AI 자동 요약 기능', '오프라인 모드 지원', '다크 모드 추가', '음성 입력 지원', '팀 분석 리포트'],
    topicClusters: ['UI/UX 경험', '성능·속도', '협업 기능', '가격 정책', '언어 지원'],
    reviews,
  };
}

// ================================================================ Stage 5
function generateInsightMap(seed: number): InsightMapData {
  const nodes: InsightNode[] = [
    { id: 'n1', type: 'ai', title: 'AI 분석: 전환 장벽', description: '기존 도구에서의 전환 비용이 주요 마찰 요인', evidenceCount: 24, confidence: 87, position: { x: 300, y: 150 } },
    { id: 'n2', type: 'competitor', title: '경쟁사 갭: AI 자동화', description: '경쟁사 모두 AI 자동화 미지원 — 블루오션 기회', evidenceCount: 18, confidence: 92, position: { x: 600, y: 100 } },
    { id: 'n3', type: 'review', title: '리뷰: 온보딩 불만', description: '신규 사용자의 43%가 첫 주 이탈', evidenceCount: 156, confidence: 94, position: { x: 150, y: 320 } },
    { id: 'n4', type: 'user', title: '사용자 니즈: 직관성', description: 'UX 복잡성 감소가 핵심 요구사항', evidenceCount: 89, confidence: 78, position: { x: 450, y: 300 } },
    { id: 'n5', type: 'review', title: '리뷰: 모바일 UX 저하', description: '모바일-데스크탑 경험 불일치가 주요 불만', evidenceCount: 67, confidence: 81, position: { x: 680, y: 320 } },
    { id: 'n6', type: 'ai', title: 'AI 인사이트: 한국어 최적화', description: '한국 사용자 로컬라이제이션 기회', evidenceCount: 31, confidence: 85, position: { x: 300, y: 480 } },
    { id: 'n7', type: 'competitor', title: '경쟁사 강점: 협업', description: '실시간 협업은 이미 시장 표준화', evidenceCount: 42, confidence: 96, position: { x: 550, y: 480 } },
  ];

  const edges: InsightEdge[] = [
    { id: 'e1', source: 'n1', target: 'n4' },
    { id: 'e2', source: 'n2', target: 'n1' },
    { id: 'e3', source: 'n3', target: 'n4' },
    { id: 'e4', source: 'n3', target: 'n6' },
    { id: 'e5', source: 'n5', target: 'n4' },
    { id: 'e6', source: 'n4', target: 'n7' },
    { id: 'e7', source: 'n6', target: 'n4' },
  ];

  return { nodes, edges };
}

// ================================================================ Stage 6
function generatePersonas(seed: number): PersonaData[] {
  return [
    {
      id: 'p1', name: '김서연', age: '29세 | 마케팅 매니저', occupation: '스타트업 마케터', location: '서울 강남구',
      expertise: 7, engagement: 8,
      traits: [{ name: '분석력', value: 85 }, { name: '기술 친화성', value: 70 }, { name: '협업 선호', value: 90 }, { name: '리스크 회피', value: 40 }],
      goals: ['데이터 기반으로 캠페인 성과를 빠르게 확인하고 싶다', '팀원들과 실시간으로 인사이트를 공유하고 싶다', '자동화된 리포트로 반복 작업을 줄이고 싶다'],
      painPoints: ['여러 툴에 데이터가 분산되어 통합이 어렵다', '비기술직 팀원도 쉽게 사용할 수 있어야 한다', '모바일에서도 핵심 정보를 빠르게 확인하고 싶다'],
      quote: '"좋은 도구는 제 생각을 방해하지 않고 확장시켜줘야 해요."',
      avatarColor: '#4F46E5',
    },
    {
      id: 'p2', name: '이민호', age: '35세 | 제품 책임자', occupation: 'B2B SaaS PM', location: '서울 성동구',
      expertise: 9, engagement: 6,
      traits: [{ name: '분석력', value: 95 }, { name: '기술 친화성', value: 88 }, { name: '협업 선호', value: 60 }, { name: '리스크 회피', value: 75 }],
      goals: ['제품 로드맵 의사결정을 데이터로 뒷받침하고 싶다', '사용자 피드백을 체계적으로 관리하고 싶다', '경영진에게 명확한 UX 인사이트를 보고하고 싶다'],
      painPoints: ['분산된 사용자 데이터를 한 곳에서 보기 어렵다', '리포트 작성에 너무 많은 시간이 걸린다', '정성 데이터와 정량 데이터를 연결하기 어렵다'],
      quote: '"제품의 성공은 사용자를 얼마나 깊이 이해하느냐에 달려 있습니다."',
      avatarColor: '#0EA5E9',
    },
    {
      id: 'p3', name: '박혜진', age: '24세 | UX 디자이너', occupation: '주니어 UX 리서처', location: '판교 테크노밸리',
      expertise: 4, engagement: 9,
      traits: [{ name: '분석력', value: 65 }, { name: '기술 친화성', value: 55 }, { name: '협업 선호', value: 95 }, { name: '리스크 회피', value: 30 }],
      goals: ['빠르게 사용자 리서치 결과를 시각화하고 싶다', '혼자서도 전문적인 리서치 프로세스를 완성하고 싶다', '팀 리더에게 설득력 있는 인사이트를 제시하고 싶다'],
      painPoints: ['리서치 방법론에 대한 지식이 부족하다', '페르소나·저니맵 작성에 시간이 너무 오래 걸린다', '리서치 결과를 어떻게 실행 가능한 인사이트로 만들지 모르겠다'],
      quote: '"사용자의 목소리를 제대로 전달하는 디자이너가 되고 싶어요."',
      avatarColor: '#10B981',
    },
  ];
}

// ================================================================ Stage 7
function generateJourney(seed: number): JourneyData {
  return {
    stages: [
      {
        name: 'Discovery', koreanName: '발견',
        actions: ['앱스토어/구글 검색', '소셜 미디어 광고 클릭', '지인 추천으로 방문'],
        pains: ['비슷한 앱이 너무 많아 선택 어려움', '기능 차별점이 불명확'],
        expectations: ['기존 도구보다 확실히 나은 점이 있을 것', '쉽게 시작할 수 있을 것'],
        emotion: 1,
      },
      {
        name: 'Onboarding', koreanName: '온보딩',
        actions: ['회원가입 완료', '튜토리얼 클릭', '초기 설정 시작'],
        pains: ['설정 단계가 너무 많고 복잡', '가이드가 불충분해 혼란'],
        expectations: ['5분 안에 첫 작업을 완성할 수 있을 것', '명확한 안내가 있을 것'],
        emotion: -1,
      },
      {
        name: 'Usage', koreanName: '사용',
        actions: ['핵심 기능 사용 시작', '팀원 초대', 'AI 분석 실행'],
        pains: ['AI 결과를 어떻게 해석할지 모름', '모바일에서 기능 제한'],
        expectations: ['AI 인사이트가 실질적으로 도움이 될 것', '팀과의 협업이 원활할 것'],
        emotion: 2,
      },
      {
        name: 'Retention', koreanName: '재방문',
        actions: ['저장된 프로젝트 재오픈', '리포트 공유', '구독 갱신 검토'],
        pains: ['저장된 내용을 찾기 어려움', '가격 대비 가치 판단 어려움'],
        expectations: ['이전 작업을 빠르게 이어갈 수 있을 것', '팀 성과 측정에 활용할 수 있을 것'],
        emotion: 1,
      },
    ],
    emotionCurve: [
      { stage: '발견', score: 70 },
      { stage: '온보딩', score: 35 },
      { stage: '사용', score: 85 },
      { stage: '재방문', score: 65 },
    ],
    coreIssues: ['온보딩 복잡성이 첫 이탈의 주요 원인', 'AI 인사이트 해석 교육 부족', '모바일-데스크탑 경험 불일치'],
    aiRecommendations: ['인터랙티브 온보딩 체크리스트 도입', 'AI 결과에 설명 레이어 추가', '모바일 최우선 핵심 기능 집중'],
  };
}

// ================================================================ Stage 8
function generateOpportunities(seed: number): OpportunityData[] {
  return [
    { id: 'o1', title: 'AI 자동 요약 리포트', description: '리서치 결과를 원클릭으로 요약 리포트 생성', value: 9, effort: 6, quadrant: 'strategic' },
    { id: 'o2', title: '원탭 데이터 내보내기', description: 'PDF/Excel/CSV 동시 내보내기 기능', value: 8, effort: 3, quadrant: 'quick-win' },
    { id: 'o3', title: '인터랙티브 온보딩', description: '단계별 체크리스트 온보딩 플로우', value: 9, effort: 4, quadrant: 'quick-win' },
    { id: 'o4', title: '한국어 최적화 AI', description: '한국어 감정 분석 및 현지화 모델 탑재', value: 8, effort: 7, quadrant: 'strategic' },
    { id: 'o5', title: '모바일 앱 개선', description: '핵심 기능 모바일 최적화 및 오프라인 지원', value: 7, effort: 8, quadrant: 'strategic' },
    { id: 'o6', title: '팀 협업 대시보드', description: '실시간 멀티플레이어 분석 캔버스', value: 6, effort: 7, quadrant: 'fill-in' },
    { id: 'o7', title: '다크 모드 지원', description: '시스템 다크모드와 연동되는 UI 테마', value: 4, effort: 2, quadrant: 'fill-in' },
    { id: 'o8', title: '음성 입력 메모', description: 'AI 음성→텍스트 변환 리서치 노트', value: 5, effort: 8, quadrant: 'low-priority' },
  ];
}

// ================================================================ Stage 9
function generateReport(seed: number): UXReportData {
  return {
    executiveSummary: '종합 UX 리서치 분석 결과, 현재 시장에는 AI 자동화와 한국어 특화 경험을 결합한 솔루션이 부재합니다. 사용자 리뷰 분석과 경쟁사 벤치마킹을 통해 온보딩 복잡성 개선, AI 인사이트 접근성 향상, 모바일 경험 통일성 확보가 단기 최우선 과제임을 확인했습니다. 이 세 가지 영역에 집중할 경우 3개월 내 사용자 만족도 35% 향상이 가능할 것으로 예측됩니다.',
    keyInsights: [
      { title: '온보딩 이탈률 43%', description: '첫 세션에서 핵심 가치를 경험하지 못한 사용자의 이탈률', icon: '📉' },
      { title: 'AI 자동화 시장 공백', description: '경쟁사 중 AI 완전 자동화를 지원하는 서비스 전무', icon: '🎯' },
      { title: '모바일 불만족 38%', description: '모바일 UX가 주요 부정 리뷰의 38%를 차지', icon: '📱' },
      { title: '한국어 최적화 기회', description: '글로벌 서비스의 한국어 UX 품질 평균 3.2/5점', icon: '🇰🇷' },
      { title: '협업 기능 수요 61%', description: '사용자 중 61%가 팀 협업 기능 강화를 요청', icon: '👥' },
      { title: 'AI 결과 이해도 55%', description: 'AI 분석 결과를 제대로 해석하는 사용자 비율', icon: '🤖' },
    ],
    opportunityMapping: [
      { title: '인터랙티브 온보딩',  priority: '🔴 긴급', impact: '전환율 +25% 예상' },
      { title: 'AI 원클릭 리포트', priority: '🔴 긴급', impact: '작업시간 -40% 예상' },
      { title: '모바일 핵심 기능', priority: '🟡 높음', impact: '이탈률 -18% 예상' },
      { title: '한국어 AI 모델', priority: '🟡 높음', impact: '로컬 시장 점유 +30%' },
    ],
    recommendations: [
      { area: '온보딩', action: '3단계 인터랙티브 체크리스트 도입, 진행률 BAR 표시', timeline: '4주', priority: '긴급' },
      { area: 'AI UX', action: 'AI 인사이트 카드에 설명 레이어 및 근거 데이터 연결', timeline: '6주', priority: '높음' },
      { area: '모바일', action: '핵심 5개 기능 모바일 최우선 재설계, 오프라인 캐싱 도입', timeline: '8주', priority: '높음' },
      { area: '로컬라이제이션', action: '한국어 감정 분석 파이프라인 구축, 현지화 팀 구성', timeline: '12주', priority: '중간' },
    ],
    nextSteps: [
      { phase: 'Phase 1', items: ['온보딩 재설계', 'AI 설명 레이어'], timeline: '1-4주' },
      { phase: 'Phase 2', items: ['모바일 UX 개편', '원클릭 내보내기'], timeline: '5-8주' },
      { phase: 'Phase 3', items: ['한국어 AI 모델', '팀 협업 대시보드'], timeline: '9-12주' },
    ],
  };
}
