import React, { useState } from 'react';
import { 
  Search, Bell, Shield, User, Key, Mail, CheckCircle, X 
} from 'lucide-react';

// ==========================================
// CENTRALIZED DICTIONARY MATRIX (GLOBAL DATA)
// ==========================================
const globalSearchMock = [
  { id: 'NAV-1', tag: 'GOTO', msg: 'Dashboard Overview', type: 'NAV', route: 'dashboard' },
  { id: 'NAV-2', tag: 'GOTO', msg: 'URL Scanner', type: 'NAV', route: 'url-scanner' },
  { id: 'NAV-3', tag: 'GOTO', msg: 'Message Shield', type: 'NAV', route: 'message-shield' },
  { id: 'NAV-4', tag: 'GOTO', msg: 'QR Guard', type: 'NAV', route: 'qr-guard' },
  { id: 'NAV-5', tag: 'GOTO', msg: 'Email Scanner', type: 'NAV', route: 'email-scanner' },
  { id: 'NAV-6', tag: 'GOTO', msg: 'System Settings', type: 'NAV', route: 'settings' },

  { id: 'L-904', tag: 'ERR', msg: 'Homoglyph malicious vector string match on node MX-09', type: 'LOG' },
  { id: 'L-712', tag: 'OK',  msg: 'SSL layer verification handshakes successfully initialized', type: 'LOG' },
  { id: 'L-542', tag: 'WARN', msg: 'Suspicious domain age parameter query matched (< 3 days)', type: 'LOG' },
  { id: 'L-109', tag: 'INFO', msg: 'Internal security architecture cluster buffer reset sequence complete', type: 'LOG' }
];

// ==========================================
// TOP NAVIGATION CORE COMPONENT
// ==========================================
export default function TopNav({ onNavigate }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState('Tamanna');
  const [password, setPassword] = useState('********');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredLogs = globalSearchMock.filter(log => 
    log.msg.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item) => {
    if (item.type === 'NAV') {
      // 1. Fire navigation state switch
      onNavigate(item.route); 
    } else {
      alert(`Telemetry Inspect Event [${item.id}]: ${item.msg}`);
    }
    // 2. Clear state cleanly
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="h-16 bg-[#0e1726] border-b border-slate-800 flex items-center justify-between px-6 relative z-50 select-none w-full">
      
      {/* Global Command Search Engine */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
          <Search size={16} />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          // FIXED: Increased delay slightly to 300ms to safely bypass click race conditions
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 300)} 
          placeholder="Search system modules or logs (e.g., URL, SSL)..."
          className="w-full bg-[#090d16] border border-slate-800 rounded-md py-1.5 pl-10 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f0ff] transition-all"
        />

        {/* Search Engine Results Dropdown */}
        {isSearchFocused && searchQuery && (
          <div className="absolute top-11 left-0 w-full bg-[#0e1726] border border-slate-800 rounded-md shadow-2xl p-2 font-mono text-[11px] max-h-60 overflow-y-auto">
            <div className="text-[9px] text-[#00f0ff] font-bold uppercase tracking-widest px-2 mb-2">Query Engine Matrix</div>
            {filteredLogs.length === 0 ? (
              <div className="text-slate-600 italic p-2">No matches found.</div>
            ) : (
              filteredLogs.map(item => (
                <div 
                  key={item.id} 
                  // CRITICAL: changed from onMouseDown to onMouseDown to beat blur execution
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents input from losing focus instantly
                    handleItemClick(item);
                  }}
                  className="p-2 hover:bg-slate-900 rounded cursor-pointer transition flex gap-2 border-b border-slate-900 last:border-0 items-center"
                >
                  <span className={`font-bold px-1 rounded text-[9px] ${
                    item.type === 'NAV' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 
                    item.tag === 'ERR' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.tag}
                  </span>
                  <span className={`${item.type === 'NAV' ? 'text-white font-medium' : 'text-slate-400'} truncate`}>
                    {item.msg}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Profile Control Badges */}
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#00f0ff] rounded-full" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all font-mono text-xs border ${
              isProfileOpen ? 'bg-slate-800 text-[#00f0ff] border-[#00f0ff]' : 'bg-[#090d16] text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isEmailVerified ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            <span>{username}</span>
          </button>

          {isProfileOpen && (
            <div className="absolute top-11 right-0 w-80 bg-[#0e1726] border border-slate-800 rounded-lg shadow-2xl p-5 font-mono text-xs text-slate-300">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-[#00f0ff]"><Shield size={14} /> SECURITY PROFILE</div>
                <button onClick={() => setIsProfileOpen(false)} className="text-slate-500 hover:text-white"><X size={14} /></button>
              </div>
              <div className="space-y-1 mb-4">
                <label className="text-[10px] uppercase text-slate-500 flex items-center gap-1"><User size={10} /> Handle</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#090d16] border border-slate-800 rounded p-1.5 text-white focus:outline-none focus:border-[#00f0ff]" />
              </div>
              <div className="space-y-1 mb-4">
                <label className="text-[10px] uppercase text-slate-500 flex items-center gap-1"><Key size={10} /> Security Token</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#090d16] border border-slate-800 rounded p-1.5 text-white focus:outline-none focus:border-[#00f0ff]" />
              </div>

              <div className="space-y-2 mb-5">
                <label className="text-[10px] uppercase text-slate-500 flex items-center gap-1"><Mail size={10} /> Gateway Clearance Email</label>
                <div className="flex items-center justify-between p-2 bg-[#090d16] border border-slate-800 rounded">
                  <span className="text-slate-400 text-[11px]">tamanna@phishx.local</span>
                  {isEmailVerified ? (
                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle size={12} /> VERIFIED
                    </span>
                  ) : (
                    <button 
                      onClick={() => setIsEmailVerified(true)} 
                      className="bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black border border-[#00f0ff]/30 text-[10px] font-bold px-2 py-0.5 rounded transition"
                    >
                      VERIFY
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button onClick={() => setIsProfileOpen(false)} className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded text-[11px]">SAVE OVERRIDES</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}