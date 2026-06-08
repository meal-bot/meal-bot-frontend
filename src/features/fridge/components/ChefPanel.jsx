import { useState, useRef, useEffect, useMemo } from 'react';
import { INGREDIENTS } from '../data/fridgeData';

export default function ChefPanel({
  picked, setPicked,
  customIngredients, onRemoveCustom, onClearAll,
  isDragging, onRecommend, isLoading,
}) {
  const [armed, setArmed] = useState(false);
  const dragDepth = useRef(0);

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  const onDragEnter = (e) => {
    e.preventDefault();
    dragDepth.current += 1;
    setArmed(true);
  };
  const onDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setArmed(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id && !picked.includes(id)) {
      setPicked([...picked, id]);
    }
    dragDepth.current = 0;
    setArmed(false);
  };

  useEffect(() => {
    if (!isDragging) dragDepth.current = 0;
  }, [isDragging]);

  const activeArmed = isDragging && armed;

  const lookup = useMemo(() => {
    const m = {};
    INGREDIENTS.forEach(i => { m[i.id] = i; });
    return m;
  }, []);

  const removePreset = (id) => setPicked(picked.filter(p => p !== id));

  // preset + custom 합쳐서 총 개수 (UI 카운트/disabled 판단에 사용)
  const totalCount = picked.length + customIngredients.length;

  const chefLine = activeArmed
    ? '좋아요, 이 재료 받았습니다 — 놓으세요!'
    : totalCount === 0
      ? '안녕하세요. 냉장고에서 재료를 끌어 주세요. 멋진 한 끼를 제안해 드릴게요.'
      : `${totalCount}가지 재료로 무엇을 만들까 고민 중이에요. 더 추가하셔도 좋아요.`;

  return (
    <section className="chef">
      <div
        className={'chef-stage' + (activeArmed ? ' armed' : '')}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="chef-avatar">👩‍🍳</div>
        <div className="chef-name">Chef OBOB</div>
        <div className="chef-line">{chefLine}</div>
      </div>

      <div className="basket">
        <div className="basket-head">
          <span className="basket-label">선택한 재료</span>
          {totalCount > 0 ? (
            <span className="basket-actions">
              <span className="basket-count">{totalCount}</span>
              <button className="basket-clear" onClick={onClearAll}>모두 비우기</button>
            </span>
          ) : (
            <span className="basket-count is-empty">0</span>
          )}
        </div>
        <div className="tags">
          {totalCount === 0 ? (
            <span className="tag-empty">아직 비어 있어요</span>
          ) : (
            <>
              {picked.map(id => (
                <span className="tag" key={id}>
                  {lookup[id]?.glyph} {lookup[id]?.name}
                  <button className="tag-x" onClick={() => removePreset(id)} aria-label="제거">×</button>
                </span>
              ))}
              {customIngredients.map(name => (
                <span className="tag" key={`custom-${name}`}>
                  ✏️ {name}
                  <button className="tag-x" onClick={() => onRemoveCustom(name)} aria-label="제거">×</button>
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      <button
        className="recommend-btn"
        disabled={totalCount === 0 || isLoading}
        onClick={onRecommend}
      >
        {isLoading ? (
          <><span className="spin"></span> 셰프가 고민 중…</>
        ) : (
          <>✨ 추천받기 {totalCount > 0 && `· ${totalCount}개 재료`}</>
        )}
      </button>

      <div className="tip">
        <span className="tip-kbd">DRAG</span>
        재료를 셰프에게 끌어다 놓거나, 클릭해서 담아 보세요.
      </div>
    </section>
  );
}
