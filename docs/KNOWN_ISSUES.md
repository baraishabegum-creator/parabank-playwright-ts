---
name: known-issues
description: Documented unexpected behaviors in ParaBank app that reveal discrepancies between documentation and actual implementation
metadata:
  type: project
---

## Known Issues in ParaBank Implementation

### Issue 1: Empty Loan Amount Shows Internal Error Instead of Validation Message
**Test ID**: TC-LOAN-010  
**Documentation Expectation**: "Error message: 'Loan amount is required.' Form validation triggers"  
**Actual Behavior**: Shows "Error! An internal error has occurred and has been logged."  
**Status**: ❌ **Bug** — Validation not working properly; internal error instead of user-friendly message  
**Test Annotation**: `test.fixme()` — test skipped until validation fix lands  
**Why**: The application should validate empty fields before processing, but instead throws an internal error  
**How to apply**: Fix validation logic in LoanController or LoanPage to properly handle empty loan amount fields  

### Issue 2: Empty Down Payment Shows Internal Error Instead of Validation Message
**Test ID**: TC-LOAN-011  
**Documentation Expectation**: "Validation error: 'Down payment is required.'"  
**Actual Behavior**: Shows "Error! An internal error has occurred and has been logged."  
**Status**: ❌ **Bug** — Validation not working properly; internal error instead of user-friendly message  
**Test Annotation**: `test.fixme()` — test skipped until validation fix lands  
**Why**: The application should validate empty down payment fields before processing, but instead throws an internal error  
**How to apply**: Fix validation logic in LoanController or LoanPage to properly handle empty down payment fields  

### Issue 3: Negative Down Payment Not Properly Handled
**Test ID**: TC-LOAN-007  
**Documentation Expectation**: "Error message: 'Down payment must be greater than or equal to zero.'"  
**Actual Behavior**: Loan is processed and denied with "You do not have sufficient funds for the given down payment."  
**Status**: ⚠️ **Needs Investigation** — May indicate incorrect validation flow  
**Test Annotation**: `test.fixme()` — test skipped until validation fix lands  
**Why**: The app should reject negative down payments with a specific validation error, but instead processes and denies the loan  
**How to apply**: Investigate validation flow in LoanController to ensure negative down payments are caught before loan processing  

### Issue 4: Zero Amount Loan Processing
**Test ID**: TC-LOAN-006  
**Documentation Expectation**: "Loan request fails"  
**Actual Behavior**: Shows "Error! An internal error has occurred and has been logged."  
**Status**: ⚠️ **Needs Verification** — Unclear if this is expected or bug  
**Test Annotation**: `test.fixme()` — test skipped until validation fix lands  
**Why**: The documentation states loan request should fail, but the application appears to process zero amount loans  
**How to apply**: Verify actual business logic for zero amount loans and update documentation or fix implementation  

### Issue 5: Negative Loan Amount Not Properly Handled
**Test ID**: TC-LOAN-005  
**Documentation Expectation**: "Error message: 'Loan amount must be greater than zero.'"  
**Actual Behavior**: Loan is processed and denied with "You do not have sufficient funds for the given down payment."  
**Status**: ⚠️ **Needs Investigation** — May indicate incorrect validation flow  
**Test Annotation**: `test.fixme()` — test skipped until validation fix lands  
**Why**: The app should reject negative loan amounts with a specific validation error, but instead processes and denies the loan  
**How to apply**: Investigate validation flow in LoanController to ensure negative loan amounts are caught before loan processing  

### Issue 6: Missing From Account Selection Not Enforced
**Test ID**: TC-LOAN-012  
**Documentation Expectation**: "Error message: 'Please select an account for down payment.'"  
**Actual Behavior**: App uses default selected account and processes/denies the loan anyway  
**Status**: ⚠️ **Needs Investigation** — Missing from account not enforced  
**Test Annotation**: `test.fixme()` — test skipped until validation fix lands  
**Why**: The app should require explicit account selection, but falls back to default  
**How to apply**: Investigate controller logic to enforce explicit from-account selection  

---

## Verified vs Unverified Findings

### Verified Findings (Confirmed by Source Code per docs/DOCUMENTATION_AUDIT_REPORT.md)
- **VF-001**: Password exposure in logs (LoginController.java:60) — CONFIRMED  
- **VF-002**: Missing amount validation (TransferFormValidator.java:18-21) — CONFIRMED  
- **VF-003**: Authentication check exists (LoginInterceptor.java:19-42) — CONFIRMED  

### Unverified Security Hypotheses
- **UH-001**: No account ownership verification — Requires deeper investigation  
- **UH-002**: Race condition vulnerability — Needs concurrent testing  
- **UH-003**: No rate limiting — Requires load testing  
- **UH-004**: CSRF protection missing — Needs JSP review  
- **UH-005–011**: Plain text passwords, SQL injection, XSS, same-account transfer, session fixation, clickjacking, API rate limiting — All require verification  

---

## Test Failures Related to Unexpected Behavior

### Critical Bugs (Require Immediate Fix — annotated with test.fixme)
- TC-LOAN-010: Empty loan amount causes internal error instead of validation message
- TC-LOAN-011: Empty down payment causes internal error instead of validation message

### Needs Investigation (annotated with test.fixme)
- TC-LOAN-005: Negative loan amount not caught by validation
- TC-LOAN-006: Zero amount loan processing behavior unclear
- TC-LOAN-007: Negative down payment not properly rejected
- TC-LOAN-012: Missing from account not enforced

---

## Recommendations for Resolution

1. **Fix Validation Logic**: Implement proper field validation in LoanController before processing loan requests  
2. **Add Input Validation**: Ensure empty fields trigger user-friendly validation errors, not internal errors  
3. **Update Documentation**: Align documentation with actual implementation once fixes are made  
4. **Add Verification Status**: Clearly mark each finding as "Verified" or "To Be Verified" in documentation  
5. **Complete Missing Test Cases**: Add preconditions to the 26 incomplete test cases in TRANSFER_FUNDS_EDGE_CASES_COMPREHENSIVE.md
