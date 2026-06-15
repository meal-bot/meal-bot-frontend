import { useMemo, useState } from 'react';
import { INGREDIENTS, CATS } from '../data/fridgeData';

export default function FridgePanel({
  picked, onPick, onAddCustom, onDragStart, onDragEnd,
  search, setSearch, cat, setCat,
}) {
  // 직접 입력 카드 상태: false면 "+" 카드, true면 입력 필드
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputValue.trim();
      if (value) onAddCustom(value);
      setInputValue('');
      setIsAdding(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInputValue('');
      setIsAdding(false);
    }
  };
  const filtered = useMemo(() => {
    return INGREDIENTS.filter(i => {
      if (cat !== '전체' && i.cat !== cat) return false;
      if (search && !i.name.includes(search)) return false;
      return true;
    });
  }, [search, cat]);

  const grouped = useMemo(() => {
    if (cat !== '전체') return [{ label: cat, items: filtered }];
    const order = ['채소', '단백질', '유제품', '곡물', '기타'];
    return order
      .map(c => ({ label: c, items: filtered.filter(i => i.cat === c) }))
      .filter(g => g.items.length);
  }, [filtered, cat]);

  const counts = useMemo(() => {
    const out = { 전체: INGREDIENTS.length };
    INGREDIENTS.forEach(i => { out[i.cat] = (out[i.cat] || 0) + 1; });
    return out;
  }, []);

  return (
    <section className="fridge">
      <div className="panel-head">
        <div className="panel-title">
          <span className="panel-title-num">01</span>
          냉장고 속 재료
        </div>
        <div className="search-wrap">
          <span className="material-symbols-outlined search-icon" aria-hidden="true">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="재료 검색…  예) 토마토, 닭가슴살"
          />
        </div>
      </div>

      <div className="cat-row">
        {CATS.map(c => (
          <button
            type="button"
            key={c}
            className={'cat' + (cat === c ? ' active' : '')}
            onClick={() => setCat(c)}
          >
            {c}<span className="count">{counts[c]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">검색 결과가 없어요. 다른 키워드를 시도해 보세요.</div>
      ) : (
        grouped.map(g => (
          <div className="shelf" key={g.label}>
            <div className="shelf-label">{g.label}</div>
            <div className="ingredients">
              {g.items.map(i => {
                const isPicked = picked.includes(i.id);
                return (
                  <div
                    key={i.id}
                    className={'ing' + (isPicked ? ' picked' : '')}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', i.id);
                      e.dataTransfer.effectAllowed = 'copy';
                      onDragStart(i.id);
                    }}
                    onDragEnd={onDragEnd}
                    onClick={() => onPick(i.id)}
                    title={isPicked ? '바구니에서 빼기' : '클릭 또는 드래그해서 추가'}
                  >
                    <span className="ing-check">✓</span>
                    <div className="ing-glyph">{i.glyph}</div>
                    <div className="ing-name">{i.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* 직접 입력 카드: 카테고리/검색 필터 무관하게 항상 표시 */}
      <div className="shelf">
        <div className="shelf-label">직접 추가</div>
        <div className="ingredients">
          {isAdding ? (
            <div className="ing custom-ing editing">
              <div className="ing-glyph">
                <span className="material-symbols-outlined" aria-hidden="true">add</span>
              </div>
              <input
                className="custom-ing-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="재료 이름"
                autoFocus
              />
            </div>
          ) : (
            <div
              className="ing custom-ing"
              onClick={() => setIsAdding(true)}
              title="없는 재료를 직접 입력해서 추가"
            >
              <div className="ing-glyph">
                <span className="material-symbols-outlined" aria-hidden="true">add</span>
              </div>
              <div className="ing-name">직접 입력</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
