# 🖥️ Priora — Client

Interface desktop do sistema **Probabilistic Investigative Prioritization System (Priora)**.

Este aplicativo é responsável pela interação com o usuário, permitindo a visualização e análise das evidências e do ranking de suspeitos.

---

## ⚡ Quick Start

```bash
npm install
npm run start
```

---

## 🚀 Tecnologias

* Electron
* React
* Vite
* TailwindCSS

---

## 📁 Estrutura do Projeto

```
src/
├── components/   # Componentes reutilizáveis
├── pages/        # Páginas da aplicação
├── services/     # Comunicação com API
├── hooks/        # Hooks personalizados
└── styles/       # Estilos globais

electron/
└── main.js       # Processo principal do Electron
```

---

## ⚙️ Setup do Projeto

### 🔹 1. Clonar repositório

```bash
git clone <repo-url>
cd investigative-system-client
```

---

### 🔹 2. Instalar dependências

```bash
npm install
```

---

### 🔹 3. Rodar aplicação

```bash
npm run start
```

---

## 🧪 Scripts disponíveis

```bash
npm run dev       # Inicia o Vite
npm run electron  # Inicia o Electron
npm run start     # Inicia ambos (recomendado)
npm run build     # Build de produção
```

---

## 🔗 Integração com Backend

O frontend se comunica com o backend via API HTTP.

Por padrão, espera-se que o backend esteja rodando em:

```
http://localhost:8000
```

---

## ⚠️ Importante

* Certifique-se de que o backend está rodando antes de iniciar o client
* O Electron abrirá automaticamente uma janela com a aplicação
* Evite modificar diretamente a pasta `electron/` sem necessidade

---

## 🎯 Funcionalidades

* Visualização do ranking de suspeitos
* Inserção e acompanhamento de evidências
* Exploração de relações investigativas
* Interface otimizada para análise de dados

---

## 📌 Objetivo

O client tem como objetivo fornecer uma interface clara, organizada e eficiente para:

* Apoiar a análise investigativa
* Facilitar a interpretação dos dados
* Melhorar a tomada de decisão baseada em evidências

---

## 🖥️ Aplicativo desktop (Electron)

| Comando | O que faz |
| --- | --- |
| `npm start` | Desenvolvimento: sobe o Vite e abre o Electron em `http://localhost:5173`. |
| `npm run electron:prod` | Compila a interface e abre o Electron em modo produção (sem Vite). |
| `npm run electron:smoke` | Teste automático: abre o app em modo produção numa janela oculta, confere a tela inicial e chama a API. |
| `npm run electron:pack` | Gera o aplicativo descompactado em `release/win-unpacked/` (rápido, para testar o `Priora.exe`). |
| `npm run electron:dist` | Gera o instalador em `release/` (NSIS no Windows, AppImage no Linux, dmg no macOS; cada sistema gera o seu). |

**Endereço da API.** O aplicativo procura, nesta ordem: a variável de ambiente `PRIORA_API_URL`; o arquivo
`config.json` na pasta de dados do app (`%APPDATA%\Priora\config.json` no Windows) com
`{ "apiUrl": "http://SERVIDOR:8000" }`; e, por fim, `http://127.0.0.1:8000`.

**CORS.** O app empacotado usa a origem interna `app://priora`, que o servidor já libera sempre.

**Ícone.** `build/icon.png` foi gerado a partir do ícone de 180 px; troque por uma arte de 512 px quando houver.
