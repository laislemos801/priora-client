# Publicação do front (Vercel)

O Priora em produção usa:

| Parte | Onde | Repositório |
|---|---|---|
| Front (este repositório) | **Vercel** | `priora-client` |
| API | **Render** | `priora-server` (veja o `DEPLOY.md` de lá) |
| Banco | Neo4j Aura | — |
| Imagens | Supabase Storage | — |

> Publique **primeiro a API**: o front precisa do endereço dela no build.

## 1. Criar o projeto

1. Entre em [vercel.com](https://vercel.com) com a conta do GitHub.
2. **Add New → Project** e escolha o repositório `priora-client`.
3. A configuração já vem do [`vercel.json`](vercel.json) (Vite, `npm run build`, pasta `dist`).
4. Em **Settings → Git → Production Branch**, use a mesma branch publicada na API (ex.: `dev`).

## 2. Variáveis de ambiente

Em **Settings → Environment Variables**:

| Variável | Valor | Observação |
|---|---|---|
| `VITE_API_URL` | endereço da API no Render, ex.: `https://priora-api.onrender.com` | Sem barra no final. **Entra no build**: se mudar, publique de novo (**Deployments → Redeploy**). |

## 3. Publicar

Clique em **Deploy**. Depois disso, **cada push na branch de produção publica sozinho**.

Anote o endereço gerado (ex.: `https://priora.vercel.app`): ele vai em `FRONTEND_URL` e `CORS_ORIGINS` da API.

## O que o `vercel.json` faz

- **Rotas do React:** toda URL volta para o `index.html`. Sem isso, abrir `/case/123` direto ou dar F5 numa tela interna dá 404.
- **Electron:** a instalação usa `ELECTRON_SKIP_BINARY_DOWNLOAD=1`, para não baixar o Electron (~100 MB), que só é usado no app desktop.
- **Cache:** os arquivos de `/assets` (com hash no nome) ficam em cache por 1 ano; o `index.html` é sempre revalidado, para a versão nova aparecer logo após cada publicação.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Tela de login não entra / erro de conexão | `VITE_API_URL` errado, ou a API "dormindo" no Render (a 1ª requisição leva 30–60 s) |
| Erro de CORS no console do navegador | `CORS_ORIGINS` da API não tem o endereço exato do Vercel |
| Link do e-mail de recuperação abre `localhost` | `FRONTEND_URL` da API ainda aponta para `localhost` |
| 404 ao dar F5 numa tela interna | `vercel.json` ausente na branch publicada |
