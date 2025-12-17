import { NextRequest, NextResponse } from 'next/server';
import { WebCrawler } from '@/lib/crawler';
import { ExcelGenerator } from '@/lib/excel-generator';
import { AuditMetadata } from '@/types/audit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { baseUrl, useLogin, loginUrl, gnbSelector, platform, auditor } = body;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const crawler = new WebCrawler({
        baseUrl,
        useLogin,
        loginUrl,
        gnbSelector,
        onLog: (msg) => {
          const logData = JSON.stringify({ type: 'log', message: msg });
          controller.enqueue(encoder.encode(logData + '\n'));
        },
        enableAudit: true,
      });

      try {
        // 접근성 진단 실행
        const results = await crawler.crawlWithAudit();

        // 메타데이터 생성
        const metadata: AuditMetadata = {
          platform: platform || 'PC',
          auditor: auditor || '자동진단시스템',
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          baseUrl,
        };

        // Excel 생성
        const excelBuffer = ExcelGenerator.generateAccessibilityExcel(results, metadata);
        const excelBase64 = Buffer.from(excelBuffer).toString('base64');

        // 결과 전송
        const resultData = JSON.stringify({
          type: 'result',
          data: { results, metadata, excelBase64 }
        });
        controller.enqueue(encoder.encode(resultData + '\n'));
      } catch (e) {
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: String(e) }) + '\n'));
      } finally {
        controller.close();
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
