---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Step

You are executing a step from the main GitHub exercise issue. Follow the instructions systematically and implement all required activities.

## Instructions

### 1. Get the Issue

**If issue number provided:**
```bash
gh issue view ${input:issue-number} --comments
```

**If no issue number provided:**
Find the exercise issue automatically:
```bash
# List all open issues and look for "Exercise:" in title
gh issue list --state open

# Get the issue number from the results
gh issue view <issue-number> --comments
```

Reference the Workflow Utilities section in `.github/copilot-instructions.md` for gh CLI patterns.

### 2. Parse the Step

From the issue content:
- Locate the current step section (e.g., "# Step 5-1:")
- Extract all `:keyboard: Activity:` sections
- Note any specific requirements or constraints

### 3. Execute Activities Systematically

For each activity:
1. **Read the instructions carefully**
2. **Implement using TDD approach:**
   - Write tests FIRST (RED phase)
   - Implement minimal code to pass (GREEN phase)
   - Refactor for quality (REFACTOR phase)
3. **Run tests after each change**
4. **Document findings** in `.github/memory/scratch/working-notes.md`

### 4. Scope Boundaries

**YOU HANDLE:**
- Backend implementation (Jest + Supertest tests)
- Frontend component implementation (React Testing Library tests)
- Integration between frontend and backend
- Following TDD Red-Green-Refactor cycles

**YOU DO NOT HANDLE:**
- Playwright UI tests (use `/create-ui-tests` prompt instead)
- Running Playwright tests (use `/run-ui-tests` prompt instead)
- Committing/pushing changes (use `/commit-and-push` prompt instead)

### 5. Stop Before Committing

**DO NOT commit or push changes.** That's handled by `/commit-and-push`.

After completing all activities, provide next steps in this order:

**If the step requires UI workflow:**
```
✅ Activities completed

Next steps:
1. /create-ui-tests
2. /run-ui-tests
3. /validate-step {step-number}
```

**If UI workflow is NOT required:**
```
✅ Activities completed

Next steps:
1. /validate-step {step-number}
```

**IMPORTANT:** Never recommend `/validate-step` before required UI prompts.

## Testing Approach

Follow the testing guidelines from `.github/copilot-instructions.md`:

- **Backend API changes**: Write Jest tests FIRST, then implement
- **Frontend components**: Write React Testing Library tests FIRST, then implement
- **This is true TDD**: Test first, then code to pass the test

## Example Execution

```
Step Activity: "Implement POST /api/todos endpoint"

1. Write failing test:
   - Create test in packages/backend/__tests__/app.test.js
   - Test expects POST /api/todos to return 201 with todo object
   - Run: npm test (from packages/backend/)
   - Verify: Test fails ❌

2. Implement endpoint:
   - Add POST route in packages/backend/src/app.js
   - Parse request body, create todo, return response
   - Run: npm test
   - Verify: Test passes ✅

3. Refactor if needed:
   - Clean up code
   - Run: npm test
   - Verify: Tests still pass ✅

4. Document in working notes:
   - What was implemented
   - Key decisions made
   - Any patterns discovered
```

## Remember

- Follow TDD discipline: RED → GREEN → REFACTOR
- Run tests frequently
- Keep changes small and incremental
- Document findings in memory system
- Don't implement UI tests (separate workflow)
- Don't commit (separate workflow)

---

**Ready to execute!** Provide the issue number or let me find the exercise issue automatically.
