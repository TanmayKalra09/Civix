import React, { useState } from 'react';

export default function SafeWord() {
  const [safeWord, setSafeWord] = useState('');
  const [status, setStatus] = useState('');

  const saveSafeWord = () => {
    if (safeWord.trim()) {
      setStatus(`Safe word "${safeWord}" has been saved!`);
      // later: save to DB or localStorage
    } else {
      setStatus('Please enter a safe word.');
    }
  };

  const triggerAlert = () => {
    // replace with backend call or SMS API later
    setStatus(`🚨 Safe word alert "${safeWord}" has been triggered and sent to contacts!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Safe Word Setup</h1>
      
      <input
        type="text"
        value={safeWord}
        onChange={(e) => setSafeWord(e.target.value)}
        placeholder="Enter your safe word"
        className="border p-2 rounded w-full mb-4"
      />
      
      <div className="flex gap-4">
        <button
          onClick={saveSafeWord}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={triggerAlert}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Trigger Alert
        </button>
      </div>

      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
}
