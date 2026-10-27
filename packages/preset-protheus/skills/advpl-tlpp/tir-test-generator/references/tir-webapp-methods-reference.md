# TIR Webapp Key Methods Reference

## Setup & Lifecycle

| Method | Description | Parameters |
|--------|-------------|------------|
| `Webapp()` | Creates a new TIR Webapp instance | — |
| `Setup(cModule, cDate, cGroup, cBranch, cEnvironment)` | Configures the Protheus session | `cModule`: module code (e.g., `'SIGAFAT'`); `cDate`: date string; `cGroup`: user group; `cBranch`: branch code; `cEnvironment`: environment ID |
| `Program(cRoutine)` | Opens a specific routine | `cRoutine`: routine name (e.g., `'MATA010'`) |
| `TearDown()` | Closes the session and collects results | — |
| `Finish()` | Alternative session closer | — |

## Field Interaction

| Method | Description | Key Parameters |
|--------|-------------|----------------|
| `SetValue(cField, xValue)` | Sets a field value on screen | `cField`: field label or name; `xValue`: value to set |
| `SetValue(cField, xValue, grid=True, grid_number=N, row=N)` | Sets a grid cell value | Additional: `grid`: True for grid; `grid_number`: which grid; `row`: row number |
| `GetValue(cField)` | Returns the current field value | `cField`: field label or name |
| `SetButton(cButton)` | Clicks a button by label | `cButton`: button text (e.g., `'Incluir'`, `'Salvar'`, `'Confirmar'`) |
| `SetButton(cButton, sub_item=cSub)` | Clicks a menu button with sub-item | `cButton`: main button; `cSub`: sub-item text |
| `SetKey(cKey, grid=False, grid_number=1)` | Sends a keyboard key | `cKey`: key name (`'ENTER'`, `'DOWN'`, `'F12'`, `'DELETE'`, etc.) |

## Browse & Navigation

| Method | Description | Key Parameters |
|--------|-------------|----------------|
| `SearchBrowse(cValue, cKey)` | Searches for a record in the browse grid | `cValue`: search value; `cKey`: search key/column (optional) |
| `ClickFolder(cFolder)` | Clicks a folder/tab on screen | `cFolder`: tab label (e.g., `'Complementos'`) |
| `SetLateralMenu(cItem)` | Clicks a lateral menu item | `cItem`: menu item text |
| `ClickTree(cItem)` | Clicks a tree node | `cItem`: node text |

## Grid Operations

| Method | Description | Key Parameters |
|--------|-------------|----------------|
| `ClickGridCell(cColumn, row=N, grid_number=N)` | Clicks a specific grid cell | `cColumn`: column header; `row`: row number; `grid_number`: grid index |
| `ClickGridHeader(cColumn, grid_number=N)` | Clicks a grid column header | `cColumn`: column text |
| `LoadGrid()` | Reloads/refreshes the grid data | — |
| `ScrollGrid(cColumn, match_value=cVal, grid_number=N)` | Scrolls grid to find a value | `cColumn`: column; `match_value`: value to find |
| `LengthGridLines(grid_number=N)` | Returns the number of grid rows | `grid_number`: which grid |
| `ClickBox(cField, cValue, select_all=False, grid_number=N)` | Clicks checkbox in a grid row | `cField`: column; `cValue`: matching value |
| `ClickCheckBox(cLabel)` | Clicks a standalone checkbox | `cLabel`: checkbox label |

## Assertions & Validation

| Method | Description | Key Parameters |
|--------|-------------|----------------|
| `CheckResult(cField, xExpected)` | Asserts a field value equals expected | `cField`: field name; `xExpected`: expected value |
| `CheckResult(cField, xExpected, grid=True, line=N, grid_number=N)` | Asserts a grid cell value | Additional grid parameters |
| `CheckHelp(text_help=cText, button=cBtn)` | Validates a help/error message and clicks button | `text_help`: expected help ID; `button`: button to click |
| `AssertTrue()` | Asserts no errors occurred in the test | — |
| `AssertFalse()` | Asserts that errors were expected (negative test) | — |
| `WaitFieldValue(cField, xValue)` | Waits until a field has a specific value | `cField`: field; `xValue`: expected value |
| `WaitShow(cTitle)` | Waits for a screen/dialog to appear | `cTitle`: window title |
| `WaitHide(cTitle)` | Waits for a screen/dialog to disappear | `cTitle`: window title |
| `WaitProcessing(cMessage)` | Waits for a processing screen to finish | `cMessage`: processing message |

## Dialog Handling

| Method | Description | Key Parameters |
|--------|-------------|----------------|
| `MessageBoxClick(cMessage, cButton)` | Handles a message box dialog | `cMessage`: expected message; `cButton`: button to click |
| `SetCalendar(cField, cDate)` | Sets a calendar/date picker field | `cField`: field label; `cDate`: date string |
| `SetFilePath(cPath)` | Sets a file path in a file dialog | `cPath`: file path |

## Parameters & Configuration

| Method | Description | Key Parameters |
|--------|-------------|----------------|
| `SetParameters(aParams)` | Sets multiple parameters at once | `aParams`: list of parameter tuples |
| `AddParameter(cParamName, cBranch, cType, cContent, cContent2)` | Adds an individual parameter | Various parameter attributes |
| `RestoreParameters()` | Restores original parameter values | — |
| `SetBranch(cBranch)` | Changes the current branch | `cBranch`: branch code |
| `ChangeEnvironment(cEnv, cDate, cGroup, cBranch)` | Changes the full environment | All environment fields |
