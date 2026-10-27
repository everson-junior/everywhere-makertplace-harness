# TIR Setup and Best Practices

## Setup Requirements

TIR tests require:

- **Python 3.7+** installed with `pip install tir`
- **Running Protheus Webapp** instance accessible via browser
- **SmartClient/Webapp** configured and accessible
- **Dedicated test environment** — TIR interacts with the real interface, so avoid sharing with manual testing
- **Test data** — Pre-existing records for edit/delete/view tests

### Configuration File

TIR uses a `tir.json` configuration file in the test directory:

```json
{
    "Url": "http://{server}:{port}",
    "Browser": "chrome",
    "Environment": "{environment}",
    "User": "{user}",
    "Password": "{password}",
    "Language": "pt-br",
    "ScreenShot": true,
    "Debug": false,
    "TimeOut": 90,
    "Headless": false
}
```

---

## Best Practices

### Test Independence
- Each `test_` method should be independent of other tests
- Use `setUpClass` for environment configuration only
- If tests have data dependencies (e.g., CT002 edits what CT001 created), document this clearly and ensure test execution order via naming convention (`test_CT001`, `test_CT002`)

### Naming Conventions
- Test file: `{ROUTINE}TESTCASE.py` (e.g., `MATA010TESTCASE.py`)
- Test class: Same as routine name (e.g., `MATA010`)
- Test methods: `test_{ROUTINE}_CT{NNN}` (e.g., `test_MATA010_CT001`)
- Docstrings on each test method describing the scenario

### Screen Interactions
- Always call `LoadGrid()` after `SetValue` on grid cells to ensure values are applied
- Use `SearchBrowse` with the correct key format (branch + code, padded with spaces)
- Handle unexpected dialogs with `CheckHelp` or `MessageBoxClick`
- Use `WaitProcessing` when operations trigger server-side processing

### Assertions
- End positive tests with `self.oHelper.AssertTrue()`
- End negative tests (expected errors) with `self.oHelper.AssertFalse()`
- Use `CheckResult` before `AssertTrue` to validate specific field values
- `CheckResult` uses the **field technical name** (e.g., `'A1_COD'`), not the label

### Environment Isolation
- Use a dedicated Protheus environment for TIR execution
- Ensure test data doesn't interfere with other testing or development
- Configure `tir.json` per environment
