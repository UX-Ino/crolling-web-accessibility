#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 웹 접근성 크롤러를 시작합니다...\n');

const dir = path.resolve(__dirname, '..');
const nextBin = require.resolve('next/dist/bin/next');

// Production 모드로 실행
const child = spawn(process.execPath, [nextBin, 'start', dir], {
  stdio: 'inherit',
  cwd: dir,
  env: { ...process.env, NODE_ENV: 'production', PORT: process.env.PORT || '3000' }
});

child.on('close', (code) => {
  process.exit(code);
});

// 종료 시그널 처리
process.on('SIGINT', () => {
  console.log('\n\n👋 서버를 종료합니다...\n');
  child.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill();
  process.exit(0);
});
