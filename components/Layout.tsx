
import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Database, 
  CheckSquare, 
  Users, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { ViewType, Role, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.ADS_SPECIALIST, Role.SOCIAL_MEDIA_SPECIALIST] },
    { id: 'data', label: 'Data Input', icon: Database, roles: [Role.ADMIN, Role.ADS_SPECIALIST, Role.SOCIAL_MEDIA_SPECIALIST] },
    { id: 'task', label: 'Tasks', icon: CheckSquare, roles: [Role.ADMIN, Role.ADS_SPECIALIST, Role.SOCIAL_MEDIA_SPECIALIST] },
    { id: 'management', label: 'Manajemen Akun', icon: Users, roles: [Role.ADMIN] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Mobile Overlay */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-md shadow-md border"
        >
          <Menu className="w-5 h-5 text-indigo-600" />
        </button>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">DigiMark</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {filteredMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ViewType)}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${
                  currentView === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-slate-800">
            <div className="flex items-center p-3 rounded-xl bg-slate-800/50 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-slate-900 font-bold mr-3">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.username}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className={`lg:hidden p-2 hover:bg-slate-100 rounded-md ${isSidebarOpen ? 'hidden' : 'block'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold capitalize text-slate-800">
              {currentView === 'management' ? 'Manajemen Akun' : currentView}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-sm text-slate-500">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
          </div>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

// Define BarChart3 for internal usage since it's used in sidebar
import { BarChart3 } from 'lucide-react';
