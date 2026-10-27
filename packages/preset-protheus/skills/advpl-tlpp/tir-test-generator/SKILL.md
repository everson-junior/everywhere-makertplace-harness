---
name: tir-test-generator
description: 'Generate TIR (TOTVS Interface Robot) end-to-end test scripts in Python for Protheus SmartClient/Webapp screens. Supports CRUD screen tests, MVC screen tests, grid interaction, report tests, field validation, and message box assertions. Use when a user says "TIR test", "interface test", "e2e test Protheus", "SmartClient test", "Webapp test", "screen test", "create Python test for Protheus screen", or "automate Protheus UI test".'
license: MIT
metadata:
  domain: Protheus
  maintainer: Engenharia Protheus - Dados & DevOps
  author: Melkz Siqueira
  version: '4.1.0'
  category: Testing
---

# Protheus TIR Test Generator

## Overview

Generate end-to-end **interface test scripts** in Python for the TOTVS Protheus ERP using the **TIR** (TOTVS Interface Robot) framework. TIR automates Protheus screens through the SmartClient/Webapp interface, validating complete user workflows including screen navigation, field interaction, grid manipulation, button clicks, and result assertions.

TIR tests use Python's `unittest` framework combined with the `tir.Webapp` class to:
1. **Connect** to a running Protheus Webapp environment
2. **Navigate** to specific routines via `Program()`
3. **Interact** with screen elements (fields, grids, buttons, folders)
4. **Assert** field values, screen states, and data integrity
5. **Tear down** the session cleanly

## When to Use

Use this skill when:

- Creating end-to-end UI tests for Protheus screens (CRUD, workflows)
- Testing MVC-generated screens via the SmartClient/Webapp interface
- Validating critical user journeys (complete business flows)
- Testing screen navigation, menu access, and dialog handling
- Validating field interactions (fill, check, read values)
- Testing grid operations (add rows, edit cells, scroll, select)
- Validating reports via parameter screens
- Needing visual/interface-level regression tests

### When NOT to Use

- **Non-interface/business logic tests** → Use `advpr-test-generator` (AdvPR/FWTestHelper)
- **TLPP unit tests** → Use ProBat (@TestFixture)

---

## TIR Architecture

```
┌─────────────────────────────────────────────────────┐
│  Python unittest Framework                          │
│  └── TestCase class                                 │
│       ├── setUpClass()  → Webapp + Setup + Program  │
│       ├── test_CT001()  → Test scenario 1           │
│       ├── test_CT002()  → Test scenario 2           │
│       ├── test_CTNNN()  → ...                       │
│       └── tearDownClass() → TearDown                │
│                                                     │
│  tir.Webapp (core class)                            │
│  ├── Setup()          → Environment config          │
│  ├── Program()        → Open routine                │
│  ├── SetValue()       → Fill fields / grid cells    │
│  ├── GetValue()       → Read field values           │
│  ├── SetButton()      → Click buttons               │
│  ├── SearchBrowse()   → Search in browse grid       │
│  ├── CheckResult()    → Assert field values         │
│  ├── CheckHelp()      → Handle help/error dialogs   │
│  ├── ClickGridCell()  → Interact with grid cells    │
│  ├── LoadGrid()       → Reload grid data            │
│  ├── ClickFolder()    → Switch tabs/folders         │
│  ├── MessageBoxClick()→ Handle message dialogs      │
│  ├── AssertTrue()     → Assert success              │
│  ├── AssertFalse()    → Assert failure expected      │
│  └── TearDown()       → Close session               │
└─────────────────────────────────────────────────────┘
```

---

## TIR Webapp Key Methods Reference

For the complete TIR Webapp API reference (Setup & Lifecycle, Field Interaction, Browse & Navigation, Grid Operations, Assertions & Validation, Dialog Handling, Parameters & Configuration), see [tir-webapp-methods-reference.md](references/tir-webapp-methods-reference.md).

---

## Test Script Patterns

TIR provides 10 reusable test script patterns covering: Standard CRUD (Include, Edit, Delete), Master-Detail with Grid, Tabs/Folders, View/Validate, Validation Error (Negative), Other Actions Menu, Report with Parameters, and Grid Checkbox Selection.

For all 10 complete test script templates with code, see [tir-test-patterns.md](references/tir-test-patterns.md).

---

## Complete Test File Structure

A complete TIR test file for a Protheus routine follows this structure:

```python
from tir import Webapp
import unittest

class {ROUTINE}(unittest.TestCase):
    """
    TIR E2E Tests for {ROUTINE} - {Description}
    Module: {MODULE}
    Tables: {TABLE_ALIASES}
    """

    @classmethod
    def setUpClass(inst):
        """Setup: Initialize Webapp, configure environment, open routine"""
        inst.oHelper = Webapp()
        inst.oHelper.Setup('{MODULE}', '{DATE}', 'T1', '{BRANCH}', '{ENVIRONMENT}')
        inst.oHelper.Program('{ROUTINE}')

    def test_{ROUTINE}_CT001(self):
        """CT001 — Include record with required fields"""
        # ... test implementation ...
        self.oHelper.AssertTrue()

    def test_{ROUTINE}_CT002(self):
        """CT002 — Edit existing record"""
        # ... test implementation ...
        self.oHelper.AssertTrue()

    def test_{ROUTINE}_CT003(self):
        """CT003 — Delete record"""
        # ... test implementation ...
        self.oHelper.AssertTrue()

    def test_{ROUTINE}_CT004(self):
        """CT004 — Validate required field rule"""
        # ... test implementation ...
        self.oHelper.AssertFalse()

    @classmethod
    def tearDownClass(inst):
        """Teardown: Close session and collect results"""
        inst.oHelper.TearDown()

if __name__ == '__main__':
    unittest.main()
```

---

## Step-by-Step Process

When generating a TIR test script, follow this process:

### 1. Identify the Screen Type

| Screen Type | Characteristics | Key Methods |
|-------------|----------------|-------------|
| **Simple CRUD** | Single form, no grid | `SetValue`, `SetButton`, `CheckResult` |
| **Master-Detail** | Form + grid (e.g., invoice header + items) | `SetValue` (grid=True), `LoadGrid`, `ClickGridCell` |
| **Tabbed Screen** | Multiple folders/tabs | `ClickFolder`, `SetValue` per tab |
| **Browse + Actions** | Browse grid with action menu | `SearchBrowse`, `SetButton('Outras Ações', sub_item=...)` |
| **Report** | Parameter screen + output | `SetValue` for params, `SetButton('OK')`, `WaitProcessing` |
| **Wizard** | Multi-step dialog flow | `SetButton('Avançar')`, `SetButton('Finalizar')` |

### 2. Map Screen Elements

For each test, identify:
- **Field labels** as they appear on screen (used by `SetValue` / `CheckResult`)
- **Button labels** (e.g., `'Incluir'`, `'Alterar'`, `'Confirmar'`, `'Salvar'`, `'Fechar'`)
- **Grid columns** and their headers
- **Tab/folder names**
- **Search key format** for `SearchBrowse` (usually `branch + code`, e.g., `'M SP 01 000001'`)

### 3. Define Test Scenarios

Apply the standard test scenario structure:

| Scenario | Pattern | Assertion |
|----------|---------|-----------|
| Include with required fields | Fill required fields → Confirm → View → Check | `AssertTrue()` |
| Include with all fields | Fill all fields → Confirm → View → Check | `AssertTrue()` |
| Edit existing record | Search → Edit → Modify → Confirm → View → Check | `AssertTrue()` |
| Delete record | Search → Delete → Confirm | `AssertTrue()` |
| Required field validation | Leave required field empty → Confirm → Check help | `AssertFalse()` |
| Business rule validation | Set invalid values → Confirm → Check help | `AssertFalse()` |

### 4. Handle Common Screen Interactions

| Interaction | Method |
|-------------|--------|
| Open routine | `Program('{ROUTINE}')` |
| Click a button | `SetButton('{Label}')` |
| Click sub-menu button | `SetButton('{Main}', sub_item='{Sub}')` |
| Fill a form field | `SetValue('{Label}', '{value}')` |
| Fill a grid cell | `SetValue('{Column}', '{value}', grid=True, grid_number=1, row=N)` |
| Refresh grid | `LoadGrid()` |
| Switch tab | `ClickFolder('{Tab Name}')` |
| Search in browse | `SearchBrowse('{key}', '{column}')` |
| Check field value | `CheckResult('{FIELD_NAME}', '{expected}')` |
| Handle error dialog | `CheckHelp(text_help='{ID}', button='Fechar')` |
| Wait for processing | `WaitProcessing('{message}')` |
| Send keyboard key | `SetKey('{KEY}', grid=True/False)` |

---

## Setup Requirements & Best Practices

For environment setup (Python, Webapp, `tir.json` configuration) and best practices (test independence, naming conventions, screen interactions, assertions, environment isolation), see [tir-setup-and-best-practices.md](references/tir-setup-and-best-practices.md).

---

## Checklist

Before finalizing a generated TIR test script, verify:

- [ ] Python file follows naming convention: `{ROUTINE}TESTCASE.py`
- [ ] Class uses `unittest.TestCase` as base class
- [ ] `setUpClass` contains `Webapp()`, `Setup()`, and `Program()` calls
- [ ] `tearDownClass` contains `TearDown()` call
- [ ] `Setup()` has correct module, date, group, branch, and environment
- [ ] Each test method starts with `test_` prefix
- [ ] Each test method has a docstring describing the scenario
- [ ] Positive tests end with `self.oHelper.AssertTrue()`
- [ ] Negative tests end with `self.oHelper.AssertFalse()`
- [ ] `LoadGrid()` called after grid `SetValue` operations
- [ ] `SearchBrowse` uses correct key format with branch prefix
- [ ] `CheckResult` uses field technical names (not labels)
- [ ] Error dialogs handled with `CheckHelp(text_help=..., button=...)`
- [ ] File ends with `if __name__ == '__main__': unittest.main()`

---

## Related Skills

| Skill | When to Use Instead |
|-------|-------------------|
| `advpr-test-generator` | Non-interface tests using FWTestHelper (faster, business logic focused) |
| `mvc-generator` | Creating MVC routines (the screens being tested) |
| `tlpp-rest-endpoint-generator` | Creating REST endpoints (test via AdvPR instead of TIR) |

