# Skills de Agente Angular

Uma coleção de **2 skills** de agente IA para desenvolvimento com **Angular**, abrangendo criação de aplicações, geração de código, boas práticas de reatividade, formulários, roteamento, testes e estilização.

---

## Sumário

- [Skills por Categoria](#skills-por-categoria)
  - [Criação de Aplicações](#criação-de-aplicações)
  - [Desenvolvimento](#desenvolvimento)
- [Referências](#referências)
  - [Referências por Skill](#referências-por-skill)
- [Referência Rápida: Qual Skill Usar?](#referência-rápida-qual-skill-usar)

---

## Skills por Categoria

### Criação de Aplicações

Skills para configurar e inicializar novos projetos Angular.

| Skill | Descrição |
|-------|-----------|
| [angular-new-app](angular-new-app/SKILL.md) | Cria uma nova aplicação Angular usando o Angular CLI. Orienta a verificação do CLI, geração do projeto com as flags adequadas, configuração de IA (`--ai-config`), geração de componentes/serviços e adição do Tailwind CSS. |

### Desenvolvimento

Skills para geração de código, arquitetura e boas práticas em aplicações Angular existentes.

| Skill | Descrição |
|-------|-----------|
| [angular-developer](angular-developer/references/SKILL.md) | Gera código Angular e fornece orientação arquitetural. Cobre criação de componentes, reatividade com Signals (`signal`, `linkedSignal`, `resource`, `effect`), formulários (Signal Forms, template-driven, reactive), injeção de dependências, roteamento, acessibilidade (ARIA), animações, estilização (Tailwind CSS), testes e ferramentas de CLI. |

---

## Referências

### Referências por Skill

Materiais de referência específicos de cada skill.

#### `angular-developer`

**Componentes**

| Referência | Descrição |
|------------|-----------|
| [components.md](angular-developer/references/components.md) | Anatomia, metadados, conceitos centrais e controle de fluxo em templates (`@if`, `@for`, `@switch`). |
| [inputs.md](angular-developer/references/inputs.md) | Inputs baseados em Signals, transformações e model inputs. |
| [outputs.md](angular-developer/references/outputs.md) | Outputs baseados em Signals e boas práticas para eventos customizados. |
| [host-elements.md](angular-developer/references/host-elements.md) | Host bindings e injeção de atributos. |
| [component-styling.md](angular-developer/references/component-styling.md) | Boas práticas para estilos de componentes e encapsulamento. |

**Reatividade e Gerenciamento de Estado**

| Referência | Descrição |
|------------|-----------|
| [signals-overview.md](angular-developer/references/signals-overview.md) | Conceitos centrais de Signals (`signal`, `computed`), contextos reativos e `untracked`. |
| [linked-signal.md](angular-developer/references/linked-signal.md) | Criação de estado gravável vinculado a Signals de origem com `linkedSignal`. |
| [resource.md](angular-developer/references/resource.md) | Busca de dados assíncronos diretamente em estado de Signal com `resource`. |
| [effects.md](angular-developer/references/effects.md) | Efeitos colaterais, `afterRenderEffect` e quando não usar effects. |

**Formulários**

| Referência | Descrição |
|------------|-----------|
| [signal-forms.md](angular-developer/references/signal-forms.md) | Gerenciamento de estado de formulários com Signals (Angular v21+). |
| [template-driven-forms.md](angular-developer/references/template-driven-forms.md) | Formulários template-driven para casos simples. |
| [reactive-forms.md](angular-developer/references/reactive-forms.md) | Formulários reativos para casos complexos. |

**Injeção de Dependências**

| Referência | Descrição |
|------------|-----------|
| [di-fundamentals.md](angular-developer/references/di-fundamentals.md) | Visão geral de DI, serviços e a função `inject()`. |
| [creating-services.md](angular-developer/references/creating-services.md) | Criação de serviços, opção `providedIn: 'root'` e injeção em componentes. |
| [defining-providers.md](angular-developer/references/defining-providers.md) | Provedores automáticos vs manuais, `InjectionToken`, `useClass`, `useValue`, `useFactory` e escopos. |
| [injection-context.md](angular-developer/references/injection-context.md) | Onde `inject()` é permitido, `runInInjectionContext` e `assertInInjectionContext`. |
| [hierarchical-injectors.md](angular-developer/references/hierarchical-injectors.md) | `EnvironmentInjector` vs `ElementInjector`, regras de resolução e modificadores (`optional`, `skipSelf`). |

**Roteamento**

| Referência | Descrição |
|------------|-----------|
| [define-routes.md](angular-developer/references/define-routes.md) | Caminhos de URL, segmentos estáticos vs dinâmicos, wildcards e redirecionamentos. |
| [loading-strategies.md](angular-developer/references/loading-strategies.md) | Carregamento eager vs lazy e carregamento contextual. |
| [show-routes-with-outlets.md](angular-developer/references/show-routes-with-outlets.md) | Uso de `<router-outlet>`, outlets aninhados e outlets nomeados. |
| [navigate-to-routes.md](angular-developer/references/navigate-to-routes.md) | Navegação declarativa com `RouterLink` e programática com `Router`. |
| [route-guards.md](angular-developer/references/route-guards.md) | Implementação de `CanActivate`, `CanMatch` e outros guards de segurança. |
| [data-resolvers.md](angular-developer/references/data-resolvers.md) | Pré-carregamento de dados antes da ativação de rota com `ResolveFn`. |
| [router-lifecycle.md](angular-developer/references/router-lifecycle.md) | Ordem cronológica dos eventos de navegação e depuração. |
| [rendering-strategies.md](angular-developer/references/rendering-strategies.md) | CSR, SSG (Prerendering) e SSR com hidratação. |
| [route-animations.md](angular-developer/references/route-animations.md) | Habilitação e customização da View Transitions API. |

**Acessibilidade**

| Referência | Descrição |
|------------|-----------|
| [angular-aria.md](angular-developer/references/angular-aria.md) | Construção de componentes acessíveis headless (Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid) e estilização de atributos ARIA. |

**Estilização e Animações**

| Referência | Descrição |
|------------|-----------|
| [tailwind-css.md](angular-developer/references/tailwind-css.md) | Integração do Tailwind CSS em projetos Angular. |
| [angular-animations.md](angular-developer/references/angular-animations.md) | Uso de CSS nativo (recomendado) ou DSL legado para efeitos dinâmicos. |

**Testes**

| Referência | Descrição |
|------------|-----------|
| [testing-fundamentals.md](angular-developer/references/testing-fundamentals.md) | Boas práticas para testes unitários (Vitest), padrões assíncronos e `TestBed`. |
| [component-harnesses.md](angular-developer/references/component-harnesses.md) | Padrões padronizados para interação robusta com componentes. |
| [router-testing.md](angular-developer/references/router-testing.md) | Uso de `RouterTestingHarness` para testes de navegação confiáveis. |
| [e2e-testing.md](angular-developer/references/e2e-testing.md) | Boas práticas para testes E2E com Cypress. |

**Ferramentas**

| Referência | Descrição |
|------------|-----------|
| [cli.md](angular-developer/references/cli.md) | Criação de aplicações, geração de código (componentes, rotas, serviços), build e serve. |

---

## Referência Rápida: Qual Skill Usar?

| Eu quero... | Use esta skill |
|-------------|----------------|
| Criar um novo projeto Angular do zero | `angular-new-app` |
| Gerar componentes, serviços ou pipes | `angular-developer` |
| Implementar formulários (Signal, reactive ou template-driven) | `angular-developer` |
| Configurar roteamento e navegação | `angular-developer` |
| Usar Signals, `linkedSignal` ou `resource` | `angular-developer` |
| Configurar injeção de dependências | `angular-developer` |
| Adicionar Tailwind CSS ou animações | `angular-developer` |
| Criar testes unitários ou E2E | `angular-developer` |
| Implementar SSR, SSG ou CSR | `angular-developer` |
| Construir componentes acessíveis (ARIA) | `angular-developer` |
