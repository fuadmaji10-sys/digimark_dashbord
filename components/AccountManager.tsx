
import React, { useState } from 'react';
import { Plus, Trash2, Shield, User as UserIcon, Lock } from 'lucide-react';
import { User, Role } from '../types';
import { storage } from '../services/storage';

interface AccountManagerProps {
  onUsersChange: () => void;
}

const AccountManager: React.FC<AccountManagerProps> = ({ onUsersChange }) => {
  const users = storage.getUsers();
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    password: '',
    role: Role.ADS_SPECIALIST
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) return;
    const user: User = {
      id: crypto.randomUUID(),
      username: newUser.username,
      password: newUser.password,
      role: newUser.role as Role
    };
    storage.saveUser(user);
    onUsersChange();
    setIsAdding(false);
    setNewUser({ username: '', password: '', role: Role.ADS_SPECIALIST });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Yakin ingin menghapus user ini?')) {
      storage.deleteUser(id);
      onUsersChange();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Manajemen Pengguna</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah User
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-md font-bold mb-4">Buat Akun Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={newUser.username}
                onChange={e => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={newUser.password}
                onChange={e => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <div>
              <select 
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(Role).map(role => (
                  <option key={role} value={role}>{role.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500">Batal</button>
            <button onClick={handleAddUser} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Simpan User</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u => (
          <div key={u.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Shield className={`w-6 h-6 ${u.role === Role.ADMIN ? 'text-amber-500' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="font-bold text-slate-800">{u.username}</p>
                <p className="text-xs text-slate-400 capitalize">{u.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button 
              onClick={() => handleDeleteUser(u.id)}
              disabled={u.username === 'admin'}
              className={`p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors ${u.username === 'admin' ? 'opacity-0' : 'opacity-100'}`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountManager;
