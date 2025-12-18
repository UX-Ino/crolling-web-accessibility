export { };

declare global {
  interface Window {
    electron?: {
      platform: string;
      crawler: {
        crawl: (options: any) => Promise<any>;
      };
      auditor: {
        audit: (html: string, url: string) => Promise<any>;
      };
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void;
        removeListener: (channel: string, func: (...args: any[]) => void) => void;
      };
    };
  }
}
