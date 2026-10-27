---
name: smartx-generator
description: "Generate native Smart X TLPP routines from scratch using the totvs.framework.structure classes. Produces three files: Model class (totvs.framework.structure.model.data), View class (totvs.framework.structure.interface), and Executor function. Supports single-entity CRUD and master-detail patterns with legends, table actions, visual components, field properties, and Knowledge Base integration. Use when user says 'create SmartX screen', 'new Smart X routine', 'generate SmartX CRUD', 'native SmartX', 'totvs.framework.structure', 'SmartX from scratch'."
license: MIT
metadata:
  domain: Protheus
  maintainer: Engenharia Protheus - Dados & DevOps
  author: Melkz Siqueira
  version: '4.1.0'
  category: Code Generation
---

# Smart X Generator

## Overview

Generate complete native Smart X TLPP source code for Protheus routines from scratch. Smart X is TOTVS's next-generation UI framework built on PO-UI that renders responsive data grids, modern forms, legends, filters, table actions, and Knowledge Base integration — all natively in the browser using metadata-driven contracts.

This skill produces the **three mandatory TLPP files** that compose a native Smart X routine:

```
┌────────────────────────────────────────────────────────────┐
│ Executor Function (.tlpp)                                   │
│  └─ launcher():show("namespace.view")                      │
├────────────────────────────────────────────────────────────┤
│ View Class (.tlpp)                                         │
│  @totvsFrameworkStructureInterface annotation               │
│  ├─ BuildContract → setModelId → buildStandardView()       │
│  └─ (optional) BuildAdvplAction, BuildEvents, legends      │
├────────────────────────────────────────────────────────────┤
│ Model Class (.tlpp)                                        │
│  @totvsFrameworkStructureModel annotation                   │
│  extends totvs.framework.structure.model.data              │
│  ├─ setObject() → primary entity (header)                  │
│  └─ addArray() → detail entities (grid items)              │
└────────────────────────────────────────────────────────────┘
```

## When to Use

Use this skill when:

- Creating a **new** Smart X routine from scratch (no existing code to migrate)
- Building a native Smart X CRUD screen for a Protheus table
- Generating a master-detail Smart X form (e.g., order header + items)
- Building a Smart X interface with legends, table actions, or visual components
- Creating modern PO-UI-based screens using the `totvs.framework.structure` classes

**Do NOT use this skill when:**

- Migrating an existing Browse or MVC screen to Smart X → use `browse-to-smartx-migration`
- Creating a traditional MVC screen (ModelDef/ViewDef/MenuDef) → use `mvc-generator`
- Creating REST endpoints → use `tlpp-rest-endpoint-generator`

---

## Smart X Architecture

### Three-File Structure

Every native Smart X routine requires three source files:

| File | Purpose | Extension | Key Classes |
| --- | --- | --- | --- |
| **Model** | Data model definition — entities, relationships | `.tlpp` | `totvs.framework.structure.model.data`, `ObjectFromMetadata` |
| **View** | UI contract — browse, forms, legends, actions | `.tlpp` | `BuildContract`, `buildStandardView()`, `BuildAdvplAction`, `BuildEvents` |
| **Executor** | Menu entry point — launches the view | `.tlpp` | `totvs.framework.application.smartx.launcher` |

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

### Using Namespace

Each file must declare the appropriate `using namespace`:

```tlpp
// Model file
using namespace totvs.framework.structure.object

// View file
using namespace totvs.framework.structure.interface

// Executor file
using namespace totvs.framework.application.smartx
```

### Naming Convention

**CRITICAL — two distinct concepts, do NOT confuse them:**

| Concept | Pattern | Example (materials module, entity `produtos`) |
| --- | --- | --- |
| **File name** (on disk) | `{module}.smartx.{entity}.{type}.tlpp` | `mat.smartx.produtos.model.tlpp` |
| **`namespace` declaration** (inside the file) | `totvs.protheus.{module}.smartx.{entity}` | `totvs.protheus.materials.smartx.produtos` |

The file name NEVER starts with `totvs.` — it always starts with the short module abbreviation (e.g. `mat`, `fin`, `cmp`). The `namespace` declaration is a statement written inside the `.tlpp` source code, not the file name.

**How to derive `{module}` and `{entity}` from a Protheus routine name:**

Given a routine like `MATA010`:
- `{module}` = first 3 lowercase letters of the routine prefix → `mat` (from `MAT`)
- `{entity}` = semantic name of the main entity managed by the routine → `produtos` (SB1/products), **NOT** the routine name itself

| Routine | `{module}` | `{entity}` | Correct file name |
| --- | --- | --- | --- |
| `MATA010` | `mat` | `produtos` | `mat.smartx.produtos.model.tlpp` |
| `FINA138` | `fin` | `titulospagar` | `fin.smartx.titulospagar.model.tlpp` |
| `CMPA020` | `cmp` | `pedidoscompra` | `cmp.smartx.pedidoscompra.model.tlpp` |

`{entity}` must be a single lowercase word with no separators (no hyphens, no underscores, no camelCase) — concatenate words directly (e.g. `titulospagar`, not `titulos-pagar` or `titulosPagar`). **NEVER** use the Protheus routine name directly as `{entity}` (e.g. `mata010`, `mata010sx`, `fina138`). The entity name must reflect the business concept, not the routine code.

All three files (model, view, executor) follow the same naming rule:

| Component | File Name | `namespace` Declaration |
| --- | --- | --- |
| Model | `{module}.smartx.{entity}.model.tlpp` | `namespace totvs.protheus.{module}.smartx.{entity}` |
| View | `{module}.smartx.{entity}.view.tlpp` | `namespace totvs.protheus.{module}.smartx.{entity}` |
| Executor | `{module}.smartx.{entity}.executor.tlpp` | `namespace totvs.protheus.{module}.smartx.{entity}` |

All three files share the same namespace declaration. The class names are always `Model` and `View`. The executor is a standalone function.

---

## Bundled Reference Files

This skill uses progressive disclosure. The SKILL.md body covers the generation workflow, decision logic, and essential templates. Detailed templates, API references, and troubleshooting are in the `references/` directory — read them on demand based on the scenario:

| Reference File | When to Read | Content |
| --- | --- | --- |
| [references/smartx-model-reference.md](references/smartx-model-reference.md) | Generating **model classes** — single entity or master-detail, looking up model API methods | Full model templates (Naturezas/SED single-entity, TES/SF4+CC7 master-detail), `ObjectFromMetadata` usage, `setObject`/`addArray`, model API table |
| [references/smartx-interface-reference.md](references/smartx-interface-reference.md) | Generating **view classes** — automatic layout with `buildStandardView()`, adding menu/actions, legends, events, visual components | Full view templates (Naturezas/SED simple, Produtos/SB1 with menu, TES master-detail), legend approaches, actions, events, components |
| [references/smartx-validation-and-troubleshooting.md](references/smartx-validation-and-troubleshooting.md) | Adding **server-side field validation** or debugging Smart X issues | Validation JSON contract, validation function signature, troubleshooting table |

> Also refer to [references/sonarqube-rules-reference.md](../references/sonarqube-rules-reference.md) for the complete SonarQube rules reference shared across skills.

---

## Generation Workflow

### Step 1: Gather Requirements

Determine the generation pattern from the user's request:

| Scenario | Model Pattern | View Pattern |
| --- | --- | --- |
| Simple CRUD (single table) | Single-entity model (`setObject`) | `buildStandardView()` |
| CRUD with custom actions/menu | Single-entity model (`setObject`) | `buildStandardView()` + `BuildAdvplAction` + `BuildEvents` |
| Master-detail (different tables) | Header + items (`setObject` + `addArray`) | `buildStandardView()` |
| Master-detail with custom actions | Header + items (`setObject` + `addArray`) | `buildStandardView()` + custom actions |

Read the appropriate reference files based on the pattern identified:
- **Model pattern** → read [references/smartx-model-reference.md](references/smartx-model-reference.md)
- **View pattern** → read [references/smartx-interface-reference.md](references/smartx-interface-reference.md)
- **Legends, actions, components** → read [references/smartx-interface-reference.md](references/smartx-interface-reference.md) (features section)
- **Validation or debugging** → read [references/smartx-validation-and-troubleshooting.md](references/smartx-validation-and-troubleshooting.md)

### Step 2: Generate Model File

The model class extends `totvs.framework.structure.model.data` and defines entities and their relationships.

**Single-entity model** (e.g., Naturezas/SED):

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.model.th"

namespace totvs.protheus.financial.smartx.naturezas

using namespace totvs.framework.structure.object

@totvsFrameworkStructureModel(description="Cadastro de Naturezas")
class Model from totvs.framework.structure.model.data
    public method new() as object
    public method setModel()
endclass

method new() as object class Model
_Super:new(,,.T.)
return self

method setModel() class Model
local oObject as object

oObject := ObjectFromMetadata():new("SED")
::setObject(oObject:getObject(), "SED")

return
```

**Master-detail model** (e.g., TES/SF4+CC7):

```tlpp
method setModel() class Model
local oSF4 as object
local oCC7 as object

oSF4 := ObjectFromMetadata():new("SF4")
::setObject(oSF4:getObject(), "SF4")

oCC7 := ObjectFromMetadata():new("CC7")
::addArray(oCC7:getObject(), "CC7", {"CC7_FILIAL", "CC7_TES"}, {"F4_FILIAL", "F4_CODIGO"}, "SF4")

return
```

> For 1:1 related entities (equivalent to MVC `AddFields`), use `::addObject()` instead of `::addArray()`. See [references/smartx-model-reference.md](references/smartx-model-reference.md) for the complete template.

> Read the full model templates in [references/smartx-model-reference.md](references/smartx-model-reference.md).

### Step 3: Generate View File

The view class defines the UI contract. Use `buildStandardView()` for automatic layout generation.

**Simple view** (e.g., Naturezas/SED):

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.interface.th"

namespace totvs.protheus.financial.smartx.naturezas

using namespace totvs.framework.structure.interface

@totvsFrameworkStructureInterface(description="Cadastro de Naturezas")
class View
    private data oInterface as object

    public method new() as object
    public method setInterface()
    public method getContract() as json
endclass

method new() as object class View
return self

method setInterface() class View
::oInterface := BuildContract():new("SED")
::oInterface:setModelId("totvs.protheus.financial.smartx.naturezas.model")
::oInterface:buildStandardView()
return

method getContract() as json class View
return ::oInterface:getContract()
```

> Read the full view templates (including menu, actions, events, master-detail) in [references/smartx-interface-reference.md](references/smartx-interface-reference.md).

### Step 4: Generate Executor Function

The executor is always the same pattern — a single function call:

```tlpp
#include "totvs.ch"

namespace totvs.protheus.financial.smartx.naturezas

using namespace totvs.framework.application.smartx

//-------------------------------------------------------------------
/*/{Protheus.doc} executor
Abre a rotina Smart X para cadastro da SED

@type function
/*/
//-------------------------------------------------------------------
function executor()
return launcher():show("totvs.protheus.financial.smartx.naturezas.view")
```

> **Important:** After creating the three files (Model, View, Executor), compile them and add the Executor function name to the Protheus menu.

---

## Generation Checklist

### Model File

- [ ] File extension is `.tlpp`
- [ ] File named following `{module}.smartx.{entity}.model.tlpp` convention (e.g. `mat.smartx.produtos.model.tlpp`) — **NEVER** `MATA010SXModel.tlpp` or similar
- [ ] `#include "totvs.ch"` present
- [ ] `#include "totvs.framework.structure.model.th"` present
- [ ] `fw-tlpp-core.th` is optional (not required when using `totvs.ch`)
- [ ] `using namespace totvs.framework.structure.object` declared
- [ ] Namespace declared following `totvs.protheus.{module}.smartx.{entity}` convention
- [ ] `@totvsFrameworkStructureModel(description="...")` annotation — `description` required; `lookup` and `country` optional
- [ ] Class name is `Model`, extends `totvs.framework.structure.model.data`
- [ ] Method implementations use bare `method` keyword — NO `public`, `private`, `protected`, or `static` prefix (e.g., `method new() as object class Model`, NEVER `public method new() as object class Model`)
- [ ] `new()` calls `_Super:new(,,.T.)`
- [ ] `setModel()` creates `ObjectFromMetadata():new("ALIAS")` for each entity
- [ ] `::setObject()` called for the primary entity
- [ ] `::addArray()` called for each detail/grid entity with correct relationship keys (if master-detail)
- [ ] `::addObject()` called for each 1:1 related entity with correct relationship keys (if applicable)
- [ ] Every `ObjectFromMetadata():new("ALIAS")` result is destroyed with `FwFreeObj()` at the end of `setModel()` — **NEVER** leave objects unreleased
- [ ] `SuperGetMv()`/`GetMv()` calls are cached in a local variable **before** any loop — **NEVER** call them inside a loop (CA1003)

### View File

- [ ] File extension is `.tlpp`
- [ ] File named following `{module}.smartx.{entity}.view.tlpp` convention (e.g. `mat.smartx.produtos.view.tlpp`) — **NEVER** `MATA010SXView.tlpp` or similar
- [ ] `#include "totvs.ch"` present
- [ ] `#include "totvs.framework.structure.interface.th"` present
- [ ] `fw-tlpp-core.th` is optional (not required when using `totvs.ch`)
- [ ] `using namespace totvs.framework.structure.interface` declared
- [ ] Same namespace as model file
- [ ] `@totvsFrameworkStructureInterface(description="...")` annotation — `description` required; `lookup` and `country` optional
- [ ] Class name is `View`
- [ ] Method implementations use bare `method` keyword — NO `public`, `private`, `protected`, or `static` prefix (e.g., `method showResume() class View`, NEVER `static method showResume() class View`)
- [ ] `setInterface()` creates `BuildContract():new("ALIAS")` with the main table alias
- [ ] `setModelId()` references the model namespace (ending in `.model`, NOT the class name)
- [ ] `buildStandardView()` called for automatic layout
- [ ] `getContract()` returns `::oInterface:getContract()`

### Executor File

- [ ] File extension is `.tlpp`
- [ ] File named following `{module}.smartx.{entity}.executor.tlpp` convention (e.g. `mat.smartx.produtos.executor.tlpp`) — **NEVER** `MATA010SX.tlpp` or similar
- [ ] **Function name is ALWAYS `executor()`** — **NEVER** rename it to match the legacy routine name (e.g., `{ROTINA}SX()`) or any other custom name. The SmartX framework resolves the routine by namespace, not by function name. The function MUST be `Function executor()`
- [ ] `#include "totvs.ch"` present
- [ ] `using namespace totvs.framework.application.smartx` declared
- [ ] Same namespace as model/view files
- [ ] Uses `launcher():show("namespace.view")` — single method call
- [ ] The view namespace in `show()` matches the View class namespace (ending in `.view`, NOT the class name)
- [ ] **NEVER** wrap executor in `Try-Catch` or call `MsgAlert`/`MsgInfo` — the executor is a single-line delegation; error handling is the framework's responsibility

### General

- [ ] Every `method X(...) class MyClass` in the implementation has a matching `method X()` inside `class MyClass`/`endclass` — missing prototype causes fatal `C2021`; prototype declarations use empty `()` (params/return type in implementation only)
- [ ] All three files compile without errors
- [ ] Executor function added to the Protheus menu
- [ ] Table alias(es) exist in the data dictionary (SX2/SX3)
- [ ] Foreign key fields in `addArray()` match parent key fields in `setObject()` (if master-detail)

### SonarQube Compliance

- [ ] Error handling uses `Try-Catch`, not `ErrorBlock`
- [ ] Logging via `FWLogMsg()`, not `ConOut()`
- [ ] No `IIF()` in expressions — use `If/Else/EndIf`
- [ ] Includes in lowercase (e.g., `#include "totvs.ch"`)
- [ ] No direct access to SX3 via `DbSelectArea` — use `ObjectFromMetadata` or `FWSX3Util()`

> Refer to [references/sonarqube-rules-reference.md](../references/sonarqube-rules-reference.md) for the complete SonarQube rules reference.

