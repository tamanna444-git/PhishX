import React from 'react';

export default function UrlScannerView() {
  return (
    <div className="space-y-6">
      <div className="bg-[#0e1726] border border-slate-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Intelligent Threat Interception</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="https://suspicious-site.com/target" 
            className="flex-1 bg-[#090d16] border border-slate-800 rounded px-4 py-2 text-slate-300 focus:outline-none focus:border-[#00f0ff]"
          />
          <button className="bg-[#00f0ff] text-black px-6 py-2 font-bold rounded hover:opacity-90">SCAN</button>
        </div>
      </div>
    </div>
  );
}