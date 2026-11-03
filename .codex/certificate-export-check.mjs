const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find((item) => item.type === 'page' && item.url.includes('127.0.0.1'));
if (!page) throw new Error('Local certificate page was not found.');

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => { ws.onopen = resolve; });
let messageId = 0;

const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++messageId;
  const timer = setTimeout(() => reject(new Error('CDP command timed out.')), 15000);
  const handler = (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== id) return;
    clearTimeout(timer);
    ws.removeEventListener('message', handler);
    if (message.error || message.result?.exceptionDetails) {
      reject(new Error(JSON.stringify(message.error || message.result.exceptionDetails)));
      return;
    }
    resolve(message.result);
  };
  ws.addEventListener('message', handler);
  ws.send(JSON.stringify({ id, method, params }));
});

await command('Page.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: 'C:\\Windows\\Temp\\atideto-cert-export-check'
});
await command('Runtime.evaluate', {
  expression: `[...document.querySelectorAll('button')]
    .find((element) => element.textContent?.includes('Download PNG'))
    ?.click();`,
  awaitPromise: true
});

await new Promise((resolve) => setTimeout(resolve, 7000));
ws.close();
