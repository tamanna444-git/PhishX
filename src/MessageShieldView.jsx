import React, { useState, useEffect } from 'react';

// Live Connection to Your FastAPI Backend Router Node
// Connected Live Real-Time Backend Stream
const streamAnalysisFromBackend = async (messageContent) => {
  try {
    // 1. Point to your local FastAPI server running on port 8000
    const response = await fetch('http://127.0.0.1:8000/api/stream-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 2. Wrap her state text string inside a JSON key named "message" 
      body: JSON.stringify({ message: messageContent }) 
    });

    if (!response.ok) {
      throw new Error(`Server responded with status code: ${response.status}`);
    }

    // 3. Return the exact JSON dictionary keys your backend outputs
    return await response.json(); 
  } catch (error) {
    console.error("Live backend node connection error:", error);
    
    // Graceful visual fallback state if you turn off your server
    return {
      aiLikelihood: 0,
      status: "SERVER_OFFLINE",
      perplexity: 0.0,
      burstiness: 0.0
    };
  }
};
    

export default function MessageShield() {
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // Metrics initialized dynamically at zero state
  const [metrics, setMetrics] = useState({
    aiLikelihood: 0,
    status: 'READY',
    perplexity: 0.0,
    burstiness: 0.0
  });

  // Real-Time Engine Hook: Debounces typing to fire background analysis automatically
  useEffect(() => {
    // If the buffer gets wiped out, instantly reset metrics back to 0 without hitting backend
    if (!inputText.trim()) {
      setMetrics({
        aiLikelihood: 0,
        status: 'READY',
        perplexity: 0.0,
        burstiness: 0.0
      });
      setIsScanning(false);
      return;
    }

    setIsScanning(true);

    // Debounce timer: waits for user to pause typing (400ms) before hitting the backend node
    const delayDebounceFn = setTimeout(async () => {
      try {
        const liveData = await streamAnalysisFromBackend(inputText);
        setMetrics({
          aiLikelihood: liveData.aiLikelihood,
          status: liveData.status,
          perplexity: liveData.perplexity,
          burstiness: liveData.burstiness
        });
      } catch (err) {
        console.error("Real-time synchronization failed", err);
      } finally {
        setIsScanning(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [inputText]);

  return (
    <div className="min-h-screen bg-[#060b13] text-[#a5b4fc] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#00e5ff] font-bold">Defense Layer 04</span>
          <h1 className="text-3xl font-bold text-white mt-1">Message Shield Analysis</h1>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Center Section: Input Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-4 flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <span className={`inline-block w-2 h-2 rounded-full ${isScanning ? 'bg-amber-400 animate-pulse' : 'bg-[#00e5ff]'}`} />
                  INPUT_BUFFER
                </div>
                <span className="text-xs text-[#00e5ff] font-mono">
                  {isScanning ? 'LIVE_COMPUTING...' : metrics.status}
                </span>
              </div>
              
              <textarea
                className="w-full flex-grow bg-[#070d19] border border-[#141f32] rounded p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#00e5ff] resize-none"
                placeholder="Paste SMS, Email headers, or Chat messages here for neural analysis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setInputText('')}
                    className="px-4 py-2 text-xs bg-[#141f32] text-gray-300 hover:bg-[#1e293b] rounded font-medium transition"
                  >
                    Clear Buffer
                  </button>
                </div>
                
                {/* Active connection indicator badge */}
                <div className="px-4 py-2 text-xs bg-[#0b1424] border border-[#1e293b] text-gray-400 font-mono rounded flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REAL-TIME NODE ACTIVE
                </div>
              </div>
            </div>

            {/* Bottom Section: Safety Recommendation Banner */}
            <div className="bg-[#0b1424] border border-[#102a43] rounded-lg p-5 flex gap-4 items-start">
              <div className="p-2 bg-[#05233a] rounded text-[#00e5ff]">🛡️</div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Safety Recommendation</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Before interacting with any sender, verify the cryptographic signature of the message. If the origin is an SMS short-code, do not click embedded links without manual URL inspection.
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-[10px] bg-[#0c2540] text-[#00e5ff] border border-[#00e5ff]/30 font-mono rounded tracking-wider">
                    ENFORCE_ENCRYPTION
                  </button>
                  <button className="px-3 py-1 text-[10px] bg-[#0c2540] text-[#00e5ff] border border-[#00e5ff]/30 font-mono rounded tracking-wider">
                    BLOCK_SHORT_URLS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Analytical Intelligence Displays */}
          <div className="flex flex-col gap-6">
            
            {/* AI Likelihood Metric Card */}
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider">AI Likelihood</span>
                  <div className="text-5xl font-black text-white mt-1">
                    {metrics.aiLikelihood}<span className="text-2xl text-gray-500">%</span>
                  </div>
                  <span className="text-xs text-gray-400 block mt-1">
                    {metrics.aiLikelihood > 0 ? 'Analysis Active' : 'Awaiting Backend...'}
                  </span>
                </div>
                <span className="bg-[#14233c] text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded border border-gray-700">
                  {metrics.status}
                </span>
              </div>
              
              {/* Live Audio/Neural Map Bars rendering fluidly based on data values */}
              <div className="mt-6 pt-4 border-t border-[#141f32] flex flex-col items-center">
                <div className="flex items-end gap-1 h-12 justify-center w-full">
                  {[40, 60, 50, 85, 30, 70, 65, 45].map((baseHeight, i) => {
                    const finalHeight = metrics.aiLikelihood > 0 ? (baseHeight * (metrics.aiLikelihood / 100)) : 4;
                    return (
                      <div 
                        key={i} 
                        className="w-1.5 bg-[#00e5ff] rounded-t-sm transition-all duration-300" 
                        style={{ height: `${finalHeight}%` }} 
                      />
                    );
                  })}
                </div>
                <span className="text-[9px] text-[#00e5ff]/70 tracking-widest font-mono mt-2">NEURAL MAPPING ACTIVE</span>
              </div>
            </div>

            {/* Generative Analysis Grid Card */}
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-5">
              <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider block mb-4">Generative Analysis</span>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Perplexity Element */}
                <div className="bg-[#070d19] border border-[#141f32] p-3 rounded">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Perplexity</span>
                  <span className="text-xl font-bold text-white block mt-1 font-mono">{metrics.perplexity}</span>
                  <div className="w-full bg-[#141f32] h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#00e5ff] h-full transition-all duration-300" style={{ width: `${Math.min(metrics.perplexity * 4, 100)}%` }} />
                  </div>
                </div>

                {/* Burstiness Element */}
                <div className="bg-[#070d19] border border-[#141f32] p-3 rounded">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Burstiness</span>
                  <span className="text-xl font-bold text-white block mt-1 font-mono">{metrics.burstiness}</span>
                  <div className="w-full bg-[#141f32] h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#00e5ff] h-full transition-all duration-300" style={{ width: `${metrics.burstiness * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}