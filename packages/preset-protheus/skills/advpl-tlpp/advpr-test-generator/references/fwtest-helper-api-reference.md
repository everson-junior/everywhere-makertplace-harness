# FWTestHelper API Reference

Complete method reference for the `FWTestHelper` class used in AdvPR test scripts.

---

## Lifecycle Methods

| Method                           | Description                                  | Parameters                                                    |
| -------------------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| `FWTestHelper():New()`           | Creates a new test helper instance           | —                                                             |
| `Activate()`                     | Activates the robot class for test execution | —                                                             |
| `Deactivate()`                   | Deactivates the robot after tests            | —                                                             |
| `UTOpenFilial(cGrp, cFil, cMod)` | Opens a specific branch/company              | `cGrp`: group, `cFil`: branch code, `cMod`: module (optional) |
| `UTCloseFilial()`                | Closes the current branch                    | —                                                             |
| `GetReleaseRobo()`               | Returns the AdvPR release version string     | —                                                             |

---

## Data Setup Methods

| Method                                       | Description                                        | Parameters                                                                                                                           |
| -------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `UTSetValue(cArray, cField, xValue)`         | Sets a field value for the test                    | `cArray`: `"aCab"` (header) or `"aItens"` (items) or MVC submodel ID; `cField`: field name; `xValue`: value                          |
| `UTAddLine(cArray)`                          | Adds a new line in the items array (grid)          | `cArray`: `"aItens"` or grid submodel ID                                                                                             |
| `GetACab()`                                  | Returns the header array set via `UTSetValue`      | —                                                                                                                                    |
| `GetAItens()`                                | Returns the items array set via `UTSetValue`       | —                                                                                                                                    |
| `UTSetParam(cParam, xValue, lChange)`        | Changes an SX6 parameter                           | `cParam`: parameter name (e.g., `"MV_ESTADO"`); `xValue`: new value; `lChange`: apply immediately (`.T.`) or defer to `UTLoadData()` |
| `UTChangePergunte(cPergunte, cItem, xValue)` | Changes a SX1 query parameter                      | `cPergunte`: query group code; `cItem`: item number; `xValue`: new value                                                             |
| `UTLoadData(lClearDB, aParam)`               | Imports XML layouts and executes CSV layouts       | `lClearDB`: clear tables before import; `aParam`: parameter backup array                                                             |
| `UTFindReg(cAlias, nOrder, cSeek)`           | Positions on a record for update/delete operations | `cAlias`: table alias; `nOrder`: index; `cSeek`: search key                                                                          |

---

## Execution Methods

| Method                            | Description                                               | Parameters                                                                                                                                                       |
| --------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UTCommitData(bExec, xParam...)`  | Executes the routine and captures errors                  | **MSExecAuto**: `bExec`: code block `{\|x,y\| ROUTINE(x,y)}`, followed by `GetACab()`, `GetAItens()`, operation code. **MVC**: no parameters — uses `SetModel()` |
| `SetModel(oModel)`                | Assigns the MVC model to the robot class                  | `oModel`: FWFormModel object loaded via `FWLoadModel()`                                                                                                          |
| `SetMsErroAuto()`                 | Configures private variables for MSExecAuto error capture | —                                                                                                                                                                |
| `UTStartRpt(cRoutine, cPergunte)` | Starts a report execution                                 | `cRoutine`: report function name; `cPergunte`: SX1 group                                                                                                         |

---

## Verification Methods

| Method                                       | Description                                                             | Parameters                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `UTQueryDB(cTable, cField, cFilter, xValue)` | Queries DB and validates expected field value                           | `cTable`: alias; `cField`: field; `cFilter`: WHERE condition; `xValue`: expected value |
| `UTCheckDB(cAlias, cField, xValue)`          | Quick check: validates a field value in the currently positioned record | `cAlias`: table alias; `cField`: field; `xValue`: expected value                       |
| `UTContDB(cTable, cFilter, nExpected)`       | Counts records matching a filter condition                              | `cTable`: alias; `cFilter`: WHERE; `nExpected`: expected count                         |
| `AssertTrue(lValue, cMsg)`                   | Asserts `oHelper:lOk` or a value is `.T.`                               | `lValue`: logical; `cMsg`: error message                                               |
| `AssertFalse(lValue, cMsg)`                  | Asserts a value is `.F.`                                                | `lValue`: logical; `cMsg`: error message                                               |

---

## Cleanup Methods

| Method                                          | Description                                          | Parameters                                                                      |
| ----------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| `UTClearDB(cAlias, cFilter)`                    | Deletes records matching a filter                    | `cAlias`: table alias; `cFilter`: WHERE condition                               |
| `UTRestParam()`                                 | Restores original SX6 parameter values               | —                                                                               |
| `UTAlterAutoCont(cTable, nOrder, cSeek, aData)` | Alters self-contained table data for the test        | `cTable`: alias; `nOrder`: index; `cSeek`: key; `aData`: `{field, value}` array |
| `UTRestAutoCont()`                              | Restores self-contained table data to original state | —                                                                               |

---

## REST API Test Methods

| Method                                         | Description                                  | Parameters                                                                   |
| ---------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| `UTSetAPI(cEndpoint, cModel)`                  | Configures the API endpoint and model        | `cEndpoint`: route (e.g., `"/api/v1"`); `cModel`: `"REST"` or `"SOAP"`       |
| `UTPostWS(cBody, aHeader, cFile)`              | Sends a POST request to the configured API   | `cBody`: JSON/XML body; `aHeader`: header array; `cFile`: baseline file name |
| `UTGetWS(aHeader, cFile)`                      | Sends a GET request                          | `aHeader`: header array; `cFile`: baseline file                              |
| `UTSetRouteMock(cRoute, cSubRoute, lRegistry)` | Configures mock server route for API testing | `cRoute`: main route; `cSubRoute`: sub-route; `lRegistry`: use registry      |
| `UTGetRouteMock()`                             | Returns the configured mock server URL       | —                                                                            |
| `UTRestRegistry()`                             | Restores original registry endpoint keys     | —                                                                            |
