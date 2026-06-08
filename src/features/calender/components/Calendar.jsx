import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../../shared/components/ui';
import { cn } from '../../../shared/utils/cn.js';
import {
  MONTH_NAMES, DOW_SUN, buildMonthGrid, isoDate, isToday, isFuture, TODAY
} from '../style/sampleData.js';
import { fetchCalendarMonthData, fetchCalendarDateData, getMealTag, formatTime } from '../api/calendarApi.js';

const TAG_LABEL = { bf: '아침', ln: '점심', dn: '저녁' };

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
        <span className="swipe-hint">
          <span className="glyph">↔</span>
          <span>스와이프 또는 ← → 키</span>
        </span>
      </div>
      <div className="month-nav">
        <IconButton
          icon="chevron_left"
          label="이전 달"
          size="iconSm"
          className="month-btn"
          onClick={onPrev}
        />
        <IconButton
          icon="chevron_right"
          label="다음 달"
          size="iconSm"
          className="month-btn"
          onClick={onNext}
        />
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
  const [chatsByDate, setChatsByDate] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoading = !isLoaded;
  const [selectedDateChats, setSelectedDateChats] = useState([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    fetchCalendarMonthData()
      .then(data => {
        setChatsByDate(data);
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  const animClass = anim
    ? (dir > 0 ? 'cal-page-anim-slide-out-left' : 'cal-page-anim-slide-out-right')
    : (dir > 0 ? 'cal-page-anim-slide-in-right' : dir < 0 ? 'cal-page-anim-slide-in-left' : '');

  const openDay = (c) => {
    setClosing(false);
    setSel({ y: c.y, m: c.m, d: c.d });
    setSelectedDateChats([]);
    setIsDetailLoading(true);
    fetchCalendarDateData(isoDate(c.y, c.m, c.d))
      .then(data => setSelectedDateChats(data))
      .catch(() => setSelectedDateChats([]))
      .finally(() => setIsDetailLoading(false));
  };
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

  const chatsForSelectedDate = selectedDateChats;
  const selCount = chatsForSelectedDate.length;

  return (
    <div className="ab">
      <MonthHeader y={y} m={m} onPrev={() => go(-1)} onNext={() => go(1)} />

      {isLoading ? (
        <div className="calendar-loading">
          불러오는 중...
        </div>
      ) : (
        <div className={`cal-page ${animClass}`} key={`${y}-${m}-${dir}-${anim}`}>
          <DowRow />
          <div className="cal-grid">
            {cells.map((c, i) => {
              const count = (chatsByDate[isoDate(c.y, c.m, c.d)] || []).length;
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
      )}

      {sel && (
        <>
          <div className={`detail-backdrop ${closing ? 'closing' : ''}`} onClick={closeDay} />
          <div className={`detail-overlay ${closing ? 'closing' : ''}`}>
            <div className="head">
              <div className="ttl">
                {MONTH_NAMES[sel.m - 1]} {sel.d}
                <span className="day">
                  {new Date(sel.y, sel.m - 1, sel.d).toLocaleDateString('ko-KR', { weekday: 'long' })} · {sel.y}
                </span>
              </div>
              <IconButton
                icon="close"
                label="닫기"
                size="iconSm"
                className="close"
                onClick={closeDay}
              />
            </div>
            <div className="meta">
              <span><b>{selCount}</b> 대화</span>
              <span><b>{chatsForSelectedDate.filter(chat => getMealTag(chat.createdAt) === 'bf').length}</b> 아침</span>
              <span><b>{chatsForSelectedDate.filter(chat => getMealTag(chat.createdAt) === 'ln').length}</b> 점심</span>
              <span><b>{chatsForSelectedDate.filter(chat => getMealTag(chat.createdAt) === 'dn').length}</b> 저녁</span>
            </div>
            <div className="body">
              {isDetailLoading && (
                <div className="empty">불러오는 중...</div>
              )}
              {!isDetailLoading && chatsForSelectedDate.length === 0 && (
                <div className="empty">대화 기록이 없습니다</div>
              )}
              {!isDetailLoading && chatsForSelectedDate.map((chat, i) => {
                const tag = getMealTag(chat.createdAt);
                return (
                  <div
                    key={chat.chatId}
                    className="convo-card"
                    style={{ '--i': i }}
                    onClick={() => navigate('/main', { state: { chatIdToOpen: chat.chatId } })}
                  >
                    <div className="top">
                      <span className="time">{formatTime(chat.createdAt)}</span>
                      {tag && <span className={`tag ${tag}`}>{TAG_LABEL[tag]}</span>}
                    </div>
                    <div className="title">{chat.title || '제목 없음'}</div>
                    {chat.recommendations?.length > 0 && (
                      <div className="preview">{chat.recommendations.join(', ')}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="hint">
              {selCount === 1 ? '탭하여 대화로 이동' : `${selCount}개 대화 · 선택하여 열기`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
