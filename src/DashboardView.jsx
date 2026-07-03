import React, { useState, useEffect } from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';

export default function DashboardView() {
  // -------------------------------------------------------------
  // BACKEND INTEGRATION STATES
  // Replace these default fallback values with your dynamic API fetch data
  // -------------------------------------------------------------
  const [metrics, setMetrics] = useState({
    secureEndpoints: "0.0%",
    threatsNeutralized: 0,
    uptime: "0D",
    riskLevel: 0,
    urlsScannedToday: 0,
    messagesShielded: 0,
    qrCodesAnalyzed: 0,
    activeProbes: 0,
    lastIncidentTime: "No data"
  });

  // Dynamic collection array for live background socket streams
  const [liveFeeds, setLiveFeeds] = useState([]);

  useEffect(() => {
    // BACKEND TODO: Place your fetch methods or WebSocket listeners here
    // Example API implementation pattern:
    //
    // fetch('/api/v1/dashboard/metrics')
    //   .then(res => res.json())
    //   .then(data => setMetrics(data));
    //
    // const socket = new WebSocket('ws://your-backend/live-feed');
    // socket.onmessage = (event) => {
    //   const newLog = JSON.parse(event.data);
    //   setLiveFeeds(prev => [newLog, ...prev.slice(0, 10)]);
    // };
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] w-full mx-auto select-none">
      
      {/* TOP SECTION: DEFENSE HEADER + RISK PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Defense Block */}
        <div className="lg:col-span-2 bg-[#0a1224] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-100">Aegis Core Defense</h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              AI-driven neural network analysis monitoring active endpoints across the structural perimeter.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded font-semibold text-xs transition-colors">Run Full System Scan</button>
            <button className="border border-slate-700 hover:border-slate-500 px-4 py-2 rounded font-semibold text-xs text-slate-300 transition-colors">View Reports</button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/50">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Secure Endpoints</div>
              <div className="text-xl font-bold font-mono text-emerald-400">{metrics.secureEndpoints}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Threats Neutralized</div>
              <div className="text-xl font-bold font-mono text-cyan-400">{metrics.threatsNeutralized.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Uptime</div>
              <div className="text-xl font-bold font-mono text-slate-300">{metrics.uptime}</div>
            </div>
          </div>
        </div>

        {/* Risk Gauge Panel */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between items-center relative overflow-hidden">
          <span className="absolute top-4 left-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Risk Level</span>
          
          <div className="relative w-40 h-40 flex items-center justify-center mt-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                className="stroke-cyan-500 transition-all duration-500 ease-out" 
                strokeWidth="8" fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * metrics.riskLevel) / 100}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono text-slate-100">{metrics.riskLevel}</span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">Active Assessment</span>
            </div>
          </div>

          <div className="w-full space-y-2 mt-4 text-xs font-mono border-t border-slate-800/50 pt-4">
            <div className="flex justify-between"><span className="text-slate-500">Last Critical Incident</span><span className="text-slate-300">{metrics.lastIncidentTime}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Active Probes</span><span className="text-amber-400">{metrics.activeProbes}</span></div>
          </div>
        </div>
      </div>

      {/* MIDDLE REGION: VECTOR MAP & LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Clean Global Vector Map Panel */}
        <div className="lg:col-span-2 bg-[#0a1224] border border-slate-800/80 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2"><Globe size={14} className="text-cyan-400" /><span className="text-xs font-bold uppercase tracking-wider">Global Threat Map</span></div>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> HIGH</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> NORMAL</span>
            </div>
          </div>
          
          <div className="w-full h-72 bg-[#070d18] rounded-lg overflow-hidden border border-slate-900 relative flex items-center justify-center">
            <svg viewBox="0 0 800 400" className="w-full h-full opacity-40 p-4">
              <path d="M150,150 Q180,100 250,120 T400,110 T550,160 T700,130" fill="none" stroke="#1d283d" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M100,250 Q220,300 350,220 T600,280 T750,210" fill="none" stroke="#1d283d" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M200,160 Q380,80 620,240" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M420,220 Q500,180 620,240" fill="none" stroke="#22d3ee" strokeWidth="1" />
              <circle cx="200" cy="160" r="4" fill="#ef4444" />
              <circle cx="420" cy="220" r="4" fill="#22d3ee" />
              <circle cx="620" cy="240" r="6" fill="#ef4444" />
              <circle cx="620" cy="240" r="12" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" />
            </svg>

            <div className="absolute bottom-4 right-4 bg-[#0a1224]/95 border border-red-900/60 p-3 rounded shadow-lg backdrop-blur-sm text-[11px] font-mono max-w-xs">
              <div className="text-rose-400 font-bold mb-1">TARGET: NODE_ALERT</div>
              <div className="text-slate-400">Real-time gateway streaming initialized...</div>
            </div>
          </div>
        </div>

        {/* Live Feed Container */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Live Scan Feed</span>
            <span className="text-[10px] font-mono text-cyan-400 animate-pulse">Connected</span>
          </div>
          <div className="space-y-3 font-mono text-[11px] flex-1 overflow-y-auto max-h-72">
            {liveFeeds.length === 0 ? (
              <div className="text-center py-12 text-slate-600 text-xs italic">Awaiting connection events...</div>
            ) : (
              liveFeeds.map((feed, index) => (
                <div key={feed.id || index} className="p-2 bg-[#070d18] border border-slate-900 rounded flex items-start gap-2 animate-fade-in">
                  <span className="text-slate-500 whitespace-nowrap">{feed.time}</span>
                  <span className={`font-bold px-1 rounded text-[10px] shrink-0 ${
                    feed.status === 'danger' ? 'bg-rose-950 text-rose-400 border border-rose-900' :
                    feed.status === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                    feed.status === 'info' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900' : 'bg-slate-900 text-slate-400'
                  }`}>[{feed.type}]</span>
                  <span className="text-slate-300 break-all">{feed.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: HISTORICAL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* URLs Scanned today card */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">URLs Scanned Today</div>
              <div className="text-2xl font-bold font-mono text-slate-100">{metrics.urlsScannedToday.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-cyan-400 h-full w-[0%]"></div></div>
        </div>

        {/* Messages Shielded card */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Messages Shielded</div>
              <div className="text-2xl font-bold font-mono text-slate-100">{metrics.messagesShielded.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-slate-500 h-full w-[0%]"></div></div>
        </div>

        {/* QR Codes Analyzed card */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">QR Codes Analyzed</div>
              <div className="text-2xl font-bold font-mono text-slate-100">{metrics.qrCodesAnalyzed.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[0%]"></div></div>
        </div>
      </div>

    </div>
  );
}