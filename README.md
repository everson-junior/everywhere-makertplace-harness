# Everywhere Harness Marketplace 🛒

Repositório oficial do marketplace de plugins e presets para o **Everywhere Harness**.

---

## 🌟 Como Usar no Everywhere Harness (Discover / Navegador de Plugins)

1. Abra as **Configurações (Settings)** no Everywhere Harness Web ou Desktop.
2. Navegue até **Built-in plugins** > aba **Discover (Descobrir)**.
3. Clique em **Index sources (Fontes de índice)**.
4. Adicione a URL do índice deste marketplace:
   ```text
   https://raw.githubusercontent.com/everson-junior/everywhere-makertplace-harness/main/index.json
   ```
5. Os plugins e presets deste repositório aparecerão listados no catálogo prontos para instalação com um clique!

---

## 📦 Plugins e Presets Disponíveis

### 1. `@everywhere-harness/preset-protheus` (Modo Protheus)
- **Caminho**: [`packages/preset-protheus`](packages/preset-protheus)
- **Descrição**: Preset especializado para desenvolvimento em **TOTVS Protheus ERP** utilizando **AdvPL** e **TLPP**.
- **Perfil base**: Modo Minimal (Terminal PTY persistente Bash/PowerShell, compactação de contexto e visualização de imagens).
- **Conteúdo incluído**:
  - **35+ Skills especializadas**: Migração para TLPP, geradores MVC, endpoints REST TLPP, geradores de testes TIR/AdvPR, revisão de código SonarQube/SQL, otimização de queries, etc.
  - **Diretrizes e Instruções de Contexto**: Padrões de engenharia Protheus (`AGENTS.md` e `CLAUDE.md` com notação húngara obrigatória, tipagem estática TLPP, etc.).
  - **Agentes Customizados**: Especialista em migração de Browse para Smart X (`browse-to-smartx-migrator.agent.md`).

---

## Client UI chat em desenvolvimento

O pacote único [`@everywhere-harness/client-ui-chat`](packages/client-ui-chat/README.md), versão planejada `0.1.0`, reúne a identidade visual Everywhere do chat e da sidebar. A aprovação atual cobre branch/PR, **não publicação npm**. Ele permanece fora de `index.json` enquanto essa versão não existir no registry, evitando uma instalação com erro 404. Os plugins e presets existentes permanecem no catálogo.

Marca e hero usam slots existentes nos pacotes DSH `0.2.1-rc.3`. A identidade completa requer os novos slots `conversation.chat.running.icon` e `shell.document.title`, ainda não publicados. O pacote aguarda a declaração de cada slot; hosts anteriores conservam seu indicador e título nativos. Veja a [matriz visual e as limitações](packages/client-ui-chat/README.md#matriz-do-delta-visual).

## Validação de contribuições

Use Node.js `>=24.9.0` e pnpm `11.21.0`, utilizado localmente e fixado no CI. O workspace permite o build de `esbuild` por `allowBuilds.esbuild: true`.

```sh
pnpm install --frozen-lockfile
pnpm --filter @everywhere-harness/client-ui-chat run typecheck
pnpm --filter @everywhere-harness/client-ui-chat run build
pnpm --filter @everywhere-harness/client-ui-chat run test
pnpm --filter @everywhere-harness/client-ui-chat run test:pack
pnpm run validate:index
pnpm --filter @everywhere-harness/client-ui-chat pack --pack-destination <diretorio-temporario>
```

O workflow **Validate Marketplace** executa essas verificações em pull requests, sem secrets de publicação e com permissão de leitura. O smoke obrigatório instala o tarball em um projeto temporário isolado e verifica os entrypoints host e client. O `prepack` também executa typecheck, build e testes. Empacotar não publica no npm.

---

## 🚀 Publicação no npm (GitHub Actions)

Este repositório possui uma GitHub Action automatizada com lista explícita de publicação: somente `@everywhere-harness/preset-protheus` e `@everywhere-harness/plugin-providers`. Não existe pacote `plugin-models` nesta árvore. `@everywhere-harness/client-ui-chat` não está autorizado para publicação e fica excluído desse workflow.

1. No repositório do GitHub em **Settings** > **Secrets and variables** > **Actions**, adicione o segredo:
   - **Nome**: `NPM_TOKEN`
   - **Valor**: Seu token de automação com permissão de publicação na organização npm `@everywhere-harness`.

2. A publicação dos dois pacotes autorizados ocorre quando um push é feito na branch `main` com alterações em `packages/**` ou `index.json`, quando uma release é publicada, ou ao disparar o workflow **Publish Packages to npm** manualmente via **Actions**. Um PR não publica pacotes.

O script raiz `publish:packages` continua recursivo e não deve ser usado nesta branch: ele não aplica a lista explícita do workflow. Uma futura release de `client-ui-chat` exige autorização separada, validação do tarball e confirmação da versão no npm antes de ativar sua entrada no catálogo, conforme o [README do pacote](packages/client-ui-chat/README.md#catalogo-e-release-futura).
