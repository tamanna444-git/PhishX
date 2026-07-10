import React, { useState } from 'react';
import { Shield, Key, User, ArrowRight, AlertTriangle } from 'lucide-react';

function Authentication({ onAuthenticate }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [operatorId, setOperatorId] = useState('');
  const [neuralKey, setNeuralKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // FastAPI backend running via uvicorn — default port 8000.
  // Confirmed routes from Swagger: /api/user/register and /api/user/login
  const API_URL = 'http://127.0.0.1:8000/api/user';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    setIsLoading(true);

    const endpoint = isSignUp ? `${API_URL}/register` : `${API_URL}/login`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator_id: operatorId.trim(),
          neural_key: neuralKey
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Backend responded but not with valid JSON. Check the server logs.');
      }

      if (!response.ok) {
        let backendMessage = 'Protocol initialization failed.';
        if (typeof data.detail === 'string') {
          backendMessage = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          backendMessage = data.detail
            .map((d) => `${d.loc?.[d.loc.length - 1]}: ${d.msg}`)
            .join(' | ');
        } else if (data.error) {
          backendMessage = data.error;
        }
        throw new Error(backendMessage);
      }

      if (isSignUp) {
        setStatusMessage('PROFILE REGISTERED. ACCESS PORTAL OPEN.');
        setIsSignUp(false);
        setNeuralKey('');
      } else {
        // FIXED: Changed data.token to data.id to match the FastAPI response keys
        if (data.id) {
          localStorage.setItem('operatorToken', data.id);
          localStorage.setItem('operatorId', data.operator_id || operatorId);
          if (onAuthenticate) {
            onAuthenticate();
          }
        } else {
          throw new Error('Invalid payload handshake structure received from backend.');
        }
      }
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        setErrorMessage(
          `Cannot reach backend at ${API_URL}. Is the server running?`
        );
      } else {
        setErrorMessage(error.message || 'Network sync error. Terminal offline.');
      }
    } finally {
      isLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#050811] font-mono text-gray-200 overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,163,255,0.05),transparent_60%)] pointer-events-none" />

      <div className="mb-6 flex flex-col items-center text-center z-10">
        <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest text-2xl mb-1">
          <Shield className="w-7 h-7 text-cyan-400 animate-pulse" />
          <span>PHISHX</span>
        </div>
        <p className="text-xs text-cyan-500/60 font-semibold tracking-wider">PHISHX V.4.2.0 | NODE: ACTIVE</p>
      </div>

      <div className="w-full max-w-md bg-[#090f1d] border border-cyan-500/20 rounded-xl shadow-2xl p-8 relative z-10">
        <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4 mb-6">
          <h2 className="text-lg font-bold tracking-wide text-gray-100">
            {isSignUp ? 'Register Terminal Profile' : 'Operator Authentication'}
          </h2>
          <span className="flex items-center gap-1 text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase font-semibold">
            <Key className="w-3 h-3" /> Secure Link
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded text-xs text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {statusMessage && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-400 flex items-center gap-2">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cyan-500/70 font-semibold mb-2">
              Operator ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/40" />
              <input
                type="text"
                required
                disabled={isLoading}
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                placeholder="ENT_00_ID"
                className="w-full bg-[#050811] border border-cyan-500/20 rounded px-4 py-2.5 pl-10 text-sm text-gray-100 placeholder-cyan-950 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cyan-500/70 font-semibold mb-2">
              Neural Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/40" />
              <input
                type="password"
                required
                disabled={isLoading}
                value={neuralKey}
                onChange={(e) => setNeuralKey(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#050811] border border-cyan-500/20 rounded px-4 py-2.5 pl-10 text-sm text-gray-100 placeholder-cyan-950 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 text-black font-bold uppercase tracking-widest text-sm py-3.5 px-4 rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'SYNCING MATRIX...' : isSignUp ? 'REGISTER PROFILE' : 'INITIATE PROTOCOL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setOperatorId('');
              setNeuralKey('');
              setErrorMessage('');
              setStatusMessage('');
            }}
            className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors underline underline-offset-4 disabled:opacity-50"
          >
            {isSignUp ? 'Return to Portal Access' : 'Request New Operator ID'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Authentication;