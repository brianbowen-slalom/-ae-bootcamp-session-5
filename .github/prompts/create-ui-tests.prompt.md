---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests

Create Playwright UI tests for critical user journeys using Page Object Model (POM) patterns.

## Scope Limit

**HARD LIMIT: Maximum 5 Playwright test cases per execution**

Target: 3-5 total test cases including at least 1 error-path test

If more than 5 candidate scenarios exist:
- Select the highest-risk 5 scenarios
- List deferred scenarios in output
- DO NOT create more than 5 tests

## Instructions

### 1. Identify Journeys

**If journeys provided:**
Use the user-specified journeys

**If no journeys provided (default):**
Create tests for these critical journeys:
1. Create a todo
2. Edit a todo  
3. Toggle todo completion
4. Delete a todo
5. Handle API error state (at least 1 error-path test)

**Risk-based selection if > 5 candidates:**
Prioritize:
- Core CRUD operations (create, read, update, delete)
- Most frequently used features
- Error handling for critical failures
- Features with complex user interactions

### 2. Use Page Object Model (POM)

**Structure:**
```
packages/frontend/
  tests/
    ui/
      e2e.spec.js           # Test scenarios
      pages/
        TodoPage.js         # Page object for interactions
        BasePage.js         # Common page methods (if needed)
```

**Page Object Pattern:**

```javascript
// tests/ui/pages/TodoPage.js
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Define selectors once
    this.addInput = page.getByRole('textbox', { name: /add.*todo/i });
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoItem = (title) => page.getByRole('listitem').filter({ hasText: title });
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
    await this.page.waitForLoadState('networkidle');
  }

  async addTodo(title) {
    await this.addInput.fill(title);
    await this.addButton.click();
    await this.todoItem(title).waitFor({ state: 'visible' });
  }

  async deleteTodo(title) {
    const todo = this.todoItem(title);
    await todo.getByRole('button', { name: /delete/i }).click();
    await todo.waitFor({ state: 'detached' });
  }
}

module.exports = { TodoPage };
```

**Test File Using Page Object:**

```javascript
// tests/ui/e2e.spec.js
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo Application', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  // Test 1: Create
  test('should create a new todo', async () => {
    await todoPage.addTodo('Buy groceries');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);
  });

  // Test 2: Delete
  test('should delete a todo', async () => {
    await todoPage.addTodo('Buy groceries');
    await todoPage.deleteTodo('Buy groceries');
    const count = await todoPage.getTodoCount();
    expect(count).toBe(0);
  });

  // ... up to 5 tests total
});
```

### 3. Stable Selectors

**Priority (Most Stable → Least Stable):**

```javascript
// 1. BEST: Role + accessible name
page.getByRole('button', { name: /add/i })
page.getByRole('checkbox', { name: /completed/i })

// 2. GOOD: Label text
page.getByLabel('Todo title')

// 3. ACCEPTABLE: Test IDs
page.getByTestId('todo-item')

// 4. AVOID: CSS selectors
page.locator('.todo-item') // ❌ Brittle
```

Use role-based selectors wherever possible - they survive CSS changes.

### 4. State-Based Waits

**DO NOT use arbitrary timeouts:**
```javascript
// ❌ BAD
await page.waitForTimeout(2000);

// ✅ GOOD
await element.waitFor({ state: 'visible' });
await element.waitFor({ state: 'detached' });
await page.waitForLoadState('networkidle');
```

### 5. Test Isolation

Each test must be independent:

```javascript
test.beforeEach(async ({ page }) => {
  // Fresh start for every test
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
});

// No shared state between tests
```

### 6. Verify Count Before Finishing

Before completing:
1. Count all `test(...)` or `it(...)` blocks created
2. If count > 5, reduce to highest-priority 5
3. List any deferred scenarios in output

**Example count verification:**
```javascript
// Count these:
test('should create todo', ...) // 1
test('should edit todo', ...)   // 2
test('should toggle todo', ...) // 3
test('should delete todo', ...) // 4
test('should handle API error', ...) // 5
// Total: 5 ✅ At limit

// If you created 7 tests, remove the 2 lowest-priority ones
```

### 7. Report Results

```
✅ UI Tests Created

Files Modified:
- packages/frontend/tests/ui/e2e.spec.js
- packages/frontend/tests/ui/pages/TodoPage.js

Test Scenarios (5 total):
1. ✅ Create todo
2. ✅ Edit todo
3. ✅ Toggle todo completion
4. ✅ Delete todo
5. ✅ Handle API unavailable error

Page Object Methods:
- goto() - Navigate to app
- addTodo(title) - Create new todo
- editTodo(oldTitle, newTitle) - Edit existing todo
- toggleTodo(title) - Toggle completion
- deleteTodo(title) - Delete todo
- getTodoCount() - Count visible todos

Deferred Scenarios (will implement if needed):
- Test empty state message
- Test with 100+ todos
- Test keyboard navigation

Next Steps:
1. /run-ui-tests
2. /validate-step {step-number}
```

## Example Creation

### Default Journeys (No Input)

```
User: /create-ui-tests

Bot creates 5 tests:
1. Create todo
2. Edit todo
3. Toggle completion
4. Delete todo
5. API error handling

Bot creates page object with methods:
- addTodo()
- editTodo()
- toggleTodo()
- deleteTodo()

Bot reports: ✅ 5 UI tests created
```

### Custom Journeys

```
User: /create-ui-tests create, delete, error-state

Bot creates 3 tests:
1. Create todo
2. Delete todo  
3. Handle API error

Bot creates page object with methods:
- addTodo()
- deleteTodo()

Bot reports: ✅ 3 UI tests created
```

### Over Limit Scenario

```
User: /create-ui-tests create, edit, toggle, delete, error, empty-state, bulk-delete

Bot identifies 7 scenarios, selects 5 highest-priority:
1. Create todo (core CRUD)
2. Edit todo (core CRUD)
3. Toggle completion (core CRUD)
4. Delete todo (core CRUD)
5. API error handling (critical error path)

Deferred:
- Empty state message (lower risk)
- Bulk delete (edge case)

Bot reports: ✅ 5 UI tests created (2 scenarios deferred)
```

## Quality Checklist

Before finishing, verify:
- [ ] Total test count ≤ 5
- [ ] At least 1 error-path test included
- [ ] Page Object Model used (selectors in page object)
- [ ] Stable selectors (prefer getByRole)
- [ ] State-based waits (no arbitrary timeouts)
- [ ] Tests are isolated (beforeEach resets state)
- [ ] Test names are descriptive
- [ ] Page object methods are reusable

## Remember

- **HARD LIMIT: 5 tests maximum**
- Use Page Object Model (no duplicate selectors)
- Prefer stable selectors (getByRole > CSS)
- Use state-based waits (waitFor > waitForTimeout)
- Keep tests isolated (no shared state)
- Include at least 1 error-path test
- Count tests before finishing
- List deferred scenarios if > 5 candidates

---

**Ready to create tests!** Specify journeys or use defaults (create, edit, toggle, delete, error).
