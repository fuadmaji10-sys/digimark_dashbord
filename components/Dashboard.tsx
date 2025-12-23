
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Download, Filter, TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { MarketingData, Channel, Category } from '../types';
import { CATEGORY_CHANNELS } from '../constants';

interface DashboardProps {
  data: MarketingData[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [filter, setFilter] = useState({
    dateRange: 'all',
    category: 'all' as Category | 'all',
    channel: 'all' as Channel | 'all',
  });

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchCategory = filter.category === 'all' || item.category === filter.category;
      const matchChannel = filter.channel === 'all' || item.channel === filter.channel;
      return matchCategory && matchChannel;
    });
  }, [data, filter]);

  const stats = useMemo(() => {
    const totalSpend = filteredData.reduce((acc, curr) => acc + (Number(curr.metrics['Spend']) || Number(curr.metrics['Budget']) || 0), 0);
    const totalLeads = filteredData.reduce((acc, curr) => acc + (Number(curr.metrics['Leads']) || 0), 0);
    const totalRevenue = filteredData.reduce((acc, curr) => acc + (Number(curr.metrics['Revenue']) || 0), 0);
    const totalReach = filteredData.reduce((acc, curr) => acc + (Number(curr.metrics['Jangkauan']) || 0), 0);
    
    return [
      { label: 'Total Spend', value: totalSpend.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }), icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Total Revenue', value: totalRevenue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Total Reach', value: totalReach.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];
  }, [filteredData]);

  const channelDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(item => {
      counts[item.channel] = (counts[item.channel] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const performanceOverTime = useMemo(() => {
    // Group by date and sum revenue/spend
    const grouped: Record<string, { date: string, Revenue: number, Spend: number }> = {};
    filteredData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(item => {
      const date = new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      if (!grouped[date]) grouped[date] = { date, Revenue: 0, Spend: 0 };
      grouped[date].Revenue += Number(item.metrics['Revenue']) || 0;
      grouped[date].Spend += (Number(item.metrics['Spend']) || Number(item.metrics['Budget']) || 0);
    });
    return Object.values(grouped);
  }, [filteredData]);

  const handleExport = () => {
    const headers = ["ID", "Tanggal", "Kategori", "Channel", "Objective", "Spend/Budget", "Revenue", "Leads"];
    const rows = filteredData.map(d => [
      d.id,
      d.date,
      d.category,
      d.channel,
      d.objective,
      (Number(d.metrics['Spend']) || Number(d.metrics['Budget']) || 0),
      (Number(d.metrics['Revenue']) || 0),
      (Number(d.metrics['Leads']) || 0)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marketing_report_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
          <select 
            value={filter.category} 
            onChange={(e) => setFilter({...filter, category: e.target.value as Category | 'all', channel: 'all'})}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Kategori</option>
            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Channel</label>
          <select 
            value={filter.channel} 
            onChange={(e) => setFilter({...filter, channel: e.target.value as Channel | 'all'})}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Channel</option>
            {filter.category !== 'all' 
              ? CATEGORY_CHANNELS[filter.category as Category].map(c => <option key={c} value={c}>{c}</option>)
              : Object.values(Channel).map(c => <option key={c} value={c}>{c}</option>)
            }
          </select>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue vs Spend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceOverTime}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`Rp ${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                <Area type="monotone" dataKey="Spend" stroke="#6366f1" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Channel Distribution</h3>
          <div className="h-80 w-full flex items-center justify-center">
             {channelDistribution.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
             ) : (
               <p className="text-slate-400 italic">Belum ada data</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
