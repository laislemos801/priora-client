import { app, BrowserWindow, Menu, ipcMain, net, protocol, shell } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Processo principal do Priora (Electron).
 *
 *  - Desenvolvimento (`npm start`): abre o servidor do Vite em http://localhost:5173.
 *  - Produção (aplicativo empacotado, ou `npm run electron:prod`): serve a pasta
 *    `dist/` pelo protocolo interno `app://priora`, com retorno ao index.html nas
 *    rotas da interface (o app é uma SPA com rotas no endereço).
 *
 * Endereço da API (em ordem): variável PRIORA_API_URL, arquivo config.json na pasta
 * de dados do app ({ "apiUrl": "http://servidor:8000" }) e, por fim,
 * http://127.0.0.1:8000. O servidor precisa liberar a origem `app://priora` em
 * CORS_ORIGINS.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");

const DEV_URL = process.env.ELECTRON_START_URL || "http://localhost:5173";
const USE_DIST = app.isPackaged || process.env.ELECTRON_PROD === "1";
const SMOKE = process.env.ELECTRON_SMOKE === "1"; // teste automático: abre, confere e sai
const APP_ORIGIN = "app://priora";
const DEFAULT_API_URL = "http://127.0.0.1:8000";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

function readApiUrl() {
  if (process.env.PRIORA_API_URL) return process.env.PRIORA_API_URL;
  try {
    const file = path.join(app.getPath("userData"), "config.json");
    const cfg = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (typeof cfg.apiUrl === "string" && cfg.apiUrl.trim()) return cfg.apiUrl.trim();
  } catch {
    /* sem arquivo de configuração: usa o padrão */
  }
  return DEFAULT_API_URL;
}

function registerAppProtocol() {
  protocol.handle("app", (request) => {
    const { pathname } = new URL(request.url);
    let relative = decodeURIComponent(pathname);

    // Rotas da interface (sem extensão) voltam ao index.html
    if (relative === "/" || !path.extname(relative)) relative = "/index.html";

    const file = path.normalize(path.join(DIST, relative));
    if (!file.startsWith(DIST)) {
      return new Response("Acesso negado", { status: 403 });
    }
    return net.fetch(pathToFileURL(file).toString());
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    show: !SMOKE,
    title: "Priora",
    backgroundColor: "#1D1D1D",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Links externos abrem no navegador do sistema, nunca dentro do aplicativo
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, url) => {
    const internal = url.startsWith(APP_ORIGIN) || (!USE_DIST && url.startsWith(DEV_URL));
    if (!internal) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  if (SMOKE) {
    win.webContents.once("did-finish-load", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const text = await win.webContents.executeJavaScript("document.body.innerText");
      // Chama a API a partir do próprio aplicativo (confere endereço e CORS)
      const apiStatus = await win.webContents
        .executeJavaScript('fetch(window.priora.apiUrl + "/openapi.json").then((r) => r.status).catch((e) => "erro: " + e.message)')
        .catch((e) => "erro: " + e.message);
      console.log(
        JSON.stringify({
          smoke: true,
          url: win.webContents.getURL(),
          title: win.getTitle(),
          apiUrl: readApiUrl(),
          apiStatus,
          texto: String(text).replace(/\s+/g, " ").slice(0, 160),
        })
      );
      app.exit(String(text).trim() ? 0 : 1);
    });
  }

  win.loadURL(USE_DIST ? `${APP_ORIGIN}/` : DEV_URL);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    if (USE_DIST) {
      Menu.setApplicationMenu(null);
      registerAppProtocol();
    }
    ipcMain.on("priora:api-url", (event) => {
      event.returnValue = readApiUrl();
    });
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
