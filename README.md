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
