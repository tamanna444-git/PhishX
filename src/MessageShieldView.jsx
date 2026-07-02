import React from 'react';

export default function MessageShieldView() {
  return (
    <div className="bg-[#0e1726] border border-slate-800 p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white">Message Shield Analysis</h2>
      <textarea 
        rows="6" 
        placeholder="Paste SMS, Email headers, or Chat messages here for neural analysis..." 
        className="w-full bg-[#090d16] border border-slate-800 rounded p-4 text-slate-300 focus:outline-none focus:border-[#00f0ff] resize-none"
      ></textarea>
      <button className="bg-[#00f0ff] text-black px-6 py-2 font-bold rounded hover:opacity-90">RUN NEURAL SCAN</button>
    </div>
  );
}