# ParaBank Functional Test Scenarios

**Application:** ParaBank Banking Web Application  
**Version:** 6.0.0-SNAPSHOT  
**Test Type:** Functional Test Scenarios  
**Created:** 2026-11-27  

---

## Table of Contents
1. [Login Workflow](#1-login-workflow)
2. [Transfer Funds Workflow](#2-transfer-funds-workflow)
3. [Bill Payment Workflow](#3-bill-payment-workflow)
4. [Loan Request Workflow](#4-loan-request-workflow)

---

# 1. Login Workflow

## 1.1 Positive Scenarios

### TC-LOGIN-001: Successful Login with Valid Credentials

**Test Case ID:** TC-LOGIN-001  
**Scenario:** User successfully logs into ParaBank with valid username and password  
**Priority:** P0 - Critical  
**Type:** Positive  

**Preconditions:**
- User is registered in the system
- Username: `testuser1`
- Password: `Test@123`
- User is on the login page (http://localhost:8080/parabank/index.htm)

**Test Steps:**
1. Navigate to ParaBank home page
2. Locate the login panel on the right side
3. Enter username: `testuser1`
4. Enter password: `Test@123`
5. Click "Log In" button

**Expected Result:**
- User is redirected to Account Overview page (/overview.htm)
- Welcome message displays: "Welcome testuser1"
- All user accounts are displayed with current balances
- Total balance is calculated and displayed correctly
- Logout link is visible
- User session is created

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-002: Login and Redirect to Original Request

**Test Case ID:** TC-LOGIN-002  
**Scenario:** User attempts to access protected page, gets redirected to login, then redirected back after successful login  
**Priority:** P1 - High  
**Type:** Positive  

**Preconditions:**
- User is not logged in
- Valid credentials available
- Target page: `/transfer.htm`

**Test Steps:**
1. Navigate directly to protected URL: `http://localhost:8080/parabank/transfer.htm`
2. System redirects to login page with forwardAction parameter
3. Enter valid username and password
4. Click "Log In" button

**Expected Result:**
- After login, user is redirected to originally requested page (/transfer.htm)
- Not redirected to default overview page
- Transfer form is displayed
- Session contains correct user information

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 1.2 Negative Scenarios

### TC-LOGIN-003: Login with Invalid Username

**Test Case ID:** TC-LOGIN-003  
**Scenario:** User attempts to login with non-existent username  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is on the login page
- Username `invaliduser123` does not exist in the system

**Test Steps:**
1. Navigate to ParaBank home page
2. Enter username: `invaliduser123`
3. Enter password: `anypassword`
4. Click "Log In" button

**Expected Result:**
- Login fails
- Error message displayed: "The username and password could not be verified."
- User remains on login page
- No session is created
- Username and password fields are cleared (or retain values per UX design)

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-004: Login with Invalid Password

**Test Case ID:** TC-LOGIN-004  
**Scenario:** User attempts to login with valid username but incorrect password  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is registered with username `testuser1` and password `Test@123`
- User is on the login page

**Test Steps:**
1. Navigate to ParaBank home page
2. Enter username: `testuser1`
3. Enter password: `WrongPassword123`
4. Click "Log In" button

**Expected Result:**
- Login fails
- Error message displayed: "The username and password could not be verified."
- User remains on login page
- No session is created
- Failed login attempt is logged (without password)

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-005: Login with Empty Username

**Test Case ID:** TC-LOGIN-005  
**Scenario:** User attempts to login without entering username  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to ParaBank home page
2. Leave username field empty
3. Enter password: `Test@123`
4. Click "Log In" button

**Expected Result:**
- Login fails
- Error message displayed: "Please enter a username and password."
- User remains on login page
- No session is created
- No database query is executed

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-006: Login with Empty Password

**Test Case ID:** TC-LOGIN-006  
**Scenario:** User attempts to login without entering password  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to ParaBank home page
2. Enter username: `testuser1`
3. Leave password field empty
4. Click "Log In" button

**Expected Result:**
- Login fails
- Error message displayed: "Please enter a username and password."
- User remains on login page
- No session is created

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-007: Login with Both Fields Empty

**Test Case ID:** TC-LOGIN-007  
**Scenario:** User attempts to login without entering username or password  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to ParaBank home page
2. Leave username field empty
3. Leave password field empty
4. Click "Log In" button

**Expected Result:**
- Login fails
- Error message displayed: "Please enter a username and password."
- User remains on login page

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 1.3 Security Scenarios

### TC-LOGIN-SEC-001: SQL Injection Attempt in Username

**Test Case ID:** TC-LOGIN-SEC-001  
**Scenario:** Verify system prevents SQL injection attacks through username field  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to ParaBank home page
2. Enter username: `admin' OR '1'='1`
3. Enter password: `anything`
4. Click "Log In" button

**Expected Result:**
- Login fails
- Error message displayed: "The username and password could not be verified."
- No SQL injection occurs
- User is not logged in
- Database is not compromised
- Security event is logged

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-SEC-002: SQL Injection Attempt in Password

**Test Case ID:** TC-LOGIN-SEC-002  
**Scenario:** Verify system prevents SQL injection attacks through password field  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to ParaBank home page
2. Enter username: `testuser1`
3. Enter password: `' OR '1'='1'--`
4. Click "Log In" button

**Expected Result:**
- Login fails
- Error message displayed: "The username and password could not be verified."
- No SQL injection occurs
- Database is not compromised

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-SEC-003: XSS Attempt in Username Field

**Test Case ID:** TC-LOGIN-SEC-003  
**Scenario:** Verify system prevents XSS attacks through username field  
**Priority:** P1 - High  
**Type:** Security  

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to ParaBank home page
2. Enter username: `<script>alert('XSS')</script>`
3. Enter password: `Test@123`
4. Click "Log In" button

**Expected Result:**
- Login fails
- No JavaScript is executed
- Error message displayed safely (HTML encoded)
- No XSS attack occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-SEC-004: Brute Force Attack Simulation

**Test Case ID:** TC-LOGIN-SEC-004  
**Scenario:** Verify system prevents brute force attacks with account lockout  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- Valid username: `testuser1`
- User is on the login page

**Test Steps:**
1. Attempt login with username `testuser1` and wrong password
2. Repeat step 1 for 5 consecutive times
3. Attempt login with correct password on 6th attempt

**Expected Result:**
- First 5 attempts fail with error message
- After 5 failed attempts, account is locked
- 6th attempt (even with correct password) fails with message: "Account has been locked. Please contact support."
- Account lockout is logged
- Lockout duration is enforced (e.g., 15 minutes)

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

**Note:** CRITICAL - Current code review shows no rate limiting implementation

---

## 1.4 Edge Cases

### TC-LOGIN-EDGE-001: Username with Special Characters

**Test Case ID:** TC-LOGIN-EDGE-001  
**Scenario:** Login with username containing special characters  
**Priority:** P2 - Medium  
**Type:** Edge Case  

**Preconditions:**
- User registered with username: `test.user+1@bank`
- Password: `Test@123`

**Test Steps:**
1. Navigate to login page
2. Enter username: `test.user+1@bank`
3. Enter password: `Test@123`
4. Click "Log In" button

**Expected Result:**
- If special characters are allowed in username, login succeeds
- If not allowed, appropriate error message is displayed
- System handles special characters correctly

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-EDGE-002: Username with Leading/Trailing Spaces

**Test Case ID:** TC-LOGIN-EDGE-002  
**Scenario:** Login with spaces before/after username  
**Priority:** P2 - Medium  
**Type:** Edge Case  

**Preconditions:**
- Valid username: `testuser1` (no spaces)
- Password: `Test@123`

**Test Steps:**
1. Navigate to login page
2. Enter username with spaces: `  testuser1  `
3. Enter password: `Test@123`
4. Click "Log In" button

**Expected Result:**
- System either:
  - Trims spaces and login succeeds, OR
  - Login fails with error message
- Behavior should be consistent and documented

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-EDGE-003: Case Sensitivity Test

**Test Case ID:** TC-LOGIN-EDGE-003  
**Scenario:** Verify username case sensitivity  
**Priority:** P2 - Medium  
**Type:** Edge Case  

**Preconditions:**
- Valid username: `testuser1` (lowercase)
- Password: `Test@123`

**Test Steps:**
1. Navigate to login page
2. Enter username: `TESTUSER1` (uppercase)
3. Enter password: `Test@123`
4. Click "Log In" button

**Expected Result:**
- If usernames are case-insensitive, login succeeds
- If usernames are case-sensitive, login fails with error message
- Behavior is consistent across the application

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-EDGE-004: Very Long Username

**Test Case ID:** TC-LOGIN-EDGE-004  
**Scenario:** Attempt login with extremely long username  
**Priority:** P3 - Low  
**Type:** Edge Case  

**Preconditions:**
- User is on the login page

**Test Steps:**
1. Navigate to login page
2. Enter username: 500 character string
3. Enter password: `Test@123`
4. Click "Log In" button

**Expected Result:**
- Login fails gracefully
- No system error or crash
- Appropriate error message displayed
- Maximum length validation enforced

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOGIN-EDGE-005: Session Management After Login

**Test Case ID:** TC-LOGIN-EDGE-005  
**Scenario:** Verify session is properly created and managed  
**Priority:** P1 - High  
**Type:** Functional  

**Preconditions:**
- Valid credentials
- User is not logged in

**Test Steps:**
1. Login with valid credentials
2. Verify session cookie is set
3. Navigate to different pages (transfer, bill pay)
4. Verify session persists
5. Close browser and reopen
6. Navigate to protected page

**Expected Result:**
- Session cookie is created on login
- Session persists across page navigation
- Session expires after browser close (if session-based)
- Or session expires after timeout period
- User must re-login after session expiry

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

---

# 2. Transfer Funds Workflow

## 2.1 Positive Scenarios

### TC-TRANSFER-001: Successful Fund Transfer Between Own Accounts

**Test Case ID:** TC-TRANSFER-001  
**Scenario:** User successfully transfers funds from one account to another account they own  
**Priority:** P0 - Critical  
**Type:** Positive  

**Preconditions:**
- User is logged in as `testuser1`
- User has two accounts:
  - Account A (ID: 12345) with balance $1000.00
  - Account B (ID: 12346) with balance $500.00
- User is on the Transfer Funds page (/transfer.htm)

**Test Steps:**
1. Navigate to "Transfer Funds" from main menu
2. Select "From Account": Account A (12345)
3. Enter "Amount": $200.00
4. Select "To Account": Account B (12346)
5. Click "Transfer" button
6. Review confirmation page
7. Navigate to Account Overview to verify balances

**Expected Result:**
- Transfer confirmation page is displayed
- Confirmation shows:
  - Amount: $200.00
  - From Account: 12345
  - To Account: 12346
- Account A balance updated to $800.00 (1000 - 200)
- Account B balance updated to $700.00 (500 + 200)
- Two transactions created:
  - Debit transaction in Account A for $200.00 (description: "Funds Transfer Sent")
  - Credit transaction in Account B for $200.00 (description: "Funds Transfer Received")
- Transaction history shows the transfer
- No errors displayed

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-002: Transfer Minimum Amount

**Test Case ID:** TC-TRANSFER-002  
**Scenario:** User transfers the minimum allowed amount ($0.01)  
**Priority:** P2 - Medium  
**Type:** Boundary  

**Preconditions:**
- User is logged in
- Source account has balance $100.00
- Destination account exists

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account
3. Enter amount: $0.01
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer succeeds
- Source account balance decreases by $0.01
- Destination account balance increases by $0.01
- Confirmation message displayed
- Transactions recorded correctly with 2 decimal precision

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-003: Transfer Entire Account Balance

**Test Case ID:** TC-TRANSFER-003  
**Scenario:** User transfers entire balance from source account  
**Priority:** P1 - High  
**Type:** Boundary  

**Preconditions:**
- User is logged in
- Source account (12345) has balance $500.00
- Destination account exists

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account (12345)
3. Enter amount: $500.00 (entire balance)
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer succeeds
- Source account balance = $0.00
- Destination account balance increases by $500.00
- Confirmation displayed
- Source account remains open (not automatically closed)

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-004: Transfer with Decimal Amounts

**Test Case ID:** TC-TRANSFER-004  
**Scenario:** User transfers amount with cents  
**Priority:** P1 - High  
**Type:** Positive  

**Preconditions:**
- User is logged in
- Source account has balance $1000.00

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account
3. Enter amount: $123.45
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer succeeds
- Amount is handled with 2 decimal precision
- Balances updated correctly: 1000.00 - 123.45 = 876.55
- No rounding errors

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 2.2 Negative Scenarios

### TC-TRANSFER-005: Transfer with Insufficient Funds

**Test Case ID:** TC-TRANSFER-005  
**Scenario:** User attempts to transfer more money than available in source account  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is logged in
- Source account has balance $100.00
- Destination account exists

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account with balance $100.00
3. Enter amount: $500.00
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message displayed: "Insufficient funds. Available balance: $100.00"
- Source account balance remains $100.00
- Destination account balance unchanged
- No transactions created
- User remains on transfer page to retry

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

**Note:** CRITICAL - Code review shows no insufficient funds validation in TransferFormValidator

---

### TC-TRANSFER-006: Transfer Negative Amount

**Test Case ID:** TC-TRANSFER-006  
**Scenario:** User attempts to transfer negative amount  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is logged in
- Both accounts exist

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account
3. Enter amount: -$100.00
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message displayed: "Amount must be greater than zero."
- No transaction occurs
- Both account balances unchanged

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

**Note:** CRITICAL - Code review shows no negative amount validation

---

### TC-TRANSFER-007: Transfer Zero Amount

**Test Case ID:** TC-TRANSFER-007  
**Scenario:** User attempts to transfer $0.00  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in
- Both accounts exist

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account
3. Enter amount: $0.00
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message displayed: "Amount must be greater than zero."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-008: Transfer to Same Account

**Test Case ID:** TC-TRANSFER-008  
**Scenario:** User attempts to transfer funds from an account to itself  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in
- User has account (ID: 12345) with balance $500.00

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select "From Account": 12345
3. Enter amount: $100.00
4. Select "To Account": 12345 (same as from account)
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message displayed: "Cannot transfer to the same account. Please select a different destination account."
- Account balance remains $500.00
- No transaction created

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

**Note:** Code review shows no same-account validation in TransferForm

---

### TC-TRANSFER-009: Transfer with Empty Amount

**Test Case ID:** TC-TRANSFER-009  
**Scenario:** User attempts to transfer without entering amount  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in
- Both accounts exist

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account
3. Leave amount field empty
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message displayed: "Amount is required."
- No transaction occurs
- Form validation triggers

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-010: Transfer Without Selecting From Account

**Test Case ID:** TC-TRANSFER-010  
**Scenario:** User attempts to transfer without selecting source account  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Transfer Funds page
2. Do not select "From Account" (leave default/empty)
3. Enter amount: $100.00
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message displayed: "Please select a source account."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-011: Transfer Without Selecting To Account

**Test Case ID:** TC-TRANSFER-011  
**Scenario:** User attempts to transfer without selecting destination account  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account
3. Enter amount: $100.00
4. Do not select "To Account" (leave default/empty)
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message displayed: "Please select a destination account."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 2.3 Security Scenarios

### TC-TRANSFER-SEC-001: Transfer from Non-Owned Account

**Test Case ID:** TC-TRANSFER-SEC-001  
**Scenario:** User attempts to transfer funds from account they don't own by manipulating account ID  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User A is logged in (owns accounts 12345, 12346)
- User B owns account 99999 with balance $5000.00

**Test Steps:**
1. User A logs in
2. Navigate to Transfer Funds page
3. Using browser developer tools or proxy, modify the form data
4. Set "fromAccountId" to 99999 (User B's account)
5. Set amount to $1000.00
6. Set "toAccountId" to 12345 (User A's account)
7. Submit the modified form

**Expected Result:**
- Transfer fails
- Error message: "Unauthorized: You do not have permission to access this account."
- Account 99999 balance remains $5000.00
- Account 12345 balance unchanged
- Security event is logged
- User session may be terminated

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

**Note:** CRITICAL - Authorization check required before transfer

---

### TC-TRANSFER-SEC-002: Transfer to Non-Existent Account

**Test Case ID:** TC-TRANSFER-SEC-002  
**Scenario:** User attempts to transfer to invalid/non-existent account ID  
**Priority:** P1 - High  
**Type:** Security  

**Preconditions:**
- User is logged in
- Source account exists
- Account ID 999999 does not exist

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select valid source account
3. Enter amount: $100.00
4. Manipulate form to set destination account ID: 999999
5. Submit transfer

**Expected Result:**
- Transfer fails
- Error message: "Invalid destination account."
- No transaction occurs
- Source account balance unchanged

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-SEC-003: SQL Injection in Amount Field

**Test Case ID:** TC-TRANSFER-SEC-003  
**Scenario:** Attempt SQL injection through amount field  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User is logged in
- Both accounts exist

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source and destination accounts
3. Enter amount: `100'; DROP TABLE account;--`
4. Click "Transfer" button

**Expected Result:**
- Transfer fails with validation error
- SQL injection prevented
- Database tables intact
- No SQL commands executed

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-SEC-004: Concurrent Transfer Race Condition

**Test Case ID:** TC-TRANSFER-SEC-004  
**Scenario:** Two simultaneous transfers from same account with insufficient total balance  
**Priority:** P0 - Critical  
**Type:** Security/Concurrency  

**Preconditions:**
- Account has balance $100.00
- Two browser sessions logged in as same user

**Test Steps:**
1. Open two browser windows with same logged-in user
2. In both windows, navigate to Transfer Funds
3. In both windows, select same source account (balance $100.00)
4. In Window 1: Attempt to transfer $80.00
5. In Window 2: Attempt to transfer $80.00 (simultaneously)
6. Submit both transfers at the same time

**Expected Result:**
- One transfer succeeds, the other fails with insufficient funds
- Final balance = $20.00 (not -$60.00)
- Database transactions are properly locked
- No race condition occurs
- Both transfers do not succeed

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

**Note:** CRITICAL - Race condition testing required

---

## 2.4 Edge Cases

### TC-TRANSFER-EDGE-001: Transfer with Excessive Decimal Places

**Test Case ID:** TC-TRANSFER-EDGE-001  
**Scenario:** User enters amount with more than 2 decimal places  
**Priority:** P2 - Medium  
**Type:** Edge Case  

**Preconditions:**
- User is logged in
- Source account has sufficient balance

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select accounts
3. Enter amount: $100.123456789
4. Click "Transfer" button

**Expected Result:**
- System either:
  - Rounds to 2 decimal places ($100.12) and succeeds, OR
  - Rejects with error "Amount must have maximum 2 decimal places"
- Behavior is consistent
- No precision errors

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-EDGE-002: Transfer Maximum Allowed Amount

**Test Case ID:** TC-TRANSFER-EDGE-002  
**Scenario:** User transfers maximum allowed amount  
**Priority:** P2 - Medium  
**Type:** Boundary  

**Preconditions:**
- User is logged in
- Source account has balance $999,999,999.99

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select source account
3. Enter amount: $999,999,999.99
4. Select destination account
5. Click "Transfer" button

**Expected Result:**
- If within system limits, transfer succeeds
- If exceeds limits, error message: "Amount exceeds maximum allowed"
- No overflow errors
- BigDecimal handles large amounts correctly

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-EDGE-003: Transfer with Non-Numeric Characters

**Test Case ID:** TC-TRANSFER-EDGE-003  
**Scenario:** User enters non-numeric characters in amount field  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Transfer Funds page
2. Select accounts
3. Enter amount: `abc123`
4. Click "Transfer" button

**Expected Result:**
- Transfer fails
- Error message: "Amount must be a valid number."
- Client-side or server-side validation catches the error

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-TRANSFER-EDGE-004: Transfer After Session Timeout

**Test Case ID:** TC-TRANSFER-EDGE-004  
**Scenario:** User attempts transfer after session expires  
**Priority:** P1 - High  
**Type:** Edge Case  

**Preconditions:**
- User is logged in
- Session timeout is set (e.g., 15 minutes)

**Test Steps:**
1. Login to application
2. Navigate to Transfer Funds page
3. Wait for session timeout (or manually expire session)
4. Fill in transfer form
5. Click "Transfer" button

**Expected Result:**
- Transfer fails
- User is redirected to login page with message: "Your session has expired. Please login again."
- No transaction occurs
- After re-login, transfer form is not pre-populated (security)

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

---

# 3. Bill Payment Workflow

## 3.1 Positive Scenarios

### TC-BILLPAY-001: Successful Bill Payment

**Test Case ID:** TC-BILLPAY-001  
**Scenario:** User successfully pays a bill to a payee  
**Priority:** P0 - Critical  
**Type:** Positive  

**Preconditions:**
- User is logged in
- User has account (12345) with balance $1000.00
- User is on Bill Pay page (/billpay.htm)

**Test Steps:**
1. Navigate to "Bill Pay" from main menu
2. Enter Payee Name: "Electric Company"
3. Enter Address: "123 Main St"
4. Enter City: "Springfield"
5. Enter State: "IL"
6. Enter Zip Code: "62701"
7. Enter Phone Number: "555-1234"
8. Enter Account Number: "987654321"
9. Enter Verify Account: "987654321"
10. Enter Amount: $150.00
11. Select From Account: 12345
12. Click "Send Payment" button

**Expected Result:**
- Payment confirmation page is displayed
- Confirmation shows:
  - Payee: "Electric Company"
  - Amount: $150.00
  - From Account: 12345
- Source account balance updated to $850.00 (1000 - 150)
- Debit transaction created in account 12345
- Transaction description: "Bill Payment to Electric Company"
- No errors displayed

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-002: Bill Payment with Minimum Amount

**Test Case ID:** TC-BILLPAY-002  
**Scenario:** User pays minimum amount ($0.01) for a bill  
**Priority:** P2 - Medium  
**Type:** Boundary  

**Preconditions:**
- User is logged in
- Source account has balance $100.00

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in all payee information correctly
3. Enter Account Number: "123456"
4. Enter Verify Account: "123456"
5. Enter Amount: $0.01
6. Select From Account
7. Click "Send Payment" button

**Expected Result:**
- Payment succeeds
- Account balance decreases by $0.01
- Transaction recorded correctly
- Confirmation displayed

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 3.2 Negative Scenarios

### TC-BILLPAY-003: Bill Payment with Insufficient Funds

**Test Case ID:** TC-BILLPAY-003  
**Scenario:** User attempts to pay bill amount exceeding account balance  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is logged in
- Source account has balance $50.00

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in valid payee information
3. Enter Account Number: "123456"
4. Enter Verify Account: "123456"
5. Enter Amount: $500.00 (exceeds balance)
6. Select From Account (balance $50.00)
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Insufficient funds. Available balance: $50.00"
- Account balance remains $50.00
- No transaction created
- User can retry with different amount

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

**Note:** Code review shows withdraw is called but insufficient funds check may not exist

---

### TC-BILLPAY-004: Bill Payment with Negative Amount

**Test Case ID:** TC-BILLPAY-004  
**Scenario:** User attempts to pay bill with negative amount  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in valid payee information
3. Enter Account Number: "123456"
4. Enter Verify Account: "123456"
5. Enter Amount: -$100.00
6. Select From Account
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Amount must be greater than zero."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-005: Bill Payment with Zero Amount

**Test Case ID:** TC-BILLPAY-005  
**Scenario:** User attempts to pay bill with $0.00  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in valid payee information
3. Enter Account Number: "123456"
4. Enter Verify Account: "123456"
5. Enter Amount: $0.00
6. Select From Account
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Amount must be greater than zero."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-006: Bill Payment with Empty Amount

**Test Case ID:** TC-BILLPAY-006  
**Scenario:** User attempts to pay bill without entering amount  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in valid payee information
3. Enter Account Number: "123456"
4. Enter Verify Account: "123456"
5. Leave Amount field empty
6. Select From Account
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Amount is required."
- Form validation triggers
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-007: Account Number Mismatch

**Test Case ID:** TC-BILLPAY-007  
**Scenario:** User enters different values in Account Number and Verify Account fields  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in valid payee information
3. Enter Account Number: "123456"
4. Enter Verify Account: "654321" (different)
5. Enter Amount: $100.00
6. Select From Account
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Account numbers do not match. Please verify."
- No transaction occurs
- Both account number fields are highlighted

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-008: Empty Payee Name

**Test Case ID:** TC-BILLPAY-008  
**Scenario:** User attempts bill payment without entering payee name  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Leave Payee Name empty
3. Fill in other payee information
4. Enter matching account numbers
5. Enter Amount: $100.00
6. Select From Account
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Payee name is required."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-009: Empty Payee Address

**Test Case ID:** TC-BILLPAY-009  
**Scenario:** User attempts bill payment without entering address  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Enter Payee Name: "Utility Company"
3. Leave Address field empty
4. Fill in City, State, Zip
5. Enter matching account numbers
6. Enter Amount: $100.00
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Address is required."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-010: Empty Verify Account Field

**Test Case ID:** TC-BILLPAY-010  
**Scenario:** User attempts bill payment without entering verify account number  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in valid payee information
3. Enter Account Number: "123456"
4. Leave Verify Account field empty
5. Enter Amount: $100.00
6. Select From Account
7. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Account number verification is required."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-011: Bill Payment from Account ID ≤ 0

**Test Case ID:** TC-BILLPAY-011  
**Scenario:** Validation check for invalid from account ID  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in valid payee and payment information
3. Manipulate form to set fromAccountId to 0 or -1
4. Click "Send Payment" button

**Expected Result:**
- Payment fails
- Error message: "Please select a valid account."
- No transaction occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 3.3 Security Scenarios

### TC-BILLPAY-SEC-001: Pay Bill from Non-Owned Account

**Test Case ID:** TC-BILLPAY-SEC-001  
**Scenario:** User attempts to pay bill from account they don't own  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User A is logged in (owns account 12345)
- User B owns account 99999

**Test Steps:**
1. User A navigates to Bill Pay page
2. Fill in valid payee information
3. Enter payment details
4. Using developer tools, modify fromAccountId to 99999 (User B's account)
5. Submit payment

**Expected Result:**
- Payment fails
- Error message: "Unauthorized: You do not have permission to use this account."
- Account 99999 balance unchanged
- Security event logged

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-SEC-002: XSS in Payee Name

**Test Case ID:** TC-BILLPAY-SEC-002  
**Scenario:** Attempt XSS attack through payee name field  
**Priority:** P1 - High  
**Type:** Security  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Enter Payee Name: `<script>alert('XSS')</script>`
3. Fill in remaining fields
4. Submit payment

**Expected Result:**
- Payee name is properly sanitized/escaped
- No JavaScript executes
- If payment succeeds, confirmation page shows escaped HTML
- XSS attack prevented

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-SEC-003: SQL Injection in Payee Fields

**Test Case ID:** TC-BILLPAY-SEC-003  
**Scenario:** Attempt SQL injection through payee name  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Enter Payee Name: `'; DROP TABLE payee;--`
3. Fill in remaining fields with valid data
4. Submit payment

**Expected Result:**
- Input is properly sanitized
- SQL injection prevented
- No database tables dropped
- Payment either succeeds with sanitized name or fails with validation error

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 3.4 Edge Cases

### TC-BILLPAY-EDGE-001: Very Long Payee Name

**Test Case ID:** TC-BILLPAY-EDGE-001  
**Scenario:** Enter extremely long payee name  
**Priority:** P3 - Low  
**Type:** Edge Case  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Enter Payee Name: 500 character string
3. Fill in remaining fields
4. Submit payment

**Expected Result:**
- Either:
  - Field enforces maximum length (characters not accepted), OR
  - Server validates and returns error "Payee name exceeds maximum length"
- No system error or truncation without warning

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-EDGE-002: Special Characters in Payee Name

**Test Case ID:** TC-BILLPAY-EDGE-002  
**Scenario:** Enter special characters in payee name  
**Priority:** P2 - Medium  
**Type:** Edge Case  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Enter Payee Name: `AT&T / O'Reilly's #123`
3. Fill in remaining fields with valid data
4. Submit payment

**Expected Result:**
- Special characters are accepted (common in business names)
- Payment succeeds
- Name is stored and displayed correctly
- No encoding issues

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-EDGE-003: Invalid Zip Code Format

**Test Case ID:** TC-BILLPAY-EDGE-003  
**Scenario:** Enter invalid zip code format  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in payee information
3. Enter Zip Code: `ABCDE` (letters instead of numbers)
4. Fill remaining fields
5. Submit payment

**Expected Result:**
- Validation error: "Please enter a valid 5-digit zip code."
- Payment does not proceed
- User can correct and retry

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-BILLPAY-EDGE-004: Invalid Phone Number Format

**Test Case ID:** TC-BILLPAY-EDGE-004  
**Scenario:** Enter invalid phone number  
**Priority:** P3 - Low  
**Type:** Edge Case  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Bill Pay page
2. Fill in payee information
3. Enter Phone Number: `123` (incomplete)
4. Fill remaining fields
5. Submit payment

**Expected Result:**
- Either:
  - Validation error for phone format, OR
  - Payment succeeds (phone may be optional or format flexible)
- Behavior should be consistent

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

---

# 4. Loan Request Workflow

## 4.1 Positive Scenarios

### TC-LOAN-001: Successful Loan Request (Approved)

**Test Case ID:** TC-LOAN-001  
**Scenario:** User requests loan and gets approved  
**Priority:** P0 - Critical  
**Type:** Positive  

**Preconditions:**
- User is logged in
- User has account (12345) with balance $5000.00
- User is on Request Loan page (/requestloan.htm)
- Loan approval logic allows loan amount with sufficient down payment

**Test Steps:**
1. Navigate to "Request Loan" from main menu
2. Enter Loan Amount: $10,000.00
3. Enter Down Payment: $2,000.00
4. Select From Account: 12345 (balance $5000.00)
5. Click "Apply Now" button
6. Review loan approval page

**Expected Result:**
- Loan request is processed
- Loan status: "Approved"
- Approval message displayed: "Congratulations, your loan has been approved."
- New loan account created with:
  - Type: LOAN
  - Balance: $10,000.00 (loan amount)
- Down payment deducted from source account: $5000 - $2000 = $3000
- Loan account appears in account overview
- Loan account ID is displayed
- User can view loan details

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-002: Loan Request with Minimum Loan Amount

**Test Case ID:** TC-LOAN-002  
**Scenario:** User requests minimum allowed loan amount  
**Priority:** P2 - Medium  
**Type:** Boundary  

**Preconditions:**
- User is logged in
- Minimum loan amount is $100.00 (assumed)
- User has account with sufficient balance

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $100.00
3. Enter Down Payment: $20.00
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- If $100 is within allowed range:
  - Loan is processed
  - Approval/denial based on down payment ratio
- If below minimum:
  - Error message: "Minimum loan amount is $[minimum]"

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-003: Loan Request with Maximum Loan Amount

**Test Case ID:** TC-LOAN-003  
**Scenario:** User requests maximum allowed loan amount  
**Priority:** P2 - Medium  
**Type:** Boundary  

**Preconditions:**
- User is logged in
- Maximum loan amount is $100,000.00 (assumed)
- User has account with sufficient down payment

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $100,000.00
3. Enter Down Payment: $20,000.00 (20%)
4. Select From Account (balance > $20,000)
5. Click "Apply Now" button

**Expected Result:**
- If within system limits and down payment sufficient:
  - Loan is processed
  - Approval status returned
- If exceeds maximum:
  - Error message: "Maximum loan amount is $[maximum]"

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 4.2 Negative Scenarios

### TC-LOAN-004: Loan Request Denied (Insufficient Down Payment)

**Test Case ID:** TC-LOAN-004  
**Scenario:** User requests loan with insufficient down payment and gets denied  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is logged in
- User has account with balance $500.00
- Minimum down payment ratio is 20% (assumed)

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $10,000.00
3. Enter Down Payment: $500.00 (5%, below 20% minimum)
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- Loan request is processed but denied
- Denial message displayed: "We cannot grant a loan in that amount with your available funds."
- No loan account created
- Source account balance unchanged (down payment not deducted for denied loan)
- User can modify request and reapply

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-005: Loan Request with Negative Loan Amount

**Test Case ID:** TC-LOAN-005  
**Scenario:** User attempts to request loan with negative amount  
**Priority:** P0 - Critical  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: -$5,000.00
3. Enter Down Payment: $1,000.00
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- Loan request fails
- Error message: "Loan amount must be greater than zero."
- No loan processing occurs
- Form validation triggers

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-006: Loan Request with Zero Amount

**Test Case ID:** TC-LOAN-006  
**Scenario:** User attempts to request loan for $0.00  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $0.00
3. Enter Down Payment: $0.00
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- Loan request fails
- Error message: "Loan amount must be greater than zero."
- No loan processing occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-007: Loan Request with Negative Down Payment

**Test Case ID:** TC-LOAN-007  
**Scenario:** User attempts to request loan with negative down payment  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $10,000.00
3. Enter Down Payment: -$500.00
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- Loan request fails
- Error message: "Down payment must be greater than or equal to zero."
- No loan processing occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-008: Loan Request with Down Payment > Loan Amount

**Test Case ID:** TC-LOAN-008  
**Scenario:** User enters down payment greater than loan amount  
**Priority:** P2 - Medium  
**Type:** Edge Case  

**Preconditions:**
- User is logged in
- User has account with balance $15,000.00

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $5,000.00
3. Enter Down Payment: $10,000.00 (greater than loan)
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- Either:
  - Validation error: "Down payment cannot exceed loan amount.", OR
  - Loan is approved (down payment excess is ignored)
- Behavior should be logical and documented

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-009: Loan Request with Insufficient Account Balance for Down Payment

**Test Case ID:** TC-LOAN-009  
**Scenario:** User requests loan with down payment exceeding account balance  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in
- User has account (12345) with balance $500.00

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $10,000.00
3. Enter Down Payment: $2,000.00 (exceeds account balance of $500)
4. Select From Account: 12345
5. Click "Apply Now" button

**Expected Result:**
- Loan request fails
- Error message: "Insufficient funds for down payment. Available balance: $500.00"
- No loan account created
- Source account balance remains $500.00

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-010: Loan Request with Empty Loan Amount

**Test Case ID:** TC-LOAN-010  
**Scenario:** User attempts loan request without entering loan amount  
**Priority:** P1 - High  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Leave Loan Amount field empty
3. Enter Down Payment: $1,000.00
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- Loan request fails
- Error message: "Loan amount is required."
- Form validation triggers
- No loan processing occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-011: Loan Request with Empty Down Payment

**Test Case ID:** TC-LOAN-011  
**Scenario:** User attempts loan request without entering down payment  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $10,000.00
3. Leave Down Payment field empty
4. Select From Account
5. Click "Apply Now" button

**Expected Result:**
- Either:
  - Validation error: "Down payment is required.", OR
  - Defaults to $0 down payment and processes (likely denied)
- Behavior should be consistent

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-012: Loan Request Without Selecting From Account

**Test Case ID:** TC-LOAN-012  
**Scenario:** User attempts loan request without selecting source account for down payment  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $10,000.00
3. Enter Down Payment: $2,000.00
4. Do not select From Account (leave default/empty)
5. Click "Apply Now" button

**Expected Result:**
- Loan request fails
- Error message: "Please select an account for down payment."
- No loan processing occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 4.3 Security Scenarios

### TC-LOAN-SEC-001: Loan Request from Non-Owned Account

**Test Case ID:** TC-LOAN-SEC-001  
**Scenario:** User attempts to use another user's account for down payment  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User A is logged in (owns account 12345)
- User B owns account 99999 with balance $10,000

**Test Steps:**
1. User A navigates to Request Loan page
2. Enter Loan Amount: $5,000.00
3. Enter Down Payment: $1,000.00
4. Using developer tools, modify fromAccountId to 99999 (User B's account)
5. Submit loan request

**Expected Result:**
- Loan request fails
- Error message: "Unauthorized: You do not have permission to use this account."
- Account 99999 balance unchanged
- No loan account created
- Security event logged

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-SEC-002: SQL Injection in Loan Amount Field

**Test Case ID:** TC-LOAN-SEC-002  
**Scenario:** Attempt SQL injection through loan amount  
**Priority:** P0 - Critical  
**Type:** Security  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: `5000'; DROP TABLE loan;--`
3. Enter valid down payment
4. Select From Account
5. Submit loan request

**Expected Result:**
- Input is validated/sanitized
- SQL injection prevented
- Either validation error or loan processed with sanitized value
- Database tables intact

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

## 4.4 Edge Cases

### TC-LOAN-EDGE-001: Loan Amount with Excessive Decimal Places

**Test Case ID:** TC-LOAN-EDGE-001  
**Scenario:** User enters loan amount with many decimal places  
**Priority:** P2 - Medium  
**Type:** Edge Case  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $5,000.123456789
3. Enter Down Payment: $1,000.00
4. Select From Account
5. Submit loan request

**Expected Result:**
- System either:
  - Rounds to 2 decimal places ($5,000.12) and processes, OR
  - Validation error: "Amount must have maximum 2 decimal places"
- Behavior is consistent
- No precision errors

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-EDGE-002: Loan Request Exceeding Maximum Limit

**Test Case ID:** TC-LOAN-EDGE-002  
**Scenario:** User requests loan exceeding system maximum  
**Priority:** P2 - Medium  
**Type:** Boundary  

**Preconditions:**
- User is logged in
- System maximum loan is $100,000 (assumed)

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: $500,000.00
3. Enter Down Payment: $100,000.00
4. Select From Account
5. Submit loan request

**Expected Result:**
- Loan request fails
- Error message: "Loan amount exceeds maximum allowed limit of $100,000.00"
- No loan processing occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-EDGE-003: Multiple Concurrent Loan Requests

**Test Case ID:** TC-LOAN-EDGE-003  
**Scenario:** User submits multiple loan requests simultaneously  
**Priority:** P2 - Medium  
**Type:** Concurrency  

**Preconditions:**
- User is logged in
- User has account with balance $10,000

**Test Steps:**
1. Open two browser windows with same user logged in
2. In both windows, navigate to Request Loan
3. Window 1: Request $5,000 loan with $1,000 down payment
4. Window 2: Request $5,000 loan with $1,000 down payment
5. Submit both requests simultaneously

**Expected Result:**
- Both requests are processed
- Down payment is deducted correctly (total $2,000)
- Both loan accounts created if approved
- Or second request fails with insufficient funds if balance doesn't support both down payments
- No race condition occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

### TC-LOAN-EDGE-004: Loan Request with Non-Numeric Characters

**Test Case ID:** TC-LOAN-EDGE-004  
**Scenario:** User enters non-numeric characters in amount fields  
**Priority:** P2 - Medium  
**Type:** Negative  

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to Request Loan page
2. Enter Loan Amount: `abc123`
3. Enter Down Payment: `xyz`
4. Select From Account
5. Submit loan request

**Expected Result:**
- Loan request fails
- Validation error: "Please enter valid numeric amounts."
- Client-side or server-side validation catches error
- No loan processing occurs

**Actual Result:** _[To be filled during test execution]_

**Status:** _[Pass/Fail]_

---

---

# Test Execution Summary Template

## Summary Statistics
- **Total Test Cases:** [Count]
- **Executed:** [Count]
- **Passed:** [Count]
- **Failed:** [Count]
- **Blocked:** [Count]
- **Not Executed:** [Count]

## Test Execution by Priority
- **P0 (Critical):** [X/Y]
- **P1 (High):** [X/Y]
- **P2 (Medium):** [X/Y]
- **P3 (Low):** [X/Y]

## Test Execution by Type
- **Positive:** [X/Y]
- **Negative:** [X/Y]
- **Security:** [X/Y]
- **Edge Case:** [X/Y]
- **Boundary:** [X/Y]

## Critical Issues Found
1. [Issue description]
2. [Issue description]

## Test Environment
- **Application URL:** http://localhost:8080/parabank
- **Browser:** [Browser name and version]
- **OS:** [Operating system]
- **Database:** HSQLDB 2.7.4
- **Java Version:** 21
- **Tomcat Version:** 11.0.29

## Notes
[Any additional notes or observations]

---

# Appendix A: Test Data

## User Accounts
```
User 1:
  Username: testuser1
  Password: Test@123
  Accounts:
    - Account ID: 12345, Type: Checking, Balance: $1,000.00
    - Account ID: 12346, Type: Savings, Balance: $500.00

User 2:
  Username: testuser2
  Password: Test@456
  Accounts:
    - Account ID: 99999, Type: Checking, Balance: $5,000.00
```

## Test Payee Information
```
Payee 1:
  Name: Electric Company
  Address: 123 Main St
  City: Springfield
  State: IL
  Zip: 62701
  Phone: 555-1234
  Account: 987654321

Payee 2:
  Name: Water Utility
  Address: 456 Oak Ave
  City: Capital City
  State: IL
  Zip: 62702
  Phone: 555-5678
  Account: 111222333
```

---

# Appendix B: SQL Injection Test Payloads

```sql
' OR '1'='1
' OR '1'='1'--
' OR '1'='1'/*
admin'--
' UNION SELECT NULL--
'; DROP TABLE users--
' OR 1=1--
1' OR '1' = '1
' OR 'x'='x
') OR ('1'='1
```

---

# Appendix C: XSS Test Payloads

```javascript
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
javascript:alert('XSS')
"><script>alert('XSS')</script>
<iframe src="javascript:alert('XSS')">
<body onload=alert('XSS')>
<input onfocus=alert('XSS') autofocus>
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-11-27  
**Total Test Cases:** 72  
**Author:** QA Team  
**Review Status:** Draft
