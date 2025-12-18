import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLI 도구용: 일반 서버 모드 (standalone은 static 파일 문제 발생)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
