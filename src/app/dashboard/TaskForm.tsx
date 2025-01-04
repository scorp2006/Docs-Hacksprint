import { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask({
      title: taskTitle,
      description: taskDescription,
      dueDate,
      status: 'pending',
      id: Date.now(),
    });
    setTaskTitle('');
    setTaskDescription('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter task title"
          required
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter task description"
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button type="submit" className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded">Add Task</button>
    </form>
  );
};

export default TaskForm;
