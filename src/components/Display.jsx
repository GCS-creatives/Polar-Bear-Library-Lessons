import React, { useEffect, useState, useRef } from 'react';
import mascotImg from '../assets/mascot.jpg';
import storyIcon from '../assets/icons/story.jpg';
import activityIcon from '../assets/icons/activity.jpg';
import exploreIcon from '../assets/icons/explore.jpg';

function toEmbedUrl(raw) {
  raw = (raw || '').trim();
  let id = raw;
  const watchMatch = raw.match(/[?&]v=([^&]+)/);
  const shortMatch = raw.match(/youtu\.be\/([^?&]+)/);
  const embedMatch = raw.match(/embed\/([^?&]+)/);
  if (watchMatch) id = watchMatch[1];
  else if (shortMatch) id = shortMatch[1];
  else if (embedMatch) id = embedMatch[1];
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

function formatTimer(sec) {
  sec = Math.max(0, sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function StudentDisplay({ banks }) {
  const { lessonTitle, standards, wordOfWeek, prompts, materials, video, slides, visualSchedule, visualRules, timer } = banks;

  // ---- Live date/time ----
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' });

  // ---- Countdown timer (ephemeral — not persisted to Blobs) ----
  const [minutesInput, setMinutesInput] = useState(timer?.defaultMinutes ?? 5);
  const [remaining, setRemaining] = useState((timer?.defaultMinutes ?? 5) * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // If the admin-configured default changes, only reset while stopped.
    if (!running) setRemaining(Math.round((timer?.defaultMinutes ?? 5) * 60));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer?.defaultMinutes]);

  const startTimer = () => {
    if (running || remaining <= 0) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };
  const pauseTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const resetOrSetTimer = () => {
    pauseTimer();
    const mins = parseFloat(minutesInput) || 5;
    setRemaining(Math.round(mins * 60));
  };
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // ---- Lesson slides: Fit / Full Screen ----
  const [slidesFullscreen, setSlidesFullscreen] = useState(false);
  // ---- Video: Fit / Full Screen ----
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setSlidesFullscreen(false); setVideoFullscreen(false); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const promptLines = (prompts?.text || '').split('\n').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="student-display">
      <div className="datetime-bar">
        <span className="dt-item">📅 <span>{dateStr}</span></span>
        <span className="dt-item">🕐 <span>{timeStr}</span></span>
      </div>

      <div className="student-hero">
        <div className="kicker">Polar Bear Library</div>
        <h2>{lessonTitle?.studentHeadline}</h2>
        <img className="hero-mascot" src={mascotImg} alt="Our library bear waving hello" />
      </div>

      <div className="grid">
        <div className="card c6 timer-card">
          <h3><span className="card-emoji">⏳</span>Countdown Timer</h3>
          <div className={`timer-display${remaining <= 0 ? ' timer-done' : ''}`}>{formatTimer(remaining)}</div>
          <div className="timer-controls">
            <input
              type="number" min="1" max="60"
              value={minutesInput}
              onChange={(e) => setMinutesInput(e.target.value)}
            />
            <button type="button" className="timer-btn set" onClick={resetOrSetTimer}>Set</button>
            <button type="button" className="timer-btn start" onClick={startTimer}>Start</button>
            <button type="button" className="timer-btn pause" onClick={pauseTimer}>Pause</button>
            <button type="button" className="timer-btn reset" onClick={resetOrSetTimer}>Reset</button>
          </div>
        </div>

        <div className="card c6" style={{ background: 'var(--ice)', border: '2px solid var(--ice-2)' }}>
          <h3><span className="card-emoji">🧭</span>Our Library Rules</h3>
          <div className="rules-row">
            <div className="rule-chip"><span className="emoji">{visualRules?.rule1?.emoji}</span><span className="label">{visualRules?.rule1?.label}</span></div>
            <div className="rule-chip"><span className="emoji">{visualRules?.rule2?.emoji}</span><span className="label">{visualRules?.rule2?.label}</span></div>
            <div className="rule-chip"><span className="emoji">{visualRules?.rule3?.emoji}</span><span className="label">{visualRules?.rule3?.label}</span></div>
          </div>
        </div>
      </div>

      <div className="slides-card">
        <div className="slides-toolbar">
          <h3 style={{ margin: 0 }}><span className="card-emoji">🖥️</span>Lesson Slides</h3>
          <div>
            <button
              type="button"
              className={`slides-btn${!slidesFullscreen ? ' active' : ''}`}
              onClick={() => setSlidesFullscreen(false)}
            >
              Fit to Display
            </button>
            <button
              type="button"
              className={`slides-btn${slidesFullscreen ? ' active' : ''}`}
              onClick={() => setSlidesFullscreen(true)}
            >
              Full Screen
            </button>
          </div>
        </div>
        <div className={`slides-embed${slidesFullscreen ? ' fullscreen-mode' : ''}`}>
          {slides?.url ? (
            <iframe src={slides.url} title="Lesson slides" allowFullScreen />
          ) : (
            <div className="slides-empty">No slides URL set yet — add a Canva embed link in Admin.</div>
          )}
        </div>
        {slidesFullscreen && (
          <button type="button" className="slides-exit-btn" onClick={() => setSlidesFullscreen(false)}>
            ✕ Exit Full Screen
          </button>
        )}
      </div>

      <div className="grid">
        <div className="card c6 ican-card">
          <h3><span className="card-emoji">🎯</span>Today I Can...</h3>
          <p style={{ marginBottom: 6 }}>📚 {standards?.aaslIcanStatement}</p>
          <p>📖 {standards?.icanStatement}</p>
        </div>

        <div className="card c6 word-card">
          <h3><span className="card-emoji">🔤</span>Word of the Week</h3>
          <div className="word-row">
            <span className="the-word">{wordOfWeek?.word}</span>
            <span className="the-def">{wordOfWeek?.definition}</span>
          </div>
          <p className="the-example">"{wordOfWeek?.example}"</p>
        </div>
      </div>

      <div className="steps-row">
        <div className="step-card">
          <span className="num">1</span>
          <img className="step-icon-img" src={storyIcon} alt="" />
          <span className="step-label">{visualSchedule?.step1Label}</span>
        </div>
        <div className="step-connector" />
        <div className="step-card">
          <span className="num">2</span>
          <img className="step-icon-img" src={activityIcon} alt="" />
          <span className="step-label">{visualSchedule?.step2Label}</span>
          <div className="step-sub">{visualSchedule?.step2Sub}</div>
        </div>
        <div className="step-connector" />
        <div className="step-card">
          <span className="num">3</span>
          <img className="step-icon-img" src={exploreIcon} alt="" />
          <span className="step-label">{visualSchedule?.step3Label}</span>
        </div>
      </div>

      <div className="grid">
        <div className="card c6" style={{ background: 'linear-gradient(135deg,#fff,var(--ice))' }}>
          <h3><span className="card-emoji">📚</span>Our Books Today</h3>
          <div className="book-row">
            <div className="book-card">
              <div className="book-cover">{materials?.book1?.emoji}</div>
              <div>
                <div className="book-title">{materials?.book1?.title}</div>
                <div className="book-author">{materials?.book1?.author}</div>
              </div>
            </div>
            <div className="book-card">
              <div className="book-cover">{materials?.book2?.emoji}</div>
              <div>
                <div className="book-title">{materials?.book2?.title}</div>
                <div className="book-author">{materials?.book2?.author}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card c6">
          <div className="slides-toolbar">
            <h3 style={{ margin: 0 }}><span className="card-emoji">▶️</span>Watch</h3>
            <div>
              <button
                type="button"
                className={`slides-btn${!videoFullscreen ? ' active' : ''}`}
                onClick={() => setVideoFullscreen(false)}
              >
                Fit to Display
              </button>
              <button
                type="button"
                className={`slides-btn${videoFullscreen ? ' active' : ''}`}
                onClick={() => setVideoFullscreen(true)}
              >
                Full Screen
              </button>
            </div>
          </div>
          <div className={`video-embed${videoFullscreen ? ' fullscreen-mode' : ''}`}>
            <iframe src={toEmbedUrl(video?.url)} title="Lesson video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          {videoFullscreen && (
            <button type="button" className="slides-exit-btn" onClick={() => setVideoFullscreen(false)}>
              ✕ Exit Full Screen
            </button>
          )}
        </div>
      </div>

      <div className="grid">
        <div className="card c12">
          <h3><span className="card-emoji">🙋</span>Your Turn</h3>
          <div className="prompt-section">
            <img className="prompt-mascot" src={mascotImg} alt="Our library bear" />
            <div className="prompt-row">
              {promptLines.map((line, i) => (
                <span className="prompt-chip" key={i}>{line}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
