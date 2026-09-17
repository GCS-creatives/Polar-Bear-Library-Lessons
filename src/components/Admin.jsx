import React, { useState } from 'react';
import { checkPin, changePin } from '../lib/blobsClient.js';
import { defaultContent, aaslOptions, ncesOptions, LESSON_BANK_NAMES } from '../data/defaults.js';

/* ---------- PIN login gate ---------- */
function PinGate({ onAuthenticated }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const submit = async () => {
    setError('');
    setChecking(true);
    try {
      const res = await checkPin(pin);
      if (res.ok) {
        onAuthenticated(res.token);
      } else {
        setError('Incorrect PIN.');
      }
    } catch {
      setError('Could not check PIN — try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="card c12" style={{ maxWidth: 360, margin: '40px auto' }}>
      <h3><span className="card-emoji">🔒</span>Admin PIN</h3>
      <input
        type="password"
        inputMode="numeric"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
      />
      {error && <p style={{ color: 'var(--coral-deep)', fontSize: 13 }}>{error}</p>}
      <button type="button" className="small-btn" onClick={submit} disabled={checking}>
        {checking ? 'Checking…' : 'Enter'}
      </button>
      <p className="field-hint">Default PIN is 0000 until changed below (once you're in).</p>
    </div>
  );
}

/* ---------- Change PIN ---------- */
function ChangePinCard({ sessionToken }) {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setMsg('');
    if (newPin.length < 4) { setMsg('PIN must be at least 4 characters.'); return; }
    if (newPin !== confirmPin) { setMsg('PINs don\u2019t match.'); return; }
    setSaving(true);
    try {
      await changePin(newPin, sessionToken);
      setNewPin(''); setConfirmPin('');
      setMsg('PIN updated.');
    } catch (err) {
      setMsg(err.message || 'Could not change PIN.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card c12">
      <h3><span className="card-emoji">🔒</span>Change Admin PIN</h3>
      <div className="grid" style={{ gap: 16 }}>
        <div className="c6">
          <label className="field-label">New PIN</label>
          <input type="password" inputMode="numeric" value={newPin} onChange={(e) => setNewPin(e.target.value)} />
        </div>
        <div className="c6">
          <label className="field-label">Confirm new PIN</label>
          <input type="password" inputMode="numeric" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} />
        </div>
      </div>
      {msg && <p className="field-hint">{msg}</p>}
      <button type="button" className="small-btn" onClick={submit} disabled={saving}>
        {saving ? 'Saving…' : 'Update PIN'}
      </button>
    </div>
  );
}

/* ---------- Lessons: save / load / new / cycle ---------- */
function getSnapshot(banks) {
  const snap = {};
  for (const name of LESSON_BANK_NAMES) snap[name] = banks[name];
  return snap;
}

function LessonsToolbar({ banks, updateBank }) {
  const [baseline, setBaseline] = useState(() => getSnapshot(banks));
  const current = getSnapshot(banks);
  const dirty = JSON.stringify(current) !== JSON.stringify(baseline);

  const { items, activeId } = banks.lessons;
  const activeIndex = items.findIndex((l) => l.id === activeId);
  const activeLesson = activeIndex >= 0 ? items[activeIndex] : null;

  const applySnapshot = (snapshot) => {
    for (const name of LESSON_BANK_NAMES) {
      updateBank(name, snapshot[name]);
    }
  };

  const confirmDiscardIfDirty = () => {
    if (!dirty) return true;
    return window.confirm('You have unsaved changes on this lesson. Discard them and continue?');
  };

  const saveCurrent = () => {
    if (!activeLesson) {
      saveAsNew();
      return;
    }
    const nextItems = items.map((l) =>
      l.id === activeLesson.id ? { ...l, snapshot: current, savedAt: new Date().toISOString() } : l
    );
    updateBank('lessons', { items: nextItems, activeId: activeLesson.id });
    setBaseline(current);
  };

  const saveAsNew = () => {
    const name = window.prompt('Name this lesson:', banks.lessonTitle?.internalTitle || 'Untitled lesson');
    if (!name) return;
    const id = `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newEntry = { id, name, savedAt: new Date().toISOString(), snapshot: current };
    updateBank('lessons', { items: [...items, newEntry], activeId: id });
    setBaseline(current);
  };

  const newLesson = () => {
    if (!confirmDiscardIfDirty()) return;
    const blank = {};
    for (const name of LESSON_BANK_NAMES) blank[name] = defaultContent[name];
    applySnapshot(blank);
    updateBank('lessons', { items, activeId: null });
    setBaseline(blank);
  };

  const loadLesson = (id) => {
    if (!id) return;
    if (!confirmDiscardIfDirty()) return;
    const lesson = items.find((l) => l.id === id);
    if (!lesson) return;
    applySnapshot(lesson.snapshot);
    updateBank('lessons', { items, activeId: id });
    setBaseline(lesson.snapshot);
  };

  const cycle = (dir) => {
    if (items.length === 0) return;
    const nextIndex = activeIndex < 0
      ? (dir > 0 ? 0 : items.length - 1)
      : (activeIndex + dir + items.length) % items.length;
    loadLesson(items[nextIndex].id);
  };

  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCurrent = () => {
    const name = activeLesson?.name || banks.lessonTitle?.internalTitle || 'Untitled lesson';
    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'lesson';
    downloadJson({ name, savedAt: new Date().toISOString(), snapshot: current }, `${safeName}.json`);
  };

  const exportAll = () => {
    downloadJson({ items }, 'polar-bear-library-lessons.json');
  };

  const fileInputRef = React.useRef(null);

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch {
        window.alert('That file isn\u2019t valid JSON — nothing was imported.');
        return;
      }
      // Accept: a single lesson { name, snapshot }, an array of lessons,
      // or the { items: [...] } shape from "Export All".
      const incoming = Array.isArray(parsed) ? parsed
        : Array.isArray(parsed.items) ? parsed.items
        : parsed.snapshot ? [parsed]
        : null;
      if (!incoming || incoming.length === 0) {
        window.alert('That file doesn\u2019t look like a lesson export — nothing was imported.');
        return;
      }
      if (!confirmDiscardIfDirty()) return;
      const imported = incoming.map((l) => ({
        id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: l.name || 'Imported lesson',
        savedAt: l.savedAt || new Date().toISOString(),
        snapshot: l.snapshot
      }));
      const nextItems = [...items, ...imported];
      const first = imported[0];
      applySnapshot(first.snapshot);
      updateBank('lessons', { items: nextItems, activeId: first.id });
      setBaseline(first.snapshot);
      window.alert(`Imported ${imported.length} lesson${imported.length > 1 ? 's' : ''}. Now showing "${first.name}".`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="card c12" style={{ background: 'linear-gradient(120deg,var(--ocean-deep),var(--sky-deep))' }}>
      <h3 style={{ color: '#fff' }}><span className="card-emoji">📁</span>Lessons</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="small-btn" onClick={() => cycle(-1)} disabled={items.length === 0}>◀ Prev</button>
        <select
          style={{ maxWidth: 260, marginBottom: 0 }}
          value={activeId || ''}
          onChange={(e) => loadLesson(e.target.value)}
        >
          <option value="">— New / unsaved lesson —</option>
          {items.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <button type="button" className="small-btn" onClick={() => cycle(1)} disabled={items.length === 0}>Next ▶</button>

        <span style={{ flex: 1 }} />

        <button type="button" className="small-btn" onClick={saveCurrent}>
          {activeLesson ? 'Save Changes' : 'Save'}
        </button>
        <button type="button" className="small-btn" onClick={saveAsNew}>Save As New</button>
        <button type="button" className="small-btn" style={{ borderColor: 'var(--coral)', color: '#fff', background: 'var(--coral)' }} onClick={newLesson}>
          + New Lesson
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
        <button type="button" className="small-btn" onClick={exportCurrent}>⬇ Export This Lesson</button>
        <button type="button" className="small-btn" onClick={exportAll} disabled={items.length === 0}>⬇ Export All</button>
        <button type="button" className="small-btn" onClick={() => fileInputRef.current?.click()}>⬆ Import Lesson(s)</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />
      </div>
      <p className="field-hint" style={{ color: dirty ? '#ffe0b2' : 'rgba(255,255,255,.75)' }}>
        {dirty ? 'Unsaved changes.' : 'All changes saved.'}
        {activeLesson && ` Editing "${activeLesson.name}" — last saved ${new Date(activeLesson.savedAt).toLocaleString()}.`}
        {!activeLesson && ' This lesson has never been saved — use Save or Save As New to keep it.'}
      </p>
    </div>
  );
}

/* ---------- Main Admin panel ---------- */
export default function AdminPanel({ banks, updateBank, sessionToken, onAuthenticated, onExit }) {
  if (!sessionToken) {
    return <PinGate onAuthenticated={onAuthenticated} />;
  }

  const patch = (bankName, partial) => {
    updateBank(bankName, { ...banks[bankName], ...partial });
  };

  const applyNcesSelection = (code) => {
    const opt = ncesOptions.find((o) => o.code === code);
    if (!opt) return;
    patch('standards', {
      ncesCode: opt.code,
      ncesDescription: opt.description,
      icanStatement: opt.ican
    });
  };

  const applyAaslSelection = (code) => {
    const opt = aaslOptions.find((o) => o.code === code);
    if (!opt) return;
    patch('standards', {
      aaslCode: opt.code, aaslFoundation: opt.foundation, aaslDomain: opt.domain,
      aaslText: opt.text, aaslIcanStatement: opt.ican
    });
  };

  const resetAaslIcan = () => {
    const opt = aaslOptions.find((o) => o.code === banks.standards.aaslCode);
    if (opt) patch('standards', { aaslIcanStatement: opt.ican });
  };

  const resetIcan = () => {
    const opt = ncesOptions.find((o) => o.code === banks.standards.ncesCode);
    if (opt) patch('standards', { icanStatement: opt.ican });
  };

  return (
    <div className="admin-shell">
      <div className="admin-banner">
        <div>
          <div className="school">Polar Bear Library · Admin / Planning</div>
          <div className="lesson-title">{banks.lessonTitle.internalTitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="tag">Not shown to students</span>
          <button type="button" className="small-btn" style={{ background: '#fff' }} onClick={onExit}>
            ← Back to Display
          </button>
        </div>
      </div>

      <div className="grid">

        <LessonsToolbar banks={banks} updateBank={updateBank} />

        {/* Titles */}
        <div className="card c12">
          <h3><span className="card-emoji">📝</span>Lesson Title</h3>
          <div className="grid" style={{ gap: 16 }}>
            <div className="c6">
              <label className="field-label">Internal planning title</label>
              <input
                type="text"
                value={banks.lessonTitle.internalTitle}
                onChange={(e) => patch('lessonTitle', { internalTitle: e.target.value })}
              />
              <p className="field-hint">Used in Admin only, for your own records.</p>
            </div>
            <div className="c6">
              <label className="field-label">Student-facing headline</label>
              <input
                type="text"
                value={banks.lessonTitle.studentHeadline}
                onChange={(e) => patch('lessonTitle', { studentHeadline: e.target.value })}
              />
              <p className="field-hint">Shown at the top of the Student Display.</p>
            </div>
          </div>
        </div>

        {/* Standards */}
        <div className="card c12">
          <h3><span className="card-emoji">📐</span>Standards Addressed</h3>
          <div className="grid" style={{ gap: 16 }}>
            <div className="c6">
              <label className="field-label">AASL Learner Competency</label>
              <select value={banks.standards.aaslCode} onChange={(e) => applyAaslSelection(e.target.value)}>
                {['Inquire', 'Include', 'Collaborate', 'Curate', 'Explore', 'Engage'].map((foundation) => (
                  <optgroup label={foundation} key={foundation}>
                    {aaslOptions.filter((o) => o.foundation === foundation).map((o) => (
                      <option key={o.code} value={o.code}>{o.code} — {o.domain}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="std-desc">
                <span className="code">{banks.standards.aaslCode}</span>
                {banks.standards.aaslText}
              </p>
            </div>
            <div className="c6">
              <label className="field-label">NC Extended Content Standard (Grades 6–8, Reading: Literature)</label>
              <select value={banks.standards.ncesCode} onChange={(e) => applyNcesSelection(e.target.value)}>
                {ncesOptions.map((o) => (
                  <option key={o.code} value={o.code}>{o.code}</option>
                ))}
              </select>
              <p className="std-desc">
                <span className="code">{banks.standards.ncesCode}</span>
                {banks.standards.ncesDescription}
              </p>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ice-2)' }}>
            <label className="field-label">
              "I Can" — AASL Library Skill (shown to students) <span className="code">{banks.standards.aaslCode}</span>
            </label>
            <textarea
              rows={2}
              value={banks.standards.aaslIcanStatement}
              onChange={(e) => patch('standards', { aaslIcanStatement: e.target.value })}
            />
            <button type="button" className="small-btn" onClick={resetAaslIcan}>Reset to suggested wording</button>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ice-2)' }}>
            <label className="field-label">
              "I Can" — Content Standard (shown to students) <span className="code">{banks.standards.ncesCode}</span>
            </label>
            <textarea
              rows={2}
              value={banks.standards.icanStatement}
              onChange={(e) => patch('standards', { icanStatement: e.target.value })}
            />
            <button type="button" className="small-btn" onClick={resetIcan}>Reset to suggested wording</button>
          </div>
        </div>

        {/* Word of the Week */}
        <div className="card c12">
          <h3><span className="card-emoji">🔤</span>Word of the Week</h3>
          <div className="grid" style={{ gap: 16 }}>
            <div className="c4">
              <label className="field-label">Word</label>
              <input type="text" value={banks.wordOfWeek.word} onChange={(e) => patch('wordOfWeek', { word: e.target.value })} />
            </div>
            <div className="c4">
              <label className="field-label">Simple definition</label>
              <input type="text" value={banks.wordOfWeek.definition} onChange={(e) => patch('wordOfWeek', { definition: e.target.value })} />
            </div>
            <div className="c4">
              <label className="field-label">Example sentence</label>
              <input type="text" value={banks.wordOfWeek.example} onChange={(e) => patch('wordOfWeek', { example: e.target.value })} />
            </div>
          </div>
          <p className="field-hint">Maps directly to the Word of the Week card on Student Display.</p>
        </div>

        {/* Goal / Barriers / Access / Evidence — admin only */}
        <div className="card c12">
          <h3><span className="card-emoji">🎯</span>Goal</h3>
          <textarea rows={2} value={banks.goal.text} onChange={(e) => updateBank('goal', { text: e.target.value })} />
          <p className="no-map-note">Planning language — no student-facing counterpart by design.</p>
        </div>
        <div className="card c6">
          <h3><span className="card-emoji">🚧</span>Possible Barriers</h3>
          <textarea rows={5} value={banks.barriers.text} onChange={(e) => updateBank('barriers', { text: e.target.value })} />
          <p className="no-map-note">Planning language — no student-facing counterpart by design.</p>
        </div>
        <div className="card c6">
          <h3><span className="card-emoji">🔑</span>Access Options</h3>
          <textarea rows={5} value={banks.access.text} onChange={(e) => updateBank('access', { text: e.target.value })} />
          <p className="no-map-note">Planning language — no student-facing counterpart by design.</p>
        </div>
        <div className="card c6">
          <h3><span className="card-emoji">🙋</span>Participation (planning notes)</h3>
          <textarea rows={5} value={banks.participationNotes.text} onChange={(e) => updateBank('participationNotes', { text: e.target.value })} />
          <p className="no-map-note">Planning language — no student-facing counterpart by design.</p>
        </div>
        <div className="card c6">
          <h3><span className="card-emoji">📊</span>Evidence</h3>
          <textarea rows={5} value={banks.evidence.text} onChange={(e) => updateBank('evidence', { text: e.target.value })} />
          <p className="no-map-note">Planning language — no student-facing counterpart by design.</p>
        </div>

        {/* Prompts + Video */}
        <div className="grid c12" style={{ gap: 16 }}>
          <div className="card c6">
            <h3><span className="card-emoji">💬</span>"Your Turn" Prompts (shown to students)</h3>
            <textarea rows={3} value={banks.prompts.text} onChange={(e) => updateBank('prompts', { text: e.target.value })} />
            <p className="field-hint">One prompt per line. Maps directly to the "Your Turn" chips on Student Display.</p>
          </div>
          <div className="card c6">
            <h3><span className="card-emoji">▶️</span>Lesson Video</h3>
            <label className="field-label">YouTube URL or video ID</label>
            <input type="text" value={banks.video.url} onChange={(e) => updateBank('video', { url: e.target.value })} />
            <p className="field-hint">Maps directly to the video embedded on Student Display.</p>
          </div>
        </div>

        {/* Canva Lesson Slides */}
        <div className="card c12">
          <h3><span className="card-emoji">🖥️</span>Lesson Slides</h3>
          <label className="field-label">Slides embed URL</label>
          <input
            type="text"
            placeholder="Paste your Canva embed link (Share → More → Embed → Copy link)"
            value={banks.slides.url}
            onChange={(e) => updateBank('slides', { url: e.target.value })}
          />
          <p className="field-hint">
            Maps directly to the Lesson Slides embed on Student Display, with its own Fit / Full Screen toggle.
            Use Canva's own "Embed" link (not the regular design edit/view link) — Canva generates a public,
            frame-friendly URL specifically for this.
          </p>
        </div>

        {/* Materials */}
        <div className="card c12">
          <h3><span className="card-emoji">📚</span>Materials</h3>
          <div className="admin-subhead">Book 1</div>
          <div className="inline-fields">
            <input type="text" className="emoji-input" value={banks.materials.book1.emoji}
              onChange={(e) => patch('materials', { book1: { ...banks.materials.book1, emoji: e.target.value } })} />
            <input type="text" value={banks.materials.book1.title}
              onChange={(e) => patch('materials', { book1: { ...banks.materials.book1, title: e.target.value } })} />
            <input type="text" value={banks.materials.book1.author}
              onChange={(e) => patch('materials', { book1: { ...banks.materials.book1, author: e.target.value } })} />
          </div>
          <div className="admin-subhead">Book 2</div>
          <div className="inline-fields">
            <input type="text" className="emoji-input" value={banks.materials.book2.emoji}
              onChange={(e) => patch('materials', { book2: { ...banks.materials.book2, emoji: e.target.value } })} />
            <input type="text" value={banks.materials.book2.title}
              onChange={(e) => patch('materials', { book2: { ...banks.materials.book2, title: e.target.value } })} />
            <input type="text" value={banks.materials.book2.author}
              onChange={(e) => patch('materials', { book2: { ...banks.materials.book2, author: e.target.value } })} />
          </div>
          <div className="admin-subhead">Other materials (planning only, no student mapping)</div>
          <textarea rows={2} value={banks.materials.other} onChange={(e) => patch('materials', { other: e.target.value })} />
        </div>

        {/* Visual Schedule */}
        <div className="card c12">
          <h3><span className="card-emoji">🧭</span>Visual Schedule (3-step icon strip)</h3>
          <p className="field-hint" style={{ marginBottom: 10 }}>
            Icons are fixed illustrations (Story / Activity / Explore). Labels below are editable.
          </p>
          <div className="grid" style={{ gap: 16 }}>
            <div className="c4">
              <label className="field-label">Step 1</label>
              <input type="text" value={banks.visualSchedule.step1Label}
                onChange={(e) => patch('visualSchedule', { step1Label: e.target.value })} />
            </div>
            <div className="c4">
              <label className="field-label">Step 2 (label + specific activity)</label>
              <input type="text" value={banks.visualSchedule.step2Label}
                onChange={(e) => patch('visualSchedule', { step2Label: e.target.value })} />
              <input type="text" placeholder="Specific activity for this lesson" value={banks.visualSchedule.step2Sub}
                onChange={(e) => patch('visualSchedule', { step2Sub: e.target.value })} />
            </div>
            <div className="c4">
              <label className="field-label">Step 3</label>
              <input type="text" value={banks.visualSchedule.step3Label}
                onChange={(e) => patch('visualSchedule', { step3Label: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Visual Rules */}
        <div className="card c12">
          <h3><span className="card-emoji">✅</span>Visual Rules (shown to students)</h3>
          <div className="grid" style={{ gap: 16 }}>
            {['rule1', 'rule2', 'rule3'].map((key, i) => (
              <div className="c4" key={key}>
                <label className="field-label">Rule {i + 1}</label>
                <div className="inline-fields">
                  <input type="text" className="emoji-input" value={banks.visualRules[key].emoji}
                    onChange={(e) => patch('visualRules', { [key]: { ...banks.visualRules[key], emoji: e.target.value } })} />
                  <input type="text" value={banks.visualRules[key].label}
                    onChange={(e) => patch('visualRules', { [key]: { ...banks.visualRules[key], label: e.target.value } })} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timer default */}
        <div className="card c12">
          <h3><span className="card-emoji">⏳</span>Countdown Timer Default</h3>
          <label className="field-label">Default minutes</label>
          <input
            type="number" min="1" max="60" style={{ maxWidth: 120 }}
            value={banks.timer.defaultMinutes}
            onChange={(e) => updateBank('timer', { defaultMinutes: parseFloat(e.target.value) || 5 })}
          />
          <p className="field-hint">
            Sets the starting value on Student Display. The running countdown itself isn't saved —
            each visit to Student Display starts fresh from this default.
          </p>
        </div>

        {/* Agenda */}
        <div className="card c12">
          <h3><span className="card-emoji">⏱️</span>Agenda / Time (detailed, admin only)</h3>
          <textarea rows={7} value={banks.agenda.text} onChange={(e) => updateBank('agenda', { text: e.target.value })} />
          <p className="no-map-note">
            Planning language — feeds the 3-step Visual Schedule above conceptually, but this detailed table
            itself has no student-facing counterpart.
          </p>
        </div>

        <ChangePinCard sessionToken={sessionToken} />

      </div>
    </div>
  );
}
