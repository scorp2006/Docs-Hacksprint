"use client";

import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Home from '../Home';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex-grow flex">
        {isSidebarOpen && <Sidebar />}
        <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}> 
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-100 mb-8">Task Dashboard</h1>
            {/* Task List */}
            <div className="bg-gray-800 shadow rounded-lg">
              <ul className="divide-y divide-gray-700">
                {tasks.map((task) => (
                  <li key={task.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-100">{task.title}</h2>
                        <p className="mt-1 text-sm text-gray-400">{task.description}</p>
                        {task.dueDate && <p className="mt-1 text-sm text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {task.status}
                      </span>
                    </div>
                  </li>
                ))}
                {tasks.length === 0 && (
                  <li className="p-4 text-center text-gray-400">
                    No tasks added yet. Add your first task above!
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
