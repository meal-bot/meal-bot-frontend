import { useRef, useState, useCallback, useEffect } from 'react';

// 슬라이더 좌우 스크롤 상태 및 이벤트 관리 훅
export function useSlider() {
  const sliderRef = useRef(null);           // 슬라이더 DOM 요소 참조
  const [canScrollLeft, setCanScrollLeft] = useState(false);   // 왼쪽 화살표 버튼 활성화 여부
  const [canScrollRight, setCanScrollRight] = useState(true);  // 오른쪽 화살표 버튼 활성화 여부

  // 현재 스크롤 위치를 기반으로 좌우 버튼 활성화 상태 갱신
  const updateButtons = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    // 왼쪽으로 5px 이상 스크롤됐으면 왼쪽 버튼 활성화
    setCanScrollLeft(el.scrollLeft > 5);
    // 오른쪽 끝에 도달하지 않았으면 오른쪽 버튼 활성화
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  // 슬라이더 스크롤 이벤트 및 창 리사이즈 이벤트 등록 (언마운트 시 정리)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons(); // 초기 상태 한 번 체크
    return () => {
      el.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, [updateButtons]);

  return { sliderRef, canScrollLeft, canScrollRight };
}
