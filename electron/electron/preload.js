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
    }
});
