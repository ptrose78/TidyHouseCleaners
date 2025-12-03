'use client';

import { useState } from 'react';

export default function SmsTester() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMsg('');

    try {
      const res = await fetch('/api/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send');

      setStatus('success');
      setResponseMsg(`Success! Message SID: ${data.messageSid}`);
    } catch (err: any) {
      setStatus('error');
      setResponseMsg(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Test SMS System
      </h3>
      
      <form onSubmit={handleTest} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+14145550123"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: +1 followed by area code and number.
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
            ${status === 'loading' 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {status === 'loading' ? 'Scheduling...' : 'Send Test Reminder (16 mins)'}
        </button>

        {/* Feedback Messages */}
        {status === 'success' && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
            ✅ {responseMsg}
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            ❌ Error: {responseMsg}
          </div>
        )}
      </form>
    </div>
  );
}