---
name: protheus-development-guidelines
description: "Core AdvPL and TLPP development guidelines, naming conventions (Hungarian notation), static typing, MVC and SmartX architecture, error handling, database operations, and testing standards for TOTVS Protheus ERP. Use when writing, modifying, reviewing, or structuring AdvPL/TLPP code in Protheus."
license: MIT
metadata:
  domain: Protheus
  category: Architecture and Guidelines
  version: '4.1.0'
---

# Protheus AdvPL/TLPP Development Guidelines

## Language and Ecosystem

Source code for **TOTVS Protheus ERP** in **AdvPL** (`.prw`, `.prg`, `.prx`) and **TLPP** (`.tlpp`) languages, with automated tests in **Python** (TIR - Interface and e2e) and **AdvPR** (`.prw` - Unit tests without UI).

> **Default Language**: All interactions, documentation, comments, commit messages, and reviews must be in **Brazilian Portuguese**, except for code identifiers (variable names, functions, classes) that follow technical conventions in English or standard Protheus abbreviations.

---

## Code Conventions & Standards

### 1. Naming & Hungarian Notation (Mandatory)
Every variable MUST use Hungarian notation indicating type:
- `c` (character/string): `cQuery`, `cAlias`
- `n` (numeric/integer/float): `nTotal`, `nRecNo`
- `l` (logical/boolean): `lFound`, `lOk`
- `a` (array): `aRotina`, `aItems`
- `o` (object/instance): `oModel`, `oView`
- `d` (date): `dEmissao`, `dData`
- `b` (codeblock): `bAction`, `bFilter`
- `j` (json): `jPayload`, `jResponse`
- `x` (variant/any): `xValue`

### 2. Type System
Prefer TLPP with strict static typing:
```tlpp
Function u_Exemplo(cCodigo as Character, nValor as Numeric) as Logical
  Local lRet as Logical
  lRet := .T.
  Return lRet
```

### 3. Database & SQL Queries
- Use Embedded SQL (`BeginSql` ... `EndSql`) or TCQuery.
- Always include `WHERE D_E_L_E_T_ = ' '` and filter by branch (`xFilial`).
- Never perform queries inside loops.
- Always close aliases with `(cAlias)->(DbCloseArea())`.

### 4. Architecture Standards
- **Smart X**: Native UI framework using `totvs.framework.structure` with Model, View, and Executor classes in `.tlpp`.
- **MVC (FWFormModel / FWFormView)**: Separate ModelDef, ViewDef, and MenuDef.
- **REST Endpoints**: Use TLPP `@Get`, `@Post`, `@Put`, `@Delete` decorators with structured JSON payloads.

For full reference documentation, consult [instructions/AGENTS.md](../../../instructions/AGENTS.md) and [instructions/CLAUDE.md](../../../instructions/CLAUDE.md).
