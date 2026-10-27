# Security Review Patterns (SonarQube G1)

Detailed code examples and tables for security-related code review findings.

---

## SQL Injection (CA2050 / CA2051) — CRITICAL

```advpl
// BAD: Concatenating user input into SQL — SQL Injection risk
cQuery := "SELECT * FROM " + RetSqlName("SA1") + " WHERE A1_COD = '" + cCodCli + "'"
dbSelectArea("SA1")
dbSetQuery(cQuery)

// GOOD: Use FWPreparedStatement to prevent injection
Local oStatement := FWPreparedStatement():New()
oStatement:SetQuery("SELECT * FROM " + RetSqlName("SA1") + " WHERE A1_COD = ?")
oStatement:SetString(1, cCodCli)
oStatement:Execute()
```

---

## Hardcoded Credentials (CA2052) — CRITICAL

```advpl
// BAD: Password exposed in source code
cPassword := "admin123"

// GOOD: Use environment configuration
cPassword := GetMV("XX_SRVPASS")
```

---

## Environment Context in REST/SOAP (BG1000) — MAJOR

```advpl
// BAD: Manual RpcSetEnv inside REST service
@Get("/api/customers")
Function GetCust()
  RpcSetEnv("T1", "M SP 01")  // Prohibited in REST
  // ...
Return

// GOOD: Configure PrepareIn on REST Server
// appserver.ini: [HTTPREST] > PrepareIn=T1,M SP 01
```

---

## Restricted / Prohibited Functions

| Rule   | Function            | Severity | Action                                                                    |
| ------ | ------------------- | -------- | ------------------------------------------------------------------------- |
| CA2022 | `StaticCall()`      | CRITICAL | Replace with `FWLoadModel()`, `FWLoadMenuDef()`, or direct namespace call |
| CA2023 | `PTInternal()`      | CRITICAL | Remove — prohibited without exception                                     |
| CA2024 | `__cUserID := ...`  | CRITICAL | Never assign — read-only system variable                                  |
| CA2025 | `cEmpAnt := ...`    | CRITICAL | Never assign — use environment APIs                                       |
| CA2053 | `CREATE PROCEDURE`  | CRITICAL | Use SPManager for procedure management                                    |
| BG1200 | `ErrorBlock({...})` | INFO     | Migrate to `Try-Catch` (TLPP)                                             |
