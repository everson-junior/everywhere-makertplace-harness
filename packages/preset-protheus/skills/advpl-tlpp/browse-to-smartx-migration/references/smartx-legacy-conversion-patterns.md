# Legacy Pattern Recognition & Conversion Guide

## General Migration Principle (MANDATORY)

> **Migration MUST be complete and total — every single behavior from the legacy code MUST be present in the migrated code.** ALL business rules — sub-models, validations, triggers, initializers, custom actions, legends, filters, keyboard events, conditional logic, parameter checks, module checks, and **any other functional behavior regardless of type** — MUST be migrated, fully preserving the current business rules.

**Inviolable rules:**

1. **EVERYTHING MUST be migrated — no exceptions, no omissions.** There is no "out of scope". Every legacy behavior must exist in the migrated Smart X code.
2. **Prefer native SmartX resources when available.** If the SmartX framework (`totvs.framework.structure.*`) offers a native mechanism to implement a behavior (e.g., `setObject`, `addArray`, `BuildAdvplAction`, `BuildEvents`, `serverValidate`, `loadEventsFromMetadata`), that native mechanism MUST be used.
3. **When no native SmartX mechanism exists, use standard TLPP code inside the SmartX classes.** If a legacy behavior has NO equivalent in the SmartX framework API (e.g., parameter-based conditional loading via `SuperGetMV`, module checks via `nModulo`, `FwAliasInDic` validations, `FWModeAccess` checks, custom runtime logic), that behavior MUST STILL be migrated — implemented as **standard TLPP code** (If/Else, function calls, variable checks) directly inside the SmartX Model/View methods (e.g., inside `setModel()`, `setInterface()`, or helper methods). The SmartX class is a TLPP class — any valid TLPP code can be written inside its methods.
4. **NEVER assume the SmartX framework handles something automatically unless documented.** The SmartX framework manages data dictionary metadata (SX3 fields, SX7 triggers, X3_VALID, X3_RELACAO) automatically via `ObjectFromMetadata` and `loadEventsFromMetadata`. It does NOT automatically manage: system parameters (`SuperGetMV`), user access checks (`MPUserHasAccess`), module-specific logic (`nModulo`), table existence checks (`FwAliasInDic`), table sharing mode (`FWModeAccess`), or any other runtime business logic. These MUST be explicitly coded.
3. **Entry Points MUST be migrated or made compatible.** No entry point may stop working after migration. If native SmartX offers an equivalent mechanism (e.g., `BuildEvents`, `BuildAdvplAction`, `serverValidate` via ATUSX), the logic MUST be migrated. If there is no native equivalent, the entry point MUST continue working via the preserved legacy code (`ModelDef`, `ViewDef`, `BrowseDef`, `MenuDef`).
4. **ExecAuto / MSExecAuto / Rotina Automática MUST continue working.** Wrapper functions, `ModelDef`, `ViewDef`, `MenuDef`, and ExecAuto handlers are preserved in the legacy source to ensure compatibility. Native SmartX is ADDITIVE — it coexists with the legacy code.
5. **No functionality may regress.** The end user must have, at minimum, the same functional experience as before the migration, now on the PO-UI/SmartX interface.

This principle applies to ALL conversion sections below. When the text says "migrate to SmartX", it means migrate **completely** — all business rules, no exceptions.

### Post-Migration Gap Analysis (MANDATORY)

After generating all SmartX files, the agent MUST perform a **systematic gap analysis** before declaring the migration complete:

1. **Re-read the ENTIRE legacy source** and build a feature inventory covering: sub-models (with ALL conditions: `VerifyAccess`, `SuperGetMv`, `FWModeAccess`, `FwAliasInDic`, `FindFunction`, `nModulo`), model validations, triggers, virtual fields, field initializers, view panels, field removals, field actions, user buttons, keyboard shortcuts (`SetKey`), legends, filters, totals, Entry Points, and integrations (`InstallEvent` classes).
2. **Cross-reference each item** against the generated SmartX code.
3. **Classify each item** as: ✅ migrated, ⚠️ not-migratable (framework limitation — must justify with docs), 🔄 preserved in legacy, or ❌ omitted (MUST fix before completion).
4. **Fix ALL ❌ items** before reporting. Zero omissions is the only acceptable outcome.
5. **Present the gap analysis** to the user as part of the migration report.

Common items that are frequently omitted but HAVE SmartX equivalents (MUST be migrated):
- Conditional sub-model loading with real `VerifyAccess()` values (not `.T.` hardcoded)
- `FWModeAccess` checks for shared table sub-models (e.g., SBZ)
- User buttons from `ViewDef` → `BuildAdvplAction` in SmartX View
- `SetKey()` keyboard shortcuts → `BuildEvents():addOnKeyDown()` in SmartX View
- Field removals from `ViewDef` → `addProperty("hidden", .T.)` in SmartX View
- Conditional actions based on `nModulo`, `cPaisLoc`, `SuperGetMv`, `FindFunction`

---

## Converting from MBrowse / AxCadastro

**Identifying the legacy pattern:**

```advpl
// Legacy MBrowse pattern
Function MYLEG01()
  Private aRotina  := {}
  Private cCadastro := "My Registration"

  aAdd(aRotina, {"Pesquisar" , "AxPesqui" , 0, 1})
  aAdd(aRotina, {"Visualizar", "AxVisual" , 0, 2})
  aAdd(aRotina, {"Incluir"   , "AxInclui" , 0, 3})
  aAdd(aRotina, {"Alterar"   , "AxAltera" , 0, 4})
  aAdd(aRotina, {"Excluir"   , "AxDeleta" , 0, 5})

  DbSelectArea("ZZ1")
  DbSetOrder(1)
  MBrowse(,,,,,"ZZ1")
Return
```

```advpl
// Legacy AxCadastro pattern
Function MYLEG02()
  Private aRotina  := {}
  Private cCadastro := "Simple Registration"

  aAdd(aRotina, {"Pesquisar" , "AxPesqui", 0, 1})
  aAdd(aRotina, {"Incluir"   , "AxInclui", 0, 3})
  aAdd(aRotina, {"Alterar"   , "AxAltera", 0, 4})
  aAdd(aRotina, {"Excluir"   , "AxDeleta", 0, 5})

  AxCadastro("ZZ1", "My Registration", "AxInclui", "AxAltera", "AxDeleta")
Return
```

**Conversion mapping (Legacy → Native SmartX):**

| Legacy Construct | Smart X Equivalent |
| --- | --- |
| `Private aRotina` (menu actions) | Auto-generated CRUD by Smart X framework via `buildStandardView()` |
| `MBrowse()` / `AxCadastro()` | `launcher():show("namespace.view")` |
| `AxInclui` / `AxAltera` / `AxDeleta` / `AxVisual` | Automatic via `buildStandardView()`. For manual layout: `BuildDataNew` / `BuildDataEdit` / (delete is automatic) / `BuildDataDetail` |
| `AxPesqui` | Built-in Smart X search (automatic) |
| `DbSelectArea` + `DbSetOrder` | `ObjectFromMetadata():new("ALIAS")` in Model class handles data access automatically |
| `Enchoice()` / `MsGetDB` / `MsNewGetDados` | Automatic form/grid layout from Model + View contract via `buildStandardView()` |
| `aRotina` with custom functions | `BuildAdvplAction` + `addTableAction` in View class |
| `SetKey()` keyboard shortcuts | `BuildEvents():addOnKeyDown()` in View class |
| `nOpc == 3` / `nOpc == 4` patterns | Handled automatically by the framework (dataNew/dataEdit) |

### Parameter Signature Compatibility (Applies to ALL Action Conversions)

Legacy codeblocks (used in `AddUserButton`, `aRotina`, `SetKey`) have **unrestricted parameter passing** — they can pass arrays, objects, nested expressions, or any combination as a single argument. `BuildAdvplAction:setParams` works differently: **each array element becomes a separate positional string argument** to the target function.

When converting ANY codeblock-based action to `BuildAdvplAction`, always verify the target function's expected parameter signature is compatible with element-to-argument mapping. If there is any mismatch (e.g., function expects a single array, an object, a numeric value, or a different number of arguments than setParams elements), create a **wrapper method** in the View class that receives the individual string arguments and adapts them to the expected signature before calling the target function.

This applies to conversions from: `AddUserButton` codeblocks, `aRotina` function references, `SetKey` handlers, and any other legacy construct that invokes functions with non-trivial parameter signatures.

## Converting from MarkBrowse / MsGetDB / MsNewGetDados

**Master-detail legacy pattern:**

```advpl
// Legacy master-detail with MsGetDB
Function MYLEG03()
  Private aRotina    := {}
  Private aCols      := {}
  Private aHeader    := {}
  Private cCadastro  := "Orders"

  aAdd(aRotina, {"Pesquisar" , "AxPesqui" , 0, 1})
  aAdd(aRotina, {"Incluir"   , "MyInc"  , 0, 3})
  aAdd(aRotina, {"Alterar"   , "MyAlt"  , 0, 4})

  DbSelectArea("ZZ2")
  DbSetOrder(1)
  MBrowse(,,,,,"ZZ2")
Return

Function MyInc()
  // Header: Enchoice or MsGetDB for fields
  // Detail: MsNewGetDados for grid
Return

Function MyAlt()
  // Same pattern but loading existing data
Return
```

**This becomes the Master-Detail Native SmartX (Path B)** — see the [Smart X Code Templates](smartx-code-templates.md) for the Master-Detail Model and View templates.

## Converting from MVC FWFormBrowse / FWMBrowse

**Existing MVC pattern:**

```tlpp
Function MYMOD01()
  Local oBrowse as Object

  oBrowse := FWFormBrowse():New()
  oBrowse:SetAlias("ZZ1")
  oBrowse:SetDescription("My Registration")
  oBrowse:AddLegend("ZZ1_STATUS == '1'", "GREEN", "Active")
  oBrowse:AddLegend("ZZ1_STATUS == '2'", "RED",   "Inactive")
  oBrowse:Activate()
Return

Static Function ModelDef() as Object
  // ... existing FWFormModel / MPFormModel definition ...
Return oModel

Static Function ViewDef() as Object
  // ... existing FWFormView definition ...
Return oView

Static Function MenuDef() as Array
  // ... existing menu array ...
Return aMenu
```

**Conversion to Native SmartX:** Replace the entire MVC structure with the three-file Native SmartX architecture (Model class, View class, Executor function). See the [Smart X Code Templates](smartx-code-templates.md) for complete templates.

> **Note:** The existing `ModelDef`/`ViewDef`/`MenuDef` logic MUST be mapped to the new `totvs.framework.structure` classes. The entity definitions from `ModelDef` map to `setObject()`/`addArray()`/`addObject()` in the Model class, and the view layout maps to `BuildDataView`/`BuildDataNew`/`BuildDataEdit` in the View class. ALL business rules MUST be migrated — as per the [General Migration Principle](#general-migration-principle-mandatory).

> **CRITICAL:** The existing `ModelDef`/`ViewDef`/`MenuDef` functions MUST be PRESERVED in the legacy source file for ExecAuto/MSExecAuto compatibility. The SmartX native files are ADDITIVE — they coexist with the MVC code. See the "ExecAuto / Rotina Automática Compatibility" section in the main SKILL.md.

---

## Converting MVC Sub-Models to SmartX

### Sub-Model Type Mapping

| MVC Sub-Model Type | MVC Method | SmartX Method | Relationship |
| --- | --- | --- | --- |
| **Form fields** (1:1) | `AddFields("ID", "PARENT", oStruct)` | `addObject(jObj, "ALIAS", aFK, aPK, "PARENT")` | One record per parent |
| **Grid items** (1:N) | `AddGrid("ID", "PARENT", oStruct)` | `addArray(jObj, "ALIAS", aFK, aPK, "PARENT")` | Multiple records per parent |
| **Header+Items same table** | `AddFields` + `AddGrid` (Model 2) | `setObject` + `addArray` with lModel2 | Same table, virtual split |

### Extracting Relationship Keys

**Step 1 — Find `SetRelation` in legacy code:**
```advpl
oModel:SetRelation('SB5DETAIL', { { 'B5_FILIAL', 'xFilial("SB5")' }, { 'B5_COD', 'B1_COD' } }, SB5->(IndexKey(1)))
```

**Step 2 — Extract field pairs:**
- Foreign key (child): First element of each pair → `B5_FILIAL`, `B5_COD`
- Parent key: Second element, ignoring `xFilial()` expressions → `B1_FILIAL` (from xFilial), `B1_COD`

**Step 3 — Map to SmartX:**
```tlpp
::addObject(oSB5:getObject(), "SB5", {"B5_FILIAL", "B5_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")
```

> **Note for `xFilial()` expressions**: When the legacy `SetRelation` uses `xFilial("XXX")` as the value, the corresponding parent field is the FILIAL field of the parent table (e.g., `B1_FILIAL` for SB1).

### Handling Dynamic/Conditional Sub-Models

Some MVC routines add sub-models conditionally based on user access, parameters, or modules. In the legacy code, this looks like:

```advpl
// Legacy: conditional sub-model loading
If lMATA180 .and. IsAccessByOperation(nOpc, aMATA180Access)
    oModel:AddFields("SB5DETAIL", "SB1MASTER", oStruSB5)
    oModel:SetRelation('SB5DETAIL', ...)
EndIf
```

**SmartX approach — complete migration with behavioral parity**: As per the [General Migration Principle](#general-migration-principle-mandatory), ALL sub-model logic — conditional or not — MUST be migrated. The approach depends on the **type of condition**:

#### What SmartX handles automatically (use native SmartX only)

- **Data dictionary metadata** (SX3 field properties, SX7 triggers, X3_VALID, X3_RELACAO) → handled automatically by `ObjectFromMetadata` and `loadEventsFromMetadata()`
- **SX2 table structure** (fields, types, sizes, indexes) → resolved automatically by `ObjectFromMetadata`:new("ALIAS")`

For these, simply declare the sub-model and the framework resolves the rest.

#### What SmartX does NOT handle automatically (MUST be coded in TLPP inside the SmartX class)

- **System parameters** (`SuperGetMV("MV_CADPROD")`, `SuperGetMV("MV_VEICULO")`, etc.) → MUST be checked with standard TLPP `If/Else` inside `setModel()`
- **User access control** (`MPUserHasAccess`, `VerifyAccess()`, `IsAccessByOperation()`) → MUST be checked with standard TLPP code
- **Table existence** (`FwAliasInDic("XXX")`) → MUST be checked before calling `ObjectFromMetadata`:new()`
- **Table sharing mode** (`FWModeAccess("SB1",3) == "C"`) → MUST be checked in TLPP
- **Module checks** (`nModulo == 73`, `cPaisLoc == "BRA"`, etc.) → MUST be checked in TLPP
- **Feature flags** (`FindFunction("XXX")`, `ExistFunc("XXX")`) → MUST be checked in TLPP
- **Any other runtime conditional logic** → MUST be replicated as standard TLPP code inside the SmartX method

> **Rule: The SmartX class is a TLPP class.** Any valid TLPP code — `If/Else`, `SuperGetMV`, function calls, loops — can and MUST be written inside `setModel()`, `setInterface()`, or any other method when the SmartX framework does not provide a native mechanism. Never omit a behavior because "SmartX handles it" — only dictionary-level metadata is automatic.

This includes:
- **Dictionary-based sub-model metadata** → use native SmartX (`addObject`/`addArray`) — always declare the sub-model
- **Conditional sub-models** by parameters, access, or modules → wrap the SmartX `addObject`/`addArray` calls inside `If/Else` blocks with the same conditions as the legacy code
- **Business rules** associated with sub-models (validations, triggers, initializers) → migrate via `loadEventsFromMetadata()` or server-side validations (`serverValidate`) in ATUSX
- **Custom actions** linked to sub-models → migrate via `BuildAdvplAction` + `addTableAction` in the View class
- **InstallEvent events** → migrate business rules to SmartX validations or keep functional via preserved `ModelDef`

If any legacy conditional logic CANNOT be reproduced (e.g., depends on a SmartClient-only API), it MUST be kept functional in the preserved legacy code (`ModelDef`/`ViewDef`) that coexists with native SmartX.

```tlpp
// SmartX: conditional sub-model loading — same conditions as legacy VerifyAccess()
local cRot := SuperGetMv("MV_CADPROD",,"|SBZ|SB5|SGI|D3E|") as character

// SB5 — Complemento de Produto (condicional: "SB5" deve estar em MV_CADPROD e tabela existir)
If "SB5" $ cRot .And. FwAliasInDic("SB5")
    oSB5 := ObjectFromMetadata():new("SB5")
    ::addObject(oSB5:getObject(), "SB5", {"B5_FILIAL", "B5_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")
    FwFreeObj(oSB5)
EndIf

// SBZ — Indicadores por Filial (condicional: "SBZ" em MV_CADPROD + SB1 compartilhada)
If "SBZ" $ cRot .And. FWModeAccess("SB1",3) == "C"
    oSBZ := ObjectFromMetadata():new("SBZ")
    ::addArray(oSBZ:getObject(), "SBZ", {"BZ_COD"}, {"B1_COD"}, "SB1")
    FwFreeObj(oSBZ)
EndIf
```

### Handling InstallEvent Sub-Models

MVC routines may use `InstallEvent()` to attach business logic classes to sub-models:

```advpl
oModel:InstallEvent("COMPL.", , MATA180EVDEF():New("SB5DETAIL"))
```

**SmartX approach — complete migration**: ALL business logic attached via `InstallEvent()` MUST be migrated or made compatible:

1. **Dictionary-based events** (triggers, validations, initializers defined in SX3/SX7): are loaded automatically by SmartX via `loadEventsFromMetadata()` — no additional action required.
2. **Custom business rules** beyond the dictionary: MUST be implemented as server-side validations (`serverValidate`) in the SmartX validation contract via ATUSX, or as custom actions via `BuildAdvplAction` in the View class.
3. **If any logic CANNOT be migrated natively** to SmartX (framework limitation), the legacy `ModelDef` with the `InstallEvent()` MUST be preserved and kept functional to ensure no business rule is lost. Native SmartX coexists with the legacy code.

> **CRITICAL:** No business rule may be discarded. If the event class attached via `InstallEvent()` contains validations, calculations, or data transformations, each of those rules must be individually mapped and migrated or made compatible.

---

## ExecAuto / MSExecAuto Compatibility Patterns

> **MANDATORY**: As per the [General Migration Principle](#general-migration-principle-mandatory), ExecAuto / MSExecAuto / Rotina Automática MUST continue working fully after migration. No programmatic integration may stop working. Wrapper functions, ExecAuto handlers, and MVC definitions (`ModelDef`, `ViewDef`, `MenuDef`) are preserved in the legacy source to ensure 100% compatibility.

### Wrapper Function Preservation

The legacy wrapper function that routes between UI and ExecAuto MUST be preserved:

```advpl
// PRESERVED — do NOT modify
Function MATA010M(xRotAuto, nOpcAuto)
Local oBrowse
Private l010Auto := ( xRotAuto <> NIL )

Default nOpcAuto := 3

    If ValType(xRotAuto) == "A"
        A010Auto(nOpcAuto, xRotAuto)  // ExecAuto path — MUST remain
    Else
        oBrowse := BrowseDef()        // UI path — can coexist with SmartX executor
        oBrowse:Activate()
    EndIf
Return .T.
```

### Testing ExecAuto After Migration

After migration, validate that ExecAuto continues working:

1. Call the wrapper function with an ExecAuto array: `MATA010M(aAutoArray, 3)` for inclusion
2. Call `FWLoadModel("MATA010")` and verify it returns a valid model
3. Call `FWExecView(, "MATA010", MODEL_OPERATION_INSERT)` for UI CRUD
4. Run existing AdvPR test suites that use ExecAuto
