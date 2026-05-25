---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Step

Validate that all success criteria for a specific step are met. This prompt checks your work against the requirements defined in the GitHub issue.

## Prerequisites

**Step number is REQUIRED** (e.g., "5-0", "5-1", "5-2")

## Instructions

### 1. Get the Exercise Issue

```bash
# Find the exercise issue (has "Exercise:" in title)
gh issue list --state open

# Get the issue with all comments
gh issue view <issue-number> --comments
```

Reference the Workflow Utilities section in `.github/copilot-instructions.md` for gh CLI patterns.

### 2. Locate the Step

Search through the issue content for:
```
# Step ${input:step-number}:
```

Example: If step-number is "5-1", find "# Step 5-1:"

### 3. Extract Success Criteria

From the step section, find the "Success Criteria" or similar section.

Common formats:
- "✅ Success Criteria"
- "Success Criteria:"
- "Validation:"
- "Expected Outcomes:"

### 4. Check Each Criterion

For each success criterion, verify against the current workspace:

**Common Criteria Types:**

**Implementation Complete:**
```bash
# Check if file exists and contains implementation
cat packages/backend/src/app.js | grep "POST /api/todos"
```

**Tests Passing:**
```bash
# Run tests
npm test

# Check specific test suite
npm test -- packages/backend/__tests__/app.test.js
```

**UI Tests Passing (if required):**
```bash
# Run UI tests
npm run test:ui --workspace=frontend
```

**Lint Clean:**
```bash
# Check for lint errors
npm run lint
```

**Specific Functionality:**
- Test the feature manually if needed
- Verify API endpoints respond correctly
- Check UI renders expected elements

### 5. Report Status

Provide a clear, structured report:

```
📋 Step ${input:step-number} Validation Report

Success Criteria Status:

✅ Criterion 1: POST endpoint implemented
   - Verified: packages/backend/src/app.js contains endpoint
   - Tests: 3/3 passing for POST /api/todos

✅ Criterion 2: Input validation working
   - Verified: Returns 400 for missing title
   - Tests: Validation test passing

❌ Criterion 3: Frontend integration complete
   - Issue: Frontend not calling the API yet
   - Location: packages/frontend/src/App.js
   - Fix needed: Add handleCreateTodo API call

⚠️  Criterion 4: UI tests passing
   - Status: Tests not run yet
   - Action needed: Run /run-ui-tests

Overall Status: 🟡 PARTIALLY COMPLETE

Next Steps:
1. Fix frontend integration (packages/frontend/src/App.js)
2. Run UI tests with /run-ui-tests
3. Re-validate with /validate-step ${input:step-number}
```

### 6. Completion Levels

**✅ COMPLETE:** All criteria met, ready to move on

**🟡 PARTIALLY COMPLETE:** Some criteria met, specific actions needed

**❌ INCOMPLETE:** Major criteria missing, significant work needed

## Examples

### Example 1: All Criteria Met

```
📋 Step 5-1 Validation Report

Success Criteria Status:

✅ POST /api/todos endpoint implemented
   - File: packages/backend/src/app.js
   - Tests: 4/4 passing

✅ Input validation working
   - Returns 400 for missing title
   - Returns 201 with valid input

✅ Frontend integration complete
   - handleCreateTodo calls API
   - UI updates after creation

✅ UI tests passing
   - 4/4 Playwright tests passing
   - Coverage: create/edit/toggle/delete

Overall Status: ✅ COMPLETE

All success criteria met! Ready for next step.

Next Actions:
1. /commit-and-push feature/step-5-1
2. Continue to next step
```

### Example 2: Issues Found

```
📋 Step 5-2 Validation Report

Success Criteria Status:

✅ DELETE endpoint implemented
   - File: packages/backend/src/app.js
   - Endpoint exists

❌ Tests failing
   - Issue: DELETE test expects 200 but gets 404
   - Root cause: Endpoint not removing from array
   - Fix: Add splice() to remove item

❌ Frontend integration incomplete
   - Issue: Delete button renders but has no onClick
   - Fix: Wire up handleDelete function

⏭️  UI tests not run yet
   - Required: Run /run-ui-tests after fixes

Overall Status: ❌ INCOMPLETE

Next Steps:
1. Fix backend DELETE to remove from array
2. Wire up frontend delete button
3. Run backend tests: npm test
4. Run /run-ui-tests
5. Re-validate with /validate-step 5-2
```

## Validation Checklist

Use this mental checklist when validating:

- [ ] All files mentioned in criteria exist
- [ ] All functions/endpoints mentioned are implemented
- [ ] Unit tests exist and pass
- [ ] Integration tests exist and pass
- [ ] UI tests pass (if required for this step)
- [ ] No lint errors (if code-reviewer was run)
- [ ] Manual testing confirms functionality works
- [ ] Edge cases handled (error states, validation)

## Error Handling

**If step number not found:**
```
⚠️  Could not find Step ${input:step-number} in issue.

Available steps in issue:
- Step 5-0: Project Setup
- Step 5-1: Implement POST Endpoint
- Step 5-2: Implement DELETE Endpoint

Please provide a valid step number.
```

**If success criteria section missing:**
```
⚠️  No success criteria found for Step ${input:step-number}.

Checking for common patterns:
- Implementation requirements
- Test requirements
- Expected functionality

Based on step description, here's what should be validated:
[Infer criteria from step description]
```

## Remember

- Be thorough - check each criterion carefully
- Be specific - point to exact files/lines for issues
- Be actionable - provide clear next steps
- Be honest - don't mark complete unless truly done
- Be helpful - guide toward completion

---

**Ready to validate!** Provide the step number (e.g., "5-1") to check.
