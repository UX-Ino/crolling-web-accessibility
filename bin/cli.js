#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3000;
const appDir = path.join(__dirname, '..');

console.log('🚀 웹 접근성 크롤러를 시작합니다...\n');

// Next.js 서버 시작
const server = exec('npm start', {
  cwd: appDir,
  env: {
    ...process.env,
    PORT: PORT.toString()
  }
});

server.stdout.pipe(process.stdout);
server.stderr.pipe(process.stderr);

// 서버가 준비되면 브라우저 열기  
setTimeout(async () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n✨ 브라우저를 엽니다: ${url}\n`);

  try {
    const open = (await import('open')).default;
    await open(url, { app: { name: 'google chrome' } });
  } catch (error) {
    // Chrome이 없으면 기본 브라우저로
    try {
      const open = (await import('open')).default;
      await open(url);
    } catch (e) {
      console.log('⚠️  브라우저를 자동으로 열 수 없습니다. 직접 열어주세요:', url);
    }
  }

  console.log('💡 종료하려면 Ctrl+C를 누르세요.\n');
}, 5000);

// 종료 시그널 처리
process.on('SIGINT', () => {
  console.log('\n\n👋 서버를 종료합니다...\n');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});
