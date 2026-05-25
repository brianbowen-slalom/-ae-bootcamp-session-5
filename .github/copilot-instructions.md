# GitHub Copilot Instructions for TODO Application

## Project Context

- Full-stack TODO application with React frontend and Express backend
- Focus on iterative, feedback-driven development
- Current phase: Backend stabilization and frontend feature completion

## Documentation References

Link to existing documentation (helps AI navigate the project):

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

- **Test-Driven Development**: Red-Green-Refactor cycle
- **Incremental Changes**: Small, testable modifications
- **Systematic Debugging**: Use test failures as guides
- **Validation Before Commit**: All tests pass, no lint errors

## Testing Scope

This project uses unit tests, integration tests, and UI end-to-end tests:

- **Backend**: Jest + Supertest for API testing
- **Frontend**: React Testing Library for component unit/integration tests
- **UI testing**: Playwright for critical user journey automation
- **Manual browser testing**: For exploratory validation and visual checks
- **Reason**: Combine fast feedback (unit/integration) with end-to-end quality confidence (UI tests)

### Testing Approach by Context

- **Backend API changes**: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- **Frontend component features**: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR). Follow with manual browser testing for full UI flows.
- **This is true TDD**: Test first, then code to pass the test

## Workflow Patterns

Follow these development workflows:

1. **TDD Workflow**: Write/fix tests → Run → Fail → Implement → Pass → Refactor
2. **Code Quality Workflow**: Run lint → Categorize issues → Fix systematically → Re-validate
3. **Integration Workflow**: Identify issue → Debug → Test → Fix → Verify end-to-end
4. **UI Testing Workflow**: Define critical journeys → Create UI tests → Run → Debug failures → Validate coverage

## Agent Usage

Use specialized agents for specific workflows:

- **tdd-developer**: For implementation and unit/integration TDD cycles; do NOT create or run Playwright UI tests in this mode
- **code-reviewer**: For addressing lint errors and code quality improvements
- **test-engineer**: Owns all Playwright UI test authoring/execution, failure triage, and isolation checks

## Memory System

The project uses a two-tier memory system to track development discoveries and provide context-aware AI assistance:

- **Persistent Memory**: This file (`.github/copilot-instructions.md`) contains foundational principles and workflows that rarely change
- **Working Memory**: `.github/memory/` directory contains evolving discoveries and patterns

### Working Memory Structure

- **During active development**: Take notes in `.github/memory/scratch/working-notes.md` (not committed)
  - Real-time tracking of current task, approach, findings, decisions, and blockers
  - Scratchpad for active thinking - cleared or updated each session
- **At end of session**: Summarize key findings into `.github/memory/session-notes.md` (committed)
  - Historical record of completed sessions
  - Documents what was accomplished, key findings, decisions, and outcomes
- **Document recurring patterns**: Add to `.github/memory/patterns-discovered.md` (committed)
  - Reusable code patterns and conventions
  - Anti-patterns and lessons learned
  - Helps maintain consistency across the codebase

### How to Use

- **Reference these files** when providing context-aware suggestions
- **Consult patterns-discovered.md** before implementing new features
- **Review session-notes.md** when encountering similar problems
- **Update working-notes.md** continuously during active development
- See [.github/memory/README.md](memory/README.md) for complete usage guide

## Workflow Utilities

GitHub CLI commands for workflow automation (available to all modes):

- List open issues: `gh issue list --state open`
- Get issue details: `gh issue view <issue-number>`
- Get issue with comments: `gh issue view <issue-number> --comments`
- The main exercise issue will have "Exercise:" in the title
- Steps are posted as comments on the main issue
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked

## Git Workflow

Follow conventional commit format and branch strategies:

- **Use conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- **Feature branches**: `feature/<descriptive-name>`
- **Always stage all changes before committing**: `git add .`
- **Push to the correct branch**: `git push origin <branch-name>`
