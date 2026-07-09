import React from 'react';
import { Search, Bell, Shield } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-16 bg-[#0e1726] border-b border-slate-800 flex items-center justify-between px-6">
      <div className="relative w-64">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search size={16} />
        </span>
        <input 
          type="text" 
          placeholder="Search system logs..." 
          className="w-full bg-[#090d16] border border-slate-800 rounded-md pl-10 pr-4 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-[#00f0ff]"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white"><Bell size={18} /></button>
        <button className="text-slate-400 hover:text-white"><Shield size={18} /></button>
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <span className="text-xs font-mono text-slate-400">OPERATOR_01</span>
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-[#00f0ff]"></div>
        </div>
      </div>
    </header>
  );
}