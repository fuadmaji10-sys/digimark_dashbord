
import React, { useState, useEffect } from 'react';
import { ViewType, User, MarketingData, Task } from './types';
import { storage } from './services/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DataManager from './components/DataManager';
import TaskManager from './components/TaskManager';
import AccountManager from './components/AccountManager';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [view, setView] = useState<ViewType>('dashboard');
  const [marketingData, setMarketingData] = useState<MarketingData[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  const refreshData = () => {
    setMarketingData(storage.getMarketingData());
    setTasks(storage.getTasks());
  };

  const handleLogin = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setView('login');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={view} 
      onViewChange={setView} 
      user={currentUser} 
      onLogout={handleLogout}
    >
      {view === 'dashboard' && (
        <Dashboard data={marketingData} />
      )}
      {view === 'data' && (
        <DataManager 
          user={currentUser} 
          data={marketingData} 
          onDataChange={refreshData} 
        />
      )}
      {view === 'task' && (
        <TaskManager tasks={tasks} onTasksChange={refreshData} />
      )}
      {view === 'management' && currentUser.role === 'admin' && (
        <AccountManager onUsersChange={refreshData} />
      )}
    </Layout>
  );
};

export default App;
