import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
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
  ipcMain.handle('crawler:crawl', async (event, options) => {
    try {
      console.log('Crawl request start:', options);

      // Dynamic import to ensure proper loading in compiled environment
      const crawlerModule = await import('../lib/crawler');
      const WebCrawler = crawlerModule.WebCrawler;

      const crawler = new WebCrawler({
        ...options,
        onLog: (msg: string) => {
          try {
            console.log('[Crawler Log]', msg);
          } catch (e) {
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
        const excelModule = await import('../lib/excel-generator');
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
      } else {
        const results = await crawler.crawl();
        data = results; // 일반 크롤링은 배열 그대로 반환 (기존 호환성)
      }

      return data;
    } catch (error) {
      console.error('Crawl error:', error);
      throw error;
    }
  });

  ipcMain.handle('auditor:audit', async (event, html, url) => {
    try {
      const auditorModule = await import('../lib/accessibility-auditor');
      const AccessibilityAuditor = auditorModule.AccessibilityAuditor;

      const auditor = new AccessibilityAuditor((msg) => console.log('[Auditor]', msg));
      const results = await auditor.audit(html, url);
      return results;
    } catch (error) {
      console.error('Audit error:', error);
      throw error;
    }
  });
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
