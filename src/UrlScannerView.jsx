import React, { useState, useEffect } from 'react';
import { Shield, Globe, Search, Download, Eye, Calendar, AlertTriangle, Lock } from 'lucide-react';

export default function UrlScannerView() {
  // Input state for user scan query
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // -------------------------------------------------------------
  // BACKEND INTEGRATION STATES
  // Populate these variables with your API payload response on scan complete
  // -------------------------------------------------------------
  const [scanResult, setScanResult] = useState({
    hasRun: false,            // Toggles visibility of analysis layout panels
    activeNodes: 0,
    lastScanText: "Never",
    datasetVersion: "V0.0.0",
    trustScore: 0,
    domainAgeYears: 0,
    domainAgeMonths: 0,
    sslEncryption: "PENDING", // e.g., "TLS 1.3 AES_256_GCM", "NONE"
    securityReportsFlagged: 0,
    behavioralStatus: "No Data",
    verdict: "AWAITING SCAN",  // e.g., "HIGHLY TRUSTABLE", "MALICIOUS"
    reliabilityScore: 0,
    sslValidity: "UNKNOWN",     // e.g., "SECURE", "EXPIRED"
    vulnerabilityAge: "0y 0m 0d",
    blacklistCheckCount: 0,
    trackingPixelsDetected: 0,
    terminalLogs: []            // Array of strings for console telemetry streams
  });

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsScanning(true);
    
    // BACKEND TODO: Add your post request endpoint routing configuration here
    // Example JSON response structure payload expected:
    // {
    //   "hasRun": true,
    //   "trustScore": 88,
    //   "domainAgeYears": 3,
    //   "domainAgeMonths": 5,
    //   "sslEncryption": "TLS 1.3 AES-256",
    //   ...
    // }
  };

  return (
    <div className="space-y-6 max-w-[1600px] w-full mx-auto select-none font-sans">
      
      {/* 1. INPUT CONTROL SCANNER BAR CONTAINER */}
      <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Intelligent Threat Interception</h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Paste any suspicious URL to perform a deep-packet analysis and verify security credentials against global threat databases.
        </p>

        <form onSubmit={handleScanSubmit} className="max-w-3xl mx-auto flex gap-3 mt-4">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-3.5 text-slate-500" size={18} />
            <input 
              type="text" 
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://suspicious-site.com/target" 
              className="w-full bg-[#070d18] border border-slate-800 rounded-lg py-3 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={isScanning}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-6 py-3 rounded-lg flex items-center gap-2 text-sm uppercase tracking-wider transition-all shadow-md shadow-cyan-500/5"
          >
            <Search size={16} /> {isScanning ? 'Scanning...' : 'Scan'}
          </button>
        </form>

        <div className="flex justify-center gap-6 text-[10px] font-mono text-slate-500 pt-2">
          <span>• ACTIVE NODES: {scanResult.activeNodes}</span>
          <span>• LAST SCAN: {scanResult.lastScanText}</span>
          <span>• DATASET: {scanResult.datasetVersion}</span>
        </div>
      </div>

      {/* CONDITIONAL RENDER SKELETON PLACEHOLDER */}
      {!scanResult.hasRun && !isScanning && (
        <div className="border border-dashed border-slate-800 rounded-xl py-20 text-center text-slate-600 text-sm italic">
          Enter a URL endpoint target path above to run deep structural behavioral diagnostics.
        </div>
      )}

      {/* 2. CORE RESULTS METRICS PANELS */}
      {(scanResult.hasRun || isScanning) && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Scoring Row Widget */}
          <div className="bg-[#0a1224] border border-slate-800/80 rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center relative">
            
            {/* Trust Score Circle */}
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800/60 pb-4 md:pb-0">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r="42" 
                    className="stroke-cyan-500 transition-all duration-500" 
                    strokeWidth="6" fill="transparent"
                    strokeDasharray="263.8"
                    strokeDashoffset={263.8 - (263.8 * scanResult.trustScore) / 100}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold font-mono text-slate-100">{scanResult.trustScore}</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Trust Score</span>
                </div>
              </div>
            </div>

            {/* Middle Data Metric Points (Added SSL Encryption Here) */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4 text-center md:text-left px-2">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center md:justify-start gap-1">
                  <Calendar size={12} className="text-slate-500" /> Domain Age
                </div>
                <div className="text-base font-bold font-mono text-slate-200">
                  {scanResult.domainAgeYears}y {scanResult.domainAgeMonths}m
                </div>
                {/* SSL Cipher Suite Sub-value display */}
                <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center justify-center md:justify-start gap-1">
                  <Lock size={10} /> {scanResult.sslEncryption}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Security Reports</div>
                <div className="text-base font-bold font-mono text-amber-500">{scanResult.securityReportsFlagged} Flagged</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Behavioral Analysis</div>
                <div className="text-base font-bold font-mono text-slate-300">{scanResult.behavioralStatus}</div>
              </div>
            </div>

            {/* Action Group / Verdict Banner */}
            <div className="flex flex-col gap-2 w-full pt-4 md:pt-0 border-t md:border-t-0 border-slate-800/60">
              <div className="text-center bg-[#070d18] border border-slate-800 rounded py-1.5 text-[10px] font-bold font-mono tracking-wider text-cyan-400">
                VERDICT: {scanResult.verdict}
              </div>
              <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded flex items-center justify-center gap-2 border border-slate-700 transition-colors">
                <Download size={14} /> Download Passport
              </button>
              <button className="w-full py-2 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded flex items-center justify-center gap-2 transition-colors">
                <Eye size={14} /> View Raw Data
              </button>
            </div>
            
            <span className="absolute bottom-2 left-6 text-[8px] font-mono text-slate-600">DOMAIN TRUST PASSPORT GENERATED VIA NEURAL-LINK V4.1.2</span>
          </div>

          {/* 3. LOWER SPLIT: RELIABILITY SCORE & VULNERABILITY MATRIX */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Reliability Core Score Container */}
            <div className="lg:col-span-2 bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between min-h-[260px]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-300">Reliability Score</h3>
                  <p className="text-[10px] text-slate-500">Deep analysis parameters metrics</p>
                </div>
                <Shield size={16} className="text-cyan-400" />
              </div>

              {/* Central Large Score Indicator */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" className="stroke-slate-900" strokeWidth="5" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r="38" 
                    className="stroke-emerald-400 transition-all duration-500" 
                    strokeWidth="5" fill="transparent"
                    strokeDasharray="238.7"
                    strokeDashoffset={238.7 - (238.7 * scanResult.reliabilityScore) / 100}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold font-mono text-slate-100">{scanResult.reliabilityScore}</span>
                  <span className="text-[8px] text-slate-500 font-mono">SCORE / 100</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono border-t border-slate-800/60 pt-3">
                <span className="text-slate-500 uppercase text-[10px]">SSL Validity</span>
                <span className="text-emerald-400 font-bold">{scanResult.sslValidity}</span>
              </div>
            </div>

            {/* Vulnerability Vector System Log Stream Terminal */}
            <div className="lg:col-span-3 bg-[#0a1224] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between min-h-[260px]">
              <div>
                <h3 className="text-sm font-bold text-slate-300 mb-4">Vulnerability Vector</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-[#070d18] border border-slate-900 p-2 rounded text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-2"><Calendar size={14} className="text-cyan-400" /> Domain Age</span>
                    <span className="text-slate-200 font-bold">{scanResult.vulnerabilityAge}</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#070d18] border border-slate-900 p-2 rounded text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-2"><Shield size={14} className="text-cyan-400" /> Blacklist Check</span>
                    <span className="text-slate-200 font-bold">{scanResult.blacklistCheckCount} FOUND</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#070d18] border border-slate-900 p-2 rounded text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-2"><AlertTriangle size={14} className="text-rose-400" /> Tracking Pixels</span>
                    <span className="text-rose-400 font-bold font-mono">{scanResult.trackingPixelsDetected} DETECTED</span>
                  </div>
                </div>
              </div>

              {/* Tiny Real-time Event Console Output Box */}
              <div className="bg-[#050912] border border-slate-900 p-2 rounded font-mono text-[9px] text-slate-500 max-h-16 overflow-y-auto mt-4 space-y-0.5">
                {scanResult.terminalLogs.length === 0 ? (
                  <p>&gt;_ Awaiting endpoint connection streaming trace...</p>
                ) : (
                  scanResult.terminalLogs.map((log, i) => (
                    <p key={i} className="truncate text-emerald-600/80">&gt; {log}</p>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}