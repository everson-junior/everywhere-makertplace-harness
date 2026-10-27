# AdvPL/TLPP Development Guidelines

## Language and Ecosystem

This workspace contains source code for **TOTVS Protheus ERP** in the **AdvPL** (`.prw`, `.prg`, `.prx`) and **TLPP** (`.tlpp`) languages, as well as automated tests in **Python** (TIR - Interface and e2e tests) and **AdvPR** (`.prw` - Unit tests without UI).

> **Default language**: All interactions, documentation, comments, commit messages, and reviews must be in **Brazilian Portuguese**, except for code identifiers (variable names, functions, classes) that follow technical conventions in English/Protheus abbreviations.

---

## Project Structure

```
Fontes_Doc/Master/Fontes/   → Main source code (~60+ business modules)
  ├── <Module>/              → E.g.: Financeiro/, Compras/, Faturamento/
  │   └── *.prw, *.tlpp     → Module sources
  ├── *.PRJ                  → Build manifests (source lists per module)
  └── Rdmake Padrao/         → RDMake compiler
Testes/Automação Protheus/<Country>/
  ├── <MODULE>/Scripts Web/  → TIR tests (Python) — end-to-end via Webapp
  ├── <MODULE>/Scripts AdvPR/→ AdvPR tests (.prw) — business logic without UI
  └── <MODULE>/Dados/        → Test data
.agents/skills/   → AI agent skills for code generation, refactoring, documentation, tests, etc.
```

---

## Code Conventions

### Naming

- **Mandatory Hungarian notation**: `c` (character), `n` (numeric), `l` (logical), `a` (array), `o` (object), `d` (date), `b` (codeblock), `x` (variant), `j` (json)
- **Source file names**: Module prefix (4 chars) + number (3 digits) — e.g.: `MATA010`, `FINA138`, `ATFA002`
- **Table fields**: Table prefix (2-3 chars) + `_` + name — e.g.: `A1_COD`, `E1_FILIAL`
- **Tables**: Alias (2-3 chars) — e.g.: `SA1` (customers), `SE1` (accounts receivable), `SD1` (purchase invoice items)
- **Multilingual constants**: `STR0001` to `STR9999` defined in `.ch`

### Type System

#### AdvPL Types (optional static typing — type annotations with `as`)

| Type | Indicator | Description |
|------|-----------|-------------|
| Character (C) | `C` | Character strings from 0 to 65,535 characters (64 KB). Delimiters: `" "` or `' '` |
| Memo (M) | `M` | Equivalent to Character but with no defined size. Stored in data files (SYP) |
| Numeric (N) | `N` | Floating-point numeric values (integer and fractional). Guaranteed precision of 15 digits |
| Logical (L) | `L` | Logical values: `.T.` or `.Y.` (true), `.F.` or `.N.` (false) |
| Date (D) | `D` | Dates stored internally as Julian date |
| Fixed Size Decimal (F) | `F` | Fixed-size decimals for high precision |
| Array (A) | `A` | N-dimensional array of values |
| Code Block (B) | `B` | Executable code block that can be stored in variables |
| Undefined (U) | `U` | Undefined type (NIL) |
| Object (O) | `O` | Class objects |

#### TLPP Types (static typing — type annotations with `as`)

| Type | Indicator | Default Value | Description |
|------|-----------|---------------|-------------|
| `numeric` | `N` | `0` | Floating-point numeric values, positive or negative. Default numeric type |
| `integer` | `N` | `0` | Integer numeric values, positive or negative. Ideal for counters and loops |
| `double` | `N` | `0` | Floating-point numeric values, positive or negative |
| `decimal` | `F` | `Nil` | High-precision numeric values, essential for monetary calculations |
| `character` | `C` | `""` | Text values (alphanumeric, punctuation, special characters) |
| `logical` | `L` | `.F.` | Logical values: true (`.T.`) or false (`.F.`) |
| `date` | `D` | `31/12/1899` | Date storage |
| `array` | `A` | `Nil` | N-dimensional array of values |
| `object` | `O` | `Nil` | Interface or class objects |
| `json` | `J` | `Nil` | JSON objects |
| `codeblock` | `B` | `Nil` | Executable code blocks |
| `variant` | `U` | `Nil` | Variant and self-polymorphic type, can assume any available type |
| `variadic` | `J` | `-` | Used in function declarations for variable-length parameters (cannot instantiate variable) |

#### Key Differences

| Aspect | AdvPL | TLPP |
|--------|-------|------|
| Typing | Dynamic or optional static (not strongly typed) | Static (strongly typed) |
| Numeric Types | Only `numeric` | `numeric`, `integer`, `double`, `decimal` |
| Special Types | — | `json`, `variant`, `variadic` |
| Initialization | `Nil` by default | Automatic default values |
| Nil Comparison | Allowed | Restricted (`numeric`, `character`, `date`) |

#### Variable Declaration Syntax (TLPP)

```tlpp
// CORRECT: assignment BEFORE type annotation
Local cName   := "" as Character
Local nTotal  := 0  as Numeric
Local lFound  := .F. as Logical
Local aItems  := {} as Array
Local oModel  as Object          // without assignment is also valid

// WRONG: type annotation BEFORE assignment
Local cName as Character := ""   // does not compile

// WRONG: invalid type names
Local cName as String            // use Character
Local nVal  as Number            // use Numeric
Local lOk   as Boolean           // use Logical
```

#### Class & Method Syntax Rules (AdvPL/TLPP)

AdvPL/TLPP has a **two-part** class structure: the **declaration** (inside `class`/`endclass`) and the **implementation** (outside, after `endclass`). The syntax rules differ between these two parts and are unique compared to other languages (Java, C#, TypeScript).

**Key rule**: Method **implementations** NEVER carry access modifiers (`public`, `private`, `protected`) or the `static` keyword. These modifiers are **ONLY** used in the class **declaration** block. The implementation always uses bare `method` followed by the method name, parameters, optional return type, and `class ClassName`.

```tlpp
// ═══════════════════════════════════════════════════════════════
// CORRECT: declaration with modifiers, implementation WITHOUT
// ═══════════════════════════════════════════════════════════════
class MyClass
    public method new() as object            // declaration: has "public"
    public method calculate() as numeric     // declaration: has "public"
    private method validate() as logical     // declaration: has "private"
    static method callback()                 // declaration: has "static"
    private data nValue as numeric            // declaration: has "private"
endclass

method new() as object class MyClass         // implementation: just "method" — NO "public"
return self

method calculate() as numeric class MyClass  // implementation: just "method" — NO "public"
return ::nValue * 2

method validate() as logical class MyClass   // implementation: just "method" — NO "private"
return ::nValue > 0

method callback() class MyClass              // implementation: just "method" — NO "static"
return
```

```tlpp
// ═══════════════════════════════════════════════════════════════
// WRONG: access modifiers or static in the implementation
// ═══════════════════════════════════════════════════════════════
public method new() as object class MyClass    // WRONG: "public" before method
private method validate() class MyClass        // WRONG: "private" before method
static method callback() class MyClass         // WRONG: "static" before method
protected method process() class MyClass       // WRONG: "protected" before method
```

**Inheritance uses `from` (not `extends`, `inherits`, or `of`)**:

```tlpp
// CORRECT:
class ChildClass from ParentClass

// WRONG:
class ChildClass extends ParentClass    // does not compile
class ChildClass of ParentClass         // wrong keyword
```

**Constructor pattern** — always call `_Super:new()` for inherited classes:

```tlpp
method new() as object class ChildClass
_Super:new()       // call parent constructor
return self
```

**`static method` declaration syntax** — Inside the class body, `static method` accepts **only the method name with empty `()`** — no parameters, no return type annotation. Both parameters and typed return go **exclusively in the implementation** (outside `endclass`). This is a declaration-block restriction only; the implementation IS allowed to have both:

> **Common misconception**: "If I need parameters, I must use `public method`" — this is **WRONG**. `static method` CAN have parameters and return types; they are declared only in the implementation, not in the class body.

```tlpp
// ═══════════════════════════════════════════════════════════════
// WRONG: parameters or return type in static method declaration
// ═══════════════════════════════════════════════════════════════
class View
    static method showConsulta(cFilial as character, cCod as character)   // WRONG — parâmetros proibidos na declaração
    static method showCopia(cFilial as character, cCod as character)      // WRONG
endclass

// ═══════════════════════════════════════════════════════════════
// CORRECT: empty () in declaration; params and return type in implementation
// ═══════════════════════════════════════════════════════════════
class View
    static method showConsulta()   // CORRECT — apenas () vazio na declaração
    static method showCopia()      // CORRECT
endclass

method showConsulta(cFilial as character, cCod as character) class View   // parâmetros APENAS aqui
return

method showCopia(cFilial as character, cCod as character) class View      // parâmetros APENAS aqui
return
```

> **Source**: Official TOTVS TDN documentation — "Estrutura" (pageId 821588162), "Método Estático" (pageId 334341656), "Declaração de herança" (pageId 822220426). Validated via `language-system-docs-search` MCP.

### Include Files

- **Modern standard:** `#include "totvs.ch"` — consolidates all framework definitions for Protheus development
- **For TLPP files:** Add `#include "tlpp-core.th"` as the **first include**, then `#include "totvs.ch"`
- **NEVER use legacy obsolete includes** — all replaced by `totvs.ch`:

| Obsolete Include | Modern Class/API Replacement |
|---|---|
| `protheus.ch` | — (all definitions consolidated in `totvs.ch`) |
| `Ap5Mail.ch` | `TMailMessage()` |
| `ApWizard.ch` | `FWWizardControl()` |
| `FileIO.ch` | `FWFileWriter()` / `FWFileReader()` |
| `Font.ch` | `TFont()` |
| `ParmType.ch` | `Default` prefix for parameter handling |
| `RWMake.ch` | — (legacy compatibility only) |

### Mandatory Standards

- Always filter `D_E_L_E_T_ = ' '` in SQL queries (Protheus soft-delete)
- Always filter by branch: `XX_FILIAL = xFilial('XXX')` or equivalent
- Use `FWPreparedStatement` or `ChangeQuery()` for SQL injection prevention
- Use `RetSqlName()` to get the physical table name (e.g.: `SA1010`)
- Add `%nolock%` in read queries to avoid unnecessary locks
- Never call `GetMV()`, `SuperGetMV()`, `ExistBlock()`, `Type()`, or `Pergunte()` inside loops
- **`User Function` is forbidden**: New code **MUST** use `Function` (public) or `Static Function` (file-private) — **NEVER** `User Function`. The only exception is **Entry Points**, which by Protheus framework design require `User Function` to be discovered via the `U_` prefix. MVC routines, REST, SmartX, and any other standard implementation must use `Function`
- **File encoding**: All AdvPL/TLPP source files (`.prw`, `.prg`, `.prx`, `.tlpp`, `.ch`, `.aph`) **MUST** use **CP-1252 (Windows-1252)** encoding — **NEVER** UTF-8 or any other encoding. The RDMake/AppServer compiler expects Windows-1252; accented and special characters will be corrupted in UTF-8
- **Object destruction**: ALWAYS use the class's `Destroy()` method to destroy the instantiated object and free memory, whenever this method is available in the class. **NEVER** use `FwFreeObj()`, `FreeObj()`, or `FwFreeArray()` as a substitute when the class provides `Destroy()`. The `Destroy()` method ensures correct release of the object's internal resources, whereas generic functions may not perform a complete cleanup
- **`IIF` is forbidden**: Never use `IIF()` or `IF()` inline expressions — always use explicit `If/Else/EndIf` blocks for readability and testability (SonarQube CA4000)
- **No UI inside transactions**: Never call `MsgAlert()`, `MsgYesNo()`, `MsgInfo()`, `Aviso()`, `Help()`, `Pergunte()`, or `ParamBox()` inside `Begin Transaction / End Transaction` blocks — UI calls block multi-user scenarios and can deadlock (SonarQube CA1002)
- **No ISAM drivers**: Never use `MSCREATE()`, `DBCREATE()`, or `CRIATRAB()` — use `FWTemporaryTable` instead; ISAM drivers are prohibited in Cloud/SmartERP environments (SonarQube CA1000)
- **No console output**: Never use `ConOut()`, `OutErr()`, or `?` for logging — always use `FWLogMsg()` (SonarQube CA1004)
- **`cFilial` is forbidden**: Never use the variable `cFilial` directly — it is a reserved system variable. Use variations like `cFilAux`, `cFilBkp`, `cFilSA1`, etc., or obtain the branch value via `xFilial('XXX')` or `FWxFilial('XXX')`

### MVC Pattern

The Protheus MVC framework follows: `MenuDef()` → `ModelDef()` → `ViewDef()` → `BrowseDef()`
- `ModelDef` returns `FWFormModel` (business rules)
- `ViewDef` returns `FWFormView` (visual layout)
- Model 1 pattern (single entity) and Model 3 (master-detail)

### Modern TLPP (preferred for new code)

- Use namespaces, type annotations, Try-Catch
- `.tlpp` extension mandatory with `#include "tlpp-core.th"` or exclusive TLPP features
- REST via annotations: `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`
- Smart X (PO-UI) with `totvs.framework.structure` classes for new screens
- **`using namespace` required**: In `.tlpp` files, always declare `using namespace` at the top of the file to import framework namespaces. **NEVER** use fully qualified namespace prefixes before each class in the code. Example:

```tlpp
// CORRECT: declare using namespace and use the class directly
using namespace totvs.framework.structure.interface

::oInterface := BuildContract():new("MATA010")
```

```tlpp
// WRONG: fully qualified namespace on the call
::oInterface := totvs.framework.structure.interface.BuildContract():new("MATA010")
```

---

## SonarQube AdvPL/TLPP Compliance

**All** implementation, refactoring, code review, optimization, and improvement activities **MUST** comply with the SonarQube rules for AdvPL/TLPP. This applies to any code generated, modified, or reviewed — no exceptions.

- **Code generation**: Must not introduce CRITICAL or MAJOR violations. INFO-level security rules (CA2050, CA2051, CA2052) are also mandatory.
- **Code review**: Explicitly check for violations and flag them with the rule ID (e.g., `CA2050 — SQL Injection`).
- **Refactoring**: Fix violations found in modified lines/functions. Never introduce new ones.
- **Optimization**: Respect performance rules (G2). Never use prohibited APIs or bypass framework abstractions.

> **Full rules reference** (G1–G5: Security, Performance, Legacy/Deprecated, Metadata Access, Compilation): read [.agents/skills/advpl-tlpp/references/sonarqube-rules-reference.md](.agents/skills/advpl-tlpp/references/sonarqube-rules-reference.md) or [.agents/skills/references/sonarqube-rules-reference.md](.agents/skills/references/sonarqube-rules-reference.md) before generating or reviewing code.

---

## Completeness Verification (Mandatory)

After any **code generation, migration, or refactoring** task, the agent MUST perform a completeness verification step before declaring the task finished. This rule is generic and applies to all skills and agents.

1. **Mandatory gap analysis**: Compare item by item ALL features of the original code (or requirements) with the generated/migrated code. Explicitly list each feature as: ✅ migrated, ⚠️ not-migratable (with documented justification referencing framework limitation), or 🔄 preserved in legacy layer.
2. **No behavior may be silently omitted**: If a feature from the original code was not migrated, there MUST be an explicit justification referencing the documentation or technical limitation that prevents the migration. "I forgot" or "I assumed the framework handles it" are NOT valid justifications.
3. **Conditional logic MUST be replicated**: Access checks (`VerifyAccess`, `MPUserHasAccess`), parameters (`SuperGetMv`), table access mode (`FWModeAccess`), table existence (`FwAliasInDic`), module (`nModulo`), country (`cPaisLoc`), and feature flags (`FindFunction`) are NEVER handled automatically by frameworks — they MUST be explicitly coded.
4. **Present the gap analysis to the user** before considering the task complete. The user must be able to validate that nothing was left out.

---

## Build and Compilation

- **Compiler**: RDMake (TOTVS proprietary) via TOTVS Language Server in VS Code
- **Manifests**: `.PRJ` files list sources for each module (no Makefile/Gradle)
- **Output**: `.O` files (compiled objects) in the RPO (Protheus Object Repository)

---

## Tests

| Type | Framework | Language | Usage |
|------|-----------|----------|-------|
| **AdvPR** | `FWTestHelper` | AdvPL (`.prw`) | Business logic, MVC validation, REST APIs, reports |
| **TIR** | `tir.Webapp` | Python (`.py`) | End-to-end via SmartClient/Webapp (CRUD, grids, reports) |

- AdvPR: `TestSuite` with `SetUpSuite()`, `TearDownSuite()`, `AddTestMethod()`
- TIR: `unittest.TestCase` with `setUpClass()`, `test_CTNNN()`, `tearDownClass()`

---

## Available Agent Skills

See [.agents/skills/references/advpl-tlpp-skills-reference.md](.agents/skills/references/advpl-tlpp-skills-reference.md) or [.agents/skills/advpl-tlpp/references/advpl-tlpp-skills-reference.md](.agents/skills/advpl-tlpp/references/advpl-tlpp-skills-reference.md) for the full catalog. Summary:

| Category | Skills |
|----------|--------|
| **Code Generation** | `mvc-generator`, `tlpp-rest-endpoint-generator`, `entry-point-designer`, `smartx-generator`, `query-builder` |
| **Migration** | `advpl-to-tlpp-migration`, `browse-to-smartx-migration`, `dbseek-to-dbseekex-migration` |
| **Quality** | `code-review`, `sql-code-review`, `refactor`, `refactor-method-complexity-reduce`, `sql-optimization` |
| **Tests** | `advpr-test-generator`, `tir-test-generator` |
| **Documentation** | `documentation-writer`, `context-map`, `create-implementation-plan`, `data-dictionary-lookup` |

---

## ProtheusDOC Documentation

All new code must include a `/*/{Protheus.doc}` block with at minimum: `@type`, `@author`, `@since`, `@param` (if applicable), `@return` (if applicable). See the `documentation-writer` skill for full reference.

---

## MCP to consult documentation

> **Search language**: All queries to the documentation MCPs must be made in **Brazilian Portuguese**, as all documentation is in that language. Exception: programming terms, code identifiers (variable names, functions, classes, methods), and technical abbreviations that follow English conventions — these should be kept in their original language. Example: search *"como usar FWFormModel para validação de campos"* and not *"how to use FWFormModel for field validation"*.

### When to consult the MCPs

**MUST** use `advpl-tlpp-mcp-docs` MCPs to consult documentation **always before performing any task** — including implementation, refactoring, bug fixing, code review, planning, tests or any other development activity. You MUST use them to verify documentation, data structures, parameters, and API behavior prior to proceeding, regardless of your confidence level. The table below defines which MCP to use in each situation:

| Need | Recommended MCP tool(s) |
|------|---------------------|
| Documentation for AdvPL/TLPP functions, classes, methods, or frameworks | `language-system-docs-search` |
| Documentation for Protheus modules, routines, Entry Points, or tables | `product-docs-search` |
| Implementation examples of existing features in the source code | `code-search` (+ `get-code-chunks` for complete code) |
| Data dictionary lookup (table structure, fields, types, indexes) | `execute-sql`, `list-schemas`, `list-objects`, `get-object-details` |
| System parameters (SX6) used by a routine | `program-parameters-search` |
| Functions called by a program | `called-functions-by-programs-search` |
| Preprocessor directives (`#include`, `#define`) of a source file | `get-file-preprocessor` |
| Smart X / PO-UI — `totvs.framework.structure` classes | `smartx-docs-search` |
| Automated tests (AdvPR / FWTestHelper) | `automation-docs-search` |
| TIR tests (end-to-end Python) | `tir-docs-search` |
| TSS (NF-e, NFS-e, CT-e, e-Social, REINF, SEFAZ) | `tss-docs-search` |
| Reports (Smart View, TReport) | `reports-docs-search` |
| Legislation (tax, labor, SPED, ConSeg) | `legislation-docs-search` |
| Cloud / TCloud | `cloud-docs-search` |
| MIT / Services Framework | `mit-docs-search` |
| External libraries / APIs | `ref`, `context7 / ups` |

**Usage guidelines:**

1. **MCPs are the source of truth — always consult them first**: Before searching the codebase (regex, `grep_search`, `semantic_search`, `file_search`) or reading source files for examples, **always query the relevant MCP first**. Codebase searches are a last resort when MCP results are insufficient, not a starting point.
2. **Never use codebase searches as a substitute for MCP lookups**: Do not search the workspace for examples of a Protheus API, framework class, table structure, or system behavior. Use `code-search`, `language-system-docs-search`, `product-docs-search`, or the appropriate MCP instead. Direct source code exploration is only valid for project-specific logic not covered by any MCP.
3. **Prefer MCPs over internal knowledge**: The official documentation and the Protheus source code indexed by the MCPs are the authoritative reference for API behavior, parameters, and data structures. Internal model knowledge must never override MCP results.
4. **Combine multiple MCPs** when the task requires it. For example, when implementing an MVC routine: consult `product-docs-search` for the routine's documentation, `code-search` for existing examples, `execute-sql` or `get-object-details` for the structure of the involved tables, and `program-parameters-search` for the parameters used.
5. **Consult before generating code**: MCP lookups must happen **before** code generation, not after. The generated code must reflect the information obtained.
6. **Document the source**: when citing information obtained via MCP (parameters, fields, behaviors), mention that the information was validated against the official documentation.
7. **MUST** use `execute-sql`, `list-schemas`, `list-objects`, `get-object-details` to look up table aliases, field names, relationships, and metadata required for the model definition before making any implementation decisions. This is critical to ensure the generated code correctly references existing database structures and adheres to the actual data model.

### MCP Combination Patterns

Most tasks require **multiple MCPs** working together. Follow these patterns:

| Task Type | Step 1 (Data) | Step 2 (Documentation) | Step 3 (Examples) |
|-----------|---------------|------------------------|-------------------|
| **Code generation** (MVC, SmartX, REST) | `execute-sql` → table structure, fields, indexes | `language-system-docs-search` → framework API, class methods | `code-search` → existing implementations for reference |
| **SQL / Query building** | `execute-sql` → SIX indexes, SX3 field types/sizes | `language-system-docs-search` → TCQuery, FWPreparedStatement docs | `code-search` → query patterns in codebase |
| **Migration / Refactoring** | `execute-sql` → dictionary impact (fields, triggers, indexes) | `product-docs-search` → routine behavior, Entry Points | `code-search` + `called-functions-by-programs-search` → callers, dependencies |
| **Code review** | `execute-sql` → validate field/table references | `language-system-docs-search` → correct API usage | `code-search` → reference patterns for comparison |
| **Test generation** | `execute-sql` → table fields for test data | `automation-docs-search` or `tir-docs-search` → test framework | `code-search` → existing test patterns |
| **Documentation** | `execute-sql` → table/field metadata | `language-system-docs-search` + `product-docs-search` → signatures, behavior | — |

**Rule**: When in doubt, always start with `execute-sql` for concrete data (fields, types, indexes), then use search tools for context and documentation.

### Fallback Escalation Chain

When information is not found in one source, escalate to the next:

```
1. MCP tools (primary source of truth)
   ↓ not found or insufficient
2. Skill reference files (references/*.md bundled with each skill)
   ↓ not found or insufficient
3. AGENTS.md / CLAUDE.md rules (global conventions)
   ↓ not found or insufficient
4. Ask the user for clarification — NEVER guess or fabricate
```

**Never skip steps**. Even if you believe you know the answer, validate against MCP documentation first. Internal knowledge is unreliable for Protheus-specific APIs, data dictionary structures, and framework behaviors.