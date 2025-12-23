
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Columns, 
  List as ListIcon, 
  MoreVertical,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Task } from '../types';
import { storage } from '../services/storage';

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: () => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onTasksChange }) => {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    label: '',
    content: '',
    status: 'todo'
  });

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      label: newTask.label || 'Task',
      content: newTask.content || '',
      status: newTask.status || 'todo'
    };
    storage.saveTask(task);
    onTasksChange();
    setIsAdding(false);
    setNewTask({ title: '', label: '', content: '', status: 'todo' });
  };

  const handleUpdateStatus = (id: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      storage.saveTask({ ...task, status });
      onTasksChange();
    }
  };

  const handleDeleteTask = (id: string) => {
    storage.deleteTask(id);
    onTasksChange();
  };

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-200' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-indigo-500' },
    { id: 'done', title: 'Done', color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
          <button 
            onClick={() => setView('kanban')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            <Columns className="w-4 h-4 mr-2" />
            Kanban
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            <ListIcon className="w-4 h-4 mr-2" />
            List
          </button>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Task
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Buat Task Baru</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Judul Task"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Label (e.g. Planning, Social Media)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={newTask.label}
              onChange={e => setNewTask({...newTask, label: e.target.value})}
            />
            <textarea 
              placeholder="Deskripsi Task"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24"
              value={newTask.content}
              onChange={e => setNewTask({...newTask, content: e.target.value})}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">Batal</button>
              <button onClick={handleAddTask} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium">Tambah</button>
            </div>
          </div>
        </div>
      )}

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => (
            <div key={col.id} className="bg-slate-100/50 rounded-2xl p-4 min-h-[500px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center">
                   <div className={`w-2 h-2 rounded-full ${col.color} mr-2`} />
                   <h3 className="font-bold text-slate-700">{col.title}</h3>
                </div>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <div className="space-y-4">
                {tasks.filter(t => t.status === col.id).map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {task.label}
                      </span>
                      <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">{task.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.content}</p>
                    <div className="flex justify-end gap-1">
                      {columns.filter(c => c.id !== task.status).map(c => (
                        <button 
                          key={c.id}
                          onClick={() => handleUpdateStatus(task.id, c.id)}
                          className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded border border-slate-100 transition-all font-medium"
                        >
                          Move to {c.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Judul</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Label</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <select 
                      value={task.status} 
                      onChange={e => handleUpdateStatus(task.id, e.target.value as Task['status'])}
                      className={`text-xs font-bold px-3 py-1 rounded-full outline-none appearance-none cursor-pointer ${
                        task.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="todo">TO DO</option>
                      <option value="in-progress">IN PROGRESS</option>
                      <option value="done">DONE</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{task.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{task.label}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteTask(task.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
