---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push

Analyze the current changes, generate a conventional commit message, and push to a feature branch.

## Prerequisites

**Branch name is REQUIRED.** If not provided as input, ask the user for it.

Format: `feature/<descriptive-name>`
Example: `feature/step-5-1`, `feature/implement-delete-endpoint`

## Instructions

### 1. Verify UI Tests (If Required)

If the current step includes UI workflow:
- Check that `/run-ui-tests` was successful in this chat, OR
- Run `npm run test:ui` now to verify UI tests pass

Do NOT commit if UI tests are failing.

### 2. Analyze Changes

```bash
# See what files changed
git status

# View the actual changes
git diff
```

Understand:
- What features were added?
- What bugs were fixed?
- What files were modified?

### 3. Generate Conventional Commit Message

Follow the format from `.github/copilot-instructions.md`:

**Format:** `<type>: <description>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance, dependencies
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `refactor:` - Code refactoring

**Examples:**
```
feat: implement POST /api/todos endpoint
fix: resolve toggle bug setting completed to true
test: add integration tests for DELETE endpoint
chore: update ESLint configuration
```

**Guidelines:**
- Use lowercase
- No period at the end
- Describe WHAT changed, not HOW
- Keep under 72 characters

### 4. Create or Switch to Branch

```bash
# Check current branch
git branch --show-current

# If branch doesn't exist, create it
git checkout -b ${input:branch-name}

# If branch exists, switch to it
git checkout ${input:branch-name}
```

**CRITICAL:** NEVER commit to `main` or any branch other than the user-provided branch name.

### 5. Stage All Changes

```bash
git add .
```

Verify all files are staged:
```bash
git status
```

### 6. Commit with Generated Message

```bash
git commit -m "<generated-message>"
```

### 7. Push to Remote Branch

```bash
git push origin ${input:branch-name}
```

If this is the first push to this branch:
```bash
git push -u origin ${input:branch-name}
```

### 8. Confirm Success

```
✅ Changes committed and pushed!

Branch: ${input:branch-name}
Commit: <generated-message>

Next steps:
- Review changes on GitHub
- Create Pull Request if ready
- Continue with next step
```

## Safety Checks

**Before committing, verify:**
- [ ] All tests pass (including UI tests if required)
- [ ] No linting errors (if code-reviewer was run)
- [ ] Changes are intentional
- [ ] Branch name provided (not committing to main)

**If any check fails:**
- Stop and report the issue
- Provide guidance on fixing
- Don't commit broken code

## Example Execution

```
User: /commit-and-push feature/step-5-1

Bot analyzes changes:
- Modified: packages/backend/src/app.js
- Modified: packages/backend/__tests__/app.test.js
- Added POST /api/todos endpoint
- Tests passing

Bot generates commit message:
"feat: implement POST /api/todos endpoint with validation"

Bot executes:
$ git checkout -b feature/step-5-1
$ git add .
$ git commit -m "feat: implement POST /api/todos endpoint with validation"
$ git push origin feature/step-5-1

✅ Changes committed and pushed to feature/step-5-1
```

## Error Handling

**If branch name not provided:**
```
⚠️  Branch name required!

Please provide a branch name:
  /commit-and-push feature/your-branch-name

Format: feature/<descriptive-name>
Example: feature/step-5-1
```

**If tests failing:**
```
⚠️  Cannot commit - tests are failing!

Fix the failing tests first, then try again.
Run: npm test
```

**If trying to commit to main:**
```
🚫 Cannot commit to main branch!

Please provide a feature branch name:
  /commit-and-push feature/your-branch-name
```

---

**Ready to commit!** Provide the branch name to proceed.
