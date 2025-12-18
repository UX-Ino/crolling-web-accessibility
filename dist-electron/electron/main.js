"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const isDev = !electron_1.app.isPackaged;
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        title: '웹 접근성 크롤러',
    });
    const startURL = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../../out/index.html')}`;
    mainWindow.loadURL(startURL);
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
function setupIpcHandlers() {
    electron_1.ipcMain.handle('crawler:crawl', async (event, options) => {
        try {
            console.log('Crawl request start:', options);
            // Dynamic import to ensure proper loading in compiled environment
            const crawlerModule = await Promise.resolve().then(() => __importStar(require('../lib/crawler')));
            const WebCrawler = crawlerModule.WebCrawler;
            const crawler = new WebCrawler({
                ...options,
                onLog: (msg) => {
                    try {
                        console.log('[Crawler Log]', msg);
                    }
                    catch (e) {
                        // ignore console write errors (EPIPE)
                    }
                    if (!event.sender.isDestroyed()) {
                        event.sender.send('crawler:log', msg);
                    }
                }
            });
            let data;
            if (options.enableAudit) {
                const results = await crawler.crawlWithAudit();
                // 엑셀 생성
                const excelModule = await Promise.resolve().then(() => __importStar(require('../lib/excel-generator')));
                const ExcelGenerator = excelModule.ExcelGenerator;
                const metadata = {
                    baseUrl: options.baseUrl,
                    platform: options.platform || 'PC',
                    auditor: options.auditor || 'Unknown',
                    date: new Date().toLocaleDateString('ko-KR'),
                };
                const excelBuffer = ExcelGenerator.generateAccessibilityExcel(results, metadata);
                const excelBase64 = Buffer.from(excelBuffer).toString('base64');
                data = { results, excelBase64 };
            }
            else {
                const results = await crawler.crawl();
                data = results; // 일반 크롤링은 배열 그대로 반환 (기존 호환성)
            }
            return data;
        }
        catch (error) {
            console.error('Crawl error:', error);
            throw error;
        }
    });
    electron_1.ipcMain.handle('auditor:audit', async (event, html, url) => {
        try {
            const auditorModule = await Promise.resolve().then(() => __importStar(require('../lib/accessibility-auditor')));
            const AccessibilityAuditor = auditorModule.AccessibilityAuditor;
            const auditor = new AccessibilityAuditor((msg) => console.log('[Auditor]', msg));
            const results = await auditor.audit(html, url);
            return results;
        }
        catch (error) {
            console.error('Audit error:', error);
            throw error;
        }
    });
}
electron_1.app.whenReady().then(() => {
    setupIpcHandlers();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
