# Transfer Funds Feature - Comprehensive Edge Case Test Scenarios
## Senior QA Engineer Analysis

**Application:** ParaBank Banking Web Application  
**Feature Under Test:** Transfer Funds (Fund Transfer Between Accounts)  
**Analysis Date:** 2026-11-27  
**Prepared By:** Senior QA Engineer  
**Risk Level:** CRITICAL (Financial Transaction Feature)

---

## Executive Summary

After comprehensive code analysis of the Transfer Funds feature, I've identified **CRITICAL GAPS** in validation logic that expose the application to:
- **Financial fraud** (unauthorized transfers)
- **Data integrity issues** (race conditions, negative balances)
- **Business logic bypass** (insufficient funds check missing)
- **Security vulnerabilities** (authorization gaps)

This document presents **75+ edge case scenarios** covering functional, negative, security, and performance aspects with exploitation vectors and remediation strategies.

---

## Code Analysis Findings

### Critical Issues Identified:

1. **Missing Insufficient Funds Validation**
   - Location: `TransferFormValidator.java:20`
   - Current: Only checks if amount is empty
   - Impact: Users can overdraft accounts

2. **No Account Ownership Verification**
   - Location: `TransferController.java`
   - Impact: Potential unauthorized access via account ID manipulation

3. **Client-Side Transfer Logic**
   - Location: `transfer.jsp:93-119`
   - Issue: AJAX call with URL parameters (easily manipulated)
   - URL: `services_proxy/bank/transfer?fromAccountId=X&toAccountId=Y&amount=Z`

4. **No Same-Account Prevention**
   - Impact: Can transfer to same account (data integrity concern)

5. **BigDecimal Precision Handling**
   - Location: `Account.java:41-46` (credit/debit methods)
   - Risk: Rounding errors with excessive decimal places

6. **No Transaction Atomicity Guarantee**
   - Risk: Race conditions on concurrent transfers

---

## Test Scenario Categories

### Category Breakdown:
- **Functional Edge Cases:** 25 scenarios
- **Negative Test Cases:** 20 scenarios
- **Security Test Cases:** 18 scenarios
- **Concurrency & Performance:** 8 scenarios
- **Data Integrity Tests:** 10 scenarios
- **API/Integration Tests:** 8 scenarios
- **UI/UX Edge Cases:** 6 scenarios

**Total: 95 Test Scenarios**

---

# PART 1: FUNCTIONAL EDGE CASES

## 1.1 Amount Boundary Testing

### TC-EDGE-TF-001: Transfer with Sub-Cent Amount (0.001)

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Boundary Value Analysis

**Preconditions:**
- User logged in with valid session
- Source Account (12345): Balance = $1000.00
- Destination Account (12346): Balance = $500.00

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select From Account: 12345
3. Enter Amount: `0.001` (three decimal places)
4. Select To Account: 12346
5. Click "Transfer" button
6. Observe system behavior

**Expected Result:**
- **Option A (Preferred):** Validation error: "Amount must have maximum 2 decimal places"
- **Option B:** System rounds to $0.00 and rejects: "Amount must be greater than zero"
- **Option C:** System rounds to $0.00 and allows transfer (poor UX but acceptable)

**Actual Result:** _[To be determined]_

**Exploitation Risk:** 
- If system accepts 0.001 as valid but stores as 0.00, this creates inconsistency
- Multiple such transfers could cause audit trail issues

**Recommended Fix:**
```java
// In TransferFormValidator.java
if (amount.scale() > 2) {
    errors.rejectValue("amount", "error.amount.invalid.precision", 
                       "Amount must have maximum 2 decimal places");
}
```

---

### TC-EDGE-TF-002: Transfer with Excessive Decimal Precision (10+ decimals)

**Priority:** P1 - High  
**Risk Level:** MEDIUM  
**Test Type:** Boundary Value Analysis

**Test Data:**
- Amount: `100.1234567890123456789`

**Test Steps:**
1. Navigate to Transfer Funds page
2. Enter Amount: `100.1234567890123456789`
3. Submit transfer

**Expected Result:**
- Validation error OR automatic rounding to 2 decimal places with user confirmation
- No silent rounding without notification
- BigDecimal precision handled correctly

**Actual Result:** _[To be determined]_

**Code Analysis:**
```java
// Account.java - No precision validation
public void debit(final BigDecimal amount) {
    balance = balance.subtract(amount);  // No scale control
}
```

**Security Concern:**
- Precision manipulation could be used to create tiny discrepancies that accumulate over thousands of transactions

---

### TC-EDGE-TF-003: Transfer Exact Account Balance (Balance = Transfer Amount)

**Priority:** P0 - Critical  
**Risk Level:** HIGH  
**Test Type:** Boundary Value Analysis

**Preconditions:**
- Source Account: Balance = $500.00 (exact amount)

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account with balance $500.00
3. Enter Amount: `500.00` (entire balance)
4. Submit transfer

**Expected Result:**
- Transfer succeeds
- Source account balance = $0.00
- Destination account balance increases by $500.00
- Both transactions recorded correctly
- Account remains open (not automatically closed)
- User can still view $0.00 balance account

**Potential Issues:**
- Zero balance account handling
- Minimum balance requirements (if any)
- Account status after zero balance

---

### TC-EDGE-TF-004: Transfer $0.01 (Minimum Valid Amount)

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Boundary Value Analysis

**Test Steps:**
1. Enter Amount: `0.01`
2. Submit transfer

**Expected Result:**
- Transfer succeeds
- Balances updated correctly with cent precision
- No rounding errors
- Transaction history shows $0.01 transfer

**Validation Points:**
- Verify: 1000.00 - 0.01 = 999.99 (not 999.98 or 1000.00)
- Check both debit and credit transactions created
- Confirm transaction descriptions are correct

---

### TC-EDGE-TF-005: Transfer $999,999,999.99 (Maximum BigDecimal)

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Boundary Value Analysis

**Preconditions:**
- Source account has balance ≥ $999,999,999.99

**Test Steps:**
1. Enter Amount: `999999999.99`
2. Submit transfer

**Expected Result:**
- If within system limits: transfer succeeds
- If exceeds limits: error "Amount exceeds maximum allowed"
- No integer overflow
- BigDecimal handles large values correctly

**Code Concern:**
- BigDecimal can handle arbitrary precision, but database column may have limits
- Check for SQL DECIMAL column constraints

---

### TC-EDGE-TF-006: Transfer with Leading Zeros

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** Input Format Validation

**Test Data:**
- Amount: `00100.50` (leading zeros)

**Test Steps:**
1. Enter Amount: `00100.50`
2. Submit transfer

**Expected Result:**
- System interprets as $100.50
- Transfer processes correctly
- No parsing errors

---

### TC-EDGE-TF-007: Transfer with Trailing Zeros

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** Input Format Validation

**Test Data:**
- Amount: `100.500` (extra trailing zero)

**Expected Result:**
- System interprets as $100.50
- BigDecimal normalizes to 2 decimal places
- Transfer succeeds

---

### TC-EDGE-TF-008: Transfer with Amount = $0.001 Rounded Down

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Rounding Logic

**Test Steps:**
1. Enter Amount: `0.004` (should round to $0.00)
2. Submit transfer

**Expected Result:**
- **Preferred:** Validation error before rounding
- **Acceptable:** Rounds to $0.00 and rejects as zero amount
- **Unacceptable:** Rounds to $0.00 and completes transfer

---

## 1.2 Account Selection Edge Cases

### TC-EDGE-TF-009: Transfer from Account to Itself (Same Account)

**Priority:** P0 - Critical  
**Risk Level:** HIGH  
**Test Type:** Business Logic Validation

**Test Steps:**
1. Select From Account: 12345
2. Enter Amount: $100.00
3. Select To Account: 12345 (same as from)
4. Submit transfer

**Expected Result:**
- **MUST FAIL** with error: "Cannot transfer to the same account"
- No transaction created
- Balance unchanged

**Actual Code State:**
```java
// TransferForm.java - No validation exists
// VULNERABILITY: Same-account transfer not prevented
```

**Business Impact:**
- Creates meaningless transactions
- Clutters transaction history
- Potential for transaction fee exploitation (if fees apply)
- Audit trail pollution

**Exploitation Scenario:**
1. User transfers $1000 to same account 100 times
2. If 1% fee applies per transaction, user loses $1000 in fees
3. Or if system gives rewards per transaction, user gains undeserved rewards

---

### TC-EDGE-TF-010: Transfer from Non-Existent Account ID

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Data Validation

**Test Steps:**
1. Using browser dev tools or proxy (Burp Suite)
2. Modify fromAccountId to 999999 (non-existent)
3. Set amount: $100.00
4. Submit modified request

**Expected Result:**
- Error: "Invalid source account"
- No transaction created
- Security event logged

**Security Risk:**
- Could expose database structure
- May cause application crash if not handled
- Error messages might leak information

---

### TC-EDGE-TF-011: Transfer to Non-Existent Account ID

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Data Validation

**Test Steps:**
1. Set toAccountId to 999999 (non-existent)
2. Submit transfer

**Expected Result:**
- Error: "Invalid destination account"
- No transaction created
- Source account balance unchanged

**Database Integrity:**
- Foreign key constraints should prevent this
- Application should handle gracefully before DB error

---

### TC-EDGE-TF-012: Transfer from Closed/Inactive Account

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Account State Validation

**Preconditions:**
- Account 12347 exists but is closed/inactive

**Test Steps:**
1. Select closed account as source
2. Attempt transfer

**Expected Result:**
- Error: "Cannot transfer from closed account"
- Account status check before processing

**Code Gap:**
- No account status validation found in code review

---

### TC-EDGE-TF-013: Transfer to Closed/Inactive Account

**Priority:** P1 - High  
**Risk Level:** MEDIUM  
**Test Type:** Account State Validation

**Test Steps:**
1. Select closed account as destination
2. Attempt transfer

**Expected Result:**
- Error: "Cannot transfer to closed account"
- Or transfer succeeds but account remains closed (business rule dependent)

---

### TC-EDGE-TF-014: Transfer Between Different Customer Accounts (Unauthorized)

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Authorization & Security

**Test Steps:**
1. User A logs in (owns accounts 12345, 12346)
2. User A navigates to transfer page
3. Using proxy, modify fromAccountId to 99999 (owned by User B)
4. Set toAccountId to 12345 (User A's account)
5. Set amount: $5000.00
6. Submit modified request

**Expected Result:**
- **MUST FAIL** with: "Unauthorized: You do not have permission to access this account"
- HTTP 403 Forbidden
- Security alert triggered
- Account 99999 balance unchanged
- Failed attempt logged with User A's details

**Current Vulnerability:**
```java
// TransferController.java - No ownership verification
// getAccountIds() only retrieves user's accounts for dropdown
// But server-side validation of submitted IDs is missing
```

**Exploitation Path:**
```
1. Attacker discovers account IDs (sequential, predictable)
2. Attacker modifies transfer form data
3. If no authorization check, can steal from any account
```

**Recommended Fix:**
```java
// Before transfer
Account fromAccount = bankManager.getAccount(fromAccountId);
if (fromAccount.getCustomerId() != currentUser.getId()) {
    throw new UnauthorizedException("Cannot access this account");
}
```

---

### TC-EDGE-TF-015: Transfer with Null Account IDs

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Null Input Handling

**Test Steps:**
1. Using API/proxy, set fromAccountId = null
2. Set toAccountId = null
3. Submit request

**Expected Result:**
- Validation error before null pointer exception
- Graceful error handling
- No application crash

---

### TC-EDGE-TF-016: Transfer with Negative Account IDs

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Invalid Input

**Test Steps:**
1. Set fromAccountId = -1
2. Set toAccountId = -1
3. Submit transfer

**Expected Result:**
- Validation error: "Invalid account ID"
- No database query attempted with negative ID

---

## 1.3 Session & State Management

### TC-EDGE-TF-017: Transfer After Session Timeout

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Session Management

**Test Steps:**
1. Login to application
2. Navigate to Transfer Funds page
3. Wait for session timeout (15 minutes typical)
4. Fill in transfer form
5. Submit transfer

**Expected Result:**
- Redirect to login page with message: "Session expired. Please login again."
- No transfer processed
- Form data not persisted (security)

**Security Concern:**
- If transfer succeeds after timeout, session hijacking possible
- Session token should be invalidated

---

### TC-EDGE-TF-018: Transfer with Expired Session Token

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Security

**Test Steps:**
1. Capture valid session token
2. Logout
3. Replay transfer request with old token

**Expected Result:**
- 401 Unauthorized
- No transfer processed
- Session tokens invalidated on logout

---

### TC-EDGE-TF-019: Concurrent Transfer from Same Browser (Multiple Tabs)

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Concurrency

**Preconditions:**
- Account balance: $100.00

**Test Steps:**
1. Open 2 browser tabs, same user logged in
2. Tab 1: Initiate transfer of $80
3. Tab 2: Initiate transfer of $80 (simultaneously)
4. Both submit at same time

**Expected Result:**
- One succeeds, one fails with insufficient funds
- Final balance = $20.00 (NOT -$60.00)
- Database locking prevents race condition

**Current Risk:**
```java
// No transaction locking visible in code
// Race condition possible:
// Thread 1 reads balance: $100
// Thread 2 reads balance: $100
// Thread 1 writes: $20
// Thread 2 writes: $20 (should be -$60)
```

---

### TC-EDGE-TF-020: Transfer After Account Balance Changed in Another Session

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Data Consistency

**Test Steps:**
1. Session 1: View transfer page (account balance: $1000)
2. Session 2: Withdraw $950 (new balance: $50)
3. Session 1: Attempt to transfer $200

**Expected Result:**
- Transfer fails: "Insufficient funds"
- Balance checked at transaction time, not page load time
- No stale data issues

---

## 1.4 Decimal & Currency Precision

### TC-EDGE-TF-021: Transfer with Comma as Decimal Separator

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Localization

**Test Data:**
- Amount: `100,50` (European format)

**Test Steps:**
1. Enter Amount: `100,50`
2. Submit transfer

**Expected Result:**
- System interprets based on locale settings
- Either accepts and converts, or rejects with format error
- No silent misinterpretation (100.50 vs 10050)

---

### TC-EDGE-TF-022: Transfer with Thousands Separator

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Input Format

**Test Data:**
- Amount: `1,000.50` (US format with comma)

**Test Steps:**
1. Enter Amount: `1,000.50`
2. Submit transfer

**Expected Result:**
- System parses correctly as $1000.50
- Or rejects if thousands separator not allowed
- No misinterpretation as $1.00

---

### TC-EDGE-TF-023: Transfer with Scientific Notation

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** Input Format

**Test Data:**
- Amount: `1.5e2` (scientific notation for 150)

**Test Steps:**
1. Enter Amount: `1.5e2`
2. Submit transfer

**Expected Result:**
- Validation error: "Invalid amount format"
- Or correctly parses as $150.00
- Behavior documented and consistent

---

### TC-EDGE-TF-024: Transfer Resulting in Negative Balance

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Business Logic Validation

**Preconditions:**
- Account balance: $100.00

**Test Steps:**
1. Enter Amount: $500.00
2. Submit transfer

**Expected Result:**
- **MUST FAIL**: "Insufficient funds. Available balance: $100.00"
- No overdraft allowed (unless business rules permit)
- Balance remains $100.00

**Code Analysis:**
```java
// TransferFormValidator.java - Only checks empty
public void validate(final Object obj, final Errors errors) {
    ValidationUtils.rejectIfEmpty(errors, "amount", "error.amount.empty");
    // NO INSUFFICIENT FUNDS CHECK!
}
```

**CRITICAL VULNERABILITY:**
- No validation prevents negative balance
- User can overdraft account unlimited

**Exploitation:**
```
Current Balance: $100
Transfer: $10,000,000
Result: Balance = -$9,999,900 (if no check exists)
```

---

### TC-EDGE-TF-025: Transfer with Balance Exactly $0.01 More Than Transfer Amount

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Precision Boundary

**Preconditions:**
- Account balance: $100.01

**Test Steps:**
1. Enter Amount: $100.00
2. Submit transfer

**Expected Result:**
- Transfer succeeds
- Remaining balance: $0.01
- No rounding errors

---

# PART 2: NEGATIVE TEST CASES

## 2.1 Invalid Amount Inputs

### TC-NEG-TF-001: Transfer with Negative Amount

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Input Validation

**Test Steps:**
1. Enter Amount: `-$100.00`
2. Submit transfer

**Expected Result:**
- **MUST FAIL**: "Amount must be greater than zero"
- No transaction created

**Code Gap:**
```java
// No negative amount validation found
// User could potentially credit their account by sending negative amount
```

**Exploitation Scenario:**
```
Transfer -$500 from Account A to Account B
Expected: $500 debited from A, $500 credited to B
Actual if no validation: $500 credited to A, $500 debited from B
Result: User gains $500, victim loses $500
```

---

### TC-NEG-TF-002: Transfer with Zero Amount

**Priority:** P1 - High  
**Risk Level:** MEDIUM  
**Test Type:** Business Logic

**Test Steps:**
1. Enter Amount: `0.00`
2. Submit transfer

**Expected Result:**
- Error: "Amount must be greater than zero"
- No meaningless transaction created

---

### TC-NEG-TF-003: Transfer with Empty/Null Amount

**Priority:** P1 - High  
**Risk Level:** MEDIUM  
**Test Type:** Input Validation

**Test Steps:**
1. Leave amount field empty
2. Submit transfer

**Expected Result:**
- Error: "Amount is required"
- Form validation triggers

**Current Validation:**
```java
// TransferFormValidator.java - This check exists
ValidationUtils.rejectIfEmpty(errors, "amount", "error.amount.empty");
```

---

### TC-NEG-TF-004: Transfer with Non-Numeric Amount

**Priority:** P1 - High  
**Risk Level:** MEDIUM  
**Test Type:** Input Validation

**Test Data:**
- `abc`, `xyz123`, `$%^&*`, `one hundred`

**Test Steps:**
1. Enter Amount: `abc`
2. Submit transfer

**Expected Result:**
- Error: "Amount must be a valid number"
- No type conversion error crashes application

---

### TC-NEG-TF-005: Transfer with Special Characters

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Input Sanitization

**Test Data:**
- Amount: `$100.00` (with dollar sign)
- Amount: `100$`
- Amount: `100.00 USD`

**Test Steps:**
1. Enter Amount: `$100.00`
2. Submit transfer

**Expected Result:**
- Either: strips $ and processes $100.00
- Or: validation error "Invalid format"
- No SQL injection vulnerability

---

### TC-NEG-TF-006: Transfer with HTML Tags in Amount

**Priority:** P2 - Medium  
**Risk Level:** HIGH (XSS)  
**Test Type:** Security - XSS

**Test Data:**
- Amount: `<script>alert('XSS')</script>`
- Amount: `100<img src=x onerror=alert('XSS')>`

**Test Steps:**
1. Enter Amount: `<script>alert('XSS')</script>`
2. Submit transfer

**Expected Result:**
- Input sanitized/escaped
- No JavaScript execution
- Validation error or safe handling

---

### TC-NEG-TF-007: Transfer with SQL Injection in Amount

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Security - SQL Injection

**Test Data:**
- Amount: `100'; DROP TABLE account;--`
- Amount: `100 OR 1=1`

**Test Steps:**
1. Enter Amount: `100'; DROP TABLE account;--`
2. Submit transfer

**Expected Result:**
- Parameterized query prevents injection
- Validation error or safe handling
- Database tables intact
- No SQL commands executed

---

### TC-NEG-TF-008: Transfer with Extremely Large Amount (Overflow)

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Boundary Value

**Test Data:**
- Amount: `99999999999999999999999999999.99` (30+ digits)

**Test Steps:**
1. Enter Amount: `99999999999999999999999999999.99`
2. Submit transfer

**Expected Result:**
- Validation error: "Amount exceeds maximum allowed"
- No integer/BigDecimal overflow
- System handles gracefully

---

### TC-NEG-TF-009: Transfer with Unicode Characters

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** Character Encoding

**Test Data:**
- Amount: `١٠٠` (Arabic numerals)
- Amount: `一百` (Chinese characters)

**Test Steps:**
1. Enter Amount: `١٠٠`
2. Submit transfer

**Expected Result:**
- Validation error: "Invalid format"
- No encoding issues
- No application crash

---

### TC-NEG-TF-010: Transfer with Whitespace Only

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** Input Validation

**Test Data:**
- Amount: `   ` (spaces only)
- Amount: `\t` (tab character)

**Test Steps:**
1. Enter Amount: `   ` (spaces)
2. Submit transfer

**Expected Result:**
- Validation treats as empty
- Error: "Amount is required"

---

## 2.2 Network & Infrastructure

### TC-NEG-TF-011: Transfer During Network Interruption

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Reliability

**Test Steps:**
1. Fill in transfer form
2. Click Submit
3. Disconnect network during request
4. Wait for timeout

**Expected Result:**
- Transfer fails with timeout error
- No partial transaction (money not debited without credit)
- User can retry safely
- Transaction atomicity maintained

**Concern:**
```javascript
// transfer.jsp - 30 second timeout
timeout: 30000
// What happens if request reaches server but response doesn't return?
```

---

### TC-NEG-TF-012: Transfer with Database Connection Loss

**Priority:** P1 - High  
**Risk Level:** CRITICAL  
**Test Type:** Failure Handling

**Test Steps:**
1. Simulate database connection loss mid-transaction
2. Attempt transfer

**Expected Result:**
- Transaction rolls back
- No partial transfer (atomic operation)
- Error message: "Transaction failed. Please try again."
- Balance unchanged

---

### TC-NEG-TF-013: Transfer with Application Server Restart Mid-Transaction

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Disaster Recovery

**Test Steps:**
1. Initiate transfer
2. Restart Tomcat during processing
3. Check account balances

**Expected Result:**
- Transaction either completes or fully rolls back
- No orphaned transactions
- No balance discrepancies

---

### TC-NEG-TF-014: Transfer with AJAX Request Timeout

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** UI/UX

**Test Steps:**
1. Simulate slow network (using browser dev tools)
2. Attempt transfer
3. Wait >30 seconds

**Expected Result:**
```javascript
// transfer.jsp line 128
error: function(xhr, status, error) {
    showError(xhr);
    var status = xhr.status > 0 ? xhr.status : "timeout";
}
```
- Timeout error displayed
- User informed to check account balance
- No silent failure

---

## 2.3 Business Rule Violations

### TC-NEG-TF-015: Transfer Exceeding Daily Transaction Limit

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Business Rules

**Preconditions:**
- Daily transfer limit: $10,000 (hypothetical)
- User already transferred $9,000 today

**Test Steps:**
1. Attempt to transfer $2,000

**Expected Result:**
- Error: "Daily transfer limit exceeded. Remaining limit: $1,000"
- Transfer blocked
- Limit resets at midnight

**Code Gap:**
- No daily limit validation found in code

---

### TC-NEG-TF-016: Transfer from LOAN Account Type

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Account Type Validation

**Preconditions:**
- User has LOAN account (type = LOAN)

**Test Steps:**
1. Select LOAN account as source
2. Attempt transfer

**Expected Result:**
- **Business Rule Dependent:**
  - If loans are disbursement-only: Error "Cannot transfer from loan account"
  - If transfers allowed: Transfer succeeds

**Code Reference:**
```java
// Account.java - AccountType enum
CHECKING(false), SAVINGS(false), LOAN(true);
// LOAN has isInternal() = true
```

---

### TC-NEG-TF-017: Transfer to LOAN Account Type

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Account Type Validation

**Test Steps:**
1. Select LOAN account as destination
2. Attempt transfer

**Expected Result:**
- Depends on business rules
- Typically: "Cannot transfer to loan account" (loans are repaid differently)

---

### TC-NEG-TF-018: Multiple Rapid Transfers (Rate Limiting)

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Security & Performance

**Test Steps:**
1. Submit 100 transfer requests in 10 seconds
2. Automate using script/tool

**Expected Result:**
- Rate limiting kicks in after N requests
- Temporary block: "Too many requests. Please wait."
- CAPTCHA challenge (optional)
- Prevents automated abuse

**Current State:**
- No rate limiting visible in code

---

### TC-NEG-TF-019: Transfer with Insufficient Funds by $0.01

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Precision Boundary

**Preconditions:**
- Account balance: $99.99

**Test Steps:**
1. Enter Amount: $100.00
2. Submit transfer

**Expected Result:**
- Error: "Insufficient funds. Available: $99.99, Requested: $100.00"
- Balance unchanged

---

### TC-NEG-TF-020: Transfer After Account Locked/Frozen

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Account State

**Preconditions:**
- Account has been frozen due to fraud alert

**Test Steps:**
1. Attempt transfer from frozen account

**Expected Result:**
- Error: "Account is locked. Contact customer service."
- No transfer allowed

**Code Gap:**
- No account status/lock check found

---

# PART 3: SECURITY TEST CASES

## 3.1 Authorization & Authentication

### TC-SEC-TF-001: Transfer Without Authentication (Session Bypass)

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Authentication Bypass

**Test Steps:**
1. Clear all cookies and session data
2. Directly access transfer endpoint:
   ```
   POST /parabank/services_proxy/bank/transfer?fromAccountId=12345&toAccountId=99999&amount=5000
   ```
3. Submit without valid session

**Expected Result:**
- **MUST RETURN:** 401 Unauthorized or 302 Redirect to login
- No transfer processed
- Session validation enforced

**Code Check:**
```java
// LoginInterceptor.java should catch this
// Verify @SessionAttributes protection
```

---

### TC-SEC-TF-002: Horizontal Privilege Escalation (Transfer from Other User's Account)

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Authorization Bypass

**Attack Scenario:**
```
Attacker: User ID 123, owns accounts [12345, 12346]
Victim: User ID 456, owns accounts [99998, 99999]

Attack Steps:
1. Attacker logs in as User 123
2. Attacker intercepts transfer request
3. Attacker modifies fromAccountId=99999 (victim's account)
4. Attacker sets toAccountId=12345 (attacker's account)
5. Attacker sets amount=10000
6. Submit modified request
```

**Expected Result:**
- **MUST FAIL**: 403 Forbidden "You do not have permission to access account 99999"
- Server-side authorization check on fromAccountId
- Victim's account untouched
- Security incident logged

**Current Vulnerability:**
```java
// TransferController.java
@ModelAttribute("accounts")
public List<Integer> getAccountIds(@SessionParam UserSession userSession) {
    // Only populates dropdown with user's accounts
    // BUT NO SERVER-SIDE VALIDATION of submitted IDs!
}
```

**Exploitation Proof-of-Concept:**
```bash
# Using curl
curl -X POST \
  'http://localhost:8080/parabank/services_proxy/bank/transfer' \
  -H 'Cookie: JSESSIONID=ABC123' \
  -d 'fromAccountId=99999&toAccountId=12345&amount=5000'

# If no authorization check, transfer succeeds!
```

---

### TC-SEC-TF-003: Account ID Enumeration Attack

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Information Disclosure

**Attack Steps:**
1. Loop through account IDs: 10000, 10001, 10002, ... 99999
2. For each ID, attempt transfer
3. Analyze error messages:
   - "Invalid account" = doesn't exist
   - "Insufficient funds" = exists but empty
   - "Unauthorized" = exists, belongs to someone else

**Expected Result:**
- Uniform error message regardless of account existence
- Error: "Transfer failed" (no details)
- Rate limiting prevents mass enumeration
- Account IDs should be non-sequential UUIDs

---

### TC-SEC-TF-004: Session Fixation Attack

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Session Security

**Attack Steps:**
1. Attacker creates session: JSESSIONID=EVIL123
2. Attacker tricks victim to login with EVIL123
3. Attacker uses EVIL123 to access victim's session
4. Attacker initiates transfers from victim's accounts

**Expected Result:**
- Session ID regenerated upon login
- Old session ID invalidated
- Session fixation prevented

---

### TC-SEC-TF-005: CSRF (Cross-Site Request Forgery) Attack

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** CSRF Protection

**Attack Scenario:**
```html
<!-- Attacker's malicious website -->
<img src="http://parabank.com/services_proxy/bank/transfer?fromAccountId=12345&toAccountId=99999&amount=5000" />

<!-- Or using JavaScript -->
<script>
fetch('http://parabank.com/services_proxy/bank/transfer', {
    method: 'POST',
    credentials: 'include',
    body: 'fromAccountId=12345&toAccountId=99999&amount=5000'
});
</script>
```

**Attack Steps:**
1. Victim is logged into ParaBank
2. Victim visits attacker's website
3. Attacker's page sends transfer request using victim's session
4. Transfer executes without victim's knowledge

**Expected Result:**
- **MUST FAIL**: CSRF token validation
- Each form includes unique token
- Token validated on server
- Cross-origin requests blocked

**Code Check:**
```jsp
<!-- transfer.jsp - No CSRF token visible -->
<form id="transferForm">
    <!-- MISSING: <input type="hidden" name="csrf_token" value="${csrfToken}"/> -->
</form>
```

**Current Risk:**
- GET requests vulnerable if transfer uses GET
- POST without CSRF token still vulnerable

---

### TC-SEC-TF-006: Replay Attack

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Transaction Security

**Attack Steps:**
1. Capture legitimate transfer request
2. Replay the same request multiple times
3. Attempt to execute same transfer repeatedly

**Expected Result:**
- One-time token or nonce prevents replay
- Or: Idempotency key ensures single execution
- Duplicate requests detected and rejected

---

### TC-SEC-TF-007: Man-in-the-Middle (MITM) Attack

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Transport Security

**Test Steps:**
1. Access application over HTTP (not HTTPS)
2. Intercept transfer request with proxy
3. Modify amount or account IDs
4. Forward modified request

**Expected Result:**
- HTTPS enforced (HSTS headers)
- HTTP redirects to HTTPS
- No sensitive data over plain HTTP
- SSL/TLS certificate validation

---

### TC-SEC-TF-008: SQL Injection via Account ID

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** SQL Injection

**Test Data:**
- fromAccountId: `12345'; DROP TABLE account;--`
- fromAccountId: `12345 OR 1=1`
- fromAccountId: `12345 UNION SELECT * FROM customer`

**Test Steps:**
1. Using proxy, modify fromAccountId parameter
2. Inject SQL payload
3. Submit request

**Expected Result:**
- Parameterized queries prevent injection
- Input validation rejects non-numeric IDs
- Database structure not exposed

**Code Check:**
```java
// Should use PreparedStatement
// String query = "SELECT * FROM account WHERE id = ?"
// NOT: "SELECT * FROM account WHERE id = " + accountId
```

---

### TC-SEC-TF-009: NoSQL Injection (if applicable)

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Injection Attack

**Test Data:**
- Amount: `{"$gt": 0}`
- Account ID: `{"$ne": null}`

**Test Steps:**
1. If system uses NoSQL database
2. Inject NoSQL operators

**Expected Result:**
- Input sanitization prevents injection
- Proper parameterization

---

### TC-SEC-TF-010: XML External Entity (XXE) Injection

**Priority:** P2 - Medium  
**Risk Level:** HIGH  
**Test Type:** XXE Attack

**Scenario:**
- If transfer accepts XML input (SOAP service)

**Test Steps:**
1. Send XML with external entity:
```xml
<?xml version="1.0"?>
<!DOCTYPE transfer [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<transfer>
  <amount>&xxe;</amount>
</transfer>
```

**Expected Result:**
- XML parser configured to disable external entities
- No file disclosure
- XXE attack prevented

---

### TC-SEC-TF-011: Insecure Direct Object Reference (IDOR)

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** IDOR Vulnerability

**Test Steps:**
1. User A transfers from account 12345 (owned by User A)
2. User A modifies URL/request to fromAccountId=12346
3. If 12346 belongs to User B, check if transfer succeeds

**Expected Result:**
- Authorization check verifies account ownership
- Transfer fails if account not owned by user

**This is variant of TC-SEC-TF-002 but worth separate testing**

---

### TC-SEC-TF-012: Brute Force Account Discovery

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Enumeration

**Test Steps:**
1. Automate 10,000 transfer attempts with sequential account IDs
2. Measure response times and error messages
3. Identify valid account IDs

**Expected Result:**
- Rate limiting after N failed attempts
- CAPTCHA challenge
- Uniform response times
- No information leakage

---

### TC-SEC-TF-013: Cross-Site Scripting (XSS) in Transfer Confirmation

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** XSS Vulnerability

**Test Steps:**
1. Set account ID or amount to XSS payload
2. Submit transfer
3. Check if payload executes on confirmation page

**Code Analysis:**
```javascript
// transfer.jsp line 112
$('#amountResult').text(formatCurrency(amount));
// Using .text() is safe (not .html())
// But check server-side rendering
```

**Test Payloads:**
- `<script>alert('XSS')</script>`
- `<img src=x onerror=alert(document.cookie)>`

**Expected Result:**
- Output encoding prevents XSS
- JavaScript not executed
- Safe display of user input

---

### TC-SEC-TF-014: JWT Token Manipulation (if applicable)

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Token Security

**Test Steps:**
1. If system uses JWT tokens
2. Decode token
3. Modify user ID or account permissions
4. Re-encode and submit

**Expected Result:**
- Signature verification fails
- Tampered token rejected
- User cannot escalate privileges

---

### TC-SEC-TF-015: API Key/Token Exposure

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Credential Exposure

**Test Steps:**
1. Check browser console for exposed tokens
2. Check client-side code for hardcoded credentials
3. Check HTTP headers for sensitive data

**Expected Result:**
- No credentials in client-side code
- No tokens in console logs
- Sensitive headers (Authorization) not logged

---

### TC-SEC-TF-016: Clickjacking Attack

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** UI Redressing

**Attack Steps:**
1. Attacker embeds ParaBank transfer page in iframe
2. Overlays with invisible buttons
3. Victim clicks thinking they're on legitimate site
4. Actually clicking transfer button

**Expected Result:**
- X-Frame-Options header prevents framing
- Or: Content-Security-Policy frame-ancestors
- Transfer page cannot be embedded

---

### TC-SEC-TF-017: Session Timeout Not Enforced

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Session Management

**Test Steps:**
1. Login to application
2. Leave inactive for >15 minutes
3. Attempt transfer without re-login

**Expected Result:**
- Session expires after idle period
- Redirect to login required
- No transfer possible with stale session

---

### TC-SEC-TF-018: Sensitive Data in URL Parameters

**Priority:** P1 - High  
**Risk Level:** MEDIUM  
**Test Type:** Information Disclosure

**Current Issue:**
```javascript
// transfer.jsp line 101
var url = "services_proxy/bank/transfer?fromAccountId=" + fromAccountId + 
          "&toAccountId=" + toAccountId + "&amount=" + amount;
```

**Risk:**
- Sensitive data in URL
- Logged in server access logs
- Visible in browser history
- Exposed in Referer header

**Expected Result:**
- Sensitive data should be in POST body, not URL
- Use Content-Type: application/json
- No sensitive data in GET parameters

---

# PART 4: CONCURRENCY & PERFORMANCE

## 4.1 Race Conditions

### TC-PERF-TF-001: Concurrent Transfers from Same Account (Race Condition)

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** Concurrency & Data Integrity

**Detailed Scenario:**
```
Initial State:
- Account A: $100.00
- Account B: $0.00
- Account C: $0.00

Thread 1: Transfer $80 from A to B
Thread 2: Transfer $80 from A to C

Both execute simultaneously at time T
```

**Test Steps:**
1. Set up automated test with 2 threads
2. Both read Account A balance: $100.00
3. Thread 1 calculates: 100 - 80 = 20
4. Thread 2 calculates: 100 - 80 = 20
5. Thread 1 writes: Account A = $20
6. Thread 2 writes: Account A = $20 (overwrites!)
7. Check final balances

**Expected Result:**
- **Correct Outcome:**
  - One transfer succeeds, one fails
  - Account A: $20.00
  - Account B: $80.00
  - Account C: $0.00
  
**Incorrect Outcome (If Race Condition Exists):**
- Both transfers succeed
- Account A: $20.00 (should be -$60.00 prevented by constraint)
- Account B: $80.00
- Account C: $80.00
- Total money increased from $100 to $180!

**Database Test:**
```sql
-- Test for proper locking
BEGIN TRANSACTION;
SELECT balance FROM account WHERE id = 12345 FOR UPDATE; -- Row-level lock
-- Calculate new balance
UPDATE account SET balance = new_balance WHERE id = 12345;
COMMIT;
```

**Recommended Fix:**
```java
// Use pessimistic locking
@Lock(LockModeType.PESSIMISTIC_WRITE)
Account getAccountForUpdate(int accountId);

// Or optimistic locking with version
@Version
private int version;
```

---

### TC-PERF-TF-002: Deadlock Scenario (Transfer A→B, B→A simultaneously)

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Deadlock Detection

**Scenario:**
```
Thread 1: Transfer $50 from Account A to Account B
Thread 2: Transfer $50 from Account B to Account A

Both execute simultaneously:
- Thread 1 locks Account A
- Thread 2 locks Account B
- Thread 1 waits for Account B lock
- Thread 2 waits for Account A lock
= DEADLOCK
```

**Test Steps:**
1. Set up 2 threads
2. Thread 1: Transfer A→B
3. Thread 2: Transfer B→A (at same time)
4. Monitor for deadlock

**Expected Result:**
- Database detects deadlock
- One transaction rolled back
- One transaction succeeds
- Application handles gracefully with retry

---

### TC-PERF-TF-003: 100 Concurrent Transfers from Single Account

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Stress Test & Locking

**Test Steps:**
1. Account balance: $1000.00
2. Initiate 100 transfers of $10 each simultaneously
3. All target different destination accounts

**Expected Result:**
- All 100 transfers succeed
- Final balance: $0.00
- No race conditions
- Proper serialization of transactions

---

### TC-PERF-TF-004: Transfer During Balance Calculation

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Read Consistency

**Test Steps:**
1. User viewing account overview (calculating total balance)
2. Simultaneously, transfer deducts money
3. Check if displayed balance is consistent

**Expected Result:**
- Consistent read (repeatable read isolation level)
- Or: balance refreshed after page load
- No dirty reads

---

## 4.2 Performance & Load

### TC-PERF-TF-005: Transfer with 1000 Concurrent Users

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Load Testing

**Test Configuration:**
- 1000 virtual users
- Each performs 10 transfers
- Ramp-up: 1 minute
- Duration: 10 minutes

**Success Criteria:**
- Response time < 2 seconds (95th percentile)
- Error rate < 1%
- No transaction failures
- Database connection pool handles load

**Tools:** JMeter, Gatling, LoadRunner

---

### TC-PERF-TF-006: Transfer Performance with Large Transaction History

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** Performance Degradation

**Preconditions:**
- Account has 1,000,000 transactions in history

**Test Steps:**
1. Perform transfer from account with large history
2. Measure response time

**Expected Result:**
- Performance not degraded by historical data
- Proper indexing on transaction table
- Response time < 2 seconds

---

### TC-PERF-TF-007: Memory Leak Test (Repeated Transfers)

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Resource Management

**Test Steps:**
1. Execute 10,000 transfers in sequence
2. Monitor JVM memory usage
3. Check for memory leaks

**Expected Result:**
- Memory usage stable
- Garbage collection effective
- No OutOfMemoryError

---

### TC-PERF-TF-008: Database Connection Pool Exhaustion

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Resource Management

**Test Steps:**
1. Configure small connection pool (5 connections)
2. Initiate 50 simultaneous transfers
3. Monitor connection pool

**Expected Result:**
- Requests queue properly
- Timeout errors if pool exhausted
- Connections released after transaction
- No connection leaks

---

# PART 5: DATA INTEGRITY

## 5.1 Transaction Atomicity

### TC-DATA-TF-001: Transaction Rollback on Failure

**Priority:** P0 - Critical  
**Risk Level:** CRITICAL  
**Test Type:** ACID Compliance

**Test Steps:**
1. Mock database to fail after debit but before credit
2. Attempt transfer
3. Check both account balances

**Expected Result:**
- Entire transaction rolls back
- Source account balance unchanged (debit reverted)
- Destination account not credited
- No partial transaction

**Code Check:**
```java
// Should use @Transactional
@Transactional(rollbackFor = Exception.class)
public void transfer(int from, int to, BigDecimal amount) {
    debit(from, amount);    // Step 1
    credit(to, amount);     // Step 2
    // If step 2 fails, step 1 must rollback
}
```

---

### TC-DATA-TF-002: Duplicate Transaction Prevention

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Idempotency

**Test Steps:**
1. Submit transfer request
2. Immediately submit identical request
3. Check if both execute

**Expected Result:**
- Idempotency key prevents duplicates
- Or: second request rejected as duplicate
- Only one transaction created

---

### TC-DATA-TF-003: Transaction History Consistency

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Data Integrity

**Test Steps:**
1. Perform transfer of $100 from A to B
2. Query transaction history for Account A
3. Query transaction history for Account B
4. Verify both transactions exist

**Expected Result:**
- Account A: Debit transaction for $100
- Account B: Credit transaction for $100
- Both have same timestamp (or very close)
- Both reference same transaction ID

**Verification:**
```sql
SELECT * FROM transaction 
WHERE account_id = 12345 AND type = 'Debit' AND amount = 100.00;

SELECT * FROM transaction 
WHERE account_id = 12346 AND type = 'Credit' AND amount = 100.00;

-- Should have matching transaction IDs or correlation ID
```

---

### TC-DATA-TF-004: Balance Recalculation from Transaction History

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Data Consistency

**Test Steps:**
1. Retrieve current account balance
2. Retrieve all transactions for account
3. Calculate balance from transactions
4. Compare with stored balance

**Expected Result:**
- Stored balance = Calculated balance
- No discrepancies
- Transaction log is complete

**Formula:**
```
Balance = Initial Deposit + SUM(Credits) - SUM(Debits)
```

---

### TC-DATA-TF-005: Transfer with Database Replication Lag

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Distributed Systems

**Scenario:**
- Master-slave database setup
- Write to master
- Read from slave (with replication lag)

**Test Steps:**
1. Perform transfer (writes to master)
2. Immediately query balance from slave
3. Check if stale data returned

**Expected Result:**
- Read-your-writes consistency
- Or: clear indication of lag
- No incorrect balance displayed

---

### TC-DATA-TF-006: Concurrent Balance Updates Consistency

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** Consistency

**Test Steps:**
1. Account balance: $1000
2. Operation 1: Transfer out $200
3. Operation 2: Deposit $500
4. Operation 3: Transfer out $100
5. All operations concurrent

**Expected Result:**
- Final balance: $1000 - $200 + $500 - $100 = $1200
- No lost updates
- All transactions recorded

---

### TC-DATA-TF-007: Transfer Resulting in Exactly Zero Balance (Edge Case)

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Boundary Value

**Test Steps:**
1. Account balance: $500.00
2. Transfer exactly $500.00
3. Check account status

**Expected Result:**
- Balance = $0.00
- Account remains active
- Can still receive transfers
- No automatic closure

---

### TC-DATA-TF-008: Transfer with Decimal Precision Loss

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Precision

**Test Steps:**
1. Perform 100 transfers of $0.01
2. Check cumulative effect on balance
3. Verify no rounding errors

**Expected Result:**
- After 100 transfers of $0.01
- Total transferred = $1.00 exactly
- No precision loss ($0.99 or $1.01)

---

### TC-DATA-TF-009: Orphaned Transaction Records

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** Data Consistency

**Test Steps:**
1. Query transactions table
2. Check for transactions without matching account

**Expected SQL:**
```sql
SELECT t.* FROM transaction t
LEFT JOIN account a ON t.account_id = a.id
WHERE a.id IS NULL;

-- Should return 0 rows
```

**Expected Result:**
- No orphaned transactions
- Foreign key constraints enforced
- Data referential integrity maintained

---

### TC-DATA-TF-010: Transaction Timestamp Accuracy

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** Audit Trail

**Test Steps:**
1. Record current time before transfer
2. Perform transfer
3. Query transaction timestamp
4. Compare

**Expected Result:**
- Timestamp within 1 second of actual time
- Timezone handled correctly
- Timestamps in UTC or clearly documented timezone

---

# PART 6: API & INTEGRATION

## 6.1 REST API Testing

### TC-API-TF-001: Direct API Call Without UI

**Priority:** P1 - High  
**Risk Level:** HIGH  
**Test Type:** API Testing

**Test Steps:**
```bash
curl -X POST \
  'http://localhost:8080/parabank/services_proxy/bank/transfer' \
  -H 'Cookie: JSESSIONID=VALID_SESSION' \
  -d 'fromAccountId=12345&toAccountId=12346&amount=100.00'
```

**Expected Result:**
- API validates all parameters
- Same validation as UI
- Response: "Successfully transferred $100.00 from account #12345 to account #12346"

---

### TC-API-TF-002: API Rate Limiting

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** API Security

**Test Steps:**
1. Script 1000 API calls in 1 minute
2. All authenticated with same session

**Expected Result:**
- Rate limit: e.g., 100 requests/minute
- After limit: 429 Too Many Requests
- Retry-After header present

---

### TC-API-TF-003: API Response Format Validation

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** API Contract

**Test Steps:**
1. Perform transfer via API
2. Check response format

**Expected Response:**
```
Content-Type: text/plain
Status: 200 OK
Body: "Successfully transferred $100.00 from account #12345 to account #12346"
```

**Validation:**
- Consistent response format
- Proper HTTP status codes
- Error responses have details

---

### TC-API-TF-004: API Error Handling

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** API Quality

**Test Steps:**
1. Send invalid request (missing parameters)
2. Check error response

**Expected Response:**
```
Status: 400 Bad Request
Content-Type: application/json
{
    "error": "INVALID_PARAMETERS",
    "message": "Amount is required",
    "field": "amount"
}
```

---

### TC-API-TF-005: CORS Configuration

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** API Security

**Test Steps:**
1. From different domain, call transfer API
2. Check CORS headers

**Expected Result:**
- CORS properly configured
- Only allowed origins accepted
- Credentials handling correct

---

### TC-API-TF-006: API Version Compatibility

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** API Versioning

**Test Steps:**
1. Call API with different version headers
2. Check backward compatibility

**Expected Result:**
- Version indicated in URL or header
- Old versions supported (deprecated gracefully)

---

### TC-API-TF-007: Content-Type Validation

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** API Input Validation

**Test Steps:**
1. Send request with Content-Type: application/json but form data body
2. Send request with wrong Content-Type

**Expected Result:**
- 415 Unsupported Media Type
- Clear error message

---

### TC-API-TF-008: API Response Time

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** Performance SLA

**Test Steps:**
1. Measure API response time for transfer
2. Run 100 sequential requests

**Expected Result:**
- Average response time < 500ms
- 95th percentile < 1000ms
- 99th percentile < 2000ms

---

# PART 7: UI/UX EDGE CASES

## 7.1 User Interface Testing

### TC-UI-TF-001: Transfer Form Auto-Complete Interference

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** UI/UX

**Test Steps:**
1. Browser auto-complete enabled
2. Fill transfer form
3. Check if auto-complete suggests wrong values

**Expected Result:**
- Amount field has autocomplete="off"
- Sensitive fields not auto-filled incorrectly

---

### TC-UI-TF-002: Transfer with Copy-Paste Amount

**Priority:** P3 - Low  
**Risk Level:** LOW  
**Test Type:** UI/UX

**Test Steps:**
1. Copy amount from email: "$100.00"
2. Paste into amount field
3. Submit transfer

**Expected Result:**
- Handles copy-paste correctly
- Strips currency symbols if present
- Or: validates and rejects format

---

### TC-UI-TF-003: Dropdown Account Selection Edge Cases

**Priority:** P2 - Medium  
**Risk Level:** LOW  
**Test Type:** UI/UX

**Test Steps:**
1. User with 50+ accounts
2. Open transfer page
3. Check dropdown performance and usability

**Expected Result:**
- All accounts loaded
- Dropdown scrollable
- Search functionality (if many accounts)
- Performance not degraded

---

### TC-UI-TF-004: Transfer Confirmation Button Double-Click

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** UI/UX

**Test Steps:**
1. Fill transfer form
2. Double-click "Transfer" button rapidly
3. Check if duplicate transfer created

**Expected Result:**
- Button disabled after first click
- Or: idempotency prevents duplicate
- Only one transfer executed

**Code Check:**
```javascript
// transfer.jsp line 93
$('#transferForm').submit(function(event) {
    event.preventDefault();
    // Should disable button here
    $(this).find('input[type="submit"]').prop('disabled', true);
});
```

---

### TC-UI-TF-005: Browser Back Button After Transfer

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** UI/UX

**Test Steps:**
1. Complete transfer
2. View confirmation page
3. Click browser back button
4. Click transfer again

**Expected Result:**
- Warning: "Form resubmission"
- Or: redirect to fresh form
- Duplicate transfer prevented

---

### TC-UI-TF-006: Transfer Page Refresh During AJAX Request

**Priority:** P2 - Medium  
**Risk Level:** MEDIUM  
**Test Type:** UI/UX

**Test Steps:**
1. Click Transfer button
2. Immediately refresh page (F5)
3. Check if transfer completed

**Expected Result:**
- Clear status to user
- Recommendation to check account balance
- No silent failure

---

---

# SUMMARY & RECOMMENDATIONS

## Critical Vulnerabilities Found

### 🔴 P0 - CRITICAL (Must Fix Before Production)

1. **Missing Insufficient Funds Check**
   - File: `TransferFormValidator.java`
   - Risk: Users can overdraft accounts infinitely
   - Fix: Add server-side balance validation

2. **No Account Ownership Authorization**
   - File: `TransferController.java`
   - Risk: Users can transfer from any account
   - Fix: Verify account ownership before transfer

3. **Race Condition on Concurrent Transfers**
   - Risk: Negative balances, money creation
   - Fix: Implement database row-level locking

4. **No Negative Amount Validation**
   - Risk: Money manipulation exploit
   - Fix: Validate amount > 0

5. **CSRF Protection Missing**
   - File: `transfer.jsp`
   - Risk: Unauthorized transfers via malicious sites
   - Fix: Implement CSRF tokens

6. **Sensitive Data in URL Parameters**
   - File: `transfer.jsp:101`
   - Risk: Data exposure in logs
   - Fix: Use POST body, not query parameters

---

## Test Execution Priority Matrix

| Priority | Category | Test Count | Est. Time | Risk Level |
|----------|----------|------------|-----------|------------|
| P0 | Critical Security | 15 | 2 days | CRITICAL |
| P1 | High Priority | 32 | 3 days | HIGH |
| P2 | Medium Priority | 35 | 3 days | MEDIUM |
| P3 | Low Priority | 13 | 1 day | LOW |
| **Total** | | **95** | **9 days** | |

---

## Recommended Test Approach

### Phase 1: Critical Security (Days 1-2)
- Authorization bypass tests
- SQL injection
- CSRF validation
- Race condition tests

### Phase 2: Business Logic (Days 3-5)
- Insufficient funds validation
- Amount validation (negative, zero, boundary)
- Same-account prevention
- Transaction atomicity

### Phase 3: Integration (Days 6-7)
- API testing
- Concurrency tests
- Performance baseline
- Data integrity

### Phase 4: Edge Cases (Days 8-9)
- UI/UX edge cases
- Localization
- Error handling
- Recovery scenarios

---

## Automated Testing Strategy

### Unit Tests (JUnit)
```java
@Test
public void testTransfer_WithNegativeAmount_ShouldFail() {
    BigDecimal amount = new BigDecimal("-100.00");
    // Assert validation error
}

@Test
public void testTransfer_SameAccount_ShouldFail() {
    int accountId = 12345;
    // Assert business logic error
}
```

### Integration Tests
- Test with real database transactions
- Verify rollback behavior
- Check transaction isolation

### Security Tests (OWASP ZAP, Burp Suite)
- Automated vulnerability scanning
- SQL injection fuzzing
- XSS detection

### Performance Tests (JMeter)
- Load testing: 1000 concurrent users
- Stress testing: Find breaking point
- Endurance testing: 24-hour stability

---

## Tools Required

**Security Testing:**
- Burp Suite Professional
- OWASP ZAP
- sqlmap

**Performance Testing:**
- Apache JMeter
- Gatling
- LoadRunner (optional)

**API Testing:**
- Postman
- SoapUI
- curl scripts

**Database Testing:**
- SQL clients
- Database monitoring tools

**Browser Testing:**
- Selenium Grid
- BrowserStack
- Multiple browsers (Chrome, Firefox, Safari, Edge)

---

## Success Criteria

### Must Pass (P0):
- ✅ All authorization checks pass
- ✅ No SQL injection vulnerabilities
- ✅ No race conditions
- ✅ Transaction atomicity verified
- ✅ CSRF protection implemented

### Should Pass (P1):
- ✅ All amount validation correct
- ✅ Error handling comprehensive
- ✅ Performance benchmarks met
- ✅ Data integrity maintained

### Nice to Have (P2-P3):
- ✅ UI/UX edge cases handled
- ✅ Localization support
- ✅ Accessibility compliance

---

## Risk Assessment

### Financial Impact:
- Unauthorized transfers: **$XXX,XXX per incident**
- Reputational damage: **HIGH**
- Regulatory fines: **$XX,XXX**
- Customer trust: **SEVERE**

### Technical Debt:
- 6 critical vulnerabilities
- 15 high-priority issues
- Estimated fix time: **4-6 weeks**

---

## Conclusion

The Transfer Funds feature has **CRITICAL SECURITY GAPS** that must be addressed before production deployment. The most severe issues are:

1. Missing authorization checks (horizontal privilege escalation)
2. No insufficient funds validation
3. Race conditions on concurrent operations
4. CSRF vulnerability

**Recommendation:** 
- **DO NOT deploy to production** until P0 issues are resolved
- Implement comprehensive security testing in CI/CD pipeline
- Conduct security audit by third-party firm
- Establish bug bounty program for ongoing security

---

**Document Prepared By:** Senior QA Engineer  
**Review Status:** Ready for Test Execution  
**Next Steps:** 
1. Review with development team
2. Prioritize fixes
3. Begin P0 test execution
4. Set up automated test suite

**Version:** 1.0  
**Last Updated:** 2026-11-27
