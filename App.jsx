import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('todolime-tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');

  useEffect(() => {
    localStorage.setItem('todolime-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { text: input, priority, id: Date.now() }]);
    setInput('');
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <div className="min-h-screen flex flex-col items-center p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Todolime</h1>

      <div className="flex gap-2 w-full max-w-md">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 rounded border"
          placeholder="Enter task..."
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button onClick={addTask} className="bg-lime-500 hover:bg-lime-600 text-white p-2 rounded">
          Add
        </button>
      </div>

      <ul className="mt-6 w-full max-w-md space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded shadow">
            <div>
              <p className="font-medium">{task.text}</p>
              <small className="text-sm text-gray-500">Priority: {task.priority}</small>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
