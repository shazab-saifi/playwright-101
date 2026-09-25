'use client';

import { useState, type FormEvent } from 'react';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type Filter = 'all' | 'active' | 'completed';

const FILTERS: Filter[] = ['all', 'active', 'completed'];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
    setNewTodo('');
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const remaining = todos.filter((todo) => !todo.completed).length;
  const countLabel = `${remaining} ${remaining === 1 ? 'item' : 'items'} left`;

  const emptyMessage =
    filter === 'all'
      ? 'No todos yet.'
      : filter === 'active'
        ? 'No active todos.'
        : 'No completed todos.';

  const filterLabel = (f: Filter) => f[0].toUpperCase() + f.slice(1);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Todos</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Add things to do, mark them complete, and filter the list.
        </p>
      </header>

      <form onSubmit={addTodo} className="flex gap-2">
        <label htmlFor="new-todo" className="sr-only">
          Add a new todo
        </label>
        <input
          id="new-todo-input"
          type="text"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={!newTodo.trim()}
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p
          role="status"
          className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          {emptyMessage}
        </p>
      ) : visibleTodos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          {emptyMessage}
        </p>
      ) : (
        <ul aria-label="Todo list" className="flex flex-col gap-2">
          {visibleTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                className="size-4 accent-zinc-900 dark:accent-zinc-100"
              />
              <span
                className={
                  todo.completed
                    ? 'text-zinc-400 line-through dark:text-zinc-500'
                    : 'text-zinc-900 dark:text-zinc-100'
                }
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.text}"`}
                className="ml-auto rounded px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <p aria-live="polite" className="text-zinc-500 dark:text-zinc-400">
          {countLabel}
        </p>
        <div role="group" aria-label="Filter todos" className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={
                filter === f
                  ? 'rounded-full bg-zinc-900 px-3 py-1 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'rounded-full px-3 py-1 font-medium text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>
        <button
          onClick={clearCompleted}
          disabled={todos.every((todo) => !todo.completed)}
          className="font-medium text-zinc-500 transition-colors hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Clear completed
        </button>
      </div>
    </main>
  );
}
