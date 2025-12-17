import { NextRequest, NextResponse } from 'next/server';
import { WebCrawler } from '@/lib/crawler';

export const dynamic = 'force-dynamic';

// We'll use a simple SSE-like or chunked response to stream logs.
// But Next.js App Router streaming is best done by returning a ReadableStream.

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { baseUrl, useLogin, loginUrl, gnbSelector } = body;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const crawler = new WebCrawler({
        baseUrl,
        useLogin,
        loginUrl,
        gnbSelector,
        onLog: (msg) => {
          // Provide structured log data
          const logData = JSON.stringify({ type: 'log', message: msg });
          controller.enqueue(encoder.encode(logData + '\n'));
        }
      });

      try {
        const results = await crawler.crawl();
        // Send results at the end
        const resultData = JSON.stringify({ type: 'result', data: results });
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
