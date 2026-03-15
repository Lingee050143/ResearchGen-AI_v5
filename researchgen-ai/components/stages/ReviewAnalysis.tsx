'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { ReviewAnalysisData } from '@/lib/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const SENT_COLORS = { positive: '#10B981', neutral: '#94A3B8', negative: '#EF4444' };
const SENT_LABELS = { positive: '긍정', neutral: '중립', negative: '부정' };

interface Props {
  data: ReviewAnalysisData;
  onDataUpdate?: (data: ReviewAnalysisData) => void;
}

export default function ReviewAnalysisStage({ data, onDataUpdate }: Props) {
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [localData, setLocalData] = useState(data);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        const reviews = rows.slice(0, 50).map((row, i) => {
          const text = Object.values(row).join(' ');
          const sentiment = text.includes('좋') || text.includes('편리') || text.includes('만족') ? 'positive'
            : text.includes('불편') || text.includes('느리') || text.includes('오류') ? 'negative' : 'neutral';
          return { id: `csv_${i}`, content: text.slice(0, 120), sentiment, rating: sentiment === 'positive' ? 5 : sentiment === 'negative' ? 2 : 3 };
        }) as ReviewAnalysisData['reviews'];

        const pos = reviews.filter(r => r.sentiment === 'positive').length;
        const neg = reviews.filter(r => r.sentiment === 'negative').length;
        const total = reviews.length || 1;
        const updated = { ...localData, reviews, sentiment: { positive: Math.round((pos / total) * 100), negative: Math.round((neg / total) * 100), neutral: Math.round(((total - pos - neg) / total) * 100) } };
        setLocalData(updated);
        setCsvUploaded(true);
        onDataUpdate?.(updated);
      },
    });
  }, [localData, onDataUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] }, multiple: false });

  const sentimentPieData = [
    { name: '긍정', value: localData.sentiment.positive, color: SENT_COLORS.positive },
    { name: '중립', value: localData.sentiment.neutral, color: SENT_COLORS.neutral },
    { name: '부정', value: localData.sentiment.negative, color: SENT_COLORS.negative },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '40px 48px', maxWidth: 1060, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💬</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em' }}>STEP 4</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>리뷰 분석</h2>
          </div>
          {csvUploaded && <span style={{ marginLeft: 'auto', background: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>✓ CSV 업로드 완료</span>}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginLeft: 48 }}>사용자 리뷰 데이터를 분석하여 감성 분포와 핵심 패턴을 추출합니다</p>
      </div>

      {/* CSV Upload */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 12, padding: '32px', textAlign: 'center',
          background: isDragActive ? '#EEF2FF' : '#FAFAFA', cursor: 'pointer',
          marginBottom: 24, transition: 'all 0.2s',
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>CSV 리뷰 데이터 업로드</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {isDragActive ? '여기에 놓으세요' : '드래그앤드롭 또는 클릭하여 파일 선택 · .csv 형식 지원'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginBottom: 20 }}>
        {/* Pie Chart */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>감성 분포</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={sentimentPieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                {sentimentPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {sentimentPieData.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.name}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { title: '주요 불만 사항', items: localData.topComplaints, color: '#EF4444', bg: '#FEF2F2' },
            { title: '긍정 평가 기능', items: localData.praisedFeatures, color: '#059669', bg: '#ECFDF5' },
            { title: '기능 요청', items: localData.featureRequests, color: '#4F46E5', bg: '#EEF2FF' },
          ].map(section => (
            <div key={section.title} className="card" style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: section.color }}>{section.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {section.items.map((item, i) => (
                  <span key={i} style={{ background: section.bg, color: section.color, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Clusters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>토픽 클러스터</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {localData.topicClusters.map((tc, i) => (
            <span key={i} style={{ background: '#F1F5F9', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
              {tc}
            </span>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>리뷰 데이터 ({localData.reviews.length}건)</div>
        <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead style={{ position: 'sticky', top: 0, background: 'white' }}>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>내용</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600, width: 80 }}>감성</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600, width: 60 }}>평점</th>
              </tr>
            </thead>
            <tbody>
              {localData.reviews.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{r.content}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{
                      background: r.sentiment === 'positive' ? '#ECFDF5' : r.sentiment === 'negative' ? '#FEF2F2' : '#F1F5F9',
                      color: r.sentiment === 'positive' ? '#059669' : r.sentiment === 'negative' ? '#DC2626' : '#64748B',
                      padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    }}>
                      {SENT_LABELS[r.sentiment]}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>
                    {'⭐'.repeat(r.rating)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
