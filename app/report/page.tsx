'use client';

import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChevronDown, ChevronUp, ExternalLink, AlertCircle } from 'lucide-react';
import { formatKWCAGGuideline, getKoreanDescription, getKoreanHelp, translateFailureSummary } from '@/lib/kwcag-mapping';
import Link from 'next/link';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Violation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: { html: string; failureSummary: string }[];
}

interface AuditResult {
  url: string;
  title: string;
  depths: string[];
  totalViolations: number;
  violations: Violation[];
}

export default function ReportPage() {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());

  useEffect(() => {
    // localStorage에서 결과 로드
    const savedResults = localStorage.getItem('auditResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">리포트 데이터가 없습니다</h2>
          <p className="text-gray-500">접근성 진단을 먼저 실행해주세요.</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  // 통계 계산
  const totalPages = results.length;
  const totalViolations = results.reduce((sum, r) => sum + (r.totalViolations || 0), 0);
  const pagesWithErrors = results.filter(r => (r.totalViolations || 0) > 0).length;

  // 위반 유형별 집계
  const violationsByType: Record<string, number> = {};
  results.forEach(result => {
    (result.violations || []).forEach(v => {
      violationsByType[v.id] = (violationsByType[v.id] || 0) + v.nodes.length;
    });
  });

  const topIssues = Object.entries(violationsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Chart 데이터
  const pieData = {
    labels: topIssues.map(([id]) => formatKWCAGGuideline(id)),
    datasets: [
      {
        data: topIssues.map(([, count]) => count),
        backgroundColor: [
          '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
          '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
        ],
      },
    ],
  };

  const barData = {
    labels: results.slice(0, 10).map(r => r.title || r.url.split('/').pop() || 'Home'),
    datasets: [
      {
        label: '위반 개수',
        data: results.slice(0, 10).map(r => r.totalViolations),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const togglePage = (index: number) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPages(newExpanded);
  };

  // 영향도를 한글로 변환
  const getImpactLabel = (impact: string): string => {
    const impactMap: Record<string, string> = {
      'critical': '치명적',
      'serious': '심각',
      'moderate': '보통',
      'minor': '경미',
    };
    return impactMap[impact] || impact;
  };

  // JSON 리포트 다운로드
  const handleDownloadJSON = () => {
    try {
      const dataStr = JSON.stringify(results, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('JSON 다운로드 실패:', error);
      alert('JSON 다운로드 중 오류가 발생했습니다.');
    }
  };

  // HTML 리포트 다운로드
  const handleDownloadHTML = async () => {
    try {
      // Chart.js 차트를 이미지로 변환
      const pieChartElement = document.querySelector('canvas[aria-label="pie chart"]') as HTMLCanvasElement;
      const barChartElement = document.querySelector('canvas[aria-label="bar chart"]') as HTMLCanvasElement;

      const pieChartImage = pieChartElement?.toDataURL('image/png') || '';
      const barChartImage = barChartElement?.toDataURL('image/png') || '';

      // HTML 생성
      const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>접근성 진단 리포트 - KWCAG 2.2</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; padding: 2rem; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { margin-bottom: 2rem; }
    .header h1 { font-size: 2rem; color: #111827; margin-bottom: 0.5rem; }
    .header p { color: #6b7280; }
    .dashboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .card { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card-label { color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .card-value { font-size: 2rem; font-weight: bold; }
    .blue { color: #2563eb; }
    .red { color: #dc2626; }
    .orange { color: #ea580c; }
    .charts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .chart-container { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .chart-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
    .chart-container img { max-width: 100%; height: auto; }
    .results { background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .results-header { padding: 1rem 1.5rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600; }
    .page-item { padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; }
    .page-title { font-weight: 500; color: #111827; }
    .page-url { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
    .violation { background: #f9fafb; padding: 1rem; margin: 1rem 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
    .violation-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; }
    .guideline { font-size: 1.125rem; font-weight: bold; color: #1d4ed8; }
    .axe-rule { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; }
    .description { font-size: 0.875rem; color: #374151; margin-top: 0.5rem; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
    .badge-critical { background: #fee2e2; color: #991b1b; }
    .badge-serious { background: #ffedd5; color: #9a3412; }
    .badge-moderate { background: #fef3c7; color: #92400e; }
    .badge-minor { background: #dbeafe; color: #1e40af; }
    .solution { background: #eff6ff; padding: 0.75rem; border-radius: 0.5rem; margin: 0.75rem 0; font-size: 0.875rem; }
    .elements { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
    .elements-title { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; }
    .element { background: #f3f4f6; padding: 0.75rem; margin-top: 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; }
    .element-label { font-weight: 600; color: #374151; margin-bottom: 0.25rem; }
    .code { background: white; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid #d1d5db; font-family: monospace; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
    .print-date { text-align: right; color: #6b7280; font-size: 0.875rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>접근성 진단 리포트</h1>
      <p>KWCAG 2.2 / WCAG 2.1 AA 기준</p>
    </div>

    <div class="dashboard">
      <div class="card">
        <div class="card-label">총 페이지</div>
        <div class="card-value blue">${totalPages}</div>
      </div>
      <div class="card">
        <div class="card-label">총 위반 사항</div>
        <div class="card-value red">${totalViolations}</div>
      </div>
      <div class="card">
        <div class="card-label">오류 페이지</div>
        <div class="card-value orange">${pagesWithErrors}</div>
      </div>
    </div>

    <div class="charts">
      <div class="chart-container">
        <div class="chart-title">위반 유형별 분포 (Top 10)</div>
        ${pieChartImage ? `<img src="${pieChartImage}" alt="위반 유형별 분포 차트">` : '<p>차트를 불러올 수 없습니다.</p>'}
      </div>
      <div class="chart-container">
        <div class="chart-title">페이지별 오류 건수 (Top 10)</div>
        ${barChartImage ? `<img src="${barChartImage}" alt="페이지별 오류 건수 차트">` : '<p>차트를 불러올 수 없습니다.</p>'}
      </div>
    </div>

    <div class="results">
      <div class="results-header">페이지별 상세 내역</div>
      ${results.map(result => `
        <div class="page-item">
          <div class="page-title">${result.title}</div>
          <div class="page-url">${result.url}</div>
          <div style="margin-top: 0.5rem; color: ${result.totalViolations === 0 ? '#16a34a' : '#dc2626'}; font-weight: 500;">
            ${result.totalViolations} 위반
          </div>
          
          ${(result.violations || []).map(violation => `
            <div class="violation">
              <div class="violation-header">
                <div style="flex: 1;">
                  <div class="guideline">${formatKWCAGGuideline(violation.id)}</div>
                  <div class="axe-rule">Axe Rule: ${violation.id}</div>
                  <div class="description">${getKoreanDescription(violation.id, violation.description)}</div>
                </div>
                <span class="badge badge-${violation.impact}">${getImpactLabel(violation.impact)}</span>
              </div>
              
              <div class="solution">
                <strong>💡 해결방안:</strong> ${getKoreanHelp(violation.id, violation.help)}
              </div>
              
              <div class="elements">
                <div class="elements-title">📌 영향받는 요소 (${violation.nodes.length}개)</div>
                ${violation.nodes.map((node, idx) => `
                  <div class="element">
                    <div class="element-label">요소 #${idx + 1}</div>
                    <div class="code">${node.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    ${node.failureSummary ? `<div style="color: #b91c1c; font-size: 0.75rem; margin-top: 0.5rem;">⚠️ ${translateFailureSummary(node.failureSummary)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <div class="print-date">
      리포트 생성일: ${new Date().toLocaleString('ko-KR')}
    </div>
  </div>
</body>
</html>
      `;

      // Blob 생성 및 다운로드
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('HTML 다운로드 실패:', error);
      alert('HTML 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-2 pb-4 ">
            <div className="w-50 h-20 flex items-center justify-center">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">접근성 진단 리포트</h1>
              <p className="text-sm text-gray-500">KWCAG 2.2 / WCAG 2.1 AA 기준</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Link
              href="/report/checklist"
              className="flex items-center space-x-2 bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>진단 항목별 보기</span>
            </Link>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>JSON 다운로드</span>
            </button>
            <button
              onClick={handleDownloadHTML}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>HTML 다운로드</span>
            </button>
          </div>
        </div>

        {/* 대시보드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">총 페이지</div>
            <div className="text-3xl font-bold text-blue-600">{totalPages}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">총 위반 사항</div>
            <div className="text-3xl font-bold text-red-600">{totalViolations}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">오류 페이지</div>
            <div className="text-3xl font-bold text-orange-600">{pagesWithErrors}</div>
          </div>
        </div>

        {/* 그래프 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">위반 유형별 분포 (Top 10)</h3>
            <Pie data={pieData} options={{ maintainAspectRatio: true }} aria-label="pie chart" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">페이지별 오류 건수 (Top 10)</h3>
            <Bar data={barData} options={{ maintainAspectRatio: true }} aria-label="bar chart" />
          </div>
        </div>

        {/* 상세 위반 내역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold">페이지별 상세 내역</h3>
          </div>
          <div className="divide-y">
            {results.map((result, idx) => (
              <div key={idx}>
                <div
                  className="px-6 py-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => togglePage(idx)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.title}</div>
                    <div className="text-sm text-gray-500">{result.url}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.totalViolations === 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {result.totalViolations} 위반
                    </span>
                    {expandedPages.has(idx) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedPages.has(idx) && (result.violations || []).length > 0 && (
                  <div className="px-6 py-4 bg-gray-50 space-y-4">
                    {(result.violations || []).map((violation, vIdx) => (
                      <div key={vIdx} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-bold text-blue-700 text-lg">{formatKWCAGGuideline(violation.id)}</div>
                            <div className="text-xs text-gray-500 mt-1">Axe Rule: {violation.id}</div>
                            <div className="text-sm text-gray-700 mt-2">{getKoreanDescription(violation.id, violation.description)}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${violation.impact === 'critical' ? 'bg-red-100 text-red-800' :
                            violation.impact === 'serious' ? 'bg-orange-100 text-orange-800' :
                              violation.impact === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                            {getImpactLabel(violation.impact)}
                          </span>
                        </div>

                        <div className="text-sm text-gray-700 mb-2 bg-blue-50 p-3 rounded">
                          <strong>💡 해결방안:</strong> {getKoreanHelp(violation.id, violation.help)}
                        </div>

                        <a
                          href={violation.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:underline mb-3"
                        >
                          자세히 보기 <ExternalLink className="w-3 h-3 ml-1" />
                        </a>

                        <div className="mt-4 border-t pt-3">
                          <div className="text-sm font-semibold text-gray-700 mb-2">
                            📌 영향받는 요소 ({violation.nodes.length}개)
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {violation.nodes.map((node, nodeIdx) => (
                              <div key={nodeIdx} className="bg-gray-100 p-3 rounded text-xs">
                                <div className="font-semibold text-gray-700 mb-1">
                                  요소 #{nodeIdx + 1}
                                </div>
                                <pre className="whitespace-pre-wrap overflow-x-auto text-gray-800 font-mono bg-white p-2 rounded border">
                                  {node.html}
                                </pre>
                                {node.failureSummary && (
                                  <div className="mt-2 text-red-700 text-xs">
                                    ⚠️ {translateFailureSummary(node.failureSummary)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
