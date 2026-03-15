// ================================================================
// ResearchGen AI — Claude API Engine (Real AI)
// Calls Anthropic API directly from browser to generate research
// ================================================================

import { ResearchRun, IdeaInput } from './types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

function buildResearchPrompt(idea: IdeaInput): string {
  const depthLabel = { quick: '빠른 분석 (핵심 인사이트)', standard: '표준 분석 (전체 파이프라인)', deep: '심층 분석 (고급 인사이트)' }[idea.depth];

  return `당신은 전문 UX 리서처입니다. 다음 제품 아이디어에 대한 포괄적인 UX 리서치 데이터를 한국어로 생성하세요.

제품 정보:
- 아이디어: ${idea.description}
- 카테고리: ${idea.category}
- 플랫폼: ${idea.platforms.join(', ')}
- 분석 깊이: ${depthLabel}

아래 JSON 구조에 맞게 실제 제품에 특화된 현실적이고 구체적인 UX 리서치 데이터를 생성하세요. 모든 텍스트는 한국어로 작성하세요.

중요: 마크다운 없이 순수 JSON만 반환하세요. 코드 블록(\`\`\`)을 사용하지 마세요.

{
  "aiAnalysis": {
    "problemInterpretation": "이 제품이 해결하는 핵심 문제를 2-3문장으로 구체적으로 해석한 내용",
    "targetSegments": [
      {"name": "세그먼트명", "percentage": 숫자}
    ],
    "insights": [
      {
        "id": "i1",
        "title": "인사이트 제목",
        "description": "인사이트 설명 2문장",
        "confidence": 60에서95사이숫자,
        "category": "user_preference 또는 psychology 또는 accessibility 또는 trend 중 하나"
      }
    ],
    "hmwQuestions": ["HMW 질문 5개 배열"]
  },
  "competitorAnalysis": {
    "competitors": [
      {
        "id": "c1",
        "name": "경쟁사명",
        "platform": "Web/Mobile 등",
        "uxScore": 1에서5사이소수,
        "downloads": "사용자수 문자열",
        "pros": ["장점1", "장점2", "장점3"],
        "cons": ["단점1", "단점2", "단점3"]
      }
    ],
    "featureComparison": [
      {"feature": "기능명", "competitor1name": "가능 또는 제한 또는 불가"}
    ],
    "gaps": [
      {"title": "갭 제목", "description": "갭 설명", "priority": "high 또는 medium 또는 low"}
    ],
    "sentimentData": [
      {"name": "경쟁사명", "positive": 숫자, "neutral": 숫자, "negative": 숫자}
    ]
  },
  "reviewAnalysis": {
    "sentiment": {"positive": 숫자, "neutral": 숫자, "negative": 숫자},
    "topComplaints": ["불만사항 5개"],
    "praisedFeatures": ["칭찬 기능 5개"],
    "featureRequests": ["기능 요청 5개"],
    "topicClusters": ["토픽 클러스터 5개"],
    "reviews": [
      {"id": "r1", "content": "실제 리뷰 내용", "sentiment": "positive 또는 neutral 또는 negative", "rating": 1에서5숫자}
    ]
  },
  "insightMap": {
    "nodes": [
      {
        "id": "n1",
        "type": "ai 또는 competitor 또는 review 또는 user",
        "title": "노드 제목",
        "description": "노드 설명",
        "evidenceCount": 숫자,
        "confidence": 60에서99사이숫자,
        "position": {"x": 숫자, "y": 숫자}
      }
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2"}
    ]
  },
  "personas": [
    {
      "id": "p1",
      "name": "한국인 이름",
      "age": "나이 직업",
      "occupation": "직업",
      "location": "위치",
      "expertise": 1에서10숫자,
      "engagement": 1에서10숫자,
      "traits": [{"name": "특성명", "value": 0에서100숫자}],
      "goals": ["목표1", "목표2", "목표3"],
      "painPoints": ["페인포인트1", "페인포인트2", "페인포인트3"],
      "quote": "이 사용자의 인상적인 인용구",
      "avatarColor": "#HEX색상"
    }
  ],
  "journey": {
    "stages": [
      {
        "name": "영어스테이지명",
        "koreanName": "한국어스테이지명",
        "actions": ["행동1", "행동2", "행동3"],
        "pains": ["페인1", "페인2"],
        "expectations": ["기대1", "기대2"],
        "emotion": -2에서2사이정수
      }
    ],
    "emotionCurve": [{"stage": "스테이지명", "score": 0에서100숫자}],
    "coreIssues": ["핵심 이슈 3개"],
    "aiRecommendations": ["AI 추천사항 3개"]
  },
  "opportunities": [
    {
      "id": "o1",
      "title": "기회 제목",
      "description": "기회 설명",
      "value": 1에서10숫자,
      "effort": 1에서10숫자,
      "quadrant": "quick-win 또는 strategic 또는 fill-in 또는 low-priority"
    }
  ],
  "report": {
    "executiveSummary": "경영진 요약 3-4문장",
    "keyInsights": [
      {"title": "인사이트 제목", "description": "인사이트 설명", "icon": "이모지"}
    ],
    "opportunityMapping": [
      {"title": "기회 제목", "priority": "🔴 긴급 또는 🟡 높음 또는 🟢 중간", "impact": "예상 임팩트"}
    ],
    "recommendations": [
      {"area": "영역", "action": "액션 설명", "timeline": "기간", "priority": "긴급 또는 높음 또는 중간"}
    ],
    "nextSteps": [
      {"phase": "Phase 1", "items": ["항목1", "항목2"], "timeline": "기간"}
    ]
  }
}

규칙:
- competitors는 정확히 4개 생성
- featureComparison은 6개 기능, 각 경쟁사별 컬럼 포함
- reviews는 정확히 8개 생성
- insightMap nodes는 7개, edges는 7개 생성 (source/target은 유효한 노드 id 사용)
- personas는 정확히 3개 생성
- journey stages는 4개 (Discovery, Onboarding, Usage, Retention)
- emotionCurve는 4개 항목
- opportunities는 8개 생성
- keyInsights는 6개, opportunityMapping은 4개, recommendations는 4개, nextSteps는 3개
- featureComparison 객체의 feature 키 외 나머지 키는 반드시 competitor 이름과 정확히 일치
- sentiment의 positive + neutral + negative = 100
- sentimentData의 각 항목도 positive + neutral + negative = 100
- avatarColor는 #4F46E5, #0EA5E9, #10B981 순서로 사용`;
}

export async function generateResearchWithClaude(
  idea: IdeaInput,
  apiKey: string,
  onProgress?: (msg: string) => void,
): Promise<ResearchRun> {
  onProgress?.('Claude AI에 연결 중...');

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system:
        '당신은 전문 UX 리서치 AI입니다. 요청된 JSON 구조에 맞게 정확하고 현실적인 데이터를 생성합니다. 반드시 순수 JSON만 반환하고, 마크다운 코드 블록이나 추가 설명을 포함하지 마세요.',
      messages: [
        {
          role: 'user',
          content: buildResearchPrompt(idea),
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API 오류: ${response.status}`);
  }

  onProgress?.('AI 리서치 데이터 분석 중...');

  const data = await response.json();
  const rawText: string = data.content?.[0]?.text || '';

  onProgress?.('리서치 결과 구조화 중...');

  // Strip any accidental markdown fences
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  let parsed: ResearchRun;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
  }

  // Assign layout positions to insight nodes if missing
  const defaultPositions = [
    { x: 300, y: 150 }, { x: 600, y: 100 }, { x: 150, y: 320 },
    { x: 450, y: 300 }, { x: 680, y: 320 }, { x: 300, y: 480 }, { x: 550, y: 480 },
  ];
  if (parsed.insightMap?.nodes) {
    parsed.insightMap.nodes = parsed.insightMap.nodes.map((node, i) => ({
      ...node,
      position: node.position ?? defaultPositions[i] ?? { x: 100 + i * 120, y: 200 },
    }));
  }

  return parsed;
}
