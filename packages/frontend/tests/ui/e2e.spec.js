/**
 * End-to-End UI Tests for Todo Application
 * Tests critical user journeys: Create, Edit, Toggle, Delete, Error Handling
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo Application - Critical User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  // Test 1: Create Journey
  test('should create a new todo and display it in the list', async () => {
    const todoTitle = 'Buy groceries';
    
    await todoPage.addTodo(todoTitle);
    
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);
    
    // Verify the todo is visible
    const todo = todoPage.todoItem(todoTitle);
    await expect(todo).toBeVisible();
  });

  // Test 2: Edit Journey
  test('should edit an existing todo title', async () => {
    const originalTitle = 'Original task';
    const updatedTitle = 'Updated task';
    
    // Create a todo first
    await todoPage.addTodo(originalTitle);
    
    // Edit the todo
    await todoPage.editTodo(originalTitle, updatedTitle);
    
    // Verify old title is gone and new title exists
    await expect(todoPage.todoItem(originalTitle)).not.toBeVisible();
    await expect(todoPage.todoItem(updatedTitle)).toBeVisible();
  });

  // Test 3: Toggle Journey
  test('should toggle todo completion status', async () => {
    const todoTitle = 'Task to complete';
    
    // Create a todo
    await todoPage.addTodo(todoTitle);
    
    // Verify initially not completed
    let isCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isCompleted).toBe(false);
    
    // Toggle to completed
    await todoPage.toggleTodo(todoTitle);
    isCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isCompleted).toBe(true);
    
    // Toggle back to not completed
    await todoPage.toggleTodo(todoTitle);
    isCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isCompleted).toBe(false);
  });

  // Test 4: Delete Journey
  test('should delete a todo from the list', async () => {
    const todoTitle = 'Task to delete';
    
    // Create a todo
    await todoPage.addTodo(todoTitle);
    expect(await todoPage.getTodoCount()).toBe(1);
    
    // Delete the todo
    await todoPage.deleteTodo(todoTitle);
    
    // Verify todo is removed
    expect(await todoPage.getTodoCount()).toBe(0);
    await expect(todoPage.todoItem(todoTitle)).not.toBeVisible();
  });

  // Test 5: Error Handling Journey (Error-path test)
  test('should handle API unavailable error gracefully', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    // Simulate API failure BEFORE navigating
    await todoPage.simulateAPIError();
    
    // Navigate to app (API call will fail)
    await page.goto('http://localhost:3000');
    
    // Wait a moment for error to appear
    await page.waitForTimeout(1000);
    
    // Verify error message is displayed
    // (Adjust error text based on actual app implementation)
    const hasError = await todoPage.hasError('error|failed|unavailable');
    expect(hasError).toBe(true);
  });
});