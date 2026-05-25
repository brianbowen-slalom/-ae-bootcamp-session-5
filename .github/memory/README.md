# Working Memory System

## Purpose

This directory provides a **working memory system** for tracking patterns, decisions, and lessons learned during development. It helps GitHub Copilot provide more context-aware suggestions by understanding your project's evolution, coding patterns, and historical decisions.

## Why Two Types of Memory?

### Persistent Memory (`.github/copilot-instructions.md`)
- **Purpose**: Foundational principles and workflows that rarely change
- **Contains**: Project context, tech stack, testing approach, agent usage guidelines
- **When to update**: When core principles or architecture change
- **Committed to git**: Yes, always

### Working Memory (`.github/memory/`)
- **Purpose**: Evolving discoveries, patterns, and session-specific context
- **Contains**: Session summaries, discovered patterns, active working notes
- **When to update**: Continuously during development
- **Committed to git**: Partially (see structure below)

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical session summaries (COMMITTED)
├── patterns-discovered.md       # Accumulated code patterns (COMMITTED)
└── scratch/
    ├── .gitignore              # Ignores all scratch files
    └── working-notes.md        # Active session notes (NOT COMMITTED)
```

### File Purposes

#### `session-notes.md` (Committed)
- **Purpose**: Historical record of completed development sessions
- **When to write**: At the END of each session
- **Content**: What was accomplished, key findings, decisions made, outcomes
- **Why committed**: Provides historical context for future developers and AI
- **Think of it as**: Your development journal - preserving lessons learned

#### `patterns-discovered.md` (Committed)
- **Purpose**: Documented code patterns and conventions discovered during development
- **When to write**: When you identify a reusable pattern or convention
- **Content**: Pattern name, context, problem, solution, examples, related files
- **Why committed**: Ensures consistency across the codebase
- **Think of it as**: Your pattern library - reusable solutions

#### `scratch/working-notes.md` (NOT Committed)
- **Purpose**: Real-time notes during active development
- **When to write**: Throughout your current session as you work
- **Content**: Current task, approach, findings, decisions, blockers, next steps
- **Why NOT committed**: Temporary scratchpad - most notes become irrelevant
- **Think of it as**: Your whiteboard - active thinking space

## When to Use Each File

### During TDD Workflow (Red-Green-Refactor)

**Active Work** → `scratch/working-notes.md`:
```markdown
## Current Task
Implementing POST /api/todos endpoint - making test pass

## Approach
- Step 1: Parse request body ✓
- Step 2: Validate required fields ← CURRENT
- Step 3: Generate ID and timestamp
- Step 4: Return 201 response

## Key Findings
- Request body validation requires express-validator middleware
- Test expects specific error format: { error: "message" }

## Decisions Made
- Using nanoid for ID generation (lightweight, URL-safe)
- Storing todos in memory array (no DB yet)
```

**Pattern Discovery** → `patterns-discovered.md`:
```markdown
## Pattern: API Error Response Format
**Context**: Backend API endpoints
**Problem**: Tests expect consistent error response format
**Solution**: All errors return { error: "message" } with appropriate status
**Example**: res.status(400).json({ error: "Title is required" })
**Related Files**: packages/backend/src/app.js
```

**Session Summary** → `session-notes.md` (at end):
```markdown
## Session: Implementing POST /api/todos (May 21, 2026)

### Accomplished
- Implemented POST /api/todos endpoint with validation
- All POST endpoint tests passing

### Key Findings
- Chose nanoid for ID generation (smaller bundle than uuid)
- Established error response format convention

### Outcomes
- 5 tests passing, 0 failing
- Backend API fully implements CRUD operations
```

### During Linting Workflow (Error Resolution)

**Active Work** → `scratch/working-notes.md`:
```markdown
## Current Task
Fixing ESLint errors in frontend App.js

## Approach
1. Fix unused variable errors (3 instances)
2. Remove console.log statements (2 instances)
3. Fix missing key props in list rendering

## Key Findings
- 'handleEdit' function declared but never called
- Discovered incomplete edit feature implementation

## Decisions Made
- Removed handleEdit stub (will implement properly later)
- Added suppressWarning prop for intentional console.logs in dev
```

**Pattern Discovery** → `patterns-discovered.md`:
```markdown
## Pattern: Development Console Logging
**Context**: Frontend debugging during development
**Problem**: ESLint flags console statements, but needed for debugging
**Solution**: Use conditional logging: if (process.env.NODE_ENV === 'development')
**Example**: See App.js handleCreateTodo function
**Related Files**: packages/frontend/src/App.js
```

### During Debugging Workflow (Issue Resolution)

**Active Work** → `scratch/working-notes.md`:
```markdown
## Current Task
Debug: Toggle always sets completed=true

## Approach
1. Trace data flow from UI click to state update
2. Check API endpoint logic
3. Verify state update in React component

## Key Findings
- BUG FOUND: Line 45 uses = true instead of = !todo.completed
- State update was correct, backend logic was wrong

## Decisions Made
- Fix backend toggle logic
- Add regression test for toggle both directions
- Update patterns-discovered with this lesson

## Next Steps
- Write test for toggle false→true and true→false
- Implement fix
- Verify all toggle tests pass
```

**Pattern Discovery** → `patterns-discovered.md`:
```markdown
## Pattern: Toggle Logic Anti-Pattern
**Context**: Backend PATCH /api/todos/:id endpoint
**Problem**: Using absolute assignment (todo.completed = true) instead of toggle
**Solution**: Always use negation for toggle: todo.completed = !todo.completed
**Example**: WRONG: todo.completed = true | RIGHT: todo.completed = !todo.completed
**Related Files**: packages/backend/src/app.js (line 45)
**Lesson**: Write tests that verify both directions of toggle operations
```

**Session Summary** → `session-notes.md` (at end):
```markdown
## Session: Debugging Toggle Feature (May 21, 2026)

### Accomplished
- Identified and fixed toggle bug in backend
- Added regression tests for bidirectional toggle

### Key Findings
- Bug was subtle: used assignment instead of negation
- Tests caught the issue but didn't test both directions initially

### Outcomes
- All tests passing
- Documented toggle anti-pattern for future reference
```

## How AI Reads and Applies These Patterns

### During Code Generation
When you ask Copilot to implement a feature, it will:
1. Read `copilot-instructions.md` for foundational principles
2. Check `patterns-discovered.md` for established conventions
3. Apply learned patterns to new code
4. Suggest solutions consistent with your project's style

**Example**:
```
You: "Implement DELETE /api/todos/:id endpoint"

Copilot reads patterns-discovered.md and sees:
- Pattern: API Error Response Format
- Pattern: REST Endpoint Structure
- Pattern: Array Operations for Todo Storage

Copilot generates code that follows these patterns automatically!
```

### During Debugging
When you encounter an issue, Copilot will:
1. Check `session-notes.md` for similar past issues
2. Review `patterns-discovered.md` for anti-patterns
3. Suggest fixes based on historical learnings

### During Code Review
When reviewing your code, Copilot can:
1. Verify consistency with documented patterns
2. Flag deviations from established conventions
3. Suggest improvements based on lessons learned

## Best Practices

### ✅ DO

- **Update `scratch/working-notes.md` frequently** during active work
- **Document patterns immediately** when you discover them
- **Summarize sessions** while details are fresh
- **Keep patterns concise** - focus on the essence
- **Include examples** - show don't just tell
- **Link related files** - help future developers find context
- **Update patterns** when conventions evolve

### ❌ DON'T

- **Don't commit scratch files** - they're temporary by design
- **Don't duplicate copilot-instructions.md** - keep foundational principles there
- **Don't write novels** - brief, actionable notes are best
- **Don't skip pattern documentation** - "I'll remember" doesn't scale
- **Don't let session-notes accumulate without summarizing** - review and consolidate periodically

## Workflow Summary

```
During Session:
1. Open scratch/working-notes.md at session start
2. Document current task, approach, findings in real-time
3. When you discover a pattern → add to patterns-discovered.md
4. Keep scratch notes updated as you progress

At Session End:
5. Review scratch/working-notes.md for key learnings
6. Summarize important discoveries into session-notes.md
7. Ensure new patterns are documented in patterns-discovered.md
8. Commit session-notes.md and patterns-discovered.md
9. Leave scratch/working-notes.md for next session (or clear it)
```

## Questions?

This system evolves with your project. If you discover better ways to organize or document, update this README and share learnings in `session-notes.md`!

---

**Remember**: The goal is continuous learning - both for you and the AI assisting you. Good documentation today makes development faster tomorrow.
