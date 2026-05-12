import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MONTH_NAMES, DOW_SUN, buildMonthGrid, isoDate, isToday, isFuture, getCount, SAMPLE_CONVOS
} from '../style/sampleData.js';

function useMonth(initialY, initialM) {
  const [y, setY] = useState(initialY);
  const [m, setM] = useState(initialM);
  const [dir, setDir] = useState(0);
  const [anim, setAnim] = useState(false);
  const go = (delta) => {
    setDir(delta);
    setAnim(true);
    setTimeout(() => {
      let mm = m + delta;
      let nY = y;
      if (mm > 12) { mm = 1; nY = y + 1; }
      if (mm < 1) { mm = 12; nY = y - 1; }
      setY(nY); setM(mm);
      setTimeout(() => setAnim(false), 320);
    }, 200);
  };
  return { y, m, dir, anim, go };
}

function MonthHeader({ y, m, onPrev, onNext }) {
  return (
    <div className="month-bar">
      <div className="month-title">
        <span>{MONTH_NAMES[m - 1]}</span>
        <span className="yr">{y}</span>
        <span className="swipe-hint" style={{ marginLeft: 18 }}>
          <span className="glyph">↔</span>
          <span>swipe or use ← →</span>
        </span>
      </div>
      <div className="month-nav">
        <button className="month-btn" onClick={onPrev} aria-label="prev">‹</button>
        <button className="month-btn" onClick={onNext} aria-label="next">›</button>
      </div>
    </div>
  );
}

function DowRow() {
  return (
    <div className="dow">
      {DOW_SUN.map((d, i) => (
        <div key={d} className={i === 0 || i === 6 ? 'wknd' : ''}>{d}</div>
      ))}
    </div>
  );
}

export default function Calendar() {
  const navigate = useNavigate();
  const now = new Date();
  const { y, m, dir, anim, go } = useMonth(now.getFullYear(), now.getMonth() + 1);
  const cells = buildMonthGrid(y, m, 0);
  const [sel, setSel] = useState(null);
  const [closing, setClosing] = useState(false);

  const animClass = anim
    ? (dir > 0 ? 'cal-page-anim-slide-out-left' : 'cal-page-anim-slide-out-right')
    : (dir > 0 ? 'cal-page-anim-slide-in-right' : dir < 0 ? 'cal-page-anim-slide-in-left' : '');

  const openDay = (c) => { setClosing(false); setSel({ y: c.y, m: c.m, d: c.d }); };
  const closeDay = () => {
    setClosing(true);
    setTimeout(() => { setSel(null); setClosing(false); }, 240);
  };

  // keyboard nav
  React.useEffect(() => {
    const onKey = (e) => {
      if (sel) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const convos = sel ? (SAMPLE_CONVOS[isoDate(sel.y, sel.m, sel.d)] || []) : [];
  const selCount = sel ? getCount(sel.y, sel.m, sel.d) : 0;

  return (
    <div className="ab">
      <MonthHeader y={y} m={m} onPrev={() => go(-1)} onNext={() => go(1)} />

      <div className={`cal-page ${animClass}`} key={`${y}-${m}-${dir}-${anim}`}>
        <DowRow />
        <div className="cal-grid">
          {cells.map((c, i) => {
            const count = getCount(c.y, c.m, c.d);
            const today = isToday(c.y, c.m, c.d);
            const future = isFuture(c.y, c.m, c.d);
            const inactive = !c.outside && (count === 0 || future);
            const active = !c.outside && !inactive && count > 0;
            const cls = [
              'cal-cell',
              c.outside ? 'outside' : '',
              today ? 'today' : '',
              active ? 'active' : '',
              inactive ? 'inactive' : '',
            ].join(' ');
            return (
              <div
                key={i}
                className={cls}
                style={{ '--i': i }}
                onClick={() => active && openDay(c)}
              >
                <div className="cal-num">{c.d}</div>
                {count > 0 && !c.outside && (
                  <span className={`badge-num ${count === 1 ? 'single' : 'sage'}`}>{count}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="foot">
        <div className="legend">
          <span className="key"><span className="swatch today"></span> today</span>
          <span className="key"><span className="swatch has">●</span> has conversation</span>
          <span className="key"><span className="swatch none"></span> inactive</span>
        </div>
        <div>V1 · standard grid · click a date to open detail</div>
      </div>

      {sel && (
        <>
          <div className={`detail-backdrop ${closing ? 'closing' : ''}`} onClick={closeDay}></div>
          <div className={`detail-overlay ${closing ? 'closing' : ''}`}>
            <div className="head">
              <div className="ttl">
                {MONTH_NAMES[sel.m - 1]} {sel.d}
                <span className="day">
                  {new Date(sel.y, sel.m - 1, sel.d).toLocaleDateString('en-US', { weekday: 'long' })} · {sel.y}
                </span>
              </div>
              <button className="close" onClick={closeDay} aria-label="close">×</button>
            </div>
            <div className="meta">
              <span><b>{selCount}</b> conversations</span>
              <span><b>{convos.filter(c => c.tag === 'bf').length}</b> breakfast</span>
              <span><b>{convos.filter(c => c.tag === 'ln').length}</b> lunch</span>
              <span><b>{convos.filter(c => c.tag === 'dn').length}</b> dinner</span>
            </div>
            <div className="body">
              {convos.length === 0 && (
                <div className="empty">no conversation snippets in sample data for this date</div>
              )}
              {convos.map((c, i) => (
                <div key={i} className="convo-card" style={{ '--i': i }} onClick={() => navigate('/main')}>
                  <div className="top">
                    <span className="time">{c.time}</span>
                    <span className={`tag ${c.tag}`}>
                      {c.tag === 'bf' ? 'breakfast' : c.tag === 'ln' ? 'lunch' : 'dinner'}
                    </span>
                  </div>
                  <div className="title">{c.title}</div>
                  <div className="snippet">
                    <div className={`ln ${c.snippet}`}></div>
                    <div className="ln short"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hint">
              {selCount === 1 ? 'tap to jump straight to the conversation' : `${selCount} conversations · pick one to open`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
