// ================================================================
// ResearchGen AI — Claude API Engine (Real AI)
// Split into 3 focused calls to avoid token limits & parse errors
// ================================================================

import { ResearchRun, IdeaInput } from './types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-6';

// ── Helpers ────────────────────────────────────────────────────

function extractJSON(raw: string): unknown {
  // Strip markdown code fences anywhere in the string
  let text = raw
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim();

  // Find outermost { ... }
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    console.error('[ResearchGen] No JSON object found in:\n', raw.slice(0, 500));
    throw new Error('응답에서 JSON을 찾을 수 없습니다.');
  }
  const jsonStr = text.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('[ResearchGen] JSON parse error. Raw snippet:\n', jsonStr.slice(0, 800));
    throw new Error('AI 응답 JSON 파싱 실패 — 다시 시도해주세요.');
  }
}

async function callClaude(
  apiKey: string,
  prompt: string,
  systemMsg = '당신은 전문 UX 리서치 AI입니다. 지시한 JSON 구조를 정확하게 반환합니다. 추가 설명 없이 순수 JSON만 출력하세요.',
): Promise<unknown> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      system: systemMsg,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message
      || `API 오류 ${res.status}`;
    console.error('[ResearchGen] API error:', msg);
    throw new Error(msg);
  }

  const data = await res.json() as { content?: { text?: string }[] };
  const rawText = data?.content?.[0]?.text ?? '';
  console.log('[ResearchGen] Raw response (' + rawText.length + ' chars):\n', rawText.slice(0, 300));
  return extractJSON(rawText);
}

// ── Part 1: AI Analysis + Competitor Analysis ──────────────────

function buildPart1Prompt(idea: IdeaInput): string {
  return `제품 아이디어: "${idea.description}"
카테고리: ${idea.category} | 플랫폼: ${idea.platforms.join(', ')}

아래 JSON 형식으로 aiAnalysis와 competitorAnalysis를 생성하세요.
숫자 필드에는 반드시 숫자(정수/소수)만 넣으세요. 설명 텍스트를 넣지 마세요.

{
  "aiAnalysis": {
    "problemInterpretation": "2~3문장의 핵심 문제 해석",
    "targetSegments": [
      {"name": "세그먼트명", "percentage": 35},
      {"name": "세그먼트명", "percentage": 28},
      {"name": "세그먼트명", "percentage": 22},
      {"name": "세그먼트명", "percentage": 15}
    ],
    "insights": [
      {"id": "i1", "title": "제목", "description": "설명", "confidence": 82, "category": "user_preference"},
      {"id": "i2", "title": "제목", "description": "설명", "confidence": 74, "category": "psychology"},
      {"id": "i3", "title": "제목", "description": "설명", "confidence": 68, "category": "accessibility"},
      {"id": "i4", "title": "제목", "description": "설명", "confidence": 88, "category": "trend"}
    ],
    "hmwQuestions": ["HMW 질문1", "HMW 질문2", "HMW 질문3", "HMW 질문4", "HMW 질문5"]
  },
  "competitorAnalysis": {
    "competitors": [
      {"id": "c1", "name": "경쟁사1", "platform": "Web/Mobile", "uxScore": 4.2, "downloads": "200만+", "pros": ["장점1","장점2","장점3"], "cons": ["단점1","단점2","단점3"]},
      {"id": "c2", "name": "경쟁사2", "platform": "Web", "uxScore": 4.5, "downloads": "500만+", "pros": ["장점1","장점2","장점3"], "cons": ["단점1","단점2","단점3"]},
      {"id": "c3", "name": "경쟁사3", "platform": "Mobile", "uxScore": 3.8, "downloads": "100만+", "pros": ["장점1","장점2","장점3"], "cons": ["단점1","단점2","단점3"]},
      {"id": "c4", "name": "경쟁사4", "platform": "Web/Mobile", "uxScore": 4.0, "downloads": "300만+", "pros": ["장점1","장점2","장점3"], "cons": ["단점1","단점2","단점3"]}
    ],
    "featureComparison": [
      {"feature": "기능1", "경쟁사1": "가능", "경쟁사2": "제한", "경쟁사3": "불가", "경쟁사4": "가능"},
      {"feature": "기능2", "경쟁사1": "제한", "경쟁사2": "가능", "경쟁사3": "가능", "경쟁사4": "불가"},
      {"feature": "기능3", "경쟁사1": "가능", "경쟁사2": "불가", "경쟁사3": "제한", "경쟁사4": "가능"},
      {"feature": "기능4", "경쟁사1": "불가", "경쟁사2": "가능", "경쟁사3": "가능", "경쟁사4": "제한"},
      {"feature": "기능5", "경쟁사1": "가능", "경쟁사2": "가능", "경쟁사3": "불가", "경쟁사4": "가능"},
      {"feature": "기능6", "경쟁사1": "제한", "경쟁사2": "제한", "경쟁사3": "가능", "경쟁사4": "불가"}
    ],
    "gaps": [
      {"title": "갭 제목1", "description": "설명", "priority": "high"},
      {"title": "갭 제목2", "description": "설명", "priority": "high"},
      {"title": "갭 제목3", "description": "설명", "priority": "medium"}
    ],
    "sentimentData": [
      {"name": "경쟁사1", "positive": 68, "neutral": 20, "negative": 12},
      {"name": "경쟁사2", "positive": 74, "neutral": 17, "negative": 9},
      {"name": "경쟁사3", "positive": 52, "neutral": 25, "negative": 23},
      {"name": "경쟁사4", "positive": 81, "neutral": 13, "negative": 6}
    ]
  }
}

위 구조 그대로, 경쟁사명은 실제 관련 서비스로, featureComparison의 컬럼 키는 competitors의 name 값과 정확히 일치하게, 모든 텍스트는 한국어로 채워서 JSON만 반환하세요.`;
}

// ── Part 2a: Review Analysis only ──────────────────────────────

function buildPart2aPrompt(idea: IdeaInput): string {
  return `제품 아이디어: "${idea.description}"
카테고리: ${idea.category} | 플랫폼: ${idea.platforms.join(', ')}

아래 JSON 형식으로 reviewAnalysis 섹션을 생성하세요.
숫자 필드는 반드시 숫자만, 모든 텍스트는 한국어로, JSON만 반환하세요.

{
  "reviewAnalysis": {
    "sentiment": {"positive": 58, "neutral": 22, "negative": 20},
    "topComplaints": ["불만1", "불만2", "불만3", "불만4", "불만5"],
    "praisedFeatures": ["칭찬1", "칭찬2", "칭찬3", "칭찬4", "칭찬5"],
    "featureRequests": ["요청1", "요청2", "요청3", "요청4", "요청5"],
    "topicClusters": ["토픽1", "토픽2", "토픽3", "토픽4", "토픽5"],
    "reviews": [
      {"id": "r1", "content": "실제 리뷰 내용 1~2문장", "sentiment": "positive", "rating": 5},
      {"id": "r2", "content": "실제 리뷰 내용 1~2문장", "sentiment": "negative", "rating": 2},
      {"id": "r3", "content": "실제 리뷰 내용 1~2문장", "sentiment": "positive", "rating": 4},
      {"id": "r4", "content": "실제 리뷰 내용 1~2문장", "sentiment": "negative", "rating": 2},
      {"id": "r5", "content": "실제 리뷰 내용 1~2문장", "sentiment": "neutral",  "rating": 3},
      {"id": "r6", "content": "실제 리뷰 내용 1~2문장", "sentiment": "positive", "rating": 5},
      {"id": "r7", "content": "실제 리뷰 내용 1~2문장", "sentiment": "positive", "rating": 4},
      {"id": "r8", "content": "실제 리뷰 내용 1~2문장", "sentiment": "negative", "rating": 3}
    ]
  }
}`;
}

// ── Part 2b: InsightMap + Personas ─────────────────────────────

function buildPart2bPrompt(idea: IdeaInput): string {
  return `제품 아이디어: "${idea.description}"
카테고리: ${idea.category} | 플랫폼: ${idea.platforms.join(', ')}

아래 JSON 형식으로 insightMap과 personas 2개 섹션을 생성하세요.
숫자 필드는 반드시 숫자만, 모든 텍스트는 한국어로, JSON만 반환하세요.

{
  "insightMap": {
    "nodes": [
      {"id": "n1", "type": "ai",         "title": "제목", "description": "설명", "evidenceCount": 24, "confidence": 87, "position": {"x": 300, "y": 150}},
      {"id": "n2", "type": "competitor", "title": "제목", "description": "설명", "evidenceCount": 18, "confidence": 92, "position": {"x": 600, "y": 100}},
      {"id": "n3", "type": "review",     "title": "제목", "description": "설명", "evidenceCount": 56, "confidence": 94, "position": {"x": 150, "y": 320}},
      {"id": "n4", "type": "user",       "title": "제목", "description": "설명", "evidenceCount": 89, "confidence": 78, "position": {"x": 450, "y": 300}},
      {"id": "n5", "type": "review",     "title": "제목", "description": "설명", "evidenceCount": 67, "confidence": 81, "position": {"x": 680, "y": 320}},
      {"id": "n6", "type": "ai",         "title": "제목", "description": "설명", "evidenceCount": 31, "confidence": 85, "position": {"x": 300, "y": 480}},
      {"id": "n7", "type": "competitor", "title": "제목", "description": "설명", "evidenceCount": 42, "confidence": 96, "position": {"x": 550, "y": 480}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n4"},
      {"id": "e2", "source": "n2", "target": "n1"},
      {"id": "e3", "source": "n3", "target": "n4"},
      {"id": "e4", "source": "n3", "target": "n6"},
      {"id": "e5", "source": "n5", "target": "n4"},
      {"id": "e6", "source": "n4", "target": "n7"},
      {"id": "e7", "source": "n6", "target": "n4"}
    ]
  },
  "personas": [
    {
      "id": "p1", "name": "한국 이름", "age": "29세 | 직업", "occupation": "직업명", "location": "서울 지역",
      "expertise": 7, "engagement": 8,
      "traits": [{"name": "분석력","value": 85}, {"name": "기술 친화성","value": 70}, {"name": "협업 선호","value": 90}, {"name": "리스크 회피","value": 40}],
      "goals": ["목표1", "목표2", "목표3"],
      "painPoints": ["페인포인트1", "페인포인트2", "페인포인트3"],
      "quote": "인상적인 한 문장 인용구",
      "avatarColor": "#4F46E5"
    },
    {
      "id": "p2", "name": "한국 이름", "age": "35세 | 직업", "occupation": "직업명", "location": "서울 지역",
      "expertise": 9, "engagement": 6,
      "traits": [{"name": "분석력","value": 95}, {"name": "기술 친화성","value": 88}, {"name": "협업 선호","value": 60}, {"name": "리스크 회피","value": 75}],
      "goals": ["목표1", "목표2", "목표3"],
      "painPoints": ["페인포인트1", "페인포인트2", "페인포인트3"],
      "quote": "인상적인 한 문장 인용구",
      "avatarColor": "#0EA5E9"
    },
    {
      "id": "p3", "name": "한국 이름", "age": "24세 | 직업", "occupation": "직업명", "location": "판교 지역",
      "expertise": 4, "engagement": 9,
      "traits": [{"name": "분석력","value": 65}, {"name": "기술 친화성","value": 55}, {"name": "협업 선호","value": 95}, {"name": "리스크 회피","value": 30}],
      "goals": ["목표1", "목표2", "목표3"],
      "painPoints": ["페인포인트1", "페인포인트2", "페인포인트3"],
      "quote": "인상적인 한 문장 인용구",
      "avatarColor": "#10B981"
    }
  ]
}`;
}

// ── Part 3: Journey + Opportunities + Report ───────────────────

function buildPart3Prompt(idea: IdeaInput): string {
  return `제품 아이디어: "${idea.description}"
카테고리: ${idea.category} | 플랫폼: ${idea.platforms.join(', ')}

아래 JSON 형식으로 journey, opportunities, report 3개 섹션을 생성하세요.
숫자 필드는 반드시 숫자만, 모든 텍스트는 한국어로, JSON만 반환하세요.

{
  "journey": {
    "stages": [
      {"name": "Discovery",  "koreanName": "발견",   "actions": ["행동1","행동2","행동3"], "pains": ["페인1","페인2"], "expectations": ["기대1","기대2"], "emotion": 1},
      {"name": "Onboarding", "koreanName": "온보딩", "actions": ["행동1","행동2","행동3"], "pains": ["페인1","페인2"], "expectations": ["기대1","기대2"], "emotion": -1},
      {"name": "Usage",      "koreanName": "사용",   "actions": ["행동1","행동2","행동3"], "pains": ["페인1","페인2"], "expectations": ["기대1","기대2"], "emotion": 2},
      {"name": "Retention",  "koreanName": "재방문", "actions": ["행동1","행동2","행동3"], "pains": ["페인1","페인2"], "expectations": ["기대1","기대2"], "emotion": 1}
    ],
    "emotionCurve": [
      {"stage": "발견", "score": 70},
      {"stage": "온보딩", "score": 35},
      {"stage": "사용", "score": 85},
      {"stage": "재방문", "score": 65}
    ],
    "coreIssues": ["핵심이슈1", "핵심이슈2", "핵심이슈3"],
    "aiRecommendations": ["추천1", "추천2", "추천3"]
  },
  "opportunities": [
    {"id": "o1", "title": "기회1", "description": "설명", "value": 9, "effort": 4, "quadrant": "quick-win"},
    {"id": "o2", "title": "기회2", "description": "설명", "value": 8, "effort": 3, "quadrant": "quick-win"},
    {"id": "o3", "title": "기회3", "description": "설명", "value": 9, "effort": 6, "quadrant": "strategic"},
    {"id": "o4", "title": "기회4", "description": "설명", "value": 8, "effort": 7, "quadrant": "strategic"},
    {"id": "o5", "title": "기회5", "description": "설명", "value": 7, "effort": 8, "quadrant": "strategic"},
    {"id": "o6", "title": "기회6", "description": "설명", "value": 6, "effort": 7, "quadrant": "fill-in"},
    {"id": "o7", "title": "기회7", "description": "설명", "value": 4, "effort": 2, "quadrant": "fill-in"},
    {"id": "o8", "title": "기회8", "description": "설명", "value": 5, "effort": 8, "quadrant": "low-priority"}
  ],
  "report": {
    "executiveSummary": "3~4문장의 경영진 요약",
    "keyInsights": [
      {"title": "인사이트1", "description": "설명", "icon": "📉"},
      {"title": "인사이트2", "description": "설명", "icon": "🎯"},
      {"title": "인사이트3", "description": "설명", "icon": "📱"},
      {"title": "인사이트4", "description": "설명", "icon": "🇰🇷"},
      {"title": "인사이트5", "description": "설명", "icon": "👥"},
      {"title": "인사이트6", "description": "설명", "icon": "🤖"}
    ],
    "opportunityMapping": [
      {"title": "기회1", "priority": "🔴 긴급", "impact": "전환율 +25% 예상"},
      {"title": "기회2", "priority": "🔴 긴급", "impact": "작업시간 -40% 예상"},
      {"title": "기회3", "priority": "🟡 높음", "impact": "이탈률 -18% 예상"},
      {"title": "기회4", "priority": "🟡 높음", "impact": "시장점유 +30% 예상"}
    ],
    "recommendations": [
      {"area": "영역1", "action": "액션 설명", "timeline": "4주", "priority": "긴급"},
      {"area": "영역2", "action": "액션 설명", "timeline": "6주", "priority": "높음"},
      {"area": "영역3", "action": "액션 설명", "timeline": "8주", "priority": "높음"},
      {"area": "영역4", "action": "액션 설명", "timeline": "12주", "priority": "중간"}
    ],
    "nextSteps": [
      {"phase": "Phase 1", "items": ["항목1", "항목2"], "timeline": "1-4주"},
      {"phase": "Phase 2", "items": ["항목1", "항목2"], "timeline": "5-8주"},
      {"phase": "Phase 3", "items": ["항목1", "항목2"], "timeline": "9-12주"}
    ]
  }
}`;
}

// ── Main Export ────────────────────────────────────────────────

export async function generateResearchWithClaude(
  idea: IdeaInput,
  apiKey: string,
  onProgress?: (msg: string) => void,
): Promise<ResearchRun> {
  const key = apiKey.trim();

  onProgress?.('1/4 · AI 분석 + 경쟁사 분석 중...');
  const part1 = await callClaude(key, buildPart1Prompt(idea)) as {
    aiAnalysis: ResearchRun['aiAnalysis'];
    competitorAnalysis: ResearchRun['competitorAnalysis'];
  };

  onProgress?.('2/4 · 리뷰 분석 중...');
  const part2a = await callClaude(key, buildPart2aPrompt(idea)) as {
    reviewAnalysis: ResearchRun['reviewAnalysis'];
  };

  onProgress?.('3/4 · 인사이트 맵 + 페르소나 생성 중...');
  const part2b = await callClaude(key, buildPart2bPrompt(idea)) as {
    insightMap: ResearchRun['insightMap'];
    personas: ResearchRun['personas'];
  };

  onProgress?.('4/4 · 사용자 여정 + 기회 지도 + UX 보고서 생성 중...');
  const part3 = await callClaude(key, buildPart3Prompt(idea)) as {
    journey: ResearchRun['journey'];
    opportunities: ResearchRun['opportunities'];
    report: ResearchRun['report'];
  };

  onProgress?.('리서치 데이터 통합 중...');

  return {
    aiAnalysis:          part1.aiAnalysis,
    competitorAnalysis:  part1.competitorAnalysis,
    reviewAnalysis:      part2a.reviewAnalysis,
    insightMap:          part2b.insightMap,
    personas:            part2b.personas,
    journey:             part3.journey,
    opportunities:       part3.opportunities,
    report:              part3.report,
  };
}
