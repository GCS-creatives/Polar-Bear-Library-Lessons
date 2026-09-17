import React, { useEffect, useState, useCallback } from 'react';
import { getBank, setBank } from './lib/blobsClient.js';
import { defaultContent } from './data/defaults.js';
import StudentDisplay from './components/Display.jsx';
import AdminPanel from './components/Admin.jsx';

const BANK_NAMES = Object.keys(defaultContent);

export default function App() {
  const [banks, setBanks] = useState(null); // null while loading
  const [mode, setMode] = useState('student'); // 'student' | 'admin'
  const [sessionToken, setSessionToken] = useState(null);

  // Load every content bank on first mount. Each fetched value is merged
  // *under* the current default shape — if a bank's schema has changed
  // since data was last saved, any keys missing from the stored value
  // fall back to the default instead of being undefined and crashing
  // the first render.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = {};
      for (const name of BANK_NAMES) {
        try {
          const fetched = await getBank(name);
          const base = defaultContent[name];
          const merged = (base && typeof base === 'object' && fetched && typeof fetched === 'object')
            ? { ...base, ...fetched }
            : (fetched ?? base);
          loaded[name] = merged;
        } catch {
          loaded[name] = defaultContent[name];
        }
      }
      if (!cancelled) setBanks(loaded);
    })();
    return () => { cancelled = true; };
  }, []);

  const updateBank = useCallback(async (bankName, nextValue) => {
    setBanks((prev) => ({ ...prev, [bankName]: nextValue }));
    try {
      await setBank(bankName, nextValue, sessionToken);
    } catch (err) {
      console.error(`Failed to persist ${bankName}:`, err.message);
    }
  }, [sessionToken]);

  const enterAdmin = useCallback((token) => {
    setSessionToken(token);
  }, []);

  const exitAdmin = useCallback(() => {
    setMode('student');
  }, []);

  if (!banks) {
    return (
      <div style={{ padding: 40, fontFamily: 'Nunito, sans-serif', color: 'var(--ocean-deep, #0a4d68)' }}>
        Loading Polar Bear Library…
      </div>
    );
  }

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <h1>Polar Bear Library</h1>
        </div>
        <div className="toggles">
          <div className="toggle-wrap">
            <button
              className={`toggle-btn mode-student${mode === 'student' ? ' active' : ''}`}
              onClick={() => setMode('student')}
            >
              Student Display
            </button>
            <button
              className={`toggle-btn mode-admin${mode === 'admin' ? ' active' : ''}`}
              onClick={() => setMode('admin')}
            >
              Admin / Planning
            </button>
          </div>
        </div>
      </div>

      <div className="page">
        {mode === 'admin' ? (
          <AdminPanel
            banks={banks}
            updateBank={updateBank}
            sessionToken={sessionToken}
            onAuthenticated={enterAdmin}
            onExit={exitAdmin}
          />
        ) : (
          <StudentDisplay banks={banks} />
        )}
      </div>

      <footer>GCS Creatives Project · Grace Campbell-Sheran · © {new Date().getFullYear()}</footer>
    </div>
  );
}
