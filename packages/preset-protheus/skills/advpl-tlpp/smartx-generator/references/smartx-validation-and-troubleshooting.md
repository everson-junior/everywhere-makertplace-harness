# Smart X Validation & Troubleshooting

Server-side validation patterns and common troubleshooting scenarios for Smart X routines.

---

## Table of Contents

- [Smart X Field Validation](#smart-x-field-validation)
- [Troubleshooting](#troubleshooting)

---

## Smart X Field Validation

Smart X supports a dedicated server-side field validation mechanism via JSON contract:

```json
{
  "type": "serverValidate",
  "function": "MyValidateFunction",
  "contextInfo": ["{{$model.A1_EST}}"]
}
```

The validation function must follow this signature:

```tlpp
Function MyValidateFunction(xValue, cField, aContextInfo)
  Local jRet as json

  jRet := JsonObject():new()
  jRet['return'] := .T.
  jRet['notValidMessage'] := ""

  // Validation logic here
  If Empty(xValue)
    jRet['return'] := .F.
    jRet['notValidMessage'] := "Field cannot be empty"
  EndIf

Return jRet
```

> Smart X validations are configured in the data dictionary (ATUSX tool) via the "Valid Smart X" field and take priority over traditional X3_VALID and X3_VLDUSER validations.

---

## Troubleshooting

| Issue | Cause | Fix |
| --- | --- | --- |
| "Exception" on browse open | Legend uses an unmapped color name | Use a valid color from the label colors table or use `LabelColors` class |
| Empty browse — no records | Model `ObjectFromMetadata` uses wrong alias | Verify alias exists in SX2 — `ObjectFromMetadata():new("ALIAS")` resolves keys automatically from the dictionary |
| Forms don't open (dataNew) | `setModelId` in interface doesn't match model namespace | Ensure the namespace path in `setModelId()` matches the model's namespace exactly (ending in `.model`, not the class name) |
| Fields missing from form | Field not in SX3, or manual layout missing `addInclude` | When using `buildStandardView()` fields come from the dictionary automatically. For manual layout, add field list to `addInclude()` |
| Grid items not saving | `addArray` relationship keys don't match | Verify foreign key fields in `addArray` match parent key fields in `setObject` |
| Custom AdvPL action not firing | `setRoutine` uses invalid function/method name | Ensure function is compiled and accessible. For class methods, use `"namespace.view():methodName"` format |
| `.prw` file ignores TLPP features | TLPP directives silently ignored in `.prw` | Rename file to `.tlpp` — mandatory for native SmartX classes |
| Smart X icons in legends | Smart X does not support icon-based legends | Remove icon references; use color-based legends only |
| `buildStandardView()` not found | Wrong includes or missing `using namespace` | Ensure `#include "totvs.framework.structure.interface.th"` and `using namespace totvs.framework.structure.interface` are present |
| Executor not launching | Using old `launcher():new()` pattern | Use `launcher():show("namespace.view")` — single method call pattern |
