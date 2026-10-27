# Smart X Troubleshooting

## Common Pitfalls

| Issue | Cause | Fix |
| --- | --- | --- |
| `C2021 Missing class prototype definition of method X` | Method implemented outside `endclass` but not declared inside `class`/`endclass` block | Add `private method X()` (empty `()`) to the class declaration. Prototype uses empty `()` — parameters and return type belong only in the implementation, never in the declaration |
| `Cannot find method JSONOBJECT:SETFIELDASLABEL` | `setFieldAsLabel` called on result of `buildStandardView()` (which returns JSON) instead of a `BuildDataView` instance | Declare `private data oDataView as object` in the class; instantiate with `BuildDataView():new("id","namespace.model")`; call `::oDataView:setFieldAsLabel(...)`; inject with `::oInterface:setDataView(::oDataView:getDataView(), .T.)` |
| "Exception" on browse open | Legend uses an unmapped color name without `cColorPoUi` | Pass the PO-UI color explicitly in `LabelColors` |
| Empty browse — no records | Model `ObjectFromMetadata` uses wrong alias | Verify alias exists in SX2 — `ObjectFromMetadata():new("ALIAS")` resolves keys automatically |
| Forms don't open (dataNew) | `setModelId` in interface doesn't match model namespace | Ensure namespace in `setModelId()` matches the model's namespace (ending in `.model`, not class name) |
| Fields missing from form | Field not in SX3, or manual layout missing `addInclude` | With `buildStandardView()` fields come from dictionary. For manual layout, use `addInclude()` |
| Grid items not saving | `addArray` relationship keys don't match | Verify foreign key fields in `addArray` match parent key fields in `setObject` |
| Icons in legends | Smart X does not support icon-based legends | Remove icon references; use color-based legends only |
| Custom AdvPL action not firing | `setRoutine` uses invalid function/method name | Ensure function is compiled. For class methods, use `"namespace.view():methodName"` format |
| `.prw` file ignores TLPP features | TLPP directives silently ignored in `.prw` | Rename file to `.tlpp` — mandatory for native SmartX classes |
| `buildStandardView()` not found | Wrong includes or missing `using namespace` | Ensure `#include "totvs.framework.structure.interface.th"` and `using namespace totvs.framework.structure.interface` |
| Executor not launching | Using old `launcher():new()` pattern | Use `launcher():show("namespace.view")` — single method call pattern |
| ExecAuto broken after migration | `ModelDef`/`ViewDef` were removed or modified | NEVER delete legacy ModelDef/ViewDef — they MUST coexist with SmartX native files |
| Sub-model data not loading | Sub-model not added to SmartX Model class | Add ALL sub-models from legacy ModelDef using `addObject` (1:1) or `addArray` (1:N) |
| `addObject` wrong relationship | FK/PK fields mismatch | Extract relationship keys from legacy `SetRelation()` call — ignore `xFilial()` expressions |
| Entry points stopped working | Legacy source modified during migration | NEVER modify `ExistBlock()`/`ExecBlock()` calls or PE-related code in legacy source |
| 1:1 sub-model shows as grid | Used `addArray` instead of `addObject` | For MVC `AddFields` sub-models, use `addObject()` (1:1). For `AddGrid`, use `addArray()` (1:N) |
