/**
 * 접근성 진단 관련 타입 정의
 */

export interface ViolationNode {
  html: string;
  failureSummary: string;
  target: string[];
}

export interface Violation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: ViolationNode[];
}

export interface AuditResult {
  url: string;
  title: string;
  depths: string[]; // GNB 매핑
  totalViolations: number;
  violations: Violation[];
}

export interface AuditMetadata {
  platform: 'PC' | 'Mobile';
  auditor: string;
  date: string; // YYYY-MM-DD
  baseUrl?: string;
}

export interface AuditReport {
  id: string;
  metadata: AuditMetadata;
  results: AuditResult[];
  summary: {
    totalPages: number;
    totalViolations: number;
    pagesWithErrors: number;
    topIssues: { guideline: string; count: number }[];
  };
}

export interface ExcelRow {
  플랫폼: string;
  점검자: string;
  점검일: string;
  번호: number;
  지침명: string;
  판정: string;
  오류내용: string;
  해결방안: string;
}
