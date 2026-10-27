---
name: advpr-test-generator
description: 'Generate AdvPR (Advanced Protheus Robot) non-interface test scripts using FWTestHelper. Supports MVC model tests (FWLoadModel + SetModel), MSExecAuto/ExecAuto tests (UTCommitData with code blocks), MVC model validation tests, report tests (UTStartRpt), and REST API tests (UTSetAPI + UTPostWS/UTGetWS). Use when a user says "AdvPR test", "FWTestHelper test", "unit test AdvPL", "MSExecAuto test", "MVC model test", "non-interface test", "create test script for Protheus routine", or "automate test without interface".'
license: MIT
metadata:
  domain: Protheus
  maintainer: Engenharia Protheus - Dados & DevOps
  author: Melkz Siqueira
  version: '4.1.0'
  category: Testing
---

# Protheus AdvPR Test Generator

## Overview

Generate non-interface automated test scripts for the TOTVS Protheus ERP using the **AdvPR** (Advanced Protheus Robot) framework. AdvPR uses the `FWTestHelper` class to automate test cases focused on **business rules** without UI interaction. It supports routines built with **MVC** (FWFormModel), **MSExecAuto/ExecAuto**, reports, processing routines, and REST API endpoints.

AdvPR test scripts follow a structured pattern:

1. **Test Suite** — a class grouping related test cases with `SetUpSuite` / `TearDownSuite`
2. **Test Cases** — individual methods testing one behavior each via `FWTestHelper`
3. **Assertions** — verification points using `AssertTrue`, `AssertFalse`, `UTQueryDB`, and `UTCheckDB`

## When to Use

Use this skill when:

- Creating non-interface automated tests for Protheus routines
- Testing MVC routines (ModelDef) without UI using `FWLoadModel` + `SetModel`
- Testing routines that support `MSExecAuto` / `ExecAuto` execution
- Validating MVC model business rules (field validations, triggers, calculations)
- Testing reports via `UTStartRpt`
- Testing REST API endpoints via `UTSetAPI` + `UTPostWS` / `UTGetWS`
- Needing fast, repeatable test execution focused on business logic
- Generating test suites for SmartTest / FWMyTestRunner execution

### When NOT to Use

- **Interface/E2E tests** → Use `tir-test-generator` (Python TIR scripts)
- **TLPP unit tests with @TestFixture** → Use ProBat framework

---

## AdvPR Architecture

```
┌───────────────────────────────────────────────────────┐
│  FWMyTestRunner (entry point)                         │
│  └── Loads and executes test suites                   │
│       ├── {Routine}TestSuite                          │
│       │    ├── SetUpSuite()  → Environment setup      │
│       │    ├── TearDownSuite() → Cleanup              │
│       │    └── {Routine}TestCase                      │
│       │         ├── TestCase_001() → FWTestHelper     │
│       │         ├── TestCase_002() → FWTestHelper     │
│       │         └── TestCase_NNN()                    │
│       └── ...                                         │
│                                                       │
│  FWTestHelper (core class)                            │
│  ├── Activate() / Deactivate()                        │
│  ├── UTSetValue()   → Set field values                │
│  ├── UTCommitData() → Execute routine (MVC/ExecAuto)  │
│  ├── UTQueryDB()    → Verify DB results               │
│  ├── UTCheckDB()    → Quick field check               │
│  ├── AssertTrue() / AssertFalse()                     │
│  ├── SetModel()     → Attach MVC model                │
│  ├── UTSetParam()   → Change SX6 parameters           │
│  ├── UTOpenFilial() → Open branch/company             │
│  ├── UTClearDB()    → Clean test data                 │
│  └── UTFindReg()    → Position on record              │
└───────────────────────────────────────────────────────┘
```

---

## Bundled Reference Files

This skill uses progressive disclosure. The SKILL.md body covers the architecture, generation workflow, the checklist, and best practices. Detailed code templates and API references are in the `references/` directory — read them on demand based on the scenario:

| Reference File | When to Read | Content |
| --- | --- | --- |
| [references/advpr-test-patterns.md](references/advpr-test-patterns.md) | Generating **test code** — selecting and adapting MVC, MSExecAuto, REST API, Report, or Mock Server patterns; building TestSuite/TestCase class structure | Full code templates for all 7 test patterns (MVC insert/delete, MSExecAuto single/master-detail, REST API, Mock Server, Report), TestSuite class template (SetUpSuite/TearDownSuite), TestCase class template with AddTestMethod registration |
| [references/fwtest-helper-api-reference.md](references/fwtest-helper-api-reference.md) | Looking up **FWTestHelper method** signatures, parameters, or usage details for lifecycle, data setup, execution, verification, cleanup, or REST API methods | Complete method reference tables: Lifecycle (New, Activate, Deactivate, UTOpenFilial), Data Setup (UTSetValue, UTAddLine, UTSetParam, UTFindReg), Execution (UTCommitData, SetModel, UTStartRpt), Verification (UTQueryDB, UTCheckDB, UTContDB, AssertTrue), Cleanup (UTClearDB, UTRestParam), REST API (UTSetAPI, UTPostWS, UTGetWS, UTSetRouteMock) |

> Also refer to [references/sonarqube-rules-reference.md](../references/sonarqube-rules-reference.md) for the complete SonarQube rules reference shared across skills.

---

## Step-by-Step Process

When generating an AdvPR test script, follow this process:

### 1. Identify the Routine Pattern

| Pattern        | How to Identify                                    | Test Approach                                     |
| -------------- | -------------------------------------------------- | ------------------------------------------------- |
| **MVC**        | Routine has `ModelDef()`, `ViewDef()`, `MenuDef()` | Use `FWLoadModel` + `SetModel` + `UTCommitData()` |
| **MSExecAuto** | Routine accepts `MSExecAuto` / `ExecAuto` calls    | Use `UTCommitData({code block}, params...)`       |
| **Report**     | Routine generates spool/report output              | Use `UTStartRpt` + `UTArqCompare`                 |
| **REST API**   | Routine exposes REST endpoints                     | Use `UTSetAPI` + `UTPostWS` / `UTGetWS`           |
| **Processing** | Routine processes data without UI                  | Use `UTCommitData` with custom code block         |

### 2. Define Test Cases

Apply the **Arrange-Act-Assert** pattern for each test case:

- **Arrange**: Set up data with `UTSetValue`, `UTSetParam`, `UTFindReg`
- **Act**: Execute with `UTCommitData`, `UTStartRpt`, or API call
- **Assert**: Verify with `UTQueryDB`, `UTCheckDB`, `UTContDB`, `AssertTrue`

### 3. Plan Test Data

- Use `UTLoadData` for bulk test data import (XML/CSV layouts)
- Use `UTSetValue` for inline data setup
- Use `UTSetParam` to configure SX6 parameters
- Use `UTChangePergunte` to set SX1 query parameters

### 4. Add Verification Points

- `UTQueryDB` — Validate specific field values in the database via SQL query
- `UTCheckDB` — Quick check on the currently positioned record
- `UTContDB` — Validate record count
- `UTArqCompare` — Compare report output with baseline file

### 5. Handle Cleanup

- `UTClearDB` — Remove test-created records
- `UTRestParam` — Restore changed SX6 parameters
- `UTRestAutoCont` — Restore self-contained table data

---

## MVC Operation Constants

When using `SetOperation()` with `FWLoadModel`:

| Constant                 | Value | Operation |
| ------------------------ | ----- | --------- |
| `MODEL_OPERATION_INSERT` | 3     | Include   |
| `MODEL_OPERATION_UPDATE` | 4     | Update    |
| `MODEL_OPERATION_DELETE` | 5     | Delete    |
| `MODEL_OPERATION_VIEW`   | 1     | View only |

These same values apply to the operation code in `MSExecAuto` routines.

---

## Best Practices

### Test Independence

- Each test case must be independent — it should not depend on another test's execution
- Always clean up created records at the end of each test or in `TearDownSuite`

### Naming Conventions

- TestSuite class: `{ROUTINE}TestSuite` (e.g., `MATA030TestSuite`)
- TestCase class: `{ROUTINE}TestCase` (e.g., `MATA030TestCase`)
- Test methods: `{ROUTINE}_NNN` (e.g., `MATA030_001`, `MATA030_002`)
- Descriptive name in `AddTestMethod`: short description of the test scenario

### Data Isolation

- Use unique test data values that don't conflict with production data
- Prefix test records with identifiers like `"AUT"`, `"TST"`, `"FAT"` for easy cleanup
- Always use `UTClearDB` or delete test records after verification

### Error Handling

- `oHelper:lOk` reflects the cumulative success/failure of the commit and verifications
- Always end with `AssertTrue(oHelper:lOk, "")` for proper result reporting
- Return `oHelper` from every test method for the framework to collect results

### Release-Conditional Tests

- Use `GetReleaseRobo()` to conditionally add tests that only work on certain releases:
  ```advpl
  If oHelper:GetReleaseRobo() >= "12.1.25"
    ::AddTestMethod("TEST_005",, "Feature added in 12.1.25")
  EndIf
  ```

### MSExecAuto Private Variables

- Always declare `Private lMsErroAuto := .F.` and `Private lAutoErrNoFile := .T.` before `UTCommitData` when testing ExecAuto routines

---

## Checklist

Before finalizing a generated AdvPR test script, verify:

- [ ] TestSuite class with `SetUpSuite` and `TearDownSuite` methods
- [ ] TestCase class extending `FWDefaultTestSuite` with registered methods via `AddTestMethod`
- [ ] Each test method creates `FWTestHelper():New()` and returns `oHelper`
- [ ] Correct pattern used (MVC with `SetModel` vs MSExecAuto with code block)
- [ ] MVC tests: `FWLoadModel` → `SetOperation` → `Activate` → `SetModel` → `UTSetValue` → `UTCommitData()`
- [ ] MSExecAuto tests: `Private lMsErroAuto` declared, `UTCommitData({code block}, params, op)`
- [ ] At least one verification point (`UTQueryDB` / `UTCheckDB` / `UTContDB`)
- [ ] Final `AssertTrue(oHelper:lOk, "")` in every test method
- [ ] Test data cleanup in `TearDownSuite` or within each test
- [ ] Parameter restoration via `UTRestParam` if `UTSetParam` was used
- [ ] Unique test data values (avoid conflicts with existing records)

---

## Related Skills

| Skill                          | When to Use Instead                             |
| ------------------------------ | ----------------------------------------------- |
| `tir-test-generator`  | E2E/interface tests using Python TIR scripts    |
| `mvc-generator`       | Creating MVC routines (the code being tested)   |
| `tlpp-rest-endpoint-generator` | Creating REST endpoints (the code being tested) |

