# Smart X Interface Features

## Legends

Three approaches for configuring legends in the native Smart X interface:

**1. Automatic from combo field (simplest):**

```tlpp
::oDataView:setFieldAsLabel("ZZ1", "ZZ1_STATUS")
```

**2. Automatic with explicit color order:**

```tlpp
local oColors := LabelColors():new() as object
oColors:setColors({"green1","yellow1"})
::oDataView:setFieldAsLabel("ZZ1", "ZZ1_STATUS", oColors:getObject())
```

**3. Manual bind of values to labels and colors:**

```tlpp
local oColors := LabelColors():new() as object
oColors:bindColor('A', 'Autor',       'purple1')
oColors:bindColor('B', 'Interprete',  'blue1')
::oDataView:setFieldAsLabel("ZA0", "ZA0_LEGEND", oColors:getObject())
```

**Available SmartX label colors:**

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

> **Note**: When using legends with `buildStandardView()`, capture the return value, configure legends on the view object, then call `setDataView()`. See the Produtos/SB1 template in [smartx-code-templates.md](smartx-code-templates.md) for the pattern.

## Table Actions (Row-Level Actions)

> **Parameter passing convention**: `BuildAdvplAction:setParams` sends each array element as a **separate positional argument** to the target function. Legacy codeblocks have unrestricted parameter passing. When converting any codeblock-based action to `BuildAdvplAction`, verify the target function's expected signature. If there is a mismatch, create a wrapper method in the View class that adapts the parameters.

**Custom AdvPL/TLPP function action:**

```tlpp
local oAdvplAction := BuildAdvplAction():new() as object
oAdvplAction:setLabel("Resumo do produto")
oAdvplAction:setRoutine("namespace.view():methodName")
oAdvplAction:setParams({"{{$selectedRow.FIELD1}}", "{{$selectedRow.FIELD2}}"})
oAdvplAction:setHasResponse(.F.)
oDataView:addTableAction(oAdvplAction:getAction())
```

**Knowledge Base action:**

```tlpp
local oKBAction := BuildKnowledgeBaseAction():new() as object
oKBAction:setLabel("Banco de conhecimento")
oKBAction:setParams({"ALIAS", '{ "ALIAS_CODIGO": "{{$selectedRow.ALIAS_CODIGO}}" }'})
oDataView:addTableAction(oKBAction:getAction())
```

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

## Visual Components (in dataNew/dataEdit)

**Divider:**

```tlpp
local oComponent := BuildComponent():new() as object
oComponent:setDivider("Section Title")
```

**Radio Group (for combo fields):**

```tlpp
oComponent:setRadioGroup(2, "medium")
::oDataNew:addComponent("ZZ1_TYPE", oComponent:getRadioGroup())
```

**Custom element ordering:**

```tlpp
local oElements := BuildElementsFromCode():new() as object
oElements:addElements({"ZZ1_CODIGO","ZZ1_NOME","ZZ1_TIPO"}, .F. /*follow array order, not X3 order*/)
::oDataNew:setElement(oElements:getElements())
```

> **Note**: Visual components like dividers, radio groups, and custom element ordering are used with manual layout (via `BuildDataNew`, `BuildDataEdit`). When using `buildStandardView()`, the layout is generated automatically from the model metadata.

## Field Properties

```tlpp
// Hide a field in the interface
::oDataNew:addProperty("ZZ1_SYSFIELD", "hidden", .T.)

// Auto-increment a field (line numbering)
::oDataNew:addProperty("ZZ1_ITEM", "autoInc", .T.)

// Make a field read-only in the model
self:setProperty("ZZ1_FIELD", "readOnly", .T., "ZZ1")
```
