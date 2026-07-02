import React from 'react';

export default function QrGuardView() {
  return (
    <div className="bg-[#0e1726] border border-slate-800 p-6 rounded-lg text-center py-12">
      <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 max-w-md mx-auto hover:border-[#00f0ff] transition-all cursor-pointer">
        <p className="text-slate-400">Drag & Drop QR Code, or click to browse filesystem</p>
        <button className="mt-4 border border-slate-700 text-slate-300 px-4 py-2 rounded text-sm hover:bg-slate-800">
          Open Live Camera
        </button>
      </div>
    </div>
  );
}