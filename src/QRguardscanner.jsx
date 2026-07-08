import React, { useState } from 'react';

// Simulated Backend QR & Domain Security Analysis
const analyzeQRCodeFromBackend = async (fileObj) => {
  try {
    // Connected Live Backend QR Security Analysis
const analyzeQRCodeFromBackend = async (fileObj) => {
  try {
    // 1. Create a standard JavaScript FormData instance for image file upload
    const formData = new FormData();
    
    // CRITICAL: The first argument 'file' must match your FastAPI endpoint signature exactly!
    formData.append('file', fileObj);

    // 2. Point directly to your active local server endpoint
    const response = await fetch('http://127.0.0.1:8000/api/qr-analyze', {
      method: 'POST',
      body: formData // No headers required; the browser automatically sets multipart/form-data
    });

    if (!response.ok) {
      throw new Error(`Server returned status code: ${response.status}`);
    }

    const backendData = await response.json();

    // 3. Translate your backend variables into her exact UI state keys
    if (backendData.success) {
      return {
        // Map confidence percentage (or inverse risk) to her Reliability state
        reliabilityScore: backendData.is_url ? backendData.confidence_percentage : 100,
        // Since the pre-trained URL model doesn't look at WHOIS data yet, pass a clean placeholder
        domainAgeDays: backendData.is_url ? 180 : 0, 
        // Read the HTTPS feature value from your extractor loop
        sslStatus: backendData.content.startsWith("https") ? "VALID_HTTPS" : "UNENCRYPTED_HTTP",
        // Pass your direct ML classification text string over ("Safe" or "Phishing")
        threatLevel: backendData.prediction.toUpperCase()
      };
    } else {
      return {
        reliabilityScore: 0,
        domainAgeDays: 0,
        sslStatus: "FAILED_TO_PARSE",
        threatLevel: "NO_QR_MATRIX_FOUND"
      };
    }

  } catch (error) {
    console.error("QR Analysis node connection error:", error);
    return {
      reliabilityScore: 0,
      domainAgeDays: 0,
      sslStatus: "OFFLINE",
      threatLevel: "SERVER_DISCONNECTED"
    };
  }
};

    // ⬇️ CURRENT MOCK: Forces 0 output values until live backend node is wired in
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        reliabilityScore: 0,
        domainAgeDays: 0,
        sslStatus: "UNKNOWN",
        threatLevel: "READY"
      });
    }, 800)); 
  } catch (error) {
    console.error("QR Analysis node connection error:", error);
    throw error;
  }
};

export default function QRShieldAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Explicitly initialized at 0 / Default states
  const [metrics, setMetrics] = useState({
    reliabilityScore: 0,
    domainAgeDays: 0,
    sslStatus: 'NOT_CHECKED',
    threatLevel: 'READY'
  });

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      resetMetrics();
    }
  };

  // Clear current picture state to switch to another QR code
  const handleClearPhoto = () => {
    setSelectedFile(null);
    setImagePreview(null);
    resetMetrics();
  };

  const resetMetrics = () => {
    setMetrics({
      reliabilityScore: 0,
      domainAgeDays: 0,
      sslStatus: 'NOT_CHECKED',
      threatLevel: 'READY'
    });
  };

  // Trigger analysis when user clicks "Run Analysis"
  const handleRunAnalysis = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    try {
      const liveData = await analyzeQRCodeFromBackend(selectedFile);
      setMetrics({
        reliabilityScore: liveData.reliabilityScore,
        domainAgeDays: liveData.domainAgeDays,
        sslStatus: liveData.sslStatus,
        threatLevel: liveData.threatLevel
      });
    } catch (err) {
      console.error("Analysis synchronization failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-[#a5b4fc] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#00e5ff] font-bold">Defense Layer 05</span>
          <h1 className="text-3xl font-bold text-white mt-1">QR Code Reliability Matrix</h1>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Center Section: Upload and Interactive Canvas */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-6 flex flex-col h-[500px] justify-between">
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <span className={`inline-block w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-pulse' : 'bg-[#00e5ff]'}`} />
                  QR_DECODER_BUFFER
                </div>
                <span className="text-xs text-[#00e5ff] font-mono">
                  {isAnalyzing ? 'DECODING_PAYLOAD...' : metrics.threatLevel}
                </span>
              </div>

              {/* Upload & Preview Canvas Area */}
              <div className="flex-grow my-6 border-2 border-dashed border-[#141f32] hover:border-[#00e5ff]/50 rounded-lg flex flex-col items-center justify-center p-4 transition relative bg-[#070d19]">
                {imagePreview ? (
                  <div className="relative flex flex-col items-center justify-center h-full max-h-[300px] group">
                    {/* Cross option button overlay */}
                    <button
                      onClick={handleClearPhoto}
                      className="absolute -top-4 -right-4 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 rounded px-2.5 py-1 text-xs font-sans transition-all duration-200 z-10 flex items-center gap-1 shadow-lg"
                      title="Remove QR code"
                    >
                      <span>✕</span> <span className="font-medium">Close</span>
                    </button>

                    <img 
                      src={imagePreview} 
                      alt="QR Preview" 
                      className="max-h-[220px] object-contain rounded border border-[#1e293b] p-2 bg-white" 
                    />
                    <p className="text-xs text-gray-400 mt-2 font-mono truncate max-w-xs">{selectedFile?.name}</p>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center text-center group h-full w-full">
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                    <span className="text-sm font-semibold text-gray-300">Tap to Choose QR Code</span>
                    <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG, JPEG</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                )}
              </div>

              {/* Interaction Row */}
              <div className="flex justify-between items-center">
                <label className="px-4 py-2 text-xs bg-[#141f32] text-gray-300 hover:bg-[#1e293b] rounded font-medium transition cursor-pointer">
                  Choose QR File
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>

                <button
                  onClick={handleRunAnalysis}
                  disabled={!selectedFile || isAnalyzing}
                  className={`px-6 py-2 text-xs font-bold font-mono tracking-wider rounded transition ${
                    !selectedFile 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-[#00e5ff] text-[#060b13] hover:bg-[#00b3cc] shadow-md shadow-[#00e5ff]/10'
                  }`}
                >
                  {isAnalyzing ? 'RUNNING...' : 'RUN ANALYSIS'}
                </button>
              </div>

            </div>
          </div>

          {/* Right Section: Deep Matrix Metrics */}
          <div className="flex flex-col gap-6">
            
            {/* Reliability Rating */}
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider">Reliability Score</span>
                  <div className="text-5xl font-black text-white mt-1">
                    {metrics.reliabilityScore}<span className="text-2xl text-gray-500">%</span>
                  </div>
                  <span className="text-xs text-gray-400 block mt-1">
                    {metrics.reliabilityScore > 0 ? 'Verified Integrity' : 'Awaiting Backend Link...'}
                  </span>
                </div>
                <span className="bg-[#14233c] text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded border border-gray-700">
                  {metrics.threatLevel}
                </span>
              </div>
              
              {/* Graphic Feedback Bars */}
              <div className="mt-6 pt-4 border-t border-[#141f32] flex flex-col items-center">
                <div className="flex items-end gap-1 h-12 justify-center w-full">
                  {[35, 75, 45, 90, 25, 60, 80, 50].map((baseHeight, i) => {
                    const finalHeight = metrics.reliabilityScore > 0 ? (baseHeight * (metrics.reliabilityScore / 100)) : 4;
                    return (
                      <div 
                        key={i} 
                        className="w-1.5 bg-[#00e5ff] rounded-t-sm transition-all duration-300" 
                        style={{ height: `${finalHeight}%` }} 
                      />
                    );
                  })}
                </div>
                <span className="text-[9px] text-[#00e5ff]/70 tracking-widest font-mono mt-2">LINK INTELLIGENCE MAP</span>
              </div>
            </div>

            {/* Domain Analysis Parameters */}
            <div className="bg-[#0b1424] border border-[#1e293b] rounded-lg p-5">
              <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider block mb-4">Domain Meta Parameters</span>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Domain Age Box */}
                <div className="bg-[#070d19] border border-[#141f32] p-3 rounded">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Domain Age</span>
                  <span className="text-xl font-bold text-white block mt-1 font-mono">
                    {metrics.domainAgeDays} <span className="text-xs text-gray-500">Days</span>
                  </span>
                  <div className="w-full bg-[#141f32] h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-[#00e5ff] h-full transition-all duration-300" 
                      style={{ width: `${Math.min((metrics.domainAgeDays / 365) * 10, 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Cryptographic SSL Protocol status */}
                <div className="bg-[#070d19] border border-[#141f32] p-3 rounded">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">SSL Security</span>
                  <span className="text-sm font-bold text-white block mt-2 font-mono truncate">
                    {metrics.sslStatus}
                  </span>
                  <div className="w-full bg-[#141f32] h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${metrics.sslStatus === 'VALID' ? 'bg-emerald-400' : 'bg-gray-600'}`} 
                      style={{ width: metrics.sslStatus === 'VALID' ? '100%' : '0%' }} 
                    />
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