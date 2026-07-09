import React from 'react';
import { LayoutDashboard, ShieldAlert, ShieldCheck, QrCode, Settings, HelpCircle } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'url-scanner', name: 'URL Scanner', icon: ShieldAlert },
    { id: 'message-shield', name: 'Message Shield', icon: ShieldCheck },
    { id: 'qr-guard', name: 'QR Guard', icon: QrCode },
  ];

  return (
    <div className="w-64 bg-[#0e1726] border-r border-slate-800 flex flex-col justify-between p-4 h-full">
      <div>
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-[#00f0ff] tracking-wider flex items-center gap-2">
            <span>🛡️</span> PHISHX
          </h1>
          <span className="text-xs text-slate-500 font-mono">AI Node: Active</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-[#00f0ff] border-l-2 border-[#00f0ff]' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 border-t border-slate-800 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white">
          <Settings size={18} /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white">
          <HelpCircle size={18} /> Support
        </button>
      </div>
    </div>
  );
}