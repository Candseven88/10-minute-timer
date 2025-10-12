import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { TimerTask } from '../types/timer';

interface TaskManagerProps {
  tasks: TimerTask[];
  currentTaskIndex: number;
  onTasksUpdate: (tasks: TimerTask[]) => void;
  onClose: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  currentTaskIndex,
  onTasksUpdate,
  onClose,
}) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ name: '', hours: 0, minutes: 5, seconds: 0 });

  const addTask = () => {
    if (!newTask.name.trim()) return;

    const task: TimerTask = {
      id: Date.now().toString(),
      name: newTask.name,
      duration: newTask.hours * 3600 + newTask.minutes * 60 + newTask.seconds,
    };

    onTasksUpdate([...tasks, task]);
    setNewTask({ name: '', hours: 0, minutes: 5, seconds: 0 });
  };

  const updateTask = (id: string, updates: Partial<TimerTask>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    onTasksUpdate(updatedTasks);
    setEditingTask(null);
  };

  const deleteTask = (id: string) => {
    onTasksUpdate(tasks.filter(task => task.id !== id));
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Task Manager</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Add New Task */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Add New Task</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Task name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="23"
                value={newTask.hours}
                onChange={(e) => setNewTask({ ...newTask, hours: Math.max(0, Math.min(23, parseInt(e.target.value) || 0)) })}
                className="w-16 px-2 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="H"
              />
              <span className="text-slate-300">h</span>
              
              <input
                type="number"
                min="0"
                max="59"
                value={newTask.minutes}
                onChange={(e) => setNewTask({ ...newTask, minutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                className="w-16 px-2 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="M"
              />
              <span className="text-slate-300">m</span>
              
              <input
                type="number"
                min="0"
                max="59"
                value={newTask.seconds}
                onChange={(e) => setNewTask({ ...newTask, seconds: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                className="w-16 px-2 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="S"
              />
              <span className="text-slate-300">s</span>
            </div>
            <button
              onClick={addTask}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Tasks Queue</h3>
          {tasks.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No tasks added yet</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    index === currentTaskIndex
                      ? 'bg-purple-900/30 border-purple-500'
                      : index < currentTaskIndex
                      ? 'bg-green-900/20 border-green-500/50'
                      : 'bg-slate-700/50 border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === currentTaskIndex
                          ? 'bg-purple-500 animate-pulse'
                          : index < currentTaskIndex
                          ? 'bg-green-500'
                          : 'bg-slate-500'
                      }`} />
                      
                      {editingTask === task.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            defaultValue={task.name}
                            className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateTask(task.id, { name: (e.target as HTMLInputElement).value });
                              }
                              if (e.key === 'Escape') {
                                setEditingTask(null);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="text-white font-medium">{task.name}</span>
                          <span className="text-slate-400 text-sm ml-2">
                            {formatDuration(task.duration)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {editingTask === task.id ? (
                        <button
                          onClick={() => setEditingTask(null)}
                          className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white transition-colors"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingTask(task.id)}
                          className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};