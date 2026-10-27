<h1 align="center">EngPro AI Agent Skills</h1>

<p align="center">
  <a href="https://agentskills.io"><img src="https://img.shields.io/badge/AI-Powered%20Skills-purple?style=flat-square&logo=openai" alt="ai powered" /></a>
  <a href="https://github.com/agentskills/agentskills/tree/main/skills-ref"><img src="https://img.shields.io/badge/AI%20Scan-Framework-yellow" alt="AI Security Framework" /></a>
  <a href="https://learn-cloudsecurity.cisco.com/ai-security-framework"><img src="https://img.shields.io/badge/AI%20Security-Framework-orange" alt="AI Security Framework" /></a>
  <a href="https://code.engpro.totvs.com.br/engpro-ia/agent-skills/src/branch/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  <a href="https://drone.engpro.totvs.com.br/engpro-ia/agent-skills"><img src="https://drone.engpro.totvs.com.br/api/badges/engpro-ia/agent-skills/status.svg" /></a>
</p>

<p align="center">
  Um repositório curado, seguro e validado para o uso em quaisquer agentes de IA com suporte a skills — seguindo o padrão aberto <a href="https://agentskills.io/">Agent Skills</a>.
</p>

---

## Sumário

- [O que são Agent Skills?](#o-que-são-agent-skills)
  - [Categorias de Uso](#categorias-de-uso)
- [Agentes Suportados](#agentes-suportados)
- [Coleções Disponíveis](#coleções-disponíveis)
- [Como Usar](#como-usar)
  - [Onde as Skills Ficam](#onde-as-skills-ficam)
- [`CLAUDE.md` e `AGENTS.md` — Instruções de Contexto](#claude-md-e-agents-md-instruções-de-contexto)
  - [O que são `CLAUDE.md` e `AGENTS.md`?](#o-que-são-claude-md-e-agents-md)
  - [Como Usar o `CLAUDE.md` e `AGENTS.md`](#como-usar-o-claude-md-e-agents-md)
- [Agentes Customizados](#agentes-customizados)
- [Contribuindo](#contribuindo)
- [Segurança](#segurança)
- [Licença](#licença)

---

## O que são Agent Skills?

Agent Skills são instruções estruturadas empacotadas como pastas simples contendo um arquivo `SKILL.md` — que orientam agentes de IA a executar tarefas de engenharia de software de forma consistente e com qualidade. Cada skill define um fluxo de trabalho completo — incluindo quando usar, instruções passo a passo, formato de saída e critérios de validação — permitindo que o agente atue como um especialista no domínio.

As skills funcionam através de um sistema de **progressive disclosure** em três níveis:

1. **Frontmatter YAML** — sempre carregado no contexto do agente. Contém apenas o necessário para o agente saber quando cada skill deve ser usada.
2. **Corpo do SKILL.md** — carregado quando o agente determina que a skill é relevante para a tarefa atual. Contém as instruções completas.
3. **Arquivos vinculados** — arquivos adicionais no diretório da skill que o agente pode navegar e consultar apenas quando necessário (referências, templates, scripts).

Esse design minimiza o uso de tokens enquanto mantém expertise especializada disponível.

> **Skills ensinam agentes de IA uma vez, e eles aplicam esse conhecimento de forma consistente em cada tarefa.** Em vez de re-explicar preferências, processos e expertise de domínio a cada conversa, skills permitem ensinar o agente uma vez e se beneficiar sempre.

### Categorias de Uso

Skills são versáteis e cobrem três grandes categorias:

| Categoria | Descrição | Exemplos |
|-----------|-----------|----------|
| **Criação de Documentos e Assets** | Gerar outputs consistentes e de alta qualidade — código, documentação, relatórios | Geração de telas MVC, endpoints REST, documentação ProtheusDOC |
| **Automação de Workflows** | Processos multi-etapas que se beneficiam de metodologia consistente | Migração de código, revisão de qualidade, planejamento de implementação |
| **Inteligência de Domínio** | Conhecimento especializado aplicado a decisões de engenharia | Otimização SQL, refatoração com code smells, revisão de segurança |

## Agentes Suportados

Instale skills em qualquer um desses agentes de IA para desenvolvimento de software:

|                     Populares                             |                            Promissores                                 |                   Corporativos                   |
| :-------------------------------------------------------: | :--------------------------------------------------------------------: | :-----------------------------------------------------: |
|         **[Claude Code](https://claude.ai/code)**         |                    **[Aider](https://aider.chat)**                     |   **[Amazon Q](https://aws.amazon.com/q/developer/)**   |
|        **[Cline](https://github.com/cline/cline)**        |               **[Antigravity](https://idx.google.com)**                |       **[Augment](https://www.augmentcode.com)**        |
|             **[Cursor](https://cursor.com)**              | **[Gemini CLI](https://ai.google.dev/gemini-api/docs/code-execution)** |    **[Droid (Factory.ai)](https://www.factory.ai)**     |
| **[GitHub Copilot](https://github.com/features/copilot)** |                  **[Kilo Code](https://kilocode.ai)**                  | **[OpenCode](https://github.com/opencode-ai/opencode)** |
|       **[Windsurf](https://codeium.com/windsurf)**        |                     **[Kiro](https://kiro.dev/)**                      |  **[Sourcegraph Cody](https://sourcegraph.com/cody)**   |
|                                                           |    **[OpenAI Codex](https://openai.com/index/introducing-codex/)**     |         **[Tabnine](https://www.tabnine.com)**          |
|                                                           |                    **[Roo Code](https://roo.dev)**                     |                                                         |
|                                                           |                    **[TRAE](https://docs.trae.ai)**                    |                                                         |

## Coleções Disponíveis

Cada diretório na raiz do repositório representa uma **coleção de skills** voltada para uma linguagem, framework ou domínio específico.

| Coleção | Descrição | Skills |
|---------|-----------|--------|
| [advpl-tlpp](skills/advpl-tlpp/) | Skills para o ecossistema **TOTVS Protheus ERP** — linguagens AdvPL e TLPP | 19 |
| [angular](skills/angular/) | Skills para desenvolvimento com **Angular** — criação de aplicações, geração de código, boas práticas | 2 |
| [superpowers](skills/superpowers/) | Skills genéricas para agentes (recomendado o uso em conjunto com as outras skills) | 14 |

> Novas coleções para outras linguagens e frameworks serão adicionadas progressivamente.

## Como Usar

Faça download do pacote de skills e coloque as pastas de skills no local apropriado para que seu agente de IA possa acessá-las.

| Pacote | Descrição | Versão |
|--------|-----------|--------|
| [skills](https://code.engpro.totvs.com.br/attachments/cbbf8716-77ab-47c3-b1f3-a7c742334038) | Todas as coleções de skills (**advpl-tlpp**, **angular**, **superpowers**) em um único arquivo | 4.1.0 |
| [agents](https://code.engpro.totvs.com.br/attachments/0400a22b-5d2d-4f28-b2c9-18cf85b618a4) | Agentes customizados para **Claude Code**, **GitHub Copilot**, **Cursor** e outros | 4.1.0 |
| [AGENTS.md](https://code.engpro.totvs.com.br/attachments/f6b46a21-9efe-47a2-a580-2878a2bc2392) | Instruções de contexto para **GitHub Copilot, Cursor, Windsurf, Cline** e outros | 4.1.0 |
| [CLAUDE.md](https://code.engpro.totvs.com.br/attachments/d68233f7-9ae9-450c-8d68-75b8f5e56b7b) | Instruções de contexto para **Claude Code** | 4.1.0 |

> Para outras versões, consulte a página de [releases](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/releases).

### Onde as Skills Ficam

| Escopo | Caminhos suportados | Aplica-se a |
|--------|---------------------|-------------|
| Pessoal | `~/.claude/skills/<skill>/SKILL.md`<br>`~/.agents/skills/<skill>/SKILL.md`<br>`~/.copilot/skills/<skill>/SKILL.md` | Todos os seus projetos |
| Projeto | `.claude/skills/<skill>/SKILL.md`<br>`.github/skills/<skill>/SKILL.md`<br>`.agents/skills/<skill>/SKILL.md` | Apenas este projeto |
| Plugin | `<plugin>/skills/<skill>/SKILL.md` | Onde o plugin está habilitado |

## `CLAUDE.md` e `AGENTS.md` — Instruções de Contexto

Além das skills, este repositório fornece **CLAUDE.md** e **AGENTS.md** — arquivos de instruções de contexto que configuram o agente de IA com conhecimento fundamental sobre um ecossistema antes mesmo de ele começar a trabalhar. Enquanto skills ensinam *como fazer* tarefas específicas, CLAUDE.md e AGENTS.md ensinam *o que o agente precisa saber* sobre o projeto.

> **⚠️ Importante:** Os arquivos `CLAUDE.md` e `AGENTS.md` possuem **o mesmo conteúdo** — são equivalentes. A diferença é apenas o nome do arquivo, que existe para compatibilidade com diferentes agentes de IA. **Use apenas um deles**, conforme o agente que você utiliza:
>
> - **`CLAUDE.md`** — reconhecido nativamente pelo **Claude Code**.
> - **`AGENTS.md`** — reconhecido nativamente pelo **GitHub Copilot**, **Cursor**, **Windsurf** e outros agentes que seguem o [padrão aberto](https://agents.md/).
>
> Não é necessário (nem recomendado) usar ambos ao mesmo tempo no mesmo workspace.

### O que são `CLAUDE.md` e `AGENTS.md`?

Os arquivos [`CLAUDE.md`](instructions/CLAUDE.md) e [`AGENTS.md`](instructions/AGENTS.md) são **o mesmo conjunto de instruções de contexto para workspaces do ecossistema TOTVS Protheus ERP**, disponibilizados com dois nomes diferentes para compatibilidade com múltiplos agentes. Eles contêm:

| Seção | Conteúdo |
|-------|----------|
| **Linguagem e Ecossistema** | Identificação das linguagens AdvPL e TLPP, extensões de arquivo, idioma padrão |
| **Estrutura de Projeto** | Layout de diretórios típico de um projeto Protheus (fontes, testes, skills) |
| **Convenções de Código** | Notação Húngara, nomenclatura de arquivos, tabelas, campos e constantes multilíngue |
| **Padrões Obrigatórios** | Soft-delete, filtro por filial, prevenção de SQL injection, boas práticas de performance |
| **Padrão MVC** | Estrutura `MenuDef → ModelDef → ViewDef → BrowseDef` do framework Protheus |
| **TLPP Moderno** | Namespaces, type annotations, REST via annotations, Smart X (PO-UI) |
| **Build e Compilação** | RDMake, arquivos `.PRJ`, RPO |
| **Testes** | Frameworks AdvPR e TIR com estruturas e convenções |
| **Skills Disponíveis** | Catálogo resumido das skills de AdvPL/TLPP |
| **ProtheusDOC** | Padrão de documentação obrigatório para novo código |

Com essas informações carregadas, o agente já entende as convenções, restrições e boas práticas do projeto — sem que você precise explicar a cada conversa.

### Como Usar o `CLAUDE.md` e `AGENTS.md`

Escolha **um** dos dois arquivos conforme o agente que você utiliza e copie-o para a **raiz do seu repositório ou workspace**. A maioria dos agentes de IA detecta automaticamente arquivos de instruções na raiz do projeto.

| Arquivo | Agentes que reconhecem nativamente |
|---------|------------------------------------|
| [`CLAUDE.md`](instructions/CLAUDE.md) | Claude Code |
| [`AGENTS.md`](instructions/AGENTS.md) | GitHub Copilot, Cursor, Windsurf, Cline, Kilo Code, Roo Code e outros |

Caso o seu agente exija um caminho ou nome de arquivo específico, crie um link simbólico ou copie o arquivo para o local adequado.

> **Dica:** O CLAUDE.md e AGENTS.md complementam as skills. Use-os para dar contexto permanente ao agente e as skills para ensinar fluxos de trabalho específicos.

---

## Agentes Customizados

Além das skills e das instruções de contexto, este repositório fornece **agentes customizados** — modos de agente especializados que combinam um conjunto fixo de skills, instruções de workflow e acesso a ferramentas específicas para executar tarefas complexas de forma autônoma. Cada agente é definido por um arquivo `.agent.md` no diretório [`agents/`](agents/).

Enquanto uma skill orienta *como* realizar uma tarefa, um agente customizado define *quem* executa — com um papel fixo, ferramentas pré-configuradas, sequência de fases e critérios de ativação.

| Agente | Arquivo | Descrição |
|--------|---------|----------|
| Browse to SmartX Migrator | [browse-to-smartx-migrator.agent.md](agents/browse-to-smartx-migrator.agent.md) | Especialista em converter telas Browse legadas (`MBrowse`, `AxCadastro`, `MarkBrowse`, `FWMBrowse`) para o padrão nativo Smart X usando classes `totvs.framework.structure` (Model, View, Executor). Consulta documentação oficial via MCP, analisa dicionário de dados, preserva lógica de negócio e pontos de entrada, e gera os três arquivos TLPP da arquitetura SmartX. |

> Novos agentes customizados serão adicionados conforme novos fluxos complexos forem identificados.

---

## Contribuindo

Quer contribuir com novas skills ou melhorar as existentes? Consulte o guia completo em [CONTRIBUTING.md](CONTRIBUTING.md) — com estrutura do projeto, anatomia de uma skill, regras obrigatórias, frontmatter, boas práticas e muito mais.

## Segurança

Este repositório segue uma política de segurança rigorosa — todas as skills são open source, auditáveis e revisadas manualmente. Para detalhes sobre o modelo de ameaças e como reportar vulnerabilidades, consulte [SECURITY.md](SECURITY.md).

## Licença

Este projeto é distribuído sob a licença [MIT](LICENSE).
