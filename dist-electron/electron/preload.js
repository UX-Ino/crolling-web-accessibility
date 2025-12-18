"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    // 크롤링 API를 IPC를 통해 노출
    crawler: {
        crawl: (options) => electron_1.ipcRenderer.invoke('crawler:crawl', options)
    },
    auditor: {
        audit: (html, url) => electron_1.ipcRenderer.invoke('auditor:audit', html, url)
    },
    ipcRenderer: {
        on: (channel, func) => {
            const validChannels = ['crawler:log'];
            if (validChannels.includes(channel)) {
                electron_1.ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        removeListener: (channel, func) => {
            // 함수 참조 매칭이 어려우므로 해당 채널의 모든 리스너 제거로 대체
            electron_1.ipcRenderer.removeAllListeners(channel);
        }
    }
});
