---
name: browse-to-smartx-migration
description: "Migrate or convert legacy Browse screens (MBrowse, AxCadastro, MarkBrowse), MVC FWFormBrowse/FWMBrowse views, or any traditional Protheus data-grid routine to the new native Smart X pattern (totvs.framework.structure classes with Model, View, and Executor). Use when user says 'migrate to SmartX', 'convert Browse', 'MBrowse to SmartX', 'modernize grid'."
license: MIT
metadata:
  domain: Protheus
  maintainer: Engenharia Protheus - Dados & DevOps
  author: Melkz Siqueira
  version: '4.1.0'
  category: Migration and Modernization
---

# Browse-to-SmartX Migration

## Overview

Convert legacy Protheus Browse implementations to the modern Smart X user experience. Smart X is TOTVS's next-generation UI framework built on PO-UI, providing a responsive data grid (dataView), modern forms (dataNew, dataEdit, dataDetail), legends, filters, table actions, and Knowledge Base integration — all rendered natively in the browser.

This skill handles **three source patterns** and converts them to **Native SmartX**:

### Source Patterns (What You're Converting FROM)

| Pattern | Technology | Identifying Constructs |
| --- | --- | --- |
| **Legacy MBrowse** | AdvPL procedural | `MBrowse()`, `AxCadastro()`, `AxPesqui()`, `aRotina` array, `Processa()` |
| **Legacy MarkBrowse / AxEnclose** | AdvPL procedural | `MarkBrowse()`, `AxEnclose()`, `Enchoice()`, `MsGetDB`, `MsNewGetDados` |
| **MVC Browse** | MVC Framework | `FWFormBrowse():New()` or `FWMBrowse():New()` with `ModelDef`, `ViewDef`, `MenuDef` |

### Migration Result

All source patterns are converted to **Native SmartX**: three new TLPP files (Model class, View class, Executor function) using `totvs.framework.structure` classes with the full Smart X feature set.

### Fundamental Migration Principle

> **Migration MUST be complete and total — every single behavior from the legacy code MUST be present in the migrated code.** ALL business rules MUST be migrated: sub-models, validations, triggers, initializers, custom actions, legends, filters, events, conditional logic, parameter checks, module checks, and **any other functional behavior regardless of type**. Use native SmartX mechanisms when they exist (`setObject`, `addArray`, `BuildAdvplAction`, `BuildEvents`, `loadEventsFromMetadata`, `serverValidate`). When no native SmartX mechanism exists for a behavior (e.g., `SuperGetMV` parameter checks, `FwAliasInDic`, `MPUserHasAccess`, `FWModeAccess`, module checks), implement it as **standard TLPP code inside the SmartX class methods** — the SmartX Model/View is a TLPP class and supports any valid TLPP code. **NEVER omit a behavior assuming SmartX handles it automatically** — only data dictionary metadata (SX3/SX7) is automatic. Entry Points, ExecAuto/MSExecAuto, and rotinas automáticas MUST continue working. No functionality may regress.

For detailed rules, see the [General Migration Principle](references/smartx-legacy-conversion-patterns.md#general-migration-principle-mandatory) in the conversion guide.

## When to Use

Use this skill when:

- Converting `MBrowse()`, `AxCadastro()`, or `MarkBrowse()` screens to Native Smart X
- Converting existing MVC `FWMBrowse`/`FWFormBrowse` routines to Native Smart X
- Building a full native Smart X CRUD from an existing legacy browse
- Replacing `FWFormView`/`FWFormModel` with native `totvs.framework.structure` classes
- Adding Smart X features (legends, table actions, Knowledge Base, AdvPL actions) to any browse
- Modernizing a Protheus routine's UI to PO-UI via the Smart X framework

---

## Native SmartX (Full Rewrite)

Native Smart X uses a three-file architecture: **Model Class** (data model), **View Class** (UI components), and **Executor Function** (entry point). All files must use `.tlpp` extension with proper annotations.

### Required Includes

```tlpp
// Model file
#include "totvs.ch"
#include "totvs.framework.structure.model.th"

// View file
#include "totvs.ch"
#include "totvs.framework.structure.interface.th"

// Executor file
#include "totvs.ch"
```

> **NOTE**: `fw-tlpp-core.th` is used in some official TDN examples but is NOT required when using `totvs.ch`. Prefer using only `totvs.ch` for simplicity.

For complete code templates (Single-Entity Model, Master-Detail Model, View classes with actions and events, Executor), see [smartx-code-templates.md](references/smartx-code-templates.md).

---

## Legacy Pattern Recognition & Conversion Guide

This section covers converting legacy patterns to Native Smart X:
- **MBrowse / AxCadastro** → Native SmartX
- **MarkBrowse / MsGetDB / MsNewGetDados** → Native SmartX with master-detail
- **MVC FWFormBrowse / FWMBrowse** → Native SmartX (full rewrite)

For detailed legacy code examples, conversion mapping tables, and before/after diffs, see [smartx-legacy-conversion-patterns.md](references/smartx-legacy-conversion-patterns.md).

---

## Smart X Interface Features

The native Smart X interface supports legends (3 approaches: automatic, explicit colors, manual bind), table actions (Knowledge Base, custom AdvPL), events (KeyDown), visual components (dividers, radio groups, element ordering), and field properties (hidden, autoInc, readOnly).

For complete code examples and the SmartX label color table, see [smartx-interface-features.md](references/smartx-interface-features.md).

---

## Complete Sub-Model Migration (MANDATORY)

> **Application of the [Fundamental Migration Principle](#fundamental-migration-principle):** This section details the complete migration of sub-models. ALL sub-models, including conditional and dynamic ones, MUST be migrated. ALL associated business rules (validations, triggers, InstallEvent, custom actions) MUST be migrated or made compatible. **Conditional logic** (parameter checks, access control, module checks) MUST be replicated as standard TLPP code inside the SmartX `setModel()` method — the SmartX framework does NOT resolve these conditions automatically.

**Every sub-model** present in the legacy MVC `ModelDef` MUST be mapped to the Smart X native Model class. No sub-model may be marked as "out of scope" — incomplete migrations are not acceptable.

### Sub-Model Mapping Rules

| MVC Pattern | SmartX Native Equivalent | Use When |
| --- | --- | --- |
| `oModel:AddFields("ID", "PARENT", oStruct)` | `::addObject(oObj:getObject(), "ALIAS", aFK, aPK, "PARENT_ALIAS")` | 1:1 relationship (form fields sub-model) |
| `oModel:AddGrid("ID", "PARENT", oStruct)` | `::addArray(oObj:getObject(), "ALIAS", aFK, aPK, "PARENT_ALIAS")` | 1:N relationship (grid items sub-model) |
| `oModel:SetRelation("ID", aRelation, cOrder)` | Relationship keys in `addObject`/`addArray` parameters | Relationship definition |
| `oModel:GetModel("ID"):SetOptional(.T.)` | No direct equivalent — all entities are treated by the framework. **Still MUST be migrated** — SmartX handles visibility automatically | Optional sub-model (still mandatory to migrate) |
| `If lMATA180 .And. ...` (conditional load) | Wrap `addObject`/`addArray` inside `If/Else` with the **same condition** from legacy code | Conditional sub-model — replicate condition in TLPP |
| `SuperGetMV("MV_CADPROD")` (parameter check) | `SuperGetMv("MV_CADPROD")` inside `setModel()` — standard TLPP | Parameter-controlled sub-model |
| `FwAliasInDic("XXX")` (table existence) | `FwAliasInDic("XXX")` inside `setModel()` — standard TLPP | Table existence guard |
| `FWModeAccess("SB1",3) == "C"` (sharing) | `FWModeAccess("SB1",3)` inside `setModel()` — standard TLPP | Sharing mode guard |

### Identifying Sub-Models in Legacy Code

Search for ALL of these patterns in the source file:

1. **Direct in ModelDef**: `AddFields(`, `AddGrid(` calls
2. **Dynamic sub-models**: Functions like `Model180()`, `Model019()`, `Model061()` that call `AddFields`/`AddGrid` on the model after `ModelDef`
3. **Conditional sub-models**: Sub-models loaded based on `VerifyAccess()`, parameters (`SuperGetMV`), module checks (`nModulo`), table existence (`FwAliasInDic`), table sharing mode (`FWModeAccess`), feature flags (`FindFunction`), or any other runtime condition — **ALL conditions MUST be replicated as standard TLPP code** inside the SmartX `setModel()` method
4. **Event-based sub-models**: `InstallEvent()` calls that attach business logic classes

### Example: Complete Model with Multiple Sub-Models

```tlpp
method setModel() class Model
local oSB1 as object
local oSB5 as object
local oSA5 as object
local oSBZ as object
local oSVK as object

// Primary entity
oSB1 := ObjectFromMetadata():new("SB1")
::setObject(oSB1:getObject(), "SB1")

// 1:1 - Complemento de Produto (was AddFields "SB5DETAIL")
oSB5 := ObjectFromMetadata():new("SB5")
::addObject(oSB5:getObject(), "SB5", {"B5_FILIAL", "B5_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")

// 1:1 - Complemento PCP (was AddFields "SVKDETAIL")
oSVK := ObjectFromMetadata():new("SVK")
::addObject(oSVK:getObject(), "SVK", {"VK_FILIAL", "VK_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")

// 1:N - Produto x Fornecedor (was AddGrid "MdGridSA5")
oSA5 := ObjectFromMetadata():new("SA5")
::addArray(oSA5:getObject(), "SA5", {"A5_FILIAL", "A5_PRODUTO"}, {"B1_FILIAL", "B1_COD"}, "SB1")

// 1:N - Indicadores por Filial (was AddGrid "SBZDETAIL")
oSBZ := ObjectFromMetadata():new("SBZ")
::addArray(oSBZ:getObject(), "SBZ", {"BZ_COD"}, {"B1_COD"}, "SB1")

return
```

### Extracting Relationship Keys from Legacy Code

The relationship keys come from the MVC `SetRelation` call:

```advpl
// Legacy MVC:
oModel:SetRelation('SB5DETAIL', { { 'B5_FILIAL', 'xFilial("SB5")' }, { 'B5_COD', 'B1_COD' } }, SB5->(IndexKey(1)))
```

Maps to SmartX:
```tlpp
// aFK (foreign keys in child)  = {"B5_FILIAL", "B5_COD"}
// aPK (parent keys in parent)  = {"B1_FILIAL", "B1_COD"}
::addObject(oSB5:getObject(), "SB5", {"B5_FILIAL", "B5_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")
```

**Rule**: Ignore `xFilial()` expressions — use the raw field name from the first element of each relationship pair.

---

## ExecAuto / Rotina Automática Compatibility (MANDATORY)

The migration to native SmartX **MUST NOT break** existing ExecAuto / MSExecAuto / rotina automática integrations. These are programmatic interfaces used by other routines, imports (MILE), and automated tests.

### Architecture: SmartX + MVC Coexistence

```
┌─────────────────────────────────────────────────────────────┐
│ Smart X Native (NEW)          │ MVC Layer (PRESERVED)       │
│                               │                             │
│ Model class (.tlpp)           │ ModelDef() (kept in .prx)   │
│ View class (.tlpp)            │ ViewDef()  (kept in .prx)   │
│ Executor function (.tlpp)     │ MenuDef()  (kept in .prx)   │
│                               │                             │
│ Used by: Smart X UI (browser) │ Used by: ExecAuto,          │
│          PO-UI rendering      │          FWLoadModel,       │
│          launcher():show()    │          FWExecView,        │
│                               │          Entry Points,      │
│                               │          External callers   │
└─────────────────────────────────────────────────────────────┘
```

### Rules

1. **NEVER delete or modify** the existing `ModelDef`, `ViewDef`, `MenuDef` functions in the legacy source file.
2. **NEVER delete or modify** the wrapper function (e.g., `MATA010M(xRotAuto, nOpc)`) — it handles ExecAuto routing.
3. **NEVER delete or modify** the `A010Auto()` or equivalent ExecAuto handler function.
4. The SmartX native files (Model, View, Executor) are **additive** — they exist alongside the MVC code.
5. The Executor function replaces only the **menu entry** for UI access. The old function (`MATA010M`) continues to be called for programmatic access.
6. If the legacy source has `If ValType(xRotAuto) == "A" ... A010Auto(nOpcAuto, xRotAuto)`, this code path MUST remain functional.

### What to Preserve in Legacy Source

| Component | Preserve? | Reason |
| --- | --- | --- |
| `Function MATA010M(xRotAuto, nOpc)` | **YES** | ExecAuto entry point |
| `Static Function ModelDef()` | **YES** | Model definition used by FWLoadModel |
| `Static Function ViewDef()` | **YES** | View definition used by FWExecView |
| `Static Function MenuDef()` | **YES** | Menu used by FWMVCMenu |
| `Static Function A010Auto()` | **YES** | ExecAuto processor |
| `Static Function BrowseDef()` | **YES** (if Entry Points depend on it) | Preserve if browse-level PEs (filters, legends) depend on it. Can be replaced by Executor ONLY if no PE relies on the legacy browse |
| `MTA010VldActivate` / event functions | **YES** | Sub-model loading logic |
| All `Static Function Model*()` sub-model loaders | **YES** | Dynamic sub-model addition |

### Menu Configuration

After migration:
- The **Protheus menu** should point to the new Executor function (e.g., `executor` from `totvs.protheus.mat.smartx.produtos`)
- The old wrapper function (e.g., `MATA010M`) should **remain compilable** and callable for ExecAuto
- If the old menu entry pointed to `MATA010`, create the executor file (with the standard `Function executor()` — never rename the function) and update the menu to point to the new namespace

---

## Entry Point Preservation (MANDATORY)

All existing entry points (Pontos de Entrada) MUST continue working after migration. The migration strategy depends on where the entry point is triggered.

### Entry Point Categories

| Category | Examples | Preservation Strategy |
| --- | --- | --- |
| **Browse filter PEs** | `MA010FIL`, `M010FILB` | Preserved via `BrowseDef()` in legacy source (unchanged) |
| **Browse legend PEs** | `MT010COR` | Preserved via `BrowseDef()` + `AddLegend` in legacy source |
| **MVC model PEs** | `FORMCOMMITTTSPRE`, `MODELCOMMITNTTS` | Preserved via `ModelDef()` in legacy source (unchanged) |
| **Menu PEs** | `MTA010MNU` | Preserved via `MenuDef()` in legacy source |
| **Keyboard PEs** | `MT010BRW` | Preserved via legacy browse; add equivalent `BuildEvents` in SmartX View |
| **Validation PEs** | `MT010VLD`, `MT010CAN` | Preserved via legacy CRUD functions |
| **Custom button PEs** | `MA010BUT` | Preserved via legacy view; add equivalent `BuildAdvplAction` in SmartX View |

### Rules

1. **NEVER remove** `ExistBlock()` checks or `ExecBlock()` calls from the legacy source.
2. **NEVER remove** `Static lXXX := ExistBlock("PE_NAME")` declarations.
3. For PEs that provide browse-level functionality (filters, legends, menu), the **legacy BrowseDef/MenuDef continues to serve** users accessing via SmartClient while the SmartX Executor serves PO-UI users.
4. For PEs that provide model-level functionality (validations, commits), the **legacy ModelDef continues to serve** both SmartX and SmartClient since `FWLoadModel` is shared.
5. Custom actions triggered by PEs MUST be **replicated** in the SmartX View using `BuildAdvplAction`. If a native SmartX equivalent is not available, the action MUST remain functional via the preserved legacy code.

---

## Cross-Reference: smartx-generator Skill

Before generating the migrated Smart X code, **always read and follow the definitions from the `smartx-generator` skill** ([SKILL.md](../smartx-generator/SKILL.md)). The migration output must comply with the same architecture, templates, naming conventions, and generation workflow defined there.

Specifically, consult the `smartx-generator` and its reference files for:

- **Three-file architecture** — Model, View, and Executor structure and skeleton templates
- **Naming conventions** — Namespace patterns (`totvs.protheus.{module}.smartx.{entity}`), file naming, class names (`Model`, `View`)
- **Model reference** ([smartx-model-reference.md](../smartx-generator/references/smartx-model-reference.md)) — `ObjectFromMetadata():new("ALIAS")`, `setObject`/`addArray`, model API methods
- **Interface reference** ([smartx-interface-reference.md](../smartx-generator/references/smartx-interface-reference.md)) — `buildStandardView()`, actions, events, visual components
- **Validation & troubleshooting** ([smartx-validation-and-troubleshooting.md](../smartx-generator/references/smartx-validation-and-troubleshooting.md)) — Server-side field validation contract and common issues
- **Generation checklist & SonarQube compliance** — All checklist items and SonarQube rules from the generator apply equally to migrated code

> **Rule:** The migrated Smart X code must be indistinguishable from code generated from scratch by the `smartx-generator` skill. If there is any conflict between this skill's migration guidance and the `smartx-generator` definitions, the `smartx-generator` definitions take precedence for the generated output.

---

## Migration Checklist

**Model Class:**

- [ ] File uses `.tlpp` extension
- [ ] File named following `{module}.smartx.{entity}.model.tlpp` convention (e.g. `mat.smartx.produtos.model.tlpp`) — **NEVER** `MATA010SXModel.tlpp`, `totvs.mata010sx.model.tlpp`, or any form using the Protheus routine name as entity
- [ ] `{module}` = first 3 lowercase letters of the routine prefix (e.g. `MATA010` → `mat`); `{entity}` = semantic business name of the main entity as a single lowercase word, no separators (e.g. `produtos`, `titulospagar`, `pedidoscompra`) — **NEVER** the routine name itself (e.g. `mata010`, `mata010sx`)
- [ ] Includes: `totvs.ch`, `totvs.framework.structure.model.th` (`fw-tlpp-core.th` optional)
- [ ] `using namespace totvs.framework.structure.object` declared
- [ ] Namespace follows `totvs.protheus.{module}.smartx.{entity}` convention
- [ ] `@totvsFrameworkStructureModel(description="...")` annotation — `description` required; `lookup` and `country` optional
- [ ] Class name is `Model`, extends `totvs.framework.structure.model.data`
- [ ] Method implementations use bare `method` keyword — NO `public`, `private`, `protected`, or `static` prefix (e.g., `method new() as object class Model`, NEVER `public method new() as object class Model`)
- [ ] `_Super:new(,,.T.)` called in constructor
- [ ] `ObjectFromMetadata():new("ALIAS")` — only table alias required
- [ ] `::setObject()` called for primary entity
- [ ] `::addObject()` called for each 1:1 related entity with correct relationship keys (MVC `AddFields` equivalent)
- [ ] `::addArray()` called for each 1:N child grid entity with relationship keys (MVC `AddGrid` equivalent)
- [ ] **ALL sub-models from legacy ModelDef are mapped** — none omitted

**View Class:**

- [ ] File uses `.tlpp` extension
- [ ] File named following `{module}.smartx.{entity}.view.tlpp` convention (e.g. `mat.smartx.produtos.view.tlpp`) — **NEVER** `MATA010SXView.tlpp` or similar
- [ ] Includes: `totvs.ch`, `totvs.framework.structure.interface.th` (`fw-tlpp-core.th` optional)
- [ ] `using namespace totvs.framework.structure.interface` declared
- [ ] Same namespace as model file
- [ ] `@totvsFrameworkStructureInterface(description="...")` annotation — `description` required; `lookup` and `country` optional
- [ ] Class name is `View`
- [ ] Method implementations use bare `method` keyword — NO access modifiers or `static` prefix
- [ ] `BuildContract():new("ALIAS")` creates contract with main table alias
- [ ] `setModelId()` points to the correct model namespace (ending in `.model`)
- [ ] `buildStandardView()` called for automatic layout
- [ ] Custom actions added via `BuildAdvplAction` if the legacy source has custom actions or menu entries (after `buildStandardView()`)
- [ ] Events added via `BuildEvents` if the legacy source has keyboard events or `SetKey()` shortcuts
- [ ] `getContract()` returns `::oInterface:getContract()`

**Executor Function:**

- [ ] File uses `.tlpp` extension
- [ ] File named following `{module}.smartx.{entity}.executor.tlpp` convention (e.g. `mat.smartx.produtos.executor.tlpp`) — **NEVER** `MATA010SX.tlpp` or similar
- [ ] **Function name is ALWAYS `executor()`** — **NEVER** rename it to match the legacy routine name (e.g., `{ROTINA}SX()`) or any other custom name. The SmartX framework resolves the routine by namespace, not by function name. The function MUST be `Function executor()`
- [ ] `#include "totvs.ch"` only
- [ ] `using namespace totvs.framework.application.smartx` declared
- [ ] Same namespace as model/view files
- [ ] Uses `launcher():show("namespace.view")` — single method call
- [ ] **NEVER** wrap executor in `Try-Catch` or call `MsgAlert`/`MsgInfo` — the executor is a single-line delegation; error handling is the framework's responsibility
- [ ] Function name added to the Protheus menu

**ExecAuto / Compatibility:**

- [ ] Legacy wrapper function (e.g., `MATA010M(xRotAuto, nOpc)`) preserved and compilable
- [ ] Legacy `ModelDef` preserved — `FWLoadModel()` continues working
- [ ] Legacy `ViewDef` preserved — `FWExecView()` continues working
- [ ] Legacy `MenuDef` preserved — `FWMVCMenu()` continues working
- [ ] ExecAuto handler (e.g., `A010Auto()`) preserved and functional
- [ ] All sub-model loader functions preserved in legacy source

**Entry Points:**

- [ ] All `ExistBlock()` / `ExecBlock()` calls preserved in legacy source
- [ ] Browse-level PEs continue working via preserved `BrowseDef`
- [ ] Model-level PEs continue working via preserved `ModelDef`
- [ ] Custom actions from menu PEs replicated as `BuildAdvplAction` in SmartX View for ALL legacy PEs with custom actions

**General:**

- [ ] All `.tlpp` files include `{Protheus.doc}` documentation blocks
- [ ] Old legacy source file backed up or versioned before replacement
- [ ] New SmartX routine tested: browse loads, legends display, CRUD operations work
- [ ] Master-detail: items grid loads, items can be added/edited/deleted
- [ ] ExecAuto tested: programmatic CRUD operations work as before

---

## Post-Migration Gap Analysis (MANDATORY)

After generating all SmartX files and passing the Migration Checklist, execute a **complete gap analysis** before reporting to the user. This step prevents silent omissions — the most common migration defect.

### Step 1: Build Legacy Feature Inventory

Re-read the ENTIRE legacy source and extract every feature into a structured list:

| Category | Items to Extract |
|---|---|
| **Model (setModel)** | Sub-models with ALL activation conditions (`VerifyAccess` real values, `SuperGetMv`, `FWModeAccess`, `FwAliasInDic`, `FindFunction`, `nModulo`), `setUniqueLine`, `setDeleteAllLines`, virtual fields (`FWBuildFeature`), field initializers, triggers, `SetOptional` |
| **View (setInterface)** | Form panels, field removals, field actions (`HasButton`), user buttons (`AddUserButton`), `GotFocus`/`LostFocus` handlers, visual components, percentage layout |
| **Menu (MenuDef)** | All entries including conditional actions (by module, country, parameter, feature flag) |
| **Browse (BrowseDef)** | Legends (`AddLegend`), filters (`SetFilterDefault`), keyboard shortcuts (`SetKey`), totals (`SetTotalDefault`), chart (`SetOpenChart`) |
| **Entry Points** | All `ExistBlock`/`ExecBlock` with PE name and trigger location |
| **Integrations** | `InstallEvent` classes, ExecAuto handler, Shopify, TAF, SFC, DPR, etc. |

### Step 2: Cross-Reference with SmartX Code

For EACH item, classify:

| Status | Meaning | Action |
|---|---|---|
| ✅ Migrated | Present in SmartX with behavioral parity | None |
| ⚠️ Not-migratable | No SmartX native equivalent | Justify with framework docs; confirm legacy code preserves it |
| 🔄 Preserved in legacy | Works via ModelDef/ViewDef/BrowseDef | Confirm legacy is untouched |
| ❌ Omitted | NOT migrated but HAS SmartX equivalent | **MUST fix before reporting** |

### Step 3: Fix ❌ Items

If ANY item is ❌:
1. Implement the missing feature
2. Re-validate the affected checklist items
3. Re-classify the item as ✅

### Step 4: Present to User

Include the gap analysis in the migration report with counts:
- Total features: N
- ✅ Migrated: N | ⚠️ Not-migratable: N | 🔄 Preserved: N | ❌ Omitted: 0

**The migration is NOT complete until ❌ count = 0.**

Include the migration timing in the final report:
- **Start:** `YYYY-MM-DD HH:MM:SS` — exact timestamp captured via `date +"%Y-%m-%d %H:%M:%S"` at migration start
- **End:** `YYYY-MM-DD HH:MM:SS` — exact timestamp captured via `date +"%Y-%m-%d %H:%M:%S"` at report generation
- **Total duration:** calculated from real timestamps — e.g., `2h 14min 37s`

> **Timing rule:** At the very first migration action (Phase 0), run `date +"%Y-%m-%d %H:%M:%S"` in the terminal and save the output to session memory. At the end (Phase 5.5), run `date +"%Y-%m-%d %H:%M:%S"` again and compute the difference. Use `date -d "<timestamp>" +%s` to convert to seconds, subtract, then format as `Xh Ymin Zs`. **NEVER** use vague values like "início da sessão", "same session", or date-only without time — these are considered incorrect and incomplete. If the migration is interrupted and resumed, record it as separate sessions and show the cumulative total.

### Common Omissions (items frequently missed but with SmartX support)

These items are the most commonly omitted during migration. Always verify them explicitly:

- **Parameter signature compatibility** — `BuildAdvplAction:setParams` sends each array element as a **separate positional argument**. Legacy codeblocks have unrestricted parameter passing. When converting ANY codeblock-based action (`AddUserButton`, `aRotina`, `SetKey`) to `BuildAdvplAction`, verify the target function's expected signature. If there is a mismatch, create a **wrapper method** in the View class
- `VerifyAccess()` — using **real array values** from the function return, NOT hardcoded `.T.`
- `FWModeAccess("TABLE", 3) == "C"` — table sharing mode guard for conditional sub-models
- `SetKey()` keyboard shortcuts (F4, F12, etc.) → `BuildEvents():addOnKeyDown()`
- User buttons from `ViewDef` (`AddUserButton`) → `BuildAdvplAction` in SmartX View
- Field removals from `ViewDef` → `addProperty("hidden", .T.)` in SmartX View
- Conditional menu actions (by `nModulo`, `cPaisLoc`, `SuperGetMv`, `FindFunction`)
- `FwFreeObj()` after each `ObjectFromMetadata` use in `setModel()`
- **Every `method X(...) class MyClass` in the implementation has a matching `method X()` inside `class MyClass`/`endclass`** — missing prototype causes fatal `C2021` (prototype uses empty `()`, params/return only in implementation)

---

## Common Pitfalls

For the complete troubleshooting table (common issues with causes and fixes), see [smartx-troubleshooting.md](references/smartx-troubleshooting.md).

---

- **FWMBrowse - Abertura do browse utilizando Smart X**: https://tdn.totvs.com/display/FRAMESPSQDS/FWMBrowse+-+Abertura+do+browse+utilizando+Smart+X
- **Construindo uma rotina do zero com Smart X**: https://tdn.totvs.com/display/FRAMESPSQDS/Construindo+uma+rotina+do+zero+com+Smart+X
- **Adicionando legendas à sua rotina**: https://tdn.totvs.com/pages/viewpage.action?pageId=944702265
- **Criação de um modelo de dados**: https://tdn.totvs.com/pages/viewpage.action?pageId=900448638
- **Criação de uma interface**: https://tdn.totvs.com/pages/viewpage.action?pageId=900727251
- **Smart X (main page)**: https://tdn.totvs.com/display/FRAMESPSQDS/Smart+X
