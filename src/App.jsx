// src/App.jsx
import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('todolime-tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('all');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    localStorage.setItem('todolime-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { text: input, priority, done: false, id: Date.now() }]);
    setInput('');
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const toggleDone = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const filteredTasks = tasks.filter(task => {
    if (filter === 'done') return task.done;
    if (filter === 'todo') return !task.done;
    return true;
  });

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Your intelligent task management companion</h1>
        <p className="text-lg max-w-xl mb-6 text-gray-300">
          Organize, collaborate, and achieve more with smart lists, real-time sync, and seamless file sharing.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 font-semibold rounded-lg text-lg"
        >
          Get Started Free
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          {[{
            title: 'Smart Lists',
            desc: 'Organize tasks with intelligent categorization, custom icons, and color coding for better visual management.'
          }, {
            title: 'Real-time Sync',
            desc: 'Stay synchronized across all devices with instant updates and offline support for seamless productivity.'
          }, {
            title: 'Team Collaboration',
            desc: 'Share lists with team members, track progress together, and collaborate in real-time with QR code sharing.'
          }, {
            title: 'File Attachments',
            desc: 'Attach files, images, and documents directly to your tasks with secure cloud storage integration.'
          }, {
            title: 'Smart Scheduling',
            desc: 'Intelligent task scheduling with "My Day" smart lists and deadline management for better time management.'
          }, {
            title: 'Secure & Private',
            desc: 'Your data is protected with enterprise-grade security, encrypted storage, and privacy-first design.'
          }].map((item, index) => (
            <div key={index} className="bg-[#161b22] border border-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-semibold mb-6 tracking-tight">Todolime</h1>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-lime-500 text-black' : 'bg-gray-800'}`}>All</button>
        <button onClick={() => setFilter('todo')} className={`px-4 py-2 rounded ${filter === 'todo' ? 'bg-lime-500 text-black' : 'bg-gray-800'}`}>To Do</button>
        <button onClick={() => setFilter('done')} className={`px-4 py-2 rounded ${filter === 'done' ? 'bg-lime-500 text-black' : 'bg-gray-800'}`}>Done</button>
      </div>

      <div className="flex gap-2 w-full max-w-xl mb-6">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-[#161b22] text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
          placeholder="Enter task..."
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#161b22] text-white border border-gray-700 focus:outline-none"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button
          onClick={addTask}
          className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-xl space-y-3">
        {filteredTasks.map(task => (
          <li
            key={task.id}
            className="flex justify-between items-center px-4 py-3 rounded-lg bg-[#161b22] border border-gray-700 shadow-sm"
          >
            <div className="flex-1">
              <p className={`font-medium text-lg ${task.done ? 'line-through text-gray-500' : ''}`}>{task.text}</p>
              <p className="text-sm text-gray-400">Priority: {task.priority}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDone(task.id)}
                className="text-lime-400 hover:text-lime-500 text-sm border border-lime-400 px-2 py-1 rounded"
              >
                {task.done ? 'Undo' : 'Done'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-400 hover:text-red-500 text-xl"
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
