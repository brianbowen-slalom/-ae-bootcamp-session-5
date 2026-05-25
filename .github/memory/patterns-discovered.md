# Patterns Discovered

## Purpose
This file documents code patterns and conventions discovered during development. These patterns help maintain consistency and guide future implementation decisions.

## Pattern Template

Use this template when documenting a new pattern:

```markdown
## Pattern: [Pattern Name]

**Context**: [Where/when this pattern applies]

**Problem**: [What problem does this pattern solve?]

**Solution**: [How to implement the pattern]

**Example**:
```[language]
[Code example demonstrating the pattern]
```

**Related Files**: [List files where this pattern is used]

**Notes**: [Additional context, trade-offs, or lessons learned]
```

---

## Example Pattern

## Pattern: Service Initialization - Empty Array vs Null

**Context**: Backend service initialization, particularly for in-memory data storage

**Problem**: Should collections be initialized as empty arrays `[]` or `null`? This affects error handling and conditional logic throughout the codebase.

**Solution**: Initialize collections as empty arrays `[]` at service startup
- Allows immediate iteration without null checks
- Reduces conditional complexity in CRUD operations
- Makes the "empty state" explicit and intentional
- Prevents "Cannot read property of null" errors

**Example**:
```javascript
// ✅ GOOD: Initialize as empty array
let todos = [];

app.get('/api/todos', (req, res) => {
  res.json(todos); // No null check needed
});

// ❌ BAD: Initialize as null
let todos = null;

app.get('/api/todos', (req, res) => {
  if (todos === null) {
    todos = [];
  }
  res.json(todos); // Requires null check every time
});
```

**Related Files**: 
- `packages/backend/src/app.js` (todos array initialization)

**Notes**: 
- This pattern emerged during initial backend setup
- Empty array is semantically correct: "no todos yet" vs "todos not initialized"
- Simplifies testing: tests can assume array operations always work
- If switching to database later, this maps well to "empty result set"

---

## Guidelines for Documenting Patterns

### When to Document a Pattern

✅ **Document when**:
- You solve a problem that could recur elsewhere in the codebase
- You make a decision that affects consistency (naming, structure, error handling)
- You discover an anti-pattern or common mistake to avoid
- You establish a convention that new code should follow

❌ **Don't document**:
- One-off fixes specific to a single line of code
- Standard language idioms or well-known best practices
- Temporary workarounds that will be replaced

### Pattern Categories

Consider organizing patterns by category as they accumulate:

- **Data Structures**: How data is organized and initialized
- **API Design**: REST endpoint conventions, request/response formats
- **Error Handling**: How errors are caught, logged, and returned
- **State Management**: How frontend state is structured and updated
- **Testing**: Test organization, mocking strategies, assertion patterns
- **Anti-Patterns**: Common mistakes and how to avoid them

### Keep It Actionable

- **Good**: "Use `!todo.completed` for toggle logic instead of `= true`"
- **Bad**: "Toggle didn't work so I fixed it"

The goal is to capture reusable knowledge that helps future development (including AI-assisted development) stay consistent with established patterns.

---

## Pattern Index

As patterns accumulate, maintain a quick reference index here:

1. [Service Initialization - Empty Array vs Null](#pattern-service-initialization---empty-array-vs-null)

---

## Notes
- Review this file before implementing new features
- Update patterns when conventions evolve
- Remove or archive patterns that are no longer relevant
- Cross-reference with session-notes.md for context on why patterns emerged
