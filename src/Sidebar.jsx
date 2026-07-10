import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldAlert, ShieldCheck, QrCode, Mail, Settings, HelpCircle, User } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  // 1. Initialize user state with fallbacks in case localStorage isn't populated yet
  const [userSession, setUserSession] = useState({
    username: 'Admin_Node',
    email: 'operator@phishx.local'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Lifecycle hook to grab your actual authentication credentials on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('username') || localStorage.getItem('user');
    const storedEmail = localStorage.getItem('email');
    
    if (storedUser || storedEmail) {
      setUserSession({
        username: storedUser || 'Authenticated Operator',
        email: storedEmail || 'active_session@phishx.local'
      });
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'url-scanner', name: 'URL Scanner', icon: ShieldAlert },
    { id: 'message-shield', name: 'Message Shield', icon: ShieldCheck },
    { id: 'qr-guard', name: 'QR Guard', icon: QrCode },
    { id: 'email-scanner', name: 'Email Scanner', icon: Mail },
  ];

  return (
    <div className="w-64 bg-[#0e1726] border-r border-slate-800 flex flex-col justify-between p-4 h-full relative">
      <div>
        <div className="mb-8 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#00f0ff] tracking-wider flex items-center gap-2">
              <span>🛡️</span> PHISHX
            </h1>
            <span className="text-xs text-slate-500 font-mono">AI Node: Active</span>
          </div>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
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
        {/* Profile Button Option Trigger */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white mb-2 font-semibold text-[#00f0ff]/80 cursor-pointer"
        >
          <User size={18} className="text-amber-400" /> {userSession.username}
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white cursor-pointer">
          <Settings size={18} /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white cursor-pointer">
          <HelpCircle size={18} /> Support
        </button>
      </div>

      {/* 3. INTERACTIVE SECURITY PROFILE MODAL COMPONENT BLOCK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0b1424] border border-[#1e293b] w-full max-w-md rounded-lg p-6 shadow-2xl relative text-[#a5b4fc]">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#141f32]">
              <span>🛡️</span>
              <h3 className="text-base font-bold text-white tracking-wide">SECURITY PROFILE</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1 font-medium">Handle</label>
                <input 
                  type="text" 
                  className="w-full bg-[#070d19] border border-[#141f32] p-2.5 rounded text-sm text-gray-300 font-mono focus:outline-none"
                  value={userSession.username}
                  readOnly 
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1 font-medium">Security Token</label>
                <input 
                  type="password" 
                  className="w-full bg-[#070d19] border border-[#141f32] p-2.5 rounded text-sm text-gray-400 font-mono focus:outline-none"
                  value="••••••••••••" 
                  readOnly 
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1 font-medium">Gateway Clearance Email</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="w-full bg-[#070d19] border border-[#141f32] p-2.5 rounded text-sm text-gray-300 font-mono focus:outline-none"
                    value={userSession.email}
                    readOnly 
                  />
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-3 py-2 rounded border border-emerald-800/40 flex items-center font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-6 bg-[#00e5ff] text-[#060b13] hover:bg-[#00b3cc] py-2.5 rounded text-xs font-bold font-mono tracking-wider transition cursor-pointer"
            >
              SAVE OVERRIDES
            </button>

          </div>
        </div>
      )}
    </div>
  );
}