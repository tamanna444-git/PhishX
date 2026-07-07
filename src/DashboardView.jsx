import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export default function DashboardView() {
  // -------------------------------------------------------------
  // STERILE BACKEND INTEGRATION STATES (All Reset to Zero)
  // -------------------------------------------------------------
  const [metrics, setMetrics] = useState({
    secureEndpoints: "0.0%",
    threatsNeutralized: 0,
    uptime: "0D 0H",
    riskLevel: 0,        // Scales from 0 to 100
    urlsScannedToday: 0,
    messagesShielded: 0,
    qrCodesAnalyzed: 0,
    emailsScanned: 0, 
    activeProbes: 0,
    lastIncidentTime: "No Data"
  });

  // Empty stream collection for live socket feeds
  const [liveFeeds, setLiveFeeds] = useState([]);

  useEffect(() => {
    // -------------------------------------------------------------
    // PRODUCTION BACKEND HOOKS
    // Un-comment and configure these endpoints when connecting your backend:
    // -------------------------------------------------------------
    
    /* ---- Method A: REST API Polling (Every 10 seconds) ----
    const fetchDashboardMetrics = async () => {
      try {
        const response = await fetch('/api/v1/dashboard/metrics');
        const data = await response.json();
        setMetrics(data); // Expecting structural match with the 'metrics' state object
      } catch (error) {
        console.error("Failed to query core metrics gateway:", error);
      }
    };
    
    fetchDashboardMetrics();
    const pollingInterval = setInterval(fetchDashboardMetrics, 10000);
    */

    /* ---- Method B: Live WebSockets Stream (Real-time updates) ----
    const socket = new WebSocket('ws://your-backend-endpoint/telemetry');
    
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      
      if (payload.type === 'METRICS_UPDATE') {
        setMetrics(payload.data);
      } else if (payload.type === 'NEW_LOG') {
        // Appends new server streams, capping the display at latest 10 elements
        setLiveFeeds(prev => [payload.data, ...prev.slice(0, 9)]);
      }
    };
    */

    // Cleanup routines on component unmount
    return () => {
      // clearInterval(pollingInterval);
      // socket.close();
    };
  }, []);

  // Daily target quotas used to calculate progress fill bar scaling metrics
  const targets = { urls: 5000, messages: 20000, qr: 1000, emails: 15000 };

  return (
    <div className="space-y-6 max-w-[1600px] w-full mx-auto select-none p-2">
      
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
                className={`${metrics.riskLevel > 50 ? 'stroke-rose-500' : 'stroke-cyan-500'} transition-all duration-500 ease-out`} 
                strokeWidth="8" fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * metrics.riskLevel) / 100}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono text-slate-100">{metrics.riskLevel}%</span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">Active Assessment</span>
            </div>
          </div>

          <div className="w-full space-y-2 mt-4 text-xs font-mono border-t border-slate-800/50 pt-4">
            <div className="flex justify-between"><span className="text-slate-500">Last Critical Incident</span><span className="text-slate-300">{metrics.lastIncidentTime}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Active Probes</span><span className="text-amber-400">{metrics.activeProbes}</span></div>
          </div>
        </div>
      </div>

      {/* MIDDLE REGION: GLOBAL VECTOR WORLD MAP & LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Global Vector Map Panel */}
        <div className="lg:col-span-2 bg-[#0a1224] border border-slate-800/80 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Global Threat Map</span>
            </div>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> HIGH</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> NORMAL</span>
            </div>
          </div>
          
          <div className="w-full h-72 bg-[#070d18] rounded-lg overflow-hidden border border-slate-900 relative flex items-center justify-center">
            {/* Explicit 800x400 geographic projection projection canvas */}
            <svg viewBox="0 0 800 400" className="w-full h-full p-2" xmlns="http://www.w3.org/2000/svg">
              {/* WORLD MAP GEOMETRY PLOT (High performance low-poly projection paths) */}
              <g fill="#16223f" stroke="#1f2d5a" strokeWidth="0.75" opacity="0.65" strokeLinejoin="round">
                {/* North America */}
                <path d="M100,60 L140,55 L180,70 L210,65 L220,90 L180,120 L150,115 L120,150 L90,130 L70,100 Z" />
                {/* Greenland */}
                <path d="M240,40 L280,35 L290,55 L260,70 Z" />
                {/* South America */}
                <path d="M165,190 L200,200 L240,250 L220,320 L195,350 L185,320 L175,250 L155,210 Z" />
                {/* Africa */}
                <path d="M360,160 L410,150 L450,170 L470,200 L440,240 L415,290 L395,310 L390,260 L365,220 L350,180 Z" />
                {/* Europe & Asia (Eurasia) */}
                <path d="M360,130 L400,100 L450,70 L550,65 L680,75 L720,100 L700,140 L650,130 L610,170 L570,180 L520,150 L460,140 L420,140 Z" />
                {/* India Subcontinent */}
                <path d="M545,150 L565,155 L560,175 L545,185 L535,170 Z" fill="#1c3266" />
                {/* Australia */}
                <path d="M630,260 L680,255 L700,285 L675,310 L635,295 Z" />
                {/* Minor Islands (UK, Iceland) */}
                <path d="M330,90 L345,95 L340,105 Z" />
                <path d="M300,70 L315,75 L310,80 Z" />
              </g>

              {/* Grid Overlays */}
              <path d="M150,150 Q180,100 250,120 T400,110 T550,160 T700,130" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />
              <path d="M100,250 Q220,300 350,220 T600,280 T750,210" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />

              {/* DYNAMIC PERIMETER OVERLAYS: Renders vector beam alerts when telemetry data flows */}
              {metrics.riskLevel > 0 && (
                <>
                  <path d="M160,120 Q350,40 550,175" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" className="animate-pulse" />
                  <circle cx="160" cy="120" r="4" fill="#ef4444" />
                  <circle cx="550" cy="175" r="5" fill="#ef4444" />
                  <circle cx="550" cy="175" r="12" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />
                </>
              )}
            </svg>

            <div className="absolute bottom-4 right-4 bg-[#0a1224]/95 border border-slate-800 p-3 rounded shadow-lg backdrop-blur-sm text-[11px] font-mono max-w-xs">
              <div className="text-slate-500 font-bold mb-1">SYSTEM MONITOR</div>
              <div className="text-slate-600 text-[10px]">
                {metrics.riskLevel > 0 ? "Global perimeter vector feed active." : "Awaiting telemetry network map connection hook..."}
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed Container */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Live Scan Feed</span>
            <span className={`text-[10px] font-mono ${liveFeeds.length > 0 ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`}>
              {liveFeeds.length > 0 ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="space-y-3 font-mono text-[11px] flex-1 overflow-y-auto max-h-72 pr-1">
            {liveFeeds.length === 0 ? (
              <div className="text-center py-24 text-slate-600 text-xs italic">Awaiting backend stream link context...</div>
            ) : (
              liveFeeds.map((feed, index) => (
                <div key={index} className="p-2 bg-[#070d18] border border-slate-900 rounded flex items-start gap-2">
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

      {/* BOTTOM SECTION: HISTORICAL METRICS WITH TRACKING BAR RATIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* URLs Scanned today card */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">URLs Scanned Today</div>
              <div className="text-2xl font-bold font-mono text-slate-100">{metrics.urlsScannedToday.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-400 h-full transition-all duration-500" 
              style={{ width: `${metrics.urlsScannedToday > 0 ? Math.min((metrics.urlsScannedToday / targets.urls) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Messages Shielded card */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Messages Shielded</div>
              <div className="text-2xl font-bold font-mono text-slate-100">{metrics.messagesShielded.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full transition-all duration-500" 
              style={{ width: `${metrics.messagesShielded > 0 ? Math.min((metrics.messagesShielded / targets.messages) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* QR Codes Analyzed card */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">QR Codes Analyzed</div>
              <div className="text-2xl font-bold font-mono text-slate-100">{metrics.qrCodesAnalyzed.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-500" 
              style={{ width: `${metrics.qrCodesAnalyzed > 0 ? Math.min((metrics.qrCodesAnalyzed / targets.qr) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Emails Scanned card */}
        <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Emails Scanned</div>
              <div className="text-2xl font-bold font-mono text-slate-100">{metrics.emailsScanned.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full transition-all duration-500" 
              style={{ width: `${metrics.emailsScanned > 0 ? Math.min((metrics.emailsScanned / targets.emails) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}