# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo. Veja [standard-version](https://github.com/conventional-changelog/standard-version) para diretrizes de commits.

## [4.1.0](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/compare/v4.0.0...v4.1.0) (2026-04-22)


### Features

* **utf8-to-cp1252-conversion:** nova skill para conversão de encoding de fontes AdvPL/TLPP de UTF-8 para Windows-1252 (CP1252), com scripts nativos sem dependências para Linux/macOS (`convert-encoding.sh`) e Windows (`convert-encoding.bat`), detecção de BOM, backup e suporte a CI/CD ([a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))
* **agents:** novo agente customizado `browse-to-smartx-migrator` para migração autônoma de telas Browse legadas (`MBrowse`, `AxCadastro`, `MarkBrowse`, `FWMBrowse`) para Smart X nativo, com consulta MCP, análise de dicionário de dados e geração dos três arquivos TLPP da arquitetura SmartX ([a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))
* **browse-to-smartx-migration:** refatoração significativa da skill com novos patterns de conversão, templates de código atualizados e guia de troubleshooting expandido ([a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))
* **smartx-generator:** atualização abrangente dos templates de Model e Interface com referências completas da API `totvs.framework.structure` ([a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))
* **agents/claude:** diretrizes de conformidade SonarQube adicionadas ao `AGENTS.md` e `CLAUDE.md` (+229 linhas em cada arquivo) ([afc1af8](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/afc1af8992045ca2ff505e38f85c505e51e2f142), [a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))
* **advpl-tlpp-skills-reference:** novo arquivo de referência canônico em inglês com catálogo completo das skills AdvPL/TLPP para uso pelos arquivos de instrução de agentes ([afc1af8](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/afc1af8992045ca2ff505e38f85c505e51e2f142))
* **README:** adicionada seção "Agentes Customizados" documentando o agente `browse-to-smartx-migrator`; contagem de skills da coleção `advpl-tlpp` atualizada para 19; `AGENTS.md` e `CLAUDE.md` adicionados à tabela de coleções disponíveis ([f7831ee](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/f7831ee061c53bbc370694993ffd1e3f630db278))
* todas as skills AdvPL/TLPP revisadas para maior clareza, consistência e referências MCP atualizadas ([a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))
* **angular:** skills Angular atualizadas, removendo referências desnecessárias a ferramentas MCP e clarificando instruções de uso ([a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))
* **superpowers:** remoção do prefixo `superpowers:` nas sub-skills para maior consistência de nomenclatura ([a2547dd](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a2547dd4552b4606ae85cc11b8205292283eb68a))


### Bug Fixes

* **agents/claude:** caminhos dos arquivos `AGENTS.md` e `CLAUDE.md` corrigidos no `AGENTS.md` e `CLAUDE.md` para refletir nova estrutura de diretórios (`instructions/`) ([dc1c71d](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/dc1c71da91775285a38df2ab7d239c50f7e2ec6c))
* **README:** links e textos dos arquivos `CLAUDE.md` e `AGENTS.md` corrigidos ([0e91022](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/0e91022d116b49999e9ca946ebaedf5c0c215bf6), [2020ee9](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/2020ee9d2c3ed42f92041cf2c6d88a6453532c59))
* **build:** script de build atualizado para copiar corretamente os arquivos de agentes do diretório `instructions/` para o release ([a3ae824](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/a3ae8244d44b2bc559f90ab535c4f57076550b7e), [7f59aef](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/7f59aefa3dccc752aa8a10b63027a383e01e862a))


### Documentação

* **browse-to-smartx-migration:** cross-reference com a skill `smartx-generator` adicionada ao `SKILL.md` ([1271083](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/1271083ab16d59e837c764fe06a85993bf3b0738))
* **skills/advpl-tlpp/README:** `advpl-tlpp-skills-reference.md` adicionado às Referências Compartilhadas


## [4.0.0](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/compare/v3.1.0...v4.0.0) (2026-04-10)


### ⚠ BREAKING CHANGES

* todos os exemplos de código alterados de `User Function` para `Function`, alinhando com convenções modernas de TLPP


### Features

* **data-dictionary-lookup:** nova skill para consulta ao dicionário de dados do Protheus (SX3), incluindo referências de colunas e queries SQL prontas ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))


### Bug Fixes

* atualização dos links de download e versões das coleções no README.md ([4004396](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/40043965b49fcdaa47173d01418f346033c4b460))
* **agent:** título do AGENTS.md e CLAUDE.md atualizado para "AdvPL/TLPP Development Guidelines" ([329165e](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/329165e2f0d9fabd1050bc0a337059c40a87cc51))


### Documentação

* **agent:** AGENTS.md e CLAUDE.md expandidos com significativamente mais contexto (+101 linhas) ([329165e](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/329165e2f0d9fabd1050bc0a337059c40a87cc51))
* **browse-to-smartx-migration:** refatoração significativa da documentação da skill, simplificando patterns de conversão e troubleshooting (-186 linhas) ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
* **refactor:** melhorias nos exemplos de code smells e patterns de refatoração ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
* **smartx-generator:** ajustes de clareza e consistência nos exemplos ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
* **tlpp-rest-endpoint-generator:** templates e exemplos atualizados para melhor legibilidade ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
* **advpl-to-tlpp-migration:** melhorias na comparação de features e patterns de migração ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
* **sql-code-review:** exemplos de código melhorados para aderência a boas práticas ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
* **sql-optimization:** exemplos de código melhorados para melhor legibilidade ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
* consistência na linguagem e formatação das referências de documentação MCP em todas as skills ([df2dbf1](https://code.engpro.totvs.com.br/engpro-ia/agent-skills/commit/df2dbf113564f7e06a553e0f12c5a76b12236281))
