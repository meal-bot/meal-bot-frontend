import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../shared/utils/cn.js';
import {
  MONTH_NAMES, DOW_SUN, buildMonthGrid, isoDate, isToday, isFuture, getCount, SAMPLE_CONVOS, TODAY
} from '../style/sampleData.js';

const TAG_LABEL = { bf: 'breakfast', ln: 'lunch', dn: 'dinner' };

function useMonth() {
  const [y, setY] = useState(TODAY.y);
  const [m, setM] = useState(TODAY.m);
  const [dir, setDir] = useState(0);
  const [anim, setAnim] = useState(false);
  const t1 = useRef(null);
  const t2 = useRef(null);

  const go = useCallback((delta) => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    setDir(delta);
    setAnim(true);
    t1.current = setTimeout(() => {
      setM(prev => {
        const next = prev + delta;
        if (next > 12) { setY(y => y + 1); return 1; }
        if (next < 1)  { setY(y => y - 1); return 12; }
        return next;
      });
      t2.current = setTimeout(() => setAnim(false), 320);
    }, 200);
  }, []);

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
  const { y, m, dir, anim, go } = useMonth();
  const cells = useMemo(() => buildMonthGrid(y, m, 0), [y, m]);
  const [sel, setSel] = useState(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);

  const animClass = anim
    ? (dir > 0 ? 'cal-page-anim-slide-out-left' : 'cal-page-anim-slide-out-right')
    : (dir > 0 ? 'cal-page-anim-slide-in-right' : dir < 0 ? 'cal-page-anim-slide-in-left' : '');

  const openDay = (c) => { setClosing(false); setSel({ y: c.y, m: c.m, d: c.d }); };
  const closeDay = () => {
    clearTimeout(closeTimer.current);
    setClosing(true);
    closeTimer.current = setTimeout(() => { setSel(null); setClosing(false); }, 240);
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if (sel) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, go]);

  const convos = sel ? (SAMPLE_CONVOS[isoDate(sel.y, sel.m, sel.d)] || []) : [];
  const selCount = convos.length;

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
            const active = !c.outside && count > 0 && !future;
            return (
              <div
                key={i}
                className={cn('cal-cell', c.outside && 'outside', today && 'today', active && 'active', inactive && 'inactive')}
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
                <div key={`${c.time}-${i}`} className="convo-card" style={{ '--i': i }} onClick={() => navigate('/main')}>
                  <div className="top">
                    <span className="time">{c.time}</span>
                    <span className={`tag ${c.tag}`}>{TAG_LABEL[c.tag]}</span>
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
