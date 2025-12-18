import { NextRequest } from 'next/server';
import { WebCrawler } from '@/lib/crawler';

export async function POST(request: NextRequest) {
  try {
    const options = await request.json();

    // SSE 스트림 생성
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const crawler = new WebCrawler({
            baseUrl: options.baseUrl,
            useLogin: options.useLogin || false,
            loginUrl: options.loginUrl,
            gnbSelector: options.gnbSelector,
            onLog: (message) => {
              // 로그를 SSE 형식으로 전송
              const data = `data: ${JSON.stringify({ type: 'log', message })}\n\n`;
              controller.enqueue(encoder.encode(data));
            },
            enableAudit: options.enableAudit || false,
          });

          const results = await crawler.crawl();

          // 완료 이벤트 전송
          const doneData = `event: done\ndata: ${JSON.stringify({
            success: true,
            data: results
          })}\n\n`;
          controller.enqueue(encoder.encode(doneData));
          controller.close();
        } catch (error) {
          console.error('Crawl error:', error);
          const errorData = `event: error\ndata: ${JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Request parsing error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
