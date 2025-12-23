
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Check, X, Search } from 'lucide-react';
import { MarketingData, Category, Channel, Objective, User, Role } from '../types';
import { CHANNEL_CONFIG, CATEGORY_CHANNELS } from '../constants';
import { storage } from '../services/storage';

interface DataManagerProps {
  user: User;
  data: MarketingData[];
  onDataChange: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ user, data, onDataChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<MarketingData>>({
    date: new Date().toISOString().split('T')[0],
    category: user.role === Role.ADS_SPECIALIST ? Category.PAID_ADS : Category.ORGANIC,
    channel: user.role === Role.ADS_SPECIALIST ? Channel.META_ADS : Channel.FACEBOOK,
    objective: Objective.AWARENESS,
    metrics: {}
  });

  const availableCategories = useMemo(() => {
    if (user.role === Role.ADMIN) return Object.values(Category);
    if (user.role === Role.ADS_SPECIALIST) return [Category.PAID_ADS];
    return [Category.ORGANIC];
  }, [user.role]);

  const availableChannels = useMemo(() => {
    if (!formData.category) return [];
    return CATEGORY_CHANNELS[formData.category as Category];
  }, [formData.category]);

  const filteredDataList = useMemo(() => {
    return data.filter(item => 
      item.channel.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, searchTerm]);

  const handleSave = () => {
    if (!formData.category || !formData.channel) return;
    
    const entry: MarketingData = {
      id: editingId || crypto.randomUUID(),
      date: formData.date || new Date().toISOString().split('T')[0],
      category: formData.category as Category,
      channel: formData.channel as Channel,
      objective: formData.objective as Objective,
      metrics: formData.metrics || {},
      userId: user.id
    };

    storage.saveMarketingData(entry);
    onDataChange();
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: user.role === Role.ADS_SPECIALIST ? Category.PAID_ADS : Category.ORGANIC,
      channel: user.role === Role.ADS_SPECIALIST ? Channel.META_ADS : Channel.FACEBOOK,
      objective: Objective.AWARENESS,
      metrics: {}
    });
  };

  const handleEdit = (item: MarketingData) => {
    setEditingId(item.id);
    setFormData(item);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      storage.deleteMarketingData(id);
      onDataChange();
    }
  };

  const updateMetric = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {isAdding ? (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 pb-4 border-b">
            <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Data' : 'Tambah Data Baru'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Objektifitas</label>
              <select 
                value={formData.objective} 
                onChange={e => setFormData({...formData, objective: e.target.value as Objective})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(Objective).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
              <select 
                value={formData.category} 
                onChange={e => {
                  const cat = e.target.value as Category;
                  setFormData({...formData, category: cat, channel: CATEGORY_CHANNELS[cat][0], metrics: {}});
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Channel</label>
              <select 
                value={formData.channel} 
                onChange={e => setFormData({...formData, channel: e.target.value as Channel, metrics: {}})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {availableChannels.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Metrics Input ({formData.channel})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {formData.channel && CHANNEL_CONFIG[formData.channel as Channel].map(metric => (
                <div key={metric}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{metric}</label>
                  {metric.includes('Tanggal') ? (
                    <input 
                      type="date"
                      value={formData.metrics?.[metric] || ''}
                      onChange={e => updateMetric(metric, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  ) : metric === 'Noted' ? (
                    <textarea 
                      value={formData.metrics?.[metric] || ''}
                      onChange={e => updateMetric(metric, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                    />
                  ) : (
                    <input 
                      type="text"
                      placeholder="0"
                      value={formData.metrics?.[metric] || ''}
                      onChange={e => updateMetric(metric, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-6 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-200"
            >
              <Check className="w-5 h-5 mr-2" />
              Simpan Data
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari channel atau kategori..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Data
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Kategori</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Channel</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Objective</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Spend/Budget</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Leads</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDataList.length > 0 ? filteredDataList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(item.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.category === Category.PAID_ADS ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{item.channel}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.objective}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {Number(item.metrics['Spend'] || item.metrics['Budget'] || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.metrics['Leads'] || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                        Belum ada data marketing yang diinput.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataManager;
