import React from 'react';

export default function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="bg-[#0e1726] border border-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white">Aegis Core Defense</h2>
        <p className="text-slate-400 mt-1">AI-driven neural network analysis. Scanning 1,402 endpoints across the perimeter.</p>
        <div className="mt-4 flex gap-3">
          <button className="bg-[#00f0ff] text-black px-4 py-2 font-bold rounded hover:opacity-90 transition-all">Run Full System Scan</button>
          <button className="border border-slate-700 px-4 py-2 rounded text-slate-300 hover:bg-slate-800">View Reports</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0e1726] border border-slate-800 p-4 rounded-lg">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Secure Endpoints</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">98.4%</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800 p-4 rounded-lg">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Threats Neutralized</span>
          <div className="text-2xl font-bold text-[#00f0ff] mt-1">4,102</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800 p-4 rounded-lg">
          <span className="text-xs text-slate-500 uppercase tracking-wider">System Uptime</span>
          <div className="text-2xl font-bold text-white mt-1">364D</div>
        </div>
      </div>
    </div>
  );
}