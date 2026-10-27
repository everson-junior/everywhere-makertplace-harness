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

## 🚀 Publicação no npm (GitHub Actions)

Este repositório possui uma GitHub Action automatizada para publicação dos pacotes sob o escopo `@everywhere-harness`:

1. No repositório do GitHub em **Settings** > **Secrets and variables** > **Actions**, adicione o segredo:
   - **Nome**: `NPM_TOKEN`
   - **Valor**: Seu token de automação com permissão de publicação na organização npm `@everywhere-harness`.

2. A publicação ocorre automaticamente quando um push é feito na branch `main` com alterações em `packages/**` ou ao disparar o workflow **Publish Packages to npm** manualmente via **Actions**.
