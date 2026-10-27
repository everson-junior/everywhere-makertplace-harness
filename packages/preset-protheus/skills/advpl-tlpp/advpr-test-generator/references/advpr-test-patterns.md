# AdvPR Test Script Patterns

Complete code templates for each AdvPR test pattern. Use the appropriate pattern based on the routine type identified in the Step-by-Step Process.

---

## Test Script Patterns

### Pattern 1: MVC Insert Test (Form)

Tests a routine that uses the MVC pattern (ModelDef/ViewDef) by loading the model directly.

```advpl
//-------------------------------------------------------------------
// MVC Insert: Create a new record via FWLoadModel
//-------------------------------------------------------------------
METHOD {ROUTINE}_001() CLASS {ROUTINE}TestCase

  Local oHelper      := FWTestHelper():New()  // Robot instance
  Local oModel       := FWLoadModel("{ROUTINE}")  // Load MVC model
  Local cTable       := ""  // Verification variable
  Local cQuery       := ""  // Verification variable

  //------------------------------------
  // Set operation: Insert
  //------------------------------------
  oModel:SetOperation(MODEL_OPERATION_INSERT)

  //------------------------------------
  // Activate the MVC model
  //------------------------------------
  oModel:Activate()

  //------------------------------------
  // Assign model to robot class
  //------------------------------------
  oHelper:SetModel(oModel)

  //------------------------------------
  // Activate robot
  //------------------------------------
  oHelper:Activate()

  //------------------------------------
  // Set field values (use submodel ID from ModelDef)
  //------------------------------------
  oHelper:UTSetValue("{SUBMODEL_ID}", "{TABLE_FIELD1}", {VALUE1})
  oHelper:UTSetValue("{SUBMODEL_ID}", "{TABLE_FIELD2}", {VALUE2})
  oHelper:UTSetValue("{SUBMODEL_ID}", "{TABLE_FIELD3}", {VALUE3})

  //------------------------------------
  // Execute commit (MVC — no parameters)
  //------------------------------------
  oHelper:UTCommitData()

  //------------------------------------
  // Verification point
  //------------------------------------
  cTable := "{TABLE_ALIAS}"
  cQuery := "{FIELD1} = '{VALUE1}' AND {FIELD2} = '{VALUE2}'"

  oHelper:UTQueryDB(cTable, "{FIELD1}", cQuery, {VALUE1})
  oHelper:UTQueryDB(cTable, "{FIELD2}", cQuery, {VALUE2})
  oHelper:UTQueryDB(cTable, "{FIELD3}", cQuery, {VALUE3})

  //------------------------------------
  // Expected result
  //------------------------------------
  oHelper:AssertTrue(oHelper:lOk, "")

Return(oHelper)
```

### Pattern 2: MVC Delete Test (Form)

Tests record deletion by positioning on the record first with `UTFindReg`.

```advpl
//-------------------------------------------------------------------
// MVC Delete: Remove a record via FWLoadModel
//-------------------------------------------------------------------
METHOD {ROUTINE}_002() CLASS {ROUTINE}TestCase

  Local oHelper      := FWTestHelper():New()
  Local oModel       := FWLoadModel("{ROUTINE}")
  Local cTable       := ""
  Local cQuery       := ""

  //------------------------------------
  // Position on record to delete
  //------------------------------------
  oHelper:UTFindReg("{TABLE_ALIAS}", 1, "{SEEK_KEY}")

  //------------------------------------
  // Set operation: Delete
  //------------------------------------
  oModel:SetOperation(MODEL_OPERATION_DELETE)
  oModel:Activate()

  //------------------------------------
  // Assign model and activate robot
  //------------------------------------
  oHelper:SetModel(oModel)
  oHelper:Activate()

  //------------------------------------
  // Execute commit (MVC)
  //------------------------------------
  oHelper:UTCommitData()

  //------------------------------------
  // Verification: record should not exist
  //------------------------------------
  cTable := "{TABLE_ALIAS}"
  cQuery := "{FIELD1} = '{VALUE1}' AND {FIELD2} = '{VALUE2}'"

  oHelper:UTQueryDB(cTable, "{FIELD1}", cQuery, "")

  //------------------------------------
  // Expected result
  //------------------------------------
  oHelper:AssertTrue(oHelper:lOk, "")

Return(oHelper)
```

### Pattern 3: MSExecAuto Test (ExecAuto Routines)

Tests routines that support automatic execution via `MSExecAuto` / `ExecAuto` by passing header and items arrays.

```advpl
//-------------------------------------------------------------------
// MSExecAuto: Insert via ExecAuto
//-------------------------------------------------------------------
METHOD {ROUTINE}_003() CLASS {ROUTINE}TestCase

  Local oHelper      := FWTestHelper():New()
  Local cTable       := ""
  Local cQuery       := ""

  Private lMsErroAuto    := .F.
  Private lAutoErrNoFile := .T.

  //------------------------------------
  // Activate robot
  //------------------------------------
  oHelper:Activate()

  //------------------------------------
  // Set header fields (aCab)
  //------------------------------------
  oHelper:UTSetValue("aCab", "{FIELD1}", {VALUE1})
  oHelper:UTSetValue("aCab", "{FIELD2}", {VALUE2})
  oHelper:UTSetValue("aCab", "{FIELD3}", {VALUE3})

  //------------------------------------
  // Set item fields (aItens) — if applicable
  //------------------------------------
  oHelper:UTSetValue("aItens", "{ITEM_FIELD1}", {ITEM_VALUE1})
  oHelper:UTSetValue("aItens", "{ITEM_FIELD2}", {ITEM_VALUE2})

  //------------------------------------------------------------------
  // Execute: UTCommitData receives the same parameters as MSExecAuto
  // Operation codes: 3 = Insert, 4 = Update, 5 = Delete
  //------------------------------------------------------------------
  oHelper:UTCommitData({|x,y| {ROUTINE}(x,y)}, oHelper:GetACab(), 3)
  // For master-detail:
  // oHelper:UTCommitData({|x,y,z| {ROUTINE}(x,y,z)}, oHelper:GetACab(), oHelper:GetAItens(), 3)

  //------------------------------------
  // Verification point
  //------------------------------------
  cTable := "{TABLE_ALIAS}"
  cQuery := "{FIELD1} = '{VALUE1}'"

  oHelper:UTQueryDB(cTable, "{FIELD1}", cQuery, {VALUE1})
  oHelper:UTQueryDB(cTable, "{FIELD2}", cQuery, {VALUE2})

  //------------------------------------
  // Expected result
  //------------------------------------
  oHelper:AssertTrue(oHelper:lOk, "")

Return(oHelper)
```

### Pattern 4: MSExecAuto with Grid (Master-Detail)

Tests master-detail routines by adding multiple item lines.

```advpl
//-------------------------------------------------------------------
// MSExecAuto: Master-detail insert with grid lines
//-------------------------------------------------------------------
METHOD {ROUTINE}_004() CLASS {ROUTINE}TestCase

  Local oHelper      := FWTestHelper():New()

  Private lMsErroAuto    := .F.
  Private lAutoErrNoFile := .T.

  oHelper:Activate()

  //------------------------------------
  // Header (aCab)
  //------------------------------------
  oHelper:UTSetValue("aCab", "{HDR_FIELD1}", {HDR_VALUE1})
  oHelper:UTSetValue("aCab", "{HDR_FIELD2}", {HDR_VALUE2})

  //------------------------------------
  // Item line 1 (aItens)
  //------------------------------------
  oHelper:UTSetValue("aItens", "{ITEM_FIELD1}", {ITEM_VALUE1})
  oHelper:UTSetValue("aItens", "{ITEM_FIELD2}", {ITEM_VALUE2})

  //------------------------------------
  // Item line 2 — add new line
  //------------------------------------
  oHelper:UTAddLine("aItens")
  oHelper:UTSetValue("aItens", "{ITEM_FIELD1}", {ITEM_VALUE3})
  oHelper:UTSetValue("aItens", "{ITEM_FIELD2}", {ITEM_VALUE4})

  //------------------------------------------------------------------
  // Execute with master-detail parameters
  //------------------------------------------------------------------
  oHelper:UTCommitData({|x,y,z| {ROUTINE}(x,y,z)}, oHelper:GetACab(), oHelper:GetAItens(), 3)

  //------------------------------------
  // Verification
  //------------------------------------
  oHelper:AssertTrue(oHelper:lOk, "")

Return(oHelper)
```

### Pattern 5: REST API Test

Tests REST API endpoints using `UTSetAPI` and `UTPostWS`.

```advpl
//-------------------------------------------------------------------
// REST API Test: POST endpoint validation
//-------------------------------------------------------------------
METHOD {ROUTINE}_005() CLASS {ROUTINE}TestCase

  Local oHelper      := FWTestHelper():New()
  Local aHeader      := {"Content-Type: application/json"}
  Local cBody        := '{"field1": "value1", "field2": "value2"}'
  Local cRet         := ""

  oHelper:Activate()

  //------------------------------------
  // Configure API endpoint
  //------------------------------------
  oHelper:UTSetAPI("/api/v1/{resource}", "REST")

  //------------------------------------
  // Execute POST request
  //------------------------------------
  cRet := oHelper:UTPostWS(cBody, aHeader, "{BASELINE_FILE}")

  //------------------------------------
  // Expected result
  //------------------------------------
  oHelper:AssertTrue(oHelper:lOk, "")

Return(oHelper)
```

### Pattern 6: REST API with Mock Server

Tests API integrations using the AdvPR mock server.

```advpl
//-------------------------------------------------------------------
// REST API Test with Mock Server
//-------------------------------------------------------------------
METHOD {ROUTINE}_006() CLASS {ROUTINE}TestCase

  Local oHelper      := FWTestHelper():New()
  Local cMockServer  := ""

  oHelper:Activate()

  //------------------------------------
  // Configure mock server route
  //------------------------------------
  oHelper:UTSetRouteMock("{service_route}",, .T.)

  cMockServer := oHelper:UTGetRouteMock()

  //------------------------------------
  // Update parameter to point to mock
  //------------------------------------
  oHelper:UTSetParam("{MV_PARAM}", cMockServer, .T.)

  //------------------------------------
  // Execute the integration logic
  //------------------------------------
  oHelper:UTCommitData({|x| {IntegrationFunction}(x)}, "{endpoint}")

  //------------------------------------
  // Restore registry and verify
  //------------------------------------
  oHelper:UTRestRegistry()

  oHelper:AssertTrue(oHelper:lOk, "")

Return(oHelper)
```

### Pattern 7: Report Test

Tests Protheus report routines using `UTStartRpt` and baseline comparison.

```advpl
//-------------------------------------------------------------------
// Report Test: Parameters + execution + output comparison
//-------------------------------------------------------------------
METHOD {ROUTINE}_007() CLASS {ROUTINE}TestCase

  Local oHelper := FWTestHelper():New()

  oHelper:Activate()

  //------------------------------------
  // Set report parameters (SX1)
  //------------------------------------
  oHelper:UTChangePergunte("{PERGUNTE}", "01", {PARAM_VALUE1})
  oHelper:UTChangePergunte("{PERGUNTE}", "02", {PARAM_VALUE2})

  //------------------------------------
  // Execute report
  //------------------------------------
  oHelper:UTStartRpt("{REPORT_FUNCTION}", "{PERGUNTE}")

  //------------------------------------
  // Compare output with baseline
  //------------------------------------
  oHelper:UTArqCompare("{BASELINE_FILE}")

  oHelper:AssertTrue(oHelper:lOk, "")

Return(oHelper)
```

---

## Test Suite Structure

Every AdvPR test project consists of a **TestSuite** class and a **TestCase** class.

### TestSuite Class Template

The TestSuite handles environment setup (`SetUpSuite`) and teardown (`TearDownSuite`).

```advpl
#include "totvs.ch"
#include "fwmvcdef.ch"

//===================================================================
// TestSuite: Manages setup and teardown for {ROUTINE} tests
//===================================================================
CLASS {ROUTINE}TestSuite

  DATA oBrowse
  DATA aParam

  METHOD New() CONSTRUCTOR
  METHOD SetUpSuite()
  METHOD TearDownSuite()

ENDCLASS

//-------------------------------------------------------------------
METHOD New() CLASS {ROUTINE}TestSuite
Return

//-------------------------------------------------------------------
// SetUpSuite: Prepares environment for all test cases
//-------------------------------------------------------------------
METHOD SetUpSuite() CLASS {ROUTINE}TestSuite

  Local oHelper := FWTestHelper():New()

  //------------------------------------
  // Open branch/company
  //------------------------------------
  oHelper:UTOpenFilial("T1", "D MG01 ")

  oHelper:Activate()

  //------------------------------------
  // Change parameters if needed
  //------------------------------------
  oHelper:UTSetParam("MV_PARAM1", "VALUE1", .T.)

  //------------------------------------
  // Import test data (XML/CSV layouts)
  //------------------------------------
  oHelper:UTLoadData(.T., ::aParam)

  Conout("Setup realizado com sucesso!")

Return(oHelper)

//-------------------------------------------------------------------
// TearDownSuite: Cleans up after all test cases
//-------------------------------------------------------------------
METHOD TearDownSuite() CLASS {ROUTINE}TestSuite

  Local oHelper := FWTestHelper():New()

  oHelper:Activate()

  //------------------------------------
  // Restore parameters
  //------------------------------------
  oHelper:UTRestParam()

  //------------------------------------
  // Clean test data
  //------------------------------------
  oHelper:UTClearDB("{TABLE_ALIAS}", "{FILTER_CONDITION}")

  oHelper:Deactivate()

  Conout("TearDown realizado com sucesso!")

Return(oHelper)
```

### TestCase Class Template

The TestCase class groups individual test methods. `AddTestMethod` registers each test.

```advpl
//===================================================================
// TestCase: Individual test cases for {ROUTINE}
//===================================================================
CLASS {ROUTINE}TestCase FROM FWDefaultTestSuite

  METHOD {ROUTINE}TestCase()  // Test registration

  METHOD {ROUTINE}_001()      // Insert test
  METHOD {ROUTINE}_002()      // Update test
  METHOD {ROUTINE}_003()      // Delete test
  METHOD {ROUTINE}_004()      // Validation test

ENDCLASS

//-------------------------------------------------------------------
// Register test methods with AdvPR
//-------------------------------------------------------------------
METHOD {ROUTINE}TestCase() CLASS {ROUTINE}TestCase

  Local oHelper := FWTestHelper():New()

  _Super:FWDefaultTestSuite()

  ::AddTestMethod("{ROUTINE}_001",, "Insert record with required fields")
  ::AddTestMethod("{ROUTINE}_002",, "Update record fields")
  ::AddTestMethod("{ROUTINE}_003",, "Delete existing record")
  ::AddTestMethod("{ROUTINE}_004",, "Validate required field rules")

  // Conditional test based on release
  If oHelper:GetReleaseRobo() >= "12.1.25"
    ::AddTestMethod("{ROUTINE}_005",, "New feature in 12.1.25+")
  EndIf

Return
```
