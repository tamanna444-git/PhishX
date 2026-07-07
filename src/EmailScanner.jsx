import React, { useState } from 'react';

// Simulated Threat Intel Backend (Hardcoded to zero until backend is active)
const searchEmailIntelFromBackend = async (emailAddress) => {
  try {
    // ⬇️ WHEN CONNECTING YOUR ACTUAL BACKEND, UNCOMMENT AND USE THIS SECTION:
    // const response = await fetch(`https://api.yourdomain.com/v1/email-intel?email=${encodeURIComponent(emailAddress)}`, {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // return await response.json();

    // ⬇️ CURRENT MOCK: Hard-coded to zero output telemetry metrics
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        reliabilityRating: 0,
        spamScore: 0,
        dkimSpfStatus: "UNVERIFIED",
        searchHistoryCount: 0,
        verdict: "AWAITING_BACKEND"
      });
    }, 600)); 
  } catch (error) {
    console.error("Intel database node connection error:", error);
    throw error;
  }
};

export default function EmailScanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // Explicitly initialized states at zero / unlinked state
  const [metrics, setMetrics] = useState({
    reliabilityRating: 0,
    spamScore: 0,
    dkimSpfStatus: 'NOT_CHECKED',
    searchHistoryCount: 0,
    verdict: 'READY'
  });

  // Reset search console back to zeros
  const handleClearBuffer = () => {
    setSearchQuery('');
    setMetrics({
      reliabilityRating: 0,
      spamScore: 0,
      dkimSpfStatus: 'NOT_CHECKED',
      searchHistoryCount: 0,
      verdict: 'READY'
    });
  };

  // Trigger search sequence
  const handleRunSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsScanning(true);
    try {
      const intelData = await searchEmailIntelFromBackend(searchQuery);
      setMetrics({
        reliabilityRating: intelData.reliabilityRating,
        spamScore: intelData.spamScore,
        dkimSpfStatus: intelData.dkimSpfStatus,
        searchHistoryCount: intelData.searchHistoryCount,
        verdict: intelData.verdict
      });
    } catch (err) {
      console.error("MX Core synchronization failed", err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-[#a5b4fc] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#00e5ff] font-bold">Defense Layer 06</span>
          <h1 className="text-3xl font-bold text-white mt-1">Email Reputation & Threat Intel Search</h1>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Center Section: Search Intake Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-6 flex flex-col justify-center h-[350px]">
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <span className={`inline-block w-2 h-2 rounded-full ${isScanning ? 'bg-amber-400 animate-pulse' : 'bg-[#00e5ff]'}`} />
                  GLOBAL_INTEL_LOOKUP
                </div>
                <span className="text-xs text-[#00e5ff] font-mono">
                  {isScanning ? 'FETCHING_REPUTATION...' : metrics.verdict}
                </span>
              </div>
              
              <form onSubmit={handleRunSearch} className="relative flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="w-full bg-[#070d19] border border-[#141f32] rounded p-4 text-base text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] font-mono"
                  placeholder="Enter email to audit (e.g., target_entity@domain.com)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isScanning}
                  className={`px-8 py-4 text-xs font-bold font-mono tracking-wider rounded transition whitespace-nowrap ${
                    !searchQuery.trim() || isScanning
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-[#00e5ff] text-[#060b13] hover:bg-[#00b3cc] shadow-md shadow-[#00e5ff]/10'
                  }`}
                >
                  {isScanning ? 'AUDITING...' : 'SEARCH INTEL'}
                </button>
              </form>

              <div className="flex justify-start mt-4">
                <button 
                  onClick={handleClearBuffer}
                  className="text-xs text-gray-500 hover:text-gray-300 transition underline underline-offset-4"
                >
                  Reset Search Terminal
                </button>
              </div>
            </div>

            {/* Security Notice Banner */}
            <div className="bg-[#0b1424] border border-[#102a43] rounded-lg p-5 flex gap-4 items-start">
              <div className="p-2 bg-[#05233a] rounded text-[#00e5ff]">🔍</div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Database Scope Policy</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Searching cross-references target domains, active dark web leak databases, honeypot traps, and MX exchange validation registries to build a dynamic profile of address safety.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Core Threat Assessment Displays */}
          <div className="flex flex-col gap-6">
            
            {/* Reliability Score Metric Card */}
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider">Reliability Rating</span>
                  <div className="text-5xl font-black text-white mt-1">
                    {metrics.reliabilityRating}<span className="text-2xl text-gray-500">%</span>
                  </div>
                  <span className="text-xs text-gray-400 block mt-1">
                    {metrics.verdict === 'READY' ? 'Awaiting Lookup Query...' : 'Awaiting Core Connection...'}
                  </span>
                </div>
                <span className="bg-[#14233c] text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded border border-gray-700">
                  {metrics.verdict}
                </span>
              </div>
              
              {/* Telemetry Indicator Bars */}
              <div className="mt-6 pt-4 border-t border-[#141f32] flex flex-col items-center">
                <div className="flex items-end gap-1 h-12 justify-center w-full">
                  {[45, 60, 55, 75, 85, 95, 70, 90].map((baseHeight, i) => {
                    // Logic forces flat baseline since rating is strictly 0
                    const finalHeight = metrics.reliabilityRating > 0 ? (baseHeight * (metrics.reliabilityRating / 100)) : 4;
                    return (
                      <div 
                        key={i} 
                        className="w-1.5 rounded-t-sm transition-all duration-300 bg-[#00e5ff]" 
                        style={{ height: `${finalHeight}%` }} 
                      />
                    );
                  })}
                </div>
                <span className="text-[9px] text-[#00e5ff]/70 tracking-widest font-mono mt-2">THREAT GRAPH STREAM ACTIVE</span>
              </div>
            </div>

            {/* Extra Analytics Indicators Card */}
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-5">
              <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider block mb-4">Risk Telemetry Parameters</span>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Spam Assessment */}
                <div className="bg-[#070d19] border border-[#141f32] p-3 rounded">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Spam Score</span>
                  <span className="text-xl font-bold text-white block mt-1 font-mono">{metrics.spamScore} <span className="text-xs text-gray-600">/10</span></span>
                  <div className="w-full bg-[#141f32] h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-[#00e5ff] transition-all duration-300" 
                      style={{ width: `${metrics.spamScore * 10}%` }} 
                    />
                  </div>
                </div>

                {/* Incident History Counter */}
                <div className="bg-[#070d19] border border-[#141f32] p-3 rounded">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Incident History</span>
                  <span className="text-xl font-bold text-white block mt-1 font-mono">{metrics.searchHistoryCount}</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Flagged reporting events</span>
                </div>
              </div>

              {/* Extended Row for Crypto Status */}
              <div className="mt-4 bg-[#070d19] border border-[#141f32] p-3 rounded flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Domain Core Handshake</span>
                  <span className="text-xs font-bold text-white block font-mono mt-0.5">{metrics.dkimSpfStatus}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${metrics.dkimSpfStatus === 'PASS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>SPF</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${metrics.dkimSpfStatus === 'PASS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>DKIM</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}