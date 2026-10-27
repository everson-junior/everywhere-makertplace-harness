# Smart X Model Reference

Detailed templates and API reference for `totvs.framework.structure.model.data` model classes.

> **CRITICAL — Method Implementation Syntax**: Method implementations (outside `class`/`endclass`) NEVER use `public`, `private`, `protected`, or `static`. Always write `method methodName() class ClassName`. Even if declared as `static method`, implement as `method ... class ClassName`.

---

## Table of Contents

- [Template: Single-Entity Model](#template-single-entity-model)
- [Template: Master-Detail Model (Different Tables)](#template-master-detail-model-different-tables)
- [Template: Model with Related Entity (1:1 Relationship)](#template-model-with-related-entity-11-relationship)
- [Template: Model 2 (Header + Items in Same Table)](#template-model-2-header--items-in-same-table)
- [Model API Reference](#model-api-reference)

---

## Template: Single-Entity Model

A model for a single table (no grid/items). Based on the **Naturezas (SED)** reference implementation.

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.model.th"

namespace totvs.protheus.financial.smartx.naturezas

using namespace totvs.framework.structure.object

//-------------------------------------------------------------------
/*/{Protheus.doc} Model
Classe de modelo do cadastro de naturezas (SED) para Smart X

@type class
/*/
//-------------------------------------------------------------------
@totvsFrameworkStructureModel(description="Cadastro de Naturezas")
class Model from totvs.framework.structure.model.data
    public method new() as object
    public method setModel()
endclass

//-------------------------------------------------------------------
/*/{Protheus.doc} new
Método construtor da classe

@type method
@return object, instância da classe
/*/
//-------------------------------------------------------------------
method new() as object class Model
_Super:new(,,.T.)
return self

//-------------------------------------------------------------------
/*/{Protheus.doc} setModel
Método de criação do modelo com base no objeto de dicionário

@type method
/*/
//-------------------------------------------------------------------
method setModel() class Model
local oObject as object

oObject := ObjectFromMetadata():new("SED")
::setObject(oObject:getObject(), "SED")

return
```

### Key Points — Single-Entity Model

- **Includes**: `#include "totvs.ch"` + `#include "totvs.framework.structure.model.th"` only. Do NOT add `fw-tlpp-core.th`.
- **Using namespace**: `using namespace totvs.framework.structure.object` — allows calling `ObjectFromMetadata():new()` without full qualification.
- **Annotation**: `@totvsFrameworkStructureModel(description="...")` — `description` is required. Optional parameters `lookup` and `country` can be added if needed (e.g., `@totvsFrameworkStructureModel(lookup=.F., country="ALL", description="...")`).
- **Class name**: Always `Model`. The namespace already provides context.
- **Extends**: `totvs.framework.structure.model.data`
- **Constructor**: `_Super:new(,,.T.)` — always pass `.T.` as 3rd parameter.
- **ObjectFromMetadata**: `ObjectFromMetadata():new("ALIAS")` — pass only the table alias. Key fields and other parameters are resolved automatically from the data dictionary.
- **setObject**: `::setObject(oObject:getObject(), "ALIAS")` — binds the entity to the model.
- **FwFreeObj**: Optionally call `FwFreeObj()` on ObjectFromMetadata instances after `setObject`/`addArray`/`addObject` to free memory, as shown in official TDN examples.
- **loadEventsFromMetadata**: Call `self:loadEventsFromMetadata()` after setting up all entities to load triggers (SX7), validations (X3_VALID/X3_VLDUSER), and initializers (X3_RELACAO) from the data dictionary. This is recommended for routines with field interdependencies.

---

## Template: Master-Detail Model (Different Tables)

A model with header entity (SF4) and detail grid items (CC7) in separate tables. Based on the **TES (SF4+CC7)** reference implementation.

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.model.th"

namespace totvs.protheus.tax.smartx.tes

using namespace totvs.framework.structure.object

//-------------------------------------------------------------------
/*/{Protheus.doc} Model
Classe de modelo do cadastro de TES para Smart X

@type class
/*/
//-------------------------------------------------------------------
@totvsFrameworkStructureModel(description="Cadastro de TES")
class Model from totvs.framework.structure.model.data
    public method new() as object
    public method setModel()
endclass

//-------------------------------------------------------------------
/*/{Protheus.doc} new
Método construtor da classe

@type method
@return object, instância da classe
/*/
//-------------------------------------------------------------------
method new() as object class Model
_Super:new(,,.T.)
return self

//-------------------------------------------------------------------
/*/{Protheus.doc} setModel
Método de criação do modelo com base no objeto de dicionário

@type method
/*/
//-------------------------------------------------------------------
method setModel() class Model
local oSF4 as object
local oCC7 as object

oSF4 := ObjectFromMetadata():new("SF4")
::setObject(oSF4:getObject(), "SF4")

oCC7 := ObjectFromMetadata():new("CC7")
::addArray(oCC7:getObject(), "CC7", {"CC7_FILIAL", "CC7_TES"}, {"F4_FILIAL", "F4_CODIGO"}, "SF4")

return
```

### Key Points — Master-Detail Model

- Same includes, namespace, annotation, and class pattern as single-entity.
- **Header entity**: Created with `ObjectFromMetadata():new("HEADER_ALIAS")`, bound with `::setObject()`.
- **Detail entity**: Created with `ObjectFromMetadata():new("DETAIL_ALIAS")`, bound with `::addArray()`.
- **addArray parameters**: `::addArray(jObject, cAlias, aForeignKeys, aParentKeys, cParentAlias)` — the foreign key fields in the detail table that link to the parent key fields.
- **No extra parameters**: Do NOT pass `nMinItems`, `cTitle`, `cRef`, or `lIgnore` unless specifically required by the use case.
- **FwFreeObj**: Optionally call `FwFreeObj()` on ObjectFromMetadata instances after setup.
- **loadEventsFromMetadata**: Call `self:loadEventsFromMetadata()` after all entities are set up when the routine uses dictionary-based field events.

---

## Template: Model with Related Entity (1:1 Relationship)

A model with a primary entity and a related 1:1 entity (e.g., SB1 product + SB5 complement). In MVC, this corresponds to `AddFields` sub-models.

```tlpp
method setModel() class Model
local oSB1 as object
local oSB5 as object

oSB1 := ObjectFromMetadata():new("SB1")
::setObject(oSB1:getObject(), "SB1")

oSB5 := ObjectFromMetadata():new("SB5")
::addObject(oSB5:getObject(), "SB5", {"B5_FILIAL", "B5_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")

return
```

### Key Points — Related Entity (1:1)

- Same pattern as master-detail but uses `::addObject()` instead of `::addArray()`.
- **addObject parameters**: `::addObject(jObject, cRelationName, aProperties, aParentProperties, cParentObject, cTitle, cRef, lIgnore)`
- The foreign key fields in the related entity link to the parent key fields.
- Use `addObject` when the legacy MVC used `AddFields` (1:1 form fields).
- Use `addArray` when the legacy MVC used `AddGrid` (1:N grid rows).

---

## Template: Model 2 (Header + Items in Same Table)

When header and item data reside in the same physical table (e.g., SC7 for purchase orders), use separate `ObjectFromMetadata` instances with field lists to distinguish header from item fields.

```tlpp
method setModel() class Model
local oHeader as object
local oItems as object

oHeader := ObjectFromMetadata():new("SC7", {"C7_NUM", "C7_EMISSAO", "C7_FORNECE", "C7_LOJA", "C7_COND"}, {"C7_FILIAL","C7_NUM"})

oItems := ObjectFromMetadata():new("SC7", , {"C7_FILIAL","C7_NUM","C7_ITEM"})

::setObject(oHeader:getObject(), "SC7", .T., .T., , , {"C7_NUM", "C7_EMISSAO", "C7_FORNECE", "C7_LOJA", "C7_COND"})
::addArray(oItems:getObject(), "SC7ITEM", {"C7_FILIAL","C7_NUM"}, {"C7_FILIAL","C7_NUM"}, "SC7", , "Itens", "SC7ITEM")

return
```

### Key Points — Model 2

- **Header fields** are specified in the 2nd parameter (`aFieldList`) of `ObjectFromMetadata():new()` to restrict which fields belong to the header.
- **setObject** receives `.T.` in the 3rd parameter (`lIgnore`) AND `.T.` in the 4th parameter (`lModel2`), plus the 7th parameter listing the header fields as `aModel2ConsiderFields`.
- The detail alias uses a virtual name (e.g., `"SC7ITEM"`) different from the header alias.
- This pattern maps to MVC Model 2 where header and items share the same database table.

---

## Model API Reference

### totvs.framework.structure.model.data Methods

| Method | Description |
| --- | --- |
| `new(lSetSchema, lSolvedModel, lAdjustLookup)` | Constructor. Use `_Super:new(,,.T.)` for standard initialization |
| `setObject(jObject, cAlias, lIgnore, lModel2, aModel2IgnoreFields, cReference, aModel2ConsiderFields)` | Sets the primary entity object |
| `addObject(jObject, cRelationName, aProperties, aParentProperties, cParentObject, cTitle, cRef, lIgnore)` | Adds a related single object (1:1 relationship) |
| `addArray(jObject, cRelationName, aProperties, aParentProperties, cParentObject, nMinItems, cTitle, cRef, lIgnore)` | Adds a related array of objects (1:N relationship — grid items) |
| `setRequired(aRequired, cObject)` | Sets required fields (optional — dictionary metadata is used automatically) |
| `addRequired(aRequired, cObject)` | Adds additional required fields |
| `addExclude(aExclude, cObject)` | Removes fields from the model |
| `setProperty(cField, cSubProperty, xValue, cObject)` | Sets field property: `"description"`, `"format"`, `"readOnly"`, `"pattern"`, `"title"`, `"hidden"` |
| `addLookup(cField, cObject, jLookup)` | Adds a lookup to a field |
| `loadEventsFromMetadata(lTriggers, lValidations, lInitializers)` | Loads triggers, validations, and initializers from data dictionary (optional — use only when custom dictionary events are needed) |

### ObjectFromMetadata Parameters

```tlpp
// Standard usage — just the alias (recommended):
oEntity := ObjectFromMetadata():new("ALIAS")

// Full signature (use only when necessary):
oEntity := ObjectFromMetadata():new( ;
  cAlias,           ; // Table alias (e.g., "SED")
  aFieldList,       ; // Fields to include (nil = all from SX3)
  aFinder,          ; // Unique key fields (nil = resolved from SX2)
  cFilter           ; // oData filter always applied to this object
)
```

> **Recommendation**: Use the simple form `ObjectFromMetadata():new("ALIAS")` whenever possible. The class resolves key fields and other metadata automatically from the data dictionary (SX2/SX3).

---

### loadEventsFromMetadata

Loads triggers (SX7), validations (X3_VALID/X3_VLDUSER), and initializers (X3_RELACAO) from the data dictionary automatically.

```tlpp
// Load all events: triggers + validations + initializers
self:loadEventsFromMetadata()

// Load only specific events
self:loadEventsFromMetadata(.T., .F., .F.)  // Only triggers
self:loadEventsFromMetadata(.F., .T., .F.)  // Only validations
self:loadEventsFromMetadata(.F., .F., .T.)  // Only initializers
```

**When to use**: Call after `setObject`/`addArray`/`addObject` when the routine needs dictionary-based field validations, triggers, and initializers to execute during Smart X CRUD operations. This is the recommended approach, as shown in the official TDN examples.

**When NOT to use**: For very simple CRUD screens where `buildStandardView()` handles everything and no custom dictionary events exist.
