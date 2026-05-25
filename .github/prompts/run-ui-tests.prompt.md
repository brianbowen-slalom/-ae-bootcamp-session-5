---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
tools: ['read', 'execute', 'todo']
---

# Run UI Tests

Run Playwright UI tests and provide a structured summary of results with failure classification.

## Prerequisites

### 1. Install Playwright Dependencies (REQUIRED FIRST STEP)

**MUST run before first UI test execution after container rebuild:**

```bash
npm run test:ui:install --workspace=frontend
```

This command:
- Runs `playwright install --with-deps chromium`
- Includes automatic bounded remediation for common Ubuntu Yarn key issue
- Performs one retry if initial install fails
- **MANDATORY in Ubuntu/Linux environments**

**If install fails:**
- Stop immediately
- Report environment blocker with failing command and key error lines
- DO NOT continue to run Playwright tests
- DO NOT perform ad-hoc package hunting or broad OS troubleshooting

### 2. Start Application Servers

Both backend and frontend must be running:

```bash
# From repo root
npm start

# This starts:
# - Backend: http://localhost:3001
# - Frontend: http://localhost:3000
```

If servers aren't running, tests will fail with connection errors.

## Instructions

### 1. Verify Prerequisites

```bash
# Check if servers are running
curl http://localhost:3000  # Frontend
curl http://localhost:3001/api/todos  # Backend

# If not running, start them
npm start
```

### 2. Run UI Tests

```bash
# From repo root or frontend directory
npm run test:ui --workspace=frontend

# Or with specific options
npm run test:ui -- --headed  # Watch tests run
npm run test:ui -- --debug   # Debug mode
```

### 3. Capture Test Output

Collect:
- Total tests run
- Pass/fail counts
- Duration
- Specific test failures with error messages
- Screenshots (if available)

### 4. Summarize Results

Provide structured summary:

```
📊 UI Test Execution Summary

Total Tests: 5
✅ Passed: 4
❌ Failed: 1
Duration: 23.4 seconds

Failed Tests:

1. ❌ Todo Application › should handle API errors
   File: tests/ui/e2e.spec.js:67
   Error: Timeout 5000ms exceeded waiting for element
   
   Expected: Error message "Service unavailable"
   Actual: Element never appeared
   
   Classification: 🧪 Test Code Defect
   Root Cause: Test expects specific error text that doesn't exist
   Fix Needed: Update test to match actual error message
   Location: tests/ui/e2e.spec.js:72

Passed Tests:
✅ should create a new todo
✅ should edit todo title
✅ should toggle todo completion
✅ should delete a todo

Next Steps:
1. Fix test code defect in tests/ui/e2e.spec.js:72
2. Re-run tests: npm run test:ui
3. Once passing, proceed with /validate-step
```

### 5. Classify Each Failure

For every failed test, determine root cause category:

**🐛 Application Code Defect**
- Feature doesn't work as intended
- API returns wrong data
- UI doesn't update after action
- Business logic bug

**Indicators:**
- Manual browser test also fails
- Error occurs during actual feature use
- Backend logs show errors
- Network requests fail or return unexpected data

**Example:**
```
Test: "should delete todo"
Error: Todo still visible after delete

Manual Test: Clicking delete in browser doesn't remove todo
Network: DELETE returns 200 but array not updated

Classification: 🐛 Application Code Defect
Fix: Backend needs to splice todo from array
```

**🧪 Test Code Defect**
- Test has wrong assertion
- Test uses wrong selector
- Test doesn't wait for async operation
- Test expects wrong behavior

**Indicators:**
- Manual browser test passes
- Feature works correctly by hand
- Test expectation doesn't match actual behavior
- Selector changed but test didn't update

**Example:**
```
Test: "should show success message"
Error: Expected "Success!" but got "Operation successful"

Manual Test: App shows "Operation successful" correctly
Feature: Working as intended

Classification: 🧪 Test Code Defect
Fix: Update test expectation to "Operation successful"
```

**🌍 Environment Issue**
- Server not running
- Wrong URL/port
- Network connectivity
- Browser/dependency version
- Timing/race condition (flaky test)

**Indicators:**
- Connection refused errors
- Timeout errors (sometimes passes, sometimes fails)
- "Cannot connect" messages
- Works locally but fails in CI

**Example:**
```
Test: "should create todo"
Error: net::ERR_CONNECTION_REFUSED at http://localhost:3000

Check: curl http://localhost:3000 → Connection refused

Classification: 🌍 Environment Issue
Fix: Start frontend server with npm start
```

### 6. Provide Actionable Guidance

For each failure, specify:
- **What's wrong**: Clear description of the issue
- **Where to fix**: Exact file and line number
- **How to fix**: Concrete suggestion
- **How to verify**: Command to re-test

**Example:**
```
❌ Failed: should toggle todo completion

What: Toggle checkbox doesn't update completed state

Where: packages/backend/src/app.js:87

How: Change `todo.completed = true` to `todo.completed = !todo.completed`

Verify: 
1. Make the fix
2. Run backend tests: npm test
3. Run UI tests again: npm run test:ui
```

## Example Executions

### All Tests Pass

```
📊 UI Test Execution Summary

Total Tests: 5
✅ Passed: 5
❌ Failed: 0
Duration: 18.7 seconds

Passed Tests:
✅ should create a new todo
✅ should edit todo title
✅ should toggle todo completion
✅ should delete a todo
✅ should handle API errors

🎉 All UI tests passing!

Coverage:
- Create journey: ✅
- Edit journey: ✅
- Toggle journey: ✅
- Delete journey: ✅
- Error handling: ✅

Next Steps:
1. /validate-step {step-number}
2. /commit-and-push feature/your-branch
```

### Mixed Results with Detailed Triage

```
📊 UI Test Execution Summary

Total Tests: 5
✅ Passed: 3
❌ Failed: 2
Duration: 31.2 seconds

Failed Tests:

1. ❌ should edit todo title
   File: tests/ui/e2e.spec.js:45
   Error: Timeout waiting for updated title
   
   Investigation:
   - Ran test in --headed mode
   - Observed: Edit input appears, but save button doesn't exist
   - Manual browser test: Same issue - no save button in UI
   
   Classification: 🐛 Application Code Defect
   Root Cause: Frontend missing save button implementation
   
   Fix Needed:
   - File: packages/frontend/src/App.js
   - Add save button to edit mode
   - Wire up handleSaveTodo function
   
   Verify:
   1. Add save button to edit UI
   2. Test manually in browser
   3. Re-run: npm run test:ui

2. ❌ should handle API errors
   File: tests/ui/e2e.spec.js:78
   Error: Expected text "Service unavailable" not found
   
   Investigation:
   - Manual test: Error handling works, shows "API Error"
   - Test expects different text
   
   Classification: 🧪 Test Code Defect
   Root Cause: Test expects wrong error message text
   
   Fix Needed:
   - File: tests/ui/e2e.spec.js:82
   - Change expectation from "Service unavailable" to "API Error"
   
   Verify:
   1. Update test expectation
   2. Re-run: npm run test:ui

Passed Tests:
✅ should create a new todo
✅ should toggle todo completion
✅ should delete a todo

Next Steps (Priority Order):
1. Fix app code: Add save button (packages/frontend/src/App.js)
2. Fix test code: Update error message expectation (tests/ui/e2e.spec.js:82)
3. Re-run tests: npm run test:ui
4. Once passing: /validate-step {step-number}
```

### Environment Issue

```
📊 UI Test Execution Summary

Total Tests: 5
✅ Passed: 0
❌ Failed: 5
Duration: 5.1 seconds

Failed Tests:

All tests failed with same error:
Error: net::ERR_CONNECTION_REFUSED at http://localhost:3000

Classification: 🌍 Environment Issue
Root Cause: Frontend server not running

Fix Needed:
1. Start servers from repo root:
   npm start

2. Verify servers running:
   curl http://localhost:3000
   curl http://localhost:3001/api/todos

3. Re-run tests:
   npm run test:ui

Environment Check:
- Frontend (http://localhost:3000): ❌ Not responding
- Backend (http://localhost:3001): ❌ Not responding

Next Steps:
1. Start servers: npm start
2. Verify both respond to curl
3. Re-run: npm run test:ui --workspace=frontend
```

## Debugging Tips

**For flaky tests (intermittent failures):**
```bash
# Run multiple times to identify patterns
npm run test:ui -- --repeat-each=3

# Run with trace for detailed debugging
npm run test:ui -- --trace on
```

**For visual debugging:**
```bash
# Watch tests execute
npm run test:ui -- --headed

# Step through test
npm run test:ui -- --debug
```

**For screenshots on failure:**
Tests should automatically capture screenshots in `test-results/` folder.

## Remember

- **Always install Playwright dependencies first** (test:ui:install)
- **Verify servers running** before tests
- **Classify failures accurately** (app/test/environment)
- **Provide specific guidance** for each failure
- **Point to exact files/lines** for fixes
- **Be systematic** in triage process
- **Stop if environment issues** - don't guess at fixes

---

**Ready to run!** Ensure Playwright is installed and servers are running, then execute tests.
