import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,

  // 크롤링 API를 IPC를 통해 노출
  crawler: {
    crawl: (options: any) => ipcRenderer.invoke('crawler:crawl', options)
  },

  auditor: {
    audit: (html: string, url: string) => ipcRenderer.invoke('auditor:audit', html, url)
  },

  ipcRenderer: {
    on: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ['crawler:log'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      // 함수 참조 매칭이 어려우므로 해당 채널의 모든 리스너 제거로 대체
      ipcRenderer.removeAllListeners(channel);
    }
  }
});
