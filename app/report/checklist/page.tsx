'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { KWCAG_MAPPING } from '@/lib/kwcag-mapping';
import { AuditResult } from '@/types/audit';
import Link from 'next/link';

interface ChecklistItem {
  seq: number;
  code: string;
  name: string;
  description?: string;
  isAutomatic: boolean;
  rules: string[];
}

interface ViolationSummary {
  ruleId: string;
  description: string;
  help: string;
  helpUrl: string;
  affectedPages: {
    title: string;
    url: string;
    count: number;
  }[];
}

export default function ChecklistPage() {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [violationMap, setViolationMap] = useState<Map<number, ViolationSummary[]>>(new Map());

  useEffect(() => {
    // 1. KWCAG 매핑 데이터 구조화 && 1~33번 항목 생성
    const itemsMap = new Map<number, ChecklistItem>();

    // 1. KWCAG 2.2 33개 검사 항목 정의 (Master List)
    const KWCAG_ITEMS = [
      { seq: 1, code: '1.1.1', name: '적절한 대체 텍스트 제공', desc: '텍스트 아닌 콘텐츠에 대체 텍스트 제공' },
      { seq: 2, code: '1.2.1', name: '자막 제공', desc: '멀티미디어 콘텐츠에 자막, 대본, 수어 제공' },
      { seq: 3, code: '1.3.1', name: '색에 무관한 콘텐츠 인식', desc: '색상 없이도 콘텐츠 인식 가능' },
      { seq: 4, code: '1.3.2', name: '명확한 지시사항 제공', desc: '지시사항은 모양, 크기, 위치, 색상 외 다른 정보도 제공' },
      { seq: 5, code: '1.3.3', name: '텍스트 콘텐츠의 명도 대비', desc: '텍스트와 배경 명도 대비 4.5:1 이상' },
      { seq: 6, code: '1.3.4', name: '자동 재생 금지', desc: '자동 재생 콘텐츠 3초 내 정지 또는 제어 수단 제공' },
      { seq: 7, code: '1.3.5', name: '콘텐츠 간의 구분', desc: '이웃한 콘텐츠는 시각적으로 구분' },
      { seq: 8, code: '2.1.1', name: '키보드 사용 보장', desc: '모든 기능은 키보드로 사용 가능' },
      { seq: 9, code: '2.1.2', name: '초점 이동', desc: '키보드 초점은 논리적으로 이동, 시각적으로 구분' },
      { seq: 10, code: '2.1.3', name: '조작 가능', desc: '컨트롤 대각선 길이 6mm 이상, 1px 이상 여백' },
      { seq: 11, code: '2.2.1', name: '응답시간 조절', desc: '시간제한 콘텐츠는 조절 수단 제공' },
      { seq: 12, code: '2.2.2', name: '정지 기능 제공', desc: '자동 변경 콘텐츠는 정지 수단 제공' },
      { seq: 13, code: '2.3.1', name: '깜빡임과 번쩍임 사용 제한', desc: '초당 3~50회 깜빡임 금지' },
      { seq: 14, code: '2.4.1', name: '반복 영역 건너뛰기', desc: '반복 영역 건너뛸 수 있는 수단 제공' },
      { seq: 15, code: '2.4.2', name: '제목 제공', desc: '페이지, 프레임, 콘텐츠 블록에 적절한 제목 제공' },
      { seq: 16, code: '2.4.3', name: '적절한 링크 텍스트', desc: '링크 텍스트는 용도나 목적 이해 가능' },
      { seq: 17, code: '2.4.4', name: '고정된 참조점 제공', desc: '전자출판문서는 참조점 제공' },
      { seq: 18, code: '3.1.1', name: '기본 언어 표시', desc: '주로 사용하는 언어를 명시' },
      { seq: 19, code: '3.2.1', name: '사용자 요구에 따른 실행', desc: '사용자가 의도하지 않은 기능 자동 실행 금지' },
      { seq: 20, code: '3.3.1', name: '콘텐츠의 선형화', desc: '콘텐츠는 논리적 순서로 제공' },
      { seq: 21, code: '3.3.2', name: '표의 구성', desc: '표는 이해하기 쉽게 구성' },
      { seq: 22, code: '3.4.1', name: '레이블 제공', desc: '입력 서식에 레이블 제공' },
      { seq: 23, code: '3.4.2', name: '오류 정정', desc: '입력 오류 시 정정 방법 안내' },
      { seq: 24, code: '4.1.1', name: '마크업 오류 방지', desc: '마크업 언어 요소는 규격 준수' },
      { seq: 25, code: '4.2.1', name: '웹 애플리케이션 접근성 준수', desc: '웹 애플리케이션은 접근성 준수' },
      { seq: 26, code: '5.1.1', name: '대체 수단 제공', desc: '플랫폼 접근성 기능과 호환' },
      { seq: 27, code: '5.2.1', name: '이용 가능한 포인터', desc: '모든 포인터 입력 사용 가능' },
      { seq: 28, code: '5.2.2', name: '포인터 취소', desc: '단일 포인터 입력 취소 가능' },
      { seq: 29, code: '5.3.1', name: '레이블과 명칭 일치', desc: '시각적 레이블과 접근성 명칭 일치' },
      { seq: 30, code: '5.4.1', name: '동작 기반 작동', desc: '기기 흔들기 등 동작으로 실행되는 기능 대안 제공' },
      { seq: 31, code: '6.1.1', name: '입력 목적 식별', desc: '입력 서식 목적 자동 완성으로 식별 가능' },
      { seq: 32, code: '6.2.1', name: '상태 메시지 제공', desc: '상태 변화 정보를 보조기술이 인식 가능' },
      { seq: 33, code: '6.3.1', name: '접근 가능한 인증', desc: '인증 과정에서 인지 기능 테스트 대안 제공' },
    ];

    // Master List로 초기화
    KWCAG_ITEMS.forEach(item => {
      itemsMap.set(item.seq, {
        seq: item.seq,
        code: item.code,
        name: item.name,
        description: item.desc, // 필요시 추가
        isAutomatic: false,
        rules: []
      });
    });

    // KWCAG_MAPPING 순회하여 데이터 덮어쓰기 (자동 검사 항목 매핑)
    Object.entries(KWCAG_MAPPING).forEach(([ruleId, guideline]) => {
      if (guideline.seq > 0 && guideline.seq <= 33) {
        const existing = itemsMap.get(guideline.seq);
        if (existing) {
          existing.isAutomatic = true; // 매핑된 규칙이 있으면 자동 진단 가능
          existing.rules.push(ruleId);
        }
      }
    });

    // Map을 배열로 변환하고 순번대로 정렬
    const sortedItems = Array.from(itemsMap.values()).sort((a, b) => a.seq - b.seq);
    setChecklistItems(sortedItems);

    // 2. localStorage에서 결과 로드
    const savedResults = localStorage.getItem('auditResults');
    if (savedResults) {
      const loadedResults: AuditResult[] = JSON.parse(savedResults);
      setResults(loadedResults);

      // 3. 위반 사항 집계
      const vMap = new Map<number, ViolationSummary[]>();

      // 각 체크리스트 항목별로 순회
      sortedItems.forEach(item => {
        if (!item.isAutomatic) return; // 수동 항목은 집계 제외

        const itemViolations: ViolationSummary[] = [];

        // 해당 항목에 속하는 규칙(rule)들에 대한 위반 사항 수집
        item.rules.forEach(ruleId => {
          const pagesWithViolation: { title: string; url: string; count: number }[] = [];

          let ruleDescription = '';
          let ruleHelp = '';
          let ruleHelpUrl = '';

          loadedResults.forEach(page => {
            const v = (page.violations || []).find(v => v.id === ruleId);
            if (v) {
              pagesWithViolation.push({
                title: page.title,
                url: page.url,
                count: v.nodes.length
              });
              if (!ruleDescription) ruleDescription = v.description;
              if (!ruleHelp) ruleHelp = v.help;
              if (!ruleHelpUrl) ruleHelpUrl = v.helpUrl;
            }
          });

          if (pagesWithViolation.length > 0) {
            const mapping = KWCAG_MAPPING[ruleId];
            itemViolations.push({
              ruleId: ruleId,
              description: mapping?.koreanDescription || ruleDescription,
              help: mapping?.koreanHelp || ruleHelp,
              helpUrl: ruleHelpUrl || `https://dequeuniversity.com/rules/axe/4.4/${ruleId}`,
              affectedPages: pagesWithViolation
            });
          }
        });

        if (itemViolations.length > 0) {
          vMap.set(item.seq, itemViolations);
        }
      });

      setViolationMap(vMap);
    }
  }, []);

  const toggleItem = (seq: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(seq)) {
      newExpanded.delete(seq);
    } else {
      newExpanded.add(seq);
    }
    setExpandedItems(newExpanded);
  };

  // 통계 계산
  const totalItems = 33;
  const autoItemsCount = checklistItems.filter(i => i.isAutomatic).length;
  // 수동 항목은 '전체 - 자동'이 아니라, 명시적으로 isAutomatic=false인 항목 수
  const manualItemsCount = totalItems - autoItemsCount;
  const errorItemsCount = violationMap.size;
  const passedAutoItemsCount = autoItemsCount - errorItemsCount;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/report" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> 리포트 데시보드로 돌아가기
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">KWCAG 2.2 진단 항목별 리포트</h1>
            <p className="text-gray-600 mt-1">총 33개 검사 항목에 대한 상세 분석 결과입니다.</p>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="text-sm text-gray-500 mb-1">총 검사 항목</div>
            <div className="text-3xl font-bold text-gray-900">{totalItems}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="text-sm text-gray-500 mb-1">자동 진단 항목</div>
            <div className="text-3xl font-bold text-blue-600">{autoItemsCount}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="text-sm text-gray-500 mb-1">수동 진단 항목</div>
            <div className="text-3xl font-bold text-gray-400">{manualItemsCount}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="text-sm text-gray-500 mb-1">오류 발견 (자동)</div>
            <div className="text-3xl font-bold text-red-600">{errorItemsCount}</div>
          </div>
        </div>

        {/* 체크리스트 */}
        <div className="space-y-4">
          {checklistItems.map((item) => {
            const hasViolation = violationMap.has(item.seq);
            const violations = violationMap.get(item.seq) || [];
            const isExpanded = expandedItems.has(item.seq);
            const totalErrors = violations.reduce((acc, v) => acc + v.affectedPages.reduce((sum, p) => sum + p.count, 0), 0);

            // 상태 결정
            let statusIcon;
            let statusText;
            let statusColorClass;
            let containerClass;

            if (item.isAutomatic) {
              if (hasViolation) {
                statusIcon = <AlertTriangle className="w-5 h-5 mr-2" />;
                statusText = `${totalErrors}건 오류`;
                statusColorClass = "text-red-600";
                containerClass = "border-red-200 shadow-sm";
              } else {
                statusIcon = <CheckCircle className="w-5 h-5 mr-2" />;
                statusText = "적합";
                statusColorClass = "text-green-600";
                containerClass = "border-gray-200";
              }
            } else {
              statusIcon = <div className="w-5 h-5 mr-2 rounded-full border-2 border-gray-300 flex items-center justify-center text-[10px] text-gray-400 font-bold">?</div>;
              statusText = "수동 점검 필요";
              statusColorClass = "text-gray-400";
              containerClass = "border-gray-100 bg-gray-50 opacity-70";
            }

            return (
              <div key={item.seq} className={`bg-white rounded-lg border transition-all duration-200 ${containerClass}`}>
                <div
                  className={`flex items-center justify-between p-5 ${item.isAutomatic ? 'cursor-pointer hover:bg-gray-50' : ''} rounded-t-lg ${isExpanded ? 'bg-gray-50' : ''}`}
                  onClick={() => item.isAutomatic && toggleItem(item.seq)}
                >
                  <div className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 font-bold text-sm 
                        ${!item.isAutomatic ? 'bg-gray-200 text-gray-500' :
                        hasViolation ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {item.seq}
                    </div>
                    <div>
                      <div className="flex items-center">
                        {item.code !== '-' && <span className="text-sm font-semibold text-gray-500 mr-2">[{item.code}]</span>}
                        <h3 className={`font-semibold text-lg ${hasViolation ? 'text-gray-900' : 'text-gray-500'}`}>
                          {item.name}
                        </h3>
                        <span className="text-xs text-gray-400 ml-2 font-normal hidden sm:inline-block">({item.description})</span>
                        <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium border ${item.isAutomatic ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                          {item.isAutomatic ? '자동진단' : '수동진단'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center ${statusColorClass}`}>
                      {statusIcon}
                      <span className="font-semibold">{statusText}</span>
                    </div>
                    {item.isAutomatic && (
                      isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* 상세 내용 (오류가 있을 때만 표시) */}
                {isExpanded && hasViolation && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6 rounded-b-lg animate-fadeIn">
                    <div className="space-y-6">
                      {violations.map((v, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="mb-3 border-b pb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-mono text-gray-400">Rule ID: {v.ruleId}</span>
                            </div>
                            <p className="font-medium text-gray-800">{v.description}</p>
                            <p className="text-sm text-gray-600 mt-1">💡 {v.help}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">발생 페이지 목록</div>
                            {v.affectedPages.map((page, pIdx) => (
                              <div key={pIdx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded hover:bg-gray-100">
                                <div className="truncate flex-1 pr-4">
                                  <span className="font-medium text-gray-900">{page.title}</span>
                                  <span className="text-gray-400 mx-2">|</span>
                                  <span className="text-gray-500 truncate">{page.url}</span>
                                </div>
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                  {page.count}건
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
