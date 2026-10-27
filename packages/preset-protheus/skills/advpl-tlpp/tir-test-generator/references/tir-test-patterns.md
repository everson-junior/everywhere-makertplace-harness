# TIR Test Script Patterns

## Pattern 1: Standard CRUD — Include Record

```python
from tir import Webapp
import unittest

class {ROUTINE}(unittest.TestCase):

    @classmethod
    def setUpClass(inst):
        inst.oHelper = Webapp()
        inst.oHelper.Setup('{MODULE}', '{DATE}', 'T1', '{BRANCH}', '{ENVIRONMENT}')
        inst.oHelper.Program('{ROUTINE}')

    def test_{ROUTINE}_CT001(self):
        """Include a new record with required fields"""

        self.oHelper.SetButton('Incluir')

        # Fill header fields
        self.oHelper.SetValue('{Field Label 1}', '{value1}')
        self.oHelper.SetValue('{Field Label 2}', '{value2}')
        self.oHelper.SetValue('{Field Label 3}', '{value3}')

        self.oHelper.SetButton('Confirmar')

        # Verify the record was created
        self.oHelper.SearchBrowse(f'{BRANCH}{search_key}', '{Search Column}')
        self.oHelper.SetButton('Visualizar')
        self.oHelper.CheckResult('{FIELD_NAME}', '{expected_value}')
        self.oHelper.SetButton('Fechar')

        self.oHelper.AssertTrue()

    @classmethod
    def tearDownClass(inst):
        inst.oHelper.TearDown()

if __name__ == '__main__':
    unittest.main()
```

## Pattern 2: Standard CRUD — Edit Record

```python
def test_{ROUTINE}_CT002(self):
    """Edit an existing record"""

    # Search and select the record
    self.oHelper.SearchBrowse(f'{BRANCH}{search_key}', '{Search Column}')
    self.oHelper.SetButton('Alterar')

    # Modify field values
    self.oHelper.SetValue('{Field Label}', '{new_value}')

    self.oHelper.SetButton('Confirmar')

    # Verify the modification
    self.oHelper.SearchBrowse(f'{BRANCH}{search_key}', '{Search Column}')
    self.oHelper.SetButton('Visualizar')
    self.oHelper.CheckResult('{FIELD_NAME}', '{expected_new_value}')
    self.oHelper.SetButton('Fechar')

    self.oHelper.AssertTrue()
```

## Pattern 3: Standard CRUD — Delete Record

```python
def test_{ROUTINE}_CT003(self):
    """Delete an existing record"""

    # Search and select the record
    self.oHelper.SearchBrowse(f'{BRANCH}{search_key}', '{Search Column}')
    self.oHelper.SetButton('Outras Ações', sub_item='Excluir')
    self.oHelper.SetButton('Confirmar')

    self.oHelper.AssertTrue()
```

## Pattern 4: Master-Detail with Grid

```python
def test_{ROUTINE}_CT004(self):
    """Include record with grid items (master-detail)"""

    self.oHelper.SetButton('Incluir')

    # Fill header fields
    self.oHelper.SetValue('{Header Field 1}', '{value1}')
    self.oHelper.SetValue('{Header Field 2}', '{value2}')

    # Fill grid row 1
    self.oHelper.SetValue('{Grid Column 1}', '{item_value1}', grid=True, grid_number=1, row=1)
    self.oHelper.SetValue('{Grid Column 2}', '{item_value2}', grid=True, grid_number=1, row=1)
    self.oHelper.LoadGrid()

    # Fill grid row 2 (new line)
    self.oHelper.SetValue('{Grid Column 1}', '{item_value3}', grid=True, grid_number=1, row=2)
    self.oHelper.SetValue('{Grid Column 2}', '{item_value4}', grid=True, grid_number=1, row=2)
    self.oHelper.LoadGrid()

    self.oHelper.SetButton('Confirmar')

    self.oHelper.AssertTrue()
```

## Pattern 5: Screen with Tabs/Folders

```python
def test_{ROUTINE}_CT005(self):
    """Include record navigating through tabs"""

    self.oHelper.SetButton('Incluir')

    # Tab 1 — Main
    self.oHelper.SetValue('{Field 1}', '{value1}')
    self.oHelper.SetValue('{Field 2}', '{value2}')

    # Switch to second tab
    self.oHelper.ClickFolder('{Tab Name}')

    self.oHelper.SetValue('{Field 3}', '{value3}')
    self.oHelper.SetValue('{Field 4}', '{value4}')

    self.oHelper.SetButton('Confirmar')

    self.oHelper.AssertTrue()
```

## Pattern 6: View/Validate Record

```python
def test_{ROUTINE}_CT006(self):
    """View record and validate multiple field values"""

    self.oHelper.SearchBrowse(f'{BRANCH}{search_key}', '{Search Column}')
    self.oHelper.SetButton('Visualizar')

    # Check field values
    self.oHelper.CheckResult('{FIELD_NAME_1}', '{expected_1}')
    self.oHelper.CheckResult('{FIELD_NAME_2}', '{expected_2}')
    self.oHelper.CheckResult('{FIELD_NAME_3}', '{expected_3}')

    # Check grid values
    self.oHelper.CheckResult('{Grid Column}', '{expected_grid_value}', grid=True, line=1, grid_number=1)

    self.oHelper.SetButton('Fechar')

    self.oHelper.AssertTrue()
```

## Pattern 7: Validation Error Test (Negative)

```python
def test_{ROUTINE}_CT007(self):
    """Validate that required field error is shown"""

    self.oHelper.SetButton('Incluir')

    # Intentionally leave required field empty
    self.oHelper.SetValue('{Optional Field}', '{value}')

    self.oHelper.SetButton('Confirmar')

    # Expect a help/error dialog
    self.oHelper.CheckHelp(text_help='{HELP_ID}', button='Fechar')

    self.oHelper.SetButton('Cancelar')

    self.oHelper.AssertFalse()
```

## Pattern 8: Other Actions Menu

```python
def test_{ROUTINE}_CT008(self):
    """Execute an action from the 'Other Actions' menu"""

    self.oHelper.SearchBrowse(f'{BRANCH}{search_key}', '{Search Column}')
    self.oHelper.SetButton('Outras Ações', sub_item='{Action Name}')

    # Handle the action-specific screen
    self.oHelper.SetValue('{Action Field}', '{value}')
    self.oHelper.SetButton('Confirmar')

    self.oHelper.AssertTrue()
```

## Pattern 9: Report Test with Parameters

```python
from tir import Webapp
import unittest

class {REPORT}(unittest.TestCase):

    @classmethod
    def setUpClass(inst):
        inst.oHelper = Webapp()
        inst.oHelper.Setup('{MODULE}', '{DATE}', 'T1', '{BRANCH}', '{ENVIRONMENT}')
        inst.oHelper.Program('{REPORT_ROUTINE}')

    def test_{REPORT}_CT001(self):
        """Execute report with parameters and validate"""

        # Fill report parameters
        self.oHelper.SetValue('{Param 1 Label}', '{param_value_1}')
        self.oHelper.SetValue('{Param 2 Label}', '{param_value_2}')

        # Execute the report
        self.oHelper.SetButton('OK')

        # Wait for processing
        self.oHelper.WaitProcessing('{Processing message}')

        self.oHelper.AssertTrue()

    @classmethod
    def tearDownClass(inst):
        inst.oHelper.TearDown()

if __name__ == '__main__':
    unittest.main()
```

## Pattern 10: Grid Checkbox Selection

```python
def test_{ROUTINE}_CT010(self):
    """Select items via grid checkboxes"""

    self.oHelper.SearchBrowse(f'{BRANCH}{search_key}', '{Search Column}')
    self.oHelper.SetButton('{Action}')

    # Select specific items by checkbox
    self.oHelper.ClickBox('{Column}', '{value1}', grid_number=1)
    self.oHelper.ClickBox('{Column}', '{value2}', grid_number=1)

    self.oHelper.SetButton('Confirmar')

    self.oHelper.AssertTrue()
```
