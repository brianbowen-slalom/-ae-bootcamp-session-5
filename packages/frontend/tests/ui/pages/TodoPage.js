/**
 * Page Object Model for Todo Application
 * Encapsulates all UI interactions and selectors
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors - defined once, used everywhere
    this.addInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoList = page.getByRole('list');
  }

  /**
   * Navigate to the application
   */
  async goto() {
    await this.page.goto('http://localhost:3000');
    // Wait for app to be ready (network idle indicates data loaded)
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get a specific todo item by title
   */
  todoItem(title) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  /**
   * Create a new todo
   * @param {string} title - The todo title
   */
  async addTodo(title) {
    await this.addInput.fill(title);
    await this.addButton.click();
    // Wait for todo to appear (state-based wait)
    await this.todoItem(title).waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Edit an existing todo
   * @param {string} oldTitle - Current title
   * @param {string} newTitle - New title
   */
  async editTodo(oldTitle, newTitle) {
    const todo = this.todoItem(oldTitle);
    const editButton = todo.getByRole('button', { name: /edit/i });
    await editButton.click();
    
    // Find the input that appears for editing
    const editInput = todo.getByRole('textbox');
    await editInput.fill(newTitle);
    
    // Save the edit
    const saveButton = todo.getByRole('button', { name: /save/i });
    await saveButton.click();
    
    // Wait for updated title to appear
    await this.todoItem(newTitle).waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Toggle todo completion status
   * @param {string} title - The todo title
   */
  async toggleTodo(title) {
    const todo = this.todoItem(title);
    const checkbox = todo.getByRole('checkbox');
    await checkbox.click();
    
    // Small buffer for visual state update
    await this.page.waitForTimeout(100);
  }

  /**
   * Delete a todo
   * @param {string} title - The todo title
   */
  async deleteTodo(title) {
    const todo = this.todoItem(title);
    const deleteButton = todo.getByRole('button', { name: /delete/i });
    await deleteButton.click();
    
    // Wait for todo to be removed (state-based wait)
    await todo.waitFor({ state: 'detached', timeout: 5000 });
  }

  /**
   * Get the count of visible todos
   */
  async getTodoCount() {
    const items = await this.todoList.getByRole('listitem').all();
    return items.length;
  }

  /**
   * Check if a todo is completed
   * @param {string} title - The todo title
   */
  async isTodoCompleted(title) {
    const todo = this.todoItem(title);
    const checkbox = todo.getByRole('checkbox');
    return await checkbox.isChecked();
  }

  /**
   * Check if an error message is displayed
   * @param {string} errorText - Expected error text (can be partial)
   */
  async hasError(errorText) {
    const errorElement = this.page.getByText(new RegExp(errorText, 'i'));
    return await errorElement.isVisible();
  }

  /**
   * Simulate API unavailable by intercepting requests
   */
  async simulateAPIError() {
    // Intercept API calls and return error
    await this.page.route('**/api/todos**', route => {
      route.abort('failed');
    });
  }
}

module.exports = { TodoPage };
