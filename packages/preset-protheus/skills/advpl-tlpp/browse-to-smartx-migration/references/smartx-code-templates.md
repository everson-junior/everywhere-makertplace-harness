# Smart X Code Templates

> **CRITICAL — Method Implementation Syntax**: In AdvPL/TLPP, method **implementations** (outside the `class`/`endclass` block) NEVER use access modifiers (`public`, `private`, `protected`) or `static`. Always use bare `method methodName() class ClassName`. Even if the declaration says `static method foo()`, the implementation must be `method foo() class ClassName` — **NEVER** `static method foo() class ClassName`. See the "Class & Method Syntax Rules" section in AGENTS.md for the full reference.

## Architecture

Native Smart X uses a three-file architecture with class-based TLPP:

```
┌────────────────────────────────────────────────────────────┐
│ Executor Function (.tlpp)                                   │
│  └─ launcher():show("namespace.view")                      │
├────────────────────────────────────────────────────────────┤
│ View Class (.tlpp)                                         │
│  @totvsFrameworkStructureInterface annotation               │
│  ├─ BuildContract → setModelId → buildStandardView()       │
│  └─ BuildAdvplAction, BuildEvents, legends (when legacy has custom actions, events, or legends) │
├────────────────────────────────────────────────────────────┤
│ Model Class (.tlpp)                                        │
│  @totvsFrameworkStructureModel annotation                   │
│  extends totvs.framework.structure.model.data              │
│  ├─ setObject() → primary entity (header)                  │
│  ├─ addObject() → 1:1 related entities (form sub-models)   │
│  └─ addArray() → 1:N detail entities (grid items)          │
└────────────────────────────────────────────────────────────┘
```

## Required Includes

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

## Template: Single-Entity Model

Based on the **Naturezas (SED)** reference implementation.

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

## Template: Master-Detail Model (Header + Items)

Based on the **TES (SF4+CC7)** reference implementation. Header table SF4, detail table CC7 with relationship keys.

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

## Template: Multi-Sub-Model (1:1 + 1:N Combined)

For complex routines with both 1:1 form sub-models (`addObject`) and 1:N grid sub-models (`addArray`). Example: SB1 (Produtos) with SB5 (Complemento), SVK (PCP), SA5 (Fornecedores), SBZ (Indicadores).

```tlpp
#include "totvs.ch"
#include "totvs.framework.structure.model.th"

namespace totvs.protheus.mat.smartx.produtos

using namespace totvs.framework.structure.object

//-------------------------------------------------------------------
/*/{Protheus.doc} Model
Classe de modelo do cadastro de produtos (SB1) para Smart X
com sub-modelos completos

@type class
/*/
//-------------------------------------------------------------------
@totvsFrameworkStructureModel(description="Cadastro de produtos")
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
Método de criação do modelo com base nos objetos de dicionário.
Mapeia todas as entidades: SB1 (principal), SB5/SVK (1:1), SA5/SBZ (1:N)

@type method
/*/
//-------------------------------------------------------------------
method setModel() class Model
local oSB1 as object
local oSB5 as object
local oSVK as object
local oSA5 as object
local oSBZ as object

// Entidade principal - Produtos
oSB1 := ObjectFromMetadata():new("SB1")
::setObject(oSB1:getObject(), "SB1")

// 1:1 - Complemento de Produto (legacy: AddFields "SB5DETAIL")
oSB5 := ObjectFromMetadata():new("SB5")
::addObject(oSB5:getObject(), "SB5", {"B5_FILIAL", "B5_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")

// 1:1 - Complemento PCP (legacy: AddFields "SVKDETAIL")
oSVK := ObjectFromMetadata():new("SVK")
::addObject(oSVK:getObject(), "SVK", {"VK_FILIAL", "VK_COD"}, {"B1_FILIAL", "B1_COD"}, "SB1")

// 1:N - Produto x Fornecedor (legacy: AddGrid "MdGridSA5")
oSA5 := ObjectFromMetadata():new("SA5")
::addArray(oSA5:getObject(), "SA5", {"A5_FILIAL", "A5_PRODUTO"}, {"B1_FILIAL", "B1_COD"}, "SB1")

// 1:N - Indicadores por Filial (legacy: AddGrid "SBZDETAIL")
oSBZ := ObjectFromMetadata():new("SBZ")
::addArray(oSBZ:getObject(), "SBZ", {"BZ_COD"}, {"B1_COD"}, "SB1")

return
```

## Template: View Class (Simple — Automatic Layout)

Based on the **Naturezas (SED)** reference implementation. Uses `buildStandardView()` for fully automatic layout.

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

## Template: View Class (With Menu, Actions, and Events)

Based on the **Produtos (SB1)** reference implementation. Extends `buildStandardView()` with custom AdvPL actions and KeyDown events.

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

## Template: Executor Function

The executor pattern uses a single method call: `launcher():show()`.

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
