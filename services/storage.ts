
import { MarketingData, Task, User, Role } from '../types';

const KEYS = {
  DATA: 'digimark_data',
  TASKS: 'digimark_tasks',
  USERS: 'digimark_users',
  CURRENT_USER: 'digimark_current_user'
};

const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', password: 'password', role: Role.ADMIN },
  { id: '2', username: 'ads_spesialis', password: 'password', role: Role.ADS_SPECIALIST },
  { id: '3', username: 'socmed_spesialis', password: 'password', role: Role.SOCIAL_MEDIA_SPECIALIST }
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Audit Meta Ads', label: 'Urgent', content: 'Cek ROAS campaign Q4', status: 'todo' },
  { id: 't2', title: 'Plan Social Media Content', label: 'Planning', content: 'Buat kalender konten Januari', status: 'in-progress' },
];

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },

  saveUser: (user: User) => {
    const users = storage.getUsers();
    const existing = users.findIndex(u => u.id === user.id);
    if (existing > -1) users[existing] = user;
    else users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  deleteUser: (id: string) => {
    const users = storage.getUsers().filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getMarketingData: (): MarketingData[] => {
    const data = localStorage.getItem(KEYS.DATA);
    return data ? JSON.parse(data) : [];
  },

  saveMarketingData: (entry: MarketingData) => {
    const entries = storage.getMarketingData();
    const existing = entries.findIndex(e => e.id === entry.id);
    if (existing > -1) entries[existing] = entry;
    else entries.push(entry);
    localStorage.setItem(KEYS.DATA, JSON.stringify(entries));
  },

  deleteMarketingData: (id: string) => {
    const entries = storage.getMarketingData().filter(e => e.id !== id);
    localStorage.setItem(KEYS.DATA, JSON.stringify(entries));
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    if (!data) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(data);
  },

  saveTask: (task: Task) => {
    const tasks = storage.getTasks();
    const existing = tasks.findIndex(t => t.id === task.id);
    if (existing > -1) tasks[existing] = task;
    else tasks.push(task);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  deleteTask: (id: string) => {
    const tasks = storage.getTasks().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  }
};
