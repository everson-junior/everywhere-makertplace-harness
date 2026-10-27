# Smart X Interface Reference

Detailed templates and feature reference for `totvs.framework.structure.interface` classes.

> **CRITICAL — Method Implementation Syntax**: Method implementations (outside `class`/`endclass`) NEVER use `public`, `private`, `protected`, or `static`. Always write `method methodName() class ClassName`. Even if declared as `static method`, implement as `method ... class ClassName`.

---

## Table of Contents

- [Template: Simple View (Automatic Layout with buildStandardView)](#template-simple-view-automatic-layout-with-buildstandardview)
- [Template: View with Menu and Actions](#template-view-with-menu-and-actions)
- [Template: Master-Detail View (Automatic Layout)](#template-master-detail-view-automatic-layout)
- [BuildRelatedView (Sub-Routine Navigation)](#buildrelatedview-sub-routine-navigation)
- [Legends](#legends)
- [Table Actions](#table-actions)
- [Events (KeyDown)](#events-keydown)
- [Visual Components](#visual-components)
- [Field Properties](#field-properties)

---

## Template: Simple View (Automatic Layout with buildStandardView)

Use `buildStandardView()` for automatic layout. The framework generates dataView, dataNew, dataEdit, and dataDetail forms automatically from the model metadata. Based on the **Naturezas (SED)** reference implementation.

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.interface.th"

namespace totvs.protheus.financial.smartx.naturezas

using namespace totvs.framework.structure.interface

//-------------------------------------------------------------------
/*/{Protheus.doc} View
Classe de interface Smart X para o cadastro de naturezas (SED)

@type class
/*/
//-------------------------------------------------------------------
@totvsFrameworkStructureInterface(description="Cadastro de Naturezas")
class View
    private data oInterface as object

    public method new() as object
    public method setInterface()
    public method getContract() as json
endclass

//-------------------------------------------------------------------
/*/{Protheus.doc} new
Método construtor da classe

@type method
@return self, object, instância da classe
/*/
//-------------------------------------------------------------------
method new() as object class View
return self

//-------------------------------------------------------------------
/*/{Protheus.doc} setInterface
Método de construção da interface Smart X

@type method
/*/
//-------------------------------------------------------------------
method setInterface() class View
::oInterface := BuildContract():new("SED")
::oInterface:setModelId("totvs.protheus.financial.smartx.naturezas.model")
::oInterface:buildStandardView()
return

//-------------------------------------------------------------------
/*/{Protheus.doc} getContract
Retorna o contrato de interface Smart X

@type method
@return json, contrato da interface
/*/
//-------------------------------------------------------------------
method getContract() as json class View
return ::oInterface:getContract()
```

### Key Points — Simple View

- **Includes**: `#include "totvs.ch"` + `#include "totvs.framework.structure.interface.th"` only. Do NOT add `fw-tlpp-core.th`.
- **Using namespace**: `using namespace totvs.framework.structure.interface` — allows calling `BuildContract()`, `BuildDataView()`, `BuildAdvplAction()`, etc. without full qualification.
- **Annotation**: `@totvsFrameworkStructureInterface(description="...")` — `description` is required. Optional parameters `lookup` and `country` can be added if needed (e.g., `@totvsFrameworkStructureInterface(lookup=.F., country="All", description="...")`).
- **Class name**: Always `View`. The namespace already provides context.
- **BuildContract**: `BuildContract():new("ALIAS")` — receives the main table alias.
- **setModelId**: References the full namespace of the Model class (ending in `.model`, NOT the class name `Model`).
- **buildStandardView()**: Single call generates the entire interface automatically (dataView, dataNew, dataEdit, dataDetail) from the model metadata. This is the preferred approach for simple CRUD screens.

---

## Template: View with Menu and Actions

When the routine needs custom menu options (AdvPL actions), keyboard shortcuts (KeyDown events), or additional browse actions. Based on the **Produtos (SB1)** reference implementation.

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.interface.th"

namespace totvs.protheus.mat.smartx.produtos

using namespace totvs.framework.structure.interface

//-------------------------------------------------------------------
/*/{Protheus.doc} View
Classe de interface Smart X para o cadastro de produtos (SB1)

@type class
/*/
//-------------------------------------------------------------------
@totvsFrameworkStructureInterface(description="Cadastro de produtos")
class View
    private data oInterface as object

    public method new() as object
    public method setInterface()
    public method getContract() as json

    private method buildMenu()
    private method addKeyDownOption()
    private method addAdvplMeuOption()

    static method showResume()
endclass

//-------------------------------------------------------------------
/*/{Protheus.doc} new
Método construtor da classe

@type method
@return self, object, instância da classe
/*/
//-------------------------------------------------------------------
method new() as object class View
return self

//-------------------------------------------------------------------
/*/{Protheus.doc} setInterface
Método de construção da interface Smart X

@type method
/*/
//-------------------------------------------------------------------
method setInterface() class View
::oInterface := BuildContract():new("SB1")
::oInterface:setModelId("totvs.protheus.mat.smartx.produtos.model")
::buildMenu()
return

//-------------------------------------------------------------------
/*/{Protheus.doc} buildMenu
Cria as opções de menu da rotina

@type method
/*/
//-------------------------------------------------------------------
method buildMenu() class View
local jData as json

jData := ::oInterface:buildStandardView()

::addAdvplMeuOption(jData["view"])
::addKeyDownOption()

::oInterface:setDataView(jData["view"]:getDataView())
return

//-------------------------------------------------------------------
/*/{Protheus.doc} addAdvplMeuOption
Cria uma opção de rotinas ADVPL dentro do menu da rotina

@type method
@param oDataView, object, Objeto de DataView das opções da rotina
/*/
//-------------------------------------------------------------------
method addAdvplMeuOption(oDataView as object) class View
local oDescItemView as object

oDescItemView := BuildAdvplAction():new()
oDescItemView:setLabel("Resumo do produto")
oDescItemView:setRoutine("totvs.protheus.mat.smartx.produtos.view():showResume")
oDescItemView:setParams({"{{$selectedRow.B1_COD}}", "{{$selectedRow.B1_DESC}}", "{{$selectedRow.B1_TIPO}}", "{{$selectedRow.B1_UM}}"})
oDescItemView:setHasResponse(.F.)
oDataView:addTableAction(oDescItemView:getAction())

return

//-------------------------------------------------------------------
/*/{Protheus.doc} addKeyDownOption
Cria uma opção de keydown na visão da rotina

@type method
/*/
//-------------------------------------------------------------------
method addKeyDownOption() class View
local oKeyDownEvent as object
local oDescItemKeyDown as object

oDescItemKeyDown := BuildAdvplAction():new()
oDescItemKeyDown:setLabel("Resumo do produto")
oDescItemKeyDown:setRoutine("totvs.protheus.mat.smartx.produtos.view():showResume")
oDescItemKeyDown:setParams({"{{$selectedRow.B1_COD}}", "{{$selectedRow.B1_DESC}}", "{{$selectedRow.B1_TIPO}}", "{{$selectedRow.B1_UM}}"})
oDescItemKeyDown:setHasResponse(.F.)

oKeyDownEvent := BuildEvents():new()
oKeyDownEvent:addOnKeyDown({"dataView"}, /*aFields*/, {"f8"}, oDescItemKeyDown:getAction())

::oInterface:addInterfaceEvents(oKeyDownEvent:getEvents())

return

//-------------------------------------------------------------------
/*/{Protheus.doc} getContract
Retorna o contrato de interface Smart X

@type method
@return json, contrato da interface
/*/
//-------------------------------------------------------------------
method getContract() as json class View
return ::oInterface:getContract()

//-------------------------------------------------------------------
/*/{Protheus.doc} showResume
Exibe o resumo do produto em tela

@type method
/*/
//-------------------------------------------------------------------
method showResume(cCode as character, cDesc as character, cType as character, cUnit as character, cStorage as character) class View
local aValues as array

aValues := {cCode, cDesc, cType, cUnit, cStorage}

MsgInfo(I18n("Produto: #1" + CRLF + "Descrição: #2" + CRLF + "Tipo: #3" + CRLF + "Unidade de medida: #4", aValues))

aValues := aSize(aValues, 0)

return
```

### Key Points — View with Menu

- **buildStandardView() returns json**: When you need to customize the standard view (add actions, events), call `buildStandardView()` and capture the return value. The returned json contains a `"view"` key with the BuildDataView object.
- **Custom actions on the view**: Access `jData["view"]` to get the `BuildDataView` object, then call `addTableAction()` on it.
- **setDataView after customization**: After adding actions, call `::oInterface:setDataView(jData["view"]:getDataView())` to associate the customized view. When using manual `BuildDataView`, pass `.T.` as 2nd parameter for automatic layout: `::oInterface:setDataView(::oDataView:getDataView(), .T.)`.
- **setRoutine with namespace**: Use the full namespace path to the class method: `"namespace.view():methodName"`.
- **setHasResponse(.F.)**: Indicates the action does not return data that requires a browse refresh.

---

## Template: Master-Detail View (Automatic Layout)

For master-detail routines, `buildStandardView()` also works. Based on the **TES (SF4+CC7)** reference implementation.

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.interface.th"

namespace totvs.protheus.tax.smartx.tes

using namespace totvs.framework.structure.interface

//-------------------------------------------------------------------
/*/{Protheus.doc} View
Classe de interface Smart X para o cadastro de TES

@type class
/*/
//-------------------------------------------------------------------
@totvsFrameworkStructureInterface(description="Cadastro de TES")
class View
    private data oInterface as object

    public method new() as object
    public method setInterface()
    public method getContract() as json
endclass

//-------------------------------------------------------------------
/*/{Protheus.doc} new
Método construtor da classe

@type method
@return self, object, instância da classe
/*/
//-------------------------------------------------------------------
method new() as object class View
return self

//-------------------------------------------------------------------
/*/{Protheus.doc} setInterface
Método de construção da interface Smart X

@type method
/*/
//-------------------------------------------------------------------
method setInterface() class View
::oInterface := BuildContract():new("SF4")
::oInterface:setModelId("totvs.protheus.tax.smartx.tes.model")
::oInterface:buildStandardView()
return

//-------------------------------------------------------------------
/*/{Protheus.doc} getContract
Retorna o contrato de interface Smart X

@type method
@return json, contrato da interface
/*/
//-------------------------------------------------------------------
method getContract() as json class View
return ::oInterface:getContract()
```

### Key Points — Master-Detail View

- The master-detail view follows the **exact same pattern** as the simple view when using `buildStandardView()`.
- The framework automatically detects the master-detail relationship from the Model class (via `setObject` + `addArray`) and generates the appropriate header + grid layout.
- `BuildContract():new("SF4")` — uses the **header** table alias.
- The detail grid and its relationship are resolved automatically from the model metadata.

---

## BuildRelatedView (Sub-Routine Navigation)

Use `BuildRelatedView` to add navigation links to related routines from the browse. This replaces custom menu actions that open other routines.

```tlpp
local oRelatedView := BuildRelatedView():new() as object
oRelatedView:setLabel("Complemento de Produto")
oRelatedView:setRoutine("totvs.protheus.materials.smartx.complemento.view")
oDataView:addRelatedView(oRelatedView:getRelatedView())
```

### Key Points — BuildRelatedView

- **BuildRelatedView** creates a navigation link in the browse that opens another Smart X routine.
- `setLabel()` defines the label displayed to the user.
- `setRoutine()` receives the full namespace of the target View class (ending in `.view`).
- `addRelatedView()` is called on the `BuildDataView` object to attach the link.

---

## Legends

Three approaches for configuring status legends on the browse (dataView). These examples use the TDN reference pattern with `BuildDataView`.

### 1. Automatic from combo field (simplest)

```tlpp
::oDataView:setFieldAsLabel("ZZ1", "ZZ1_STATUS")
```

Automatically resolves combo values and assigns default colors.

### 2. Automatic with explicit color order

```tlpp
local oColors := LabelColors():new() as object
oColors:setColors({"green1","yellow1"})
::oDataView:setFieldAsLabel("ZZ1", "ZZ1_STATUS", oColors:getObject())
```

Colors are assigned to combo values in order.

### 3. Manual bind of values to labels and colors

```tlpp
local oColors := LabelColors():new() as object
oColors:bindColor('A', 'Autor',       'purple1')
oColors:bindColor('B', 'Interprete',  'blue1')
::oDataView:setFieldAsLabel("ZA0", "ZA0_LEGEND", oColors:getObject())
```

Full control over value-label-color mapping.

### Available SmartX Label Colors

| Property | PO-UI Token |
| --- | --- |
| Blue1 | color-01 |
| Blue2 | color-02 |
| Blue3 | color-03 |
| Blue4 | color-04 |
| Purple1 | color-05 |
| Purple2 | color-06 |
| Red1 | color-07 |
| Yellow1 | color-08 |
| Green1 | color-09 |
| Green2 | color-10 |
| Green3 | color-11 |
| Green4 | color-12 |

> **Note**: When using legends with `buildStandardView()`, you must capture the return value and configure legends on the view object before calling `setDataView()`. See the "View with Menu and Actions" template for the pattern.

---

## Table Actions

### Parameter Passing Convention (CRITICAL)

`BuildAdvplAction:setParams()` sends **each array element as a separate positional argument** to the target function. This is fundamentally different from legacy codeblocks, which have unrestricted parameter passing and can pass arrays, objects, or complex expressions as a single argument.

```tlpp
// setParams({"A", "B", "C"}) calls the function as: MyFunc("A", "B", "C")
// NOT as: MyFunc({"A", "B", "C"})
```

When using `setRoutine` to call any function, always verify the target function's expected parameter signature. If the function expects a parameter type that cannot be represented as individual string elements (e.g., a single array parameter, nested structures, objects), create a **wrapper method** in the View class that receives the individual arguments from `setParams` and adapts them to the expected signature.

### Custom AdvPL/TLPP Action

```tlpp
local oAdvplAction := BuildAdvplAction():new() as object
oAdvplAction:setLabel("Resumo do produto")
oAdvplAction:setRoutine("namespace.view():methodName")
oAdvplAction:setParams({"{{$selectedRow.FIELD1}}", "{{$selectedRow.FIELD2}}"})
oAdvplAction:setHasResponse(.F.)
oDataView:addTableAction(oAdvplAction:getAction())
```

### Knowledge Base Action

```tlpp
local oKBAction := BuildKnowledgeBaseAction():new() as object
oKBAction:setLabel("Banco de conhecimento")
oKBAction:setParams({"ALIAS", '{ "ALIAS_CODIGO": "{{$selectedRow.ALIAS_CODIGO}}" }'})
oDataView:addTableAction(oKBAction:getAction())
```

---

## Events (KeyDown)

```tlpp
local oKeyDownEvent as object
local oAction as object

oAction := BuildAdvplAction():new()
oAction:setLabel("Action Label")
oAction:setRoutine("namespace.view():methodName")
oAction:setParams({"{{$selectedRow.FIELD1}}"})
oAction:setHasResponse(.F.)

oKeyDownEvent := BuildEvents():new()
oKeyDownEvent:addOnKeyDown({"dataView"}, /*aFields*/, {"f8"}, oAction:getAction())

::oInterface:addInterfaceEvents(oKeyDownEvent:getEvents())
```

### Key Points — Events

- `addOnKeyDown` parameters: `aContexts` (where the key applies), `aFields` (nil = all fields), `aKeys` (key names like `"f8"`), `jAction` (action to execute).
- Events are set on the interface directly: `::oInterface:addInterfaceEvents(...)`.

---

## Visual Components

### Divider

```tlpp
local oComponent := BuildComponent():new() as object
oComponent:setDivider("Section Title")
```

### Radio Group (for combo fields)

```tlpp
oComponent:setRadioGroup(2, "medium")
::oDataNew:addComponent("ZZ1_TYPE", oComponent:getRadioGroup())
```

### Custom Element Ordering

```tlpp
local oElements := BuildElementsFromCode():new() as object
oElements:addElements({"ZZ1_CODIGO","ZZ1_NOME","ZZ1_TIPO"}, .F. /*follow array order, not X3 order*/)
::oDataNew:setElement(oElements:getElements())
```

> **Note**: Visual components like dividers, radio groups, and custom element ordering are used with manual layout (via `BuildDataNew`, `BuildDataEdit`). When using `buildStandardView()`, the layout is generated automatically from the model metadata.

---

## Field Properties

```tlpp
// Hide a field in the interface
::oDataNew:addProperty("ZZ1_SYSFIELD", "hidden", .T.)

// Auto-increment a field (line numbering in grids)
::oDataNew:addProperty("ZZ1_ITEM", "autoInc", .T.)

// Make a field read-only in the model
self:setProperty("ZZ1_FIELD", "readOnly", .T., "ZZ1")
```
