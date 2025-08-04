// src/App.jsx
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

initializeApp(firebaseConfig);
const auth = getAuth();

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('todolime-tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('all');
  const [started, setStarted] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    localStorage.setItem('todolime-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    try {
      if (forgotPasswordMode) {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent.');
        return;
      }
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { text: input, priority, done: false, id: Date.now(), important: false }]);
    setInput('');
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const toggleDone = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const toggleImportant = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, important: !t.important } : t));
  const startEdit = (id, currentText) => {
    setEditingTaskId(id);
    setEditedText(currentText);
  };
  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editedText } : t));
    setEditingTaskId(null);
    setEditedText('');
  };
  const filteredTasks = tasks.filter(task => {
    if (filter === 'done') return task.done;
    if (filter === 'todo') return !task.done;
    if (filter === 'important') return task.important;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to ToDo Lime</h1>
        <input
          className="bg-[#161b22] border border-gray-700 p-2 rounded w-64 mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-[#161b22] border border-gray-700 p-2 rounded w-64 mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className="bg-lime-500 text-black px-4 py-2 rounded mb-2"
        >
          {forgotPasswordMode ? 'Send Reset Email' : isRegistering ? 'Register' : 'Login'}
        </button>
        <p
          className="text-sm text-gray-400 hover:text-lime-400 cursor-pointer"
          onClick={() => {
            setForgotPasswordMode(!forgotPasswordMode);
            setIsRegistering(false);
          }}
        >
          {forgotPasswordMode ? 'Back to login' : 'Forgot Password?'}
        </p>
        <p
          className="text-sm text-gray-400 hover:text-lime-400 cursor-pointer mt-2"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setForgotPasswordMode(false);
          }}
        >
          {isRegistering ? 'Already have an account? Login' : 'New here? Register'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todolime</h1>
        <button onClick={() => signOut(auth)} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Sign Out</button>
      </header>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-lime-500 text-black' : 'bg-gray-800'}`}>All</button>
        <button onClick={() => setFilter('todo')} className={`px-4 py-2 rounded ${filter === 'todo' ? 'bg-lime-500 text-black' : 'bg-gray-800'}`}>To Do</button>
        <button onClick={() => setFilter('done')} className={`px-4 py-2 rounded ${filter === 'done' ? 'bg-lime-500 text-black' : 'bg-gray-800'}`}>Done</button>
        <button onClick={() => setFilter('important')} className={`px-4 py-2 rounded ${filter === 'important' ? 'bg-lime-500 text-black' : 'bg-gray-800'}`}>Important</button>
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
            className={`flex justify-between items-center px-4 py-3 rounded-lg bg-[#161b22] border border-gray-700 shadow-sm ${task.important ? 'border-yellow-400' : ''}`}
          >
            <div className="flex-1">
              {editingTaskId === task.id ? (
                <input
                  value={editedText}
                  onChange={e => setEditedText(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                  autoFocus
                  className="w-full px-2 py-1 rounded bg-[#0d1117] text-white border border-gray-600"
                />
              ) : (
                <p
                  onDoubleClick={() => startEdit(task.id, task.text)}
                  className={`font-medium text-lg cursor-pointer ${task.done ? 'line-through text-gray-500' : ''}`}
                >
                  {task.text}
                </p>
              )}
              <p className="text-sm text-gray-400">Priority: {task.priority}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleImportant(task.id)} className="text-yellow-400 text-sm hover:scale-110">★</button>
              <button onClick={() => toggleDone(task.id)} className="text-lime-400 hover:text-lime-500 text-sm border border-lime-400 px-2 py-1 rounded">
                {task.done ? 'Undo' : 'Done'}
              </button>
              <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-500 text-xl">&times;</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
