'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Download, Play, Terminal } from 'lucide-react';

interface CrawlResult {
  url: string;
  title: string;
  depths: string[];
}

export default function Home() {
  // 기본 설정
  const [baseUrl, setBaseUrl] = useState('');
  const [useLogin, setUseLogin] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');
  const [gnbSelector, setGnbSelector] = useState('');

  // 접근성 진단 모드
  const [enableAudit, setEnableAudit] = useState(false);
  const [platform, setPlatform] = useState<'PC' | 'Mobile'>('PC');
  const [auditor, setAuditor] = useState('자동진단시스템');

  // 실행 상태
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [excelData, setExcelData] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Electron 로그 리스너 등록
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron && window.electron.ipcRenderer) {
      const handleLog = (message: string) => {
        setLogs(prev => [...prev, message]);
      };

      window.electron.ipcRenderer.on('crawler:log', handleLog);

      return () => {
        if (window.electron?.ipcRenderer) {
          window.electron.ipcRenderer.removeListener('crawler:log', handleLog);
        }
      };
    }
  }, []);

  const handleStart = async () => {
    if (!baseUrl) {
      alert('시작 URL을 입력하세요.');
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setResults([]);
    setExcelData(null);
    setLogs(prev => [...prev, "요청을 시작합니다..."]);

    try {
      const options = enableAudit
        ? { baseUrl, useLogin, loginUrl: loginUrl || undefined, gnbSelector: gnbSelector || undefined, platform, auditor, enableAudit }
        : { baseUrl, useLogin, loginUrl: loginUrl || undefined, gnbSelector: gnbSelector || undefined, enableAudit: false };

      // Electron 환경 체크
      if (typeof window !== 'undefined' && window.electron) {
        setLogs(prev => [...prev, "Electron 환경에서 실행 중..."]);
        try {
          // 직접 크롤링 함수 호출 (IPC)
          const data = await window.electron.crawler.crawl(options);

          if (enableAudit) {
            // Audit 모드: { results: [...] } 형태
            const auditData = data.results || data; // 구조 호환성 확보
            setResults(Array.isArray(auditData) ? auditData : []);

            if (data.excelBase64) {
              setExcelData(data.excelBase64);
            }
            localStorage.setItem('auditResults', JSON.stringify(Array.isArray(auditData) ? auditData : []));
          } else {
            // 일반 모드: [...] 배열 형태
            setResults(Array.isArray(data) ? data : []);
          }
          setLogs(prev => [...prev, "작업 완료"]);
        } catch (err) {
          throw err;
        }
      } else {
        // 웹 환경 (API 호출)
        const endpoint = enableAudit ? '/api/audit' : '/api/crawl';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options),
        });

        if (!response.body) {
          setLogs(prev => [...prev, "서버 응답이 없습니다."]);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (data.type === 'log') {
                setLogs(prev => [...prev, data.message]);
              } else if (data.type === 'result') {
                if (enableAudit) {
                  setResults(data.data.results);
                  setExcelData(data.data.excelBase64);
                  // localStorage에 저장 (리포트 페이지용)
                  localStorage.setItem('auditResults', JSON.stringify(data.data.results));
                } else {
                  setResults(data.data);
                }
              }
            } catch (e) {
              console.error("JSON Parse Error", e);
            }
          }
        }
      }
    } catch (e) {
      setLogs(prev => [...prev, `에러 발생: ${e}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadExcel = () => {
    if (enableAudit && excelData) {
      // 접근성 모드: 서버에서 생성한 Excel 다운로드
      const blob = new Blob([Uint8Array.from(atob(excelData), c => c.charCodeAt(0))], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'accessibility_audit.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (!enableAudit && results.length > 0) {
      // 기본 IA 모드: 클라이언트에서 Excel 생성
      const data = results.map(r => ({
        '1뎁스': r.depths[0],
        '2뎁스': r.depths[1],
        '3뎁스': r.depths[2],
        '4뎁스': r.depths[3],
        '페이지명': r.title,
        'URL': r.url
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 60 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "IA Definition");
      XLSX.writeFile(wb, "crawled_ia.xlsx");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center space-x-2 pb-4 border-b">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">웹사이트 IA 크롤러 + 접근성 진단</h1>
            <p className="text-sm text-gray-500">Playwright + axe-core 기반 자동화</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Controls */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6 h-fit">
            <h2 className="text-lg font-semibold">설정</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작 URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={e => setBaseUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isRunning}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useLogin"
                  checked={useLogin}
                  onChange={e => setUseLogin(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isRunning}
                />
                <label htmlFor="useLogin" className="text-sm font-medium text-gray-700 cursor-pointer">로그인 필요</label>
              </div>

              {useLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">로그인 페이지 URL (선택)</label>
                  <input
                    type="text"
                    value={loginUrl}
                    onChange={e => setLoginUrl(e.target.value)}
                    placeholder="로그인 페이지 URL"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isRunning}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GNB 셀렉터 (선택)</label>
                <input
                  type="text"
                  value={gnbSelector}
                  onChange={e => setGnbSelector(e.target.value)}
                  placeholder="예: .gnb, nav (비워두면 자동)"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isRunning}
                />
                <p className="text-xs text-gray-500 mt-1">상단 메뉴 전체를 감싸는 클래스나 태그명</p>
              </div>

              {/* 접근성 진단 모드 */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="enableAudit"
                    checked={enableAudit}
                    onChange={e => setEnableAudit(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isRunning}
                  />
                  <label htmlFor="enableAudit" className="text-sm font-medium text-blue-700 cursor-pointer">접근성 진단 포함 (KWCAG 2.2)</label>
                </div>

                {enableAudit && (
                  <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">점검자</label>
                      <input
                        type="text"
                        value={auditor}
                        onChange={e => setAuditor(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        disabled={isRunning}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">플랫폼</label>
                      <select
                        value={platform}
                        onChange={e => setPlatform(e.target.value as 'PC' | 'Mobile')}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        disabled={isRunning}
                      >
                        <option value="PC">PC</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleStart}
                disabled={isRunning}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-colors
                  ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isRunning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>실행 중...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{enableAudit ? '진단 시작' : '크롤링 시작'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Logs & Results */}
          <div className="lg:col-span-2 space-y-6">

            {/* Logs */}
            <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col h-64">
              <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 border-b border-gray-700">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300 font-mono">Terminal Output</span>
              </div>
              <div className="p-4 overflow-y-auto flex-1 font-mono text-sm space-y-1">
                {logs.length === 0 && <span className="text-gray-500">대기 중...</span>}
                {logs.map((log, i) => (
                  <div key={i} className="text-green-400 break-all">
                    <span className="text-gray-600 mr-2">$</span>
                    {log}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="font-semibold text-gray-700">
                    {enableAudit ? '접근성 진단 결과' : '추출 결과'} ({results.length} 페이지)
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownloadExcel}
                      className="flex items-center space-x-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Excel 다운로드</span>
                    </button>
                    {enableAudit && (
                      <a
                        href="/report"
                        target="_blank"
                        className="flex items-center space-x-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <span>리포트 보기</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3">1뎁스</th>
                        <th className="px-6 py-3">페이지명</th>
                        <th className="px-6 py-3">URL</th>
                        {enableAudit && <th className="px-6 py-3 text-red-600">위반 개수</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-gray-900">{r.depths[0]}</td>
                          <td className="px-6 py-3 text-gray-900">{r.title}</td>
                          <td className="px-6 py-3 text-blue-600 truncate max-w-xs">{r.url}</td>
                          {enableAudit && (
                            <td className="px-6 py-3">
                              <span className={`${(r as any).totalViolations > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                                {(r as any).totalViolations || 0}
                              </span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
