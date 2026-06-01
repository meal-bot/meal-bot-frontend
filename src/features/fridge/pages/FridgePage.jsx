import { useState, useEffect } from 'react';
import FridgePanel from '../components/FridgePanel';
import ChefPanel from '../components/ChefPanel';
import ResultsPanel from '../components/ResultsPanel';
import { INGREDIENTS } from '../data/fridgeData';
import { fetchFridgeRecommendation } from '../api/fridgeApi';
import Layout from '../../../shared/components/layout/Layout';

export default function FridgePage() {
  const [picked, setPicked] = useState([]);
  const [customIngredients, setCustomIngredients] = useState([]); // 사용자 직접 입력 재료 (예: ['에멘탈 치즈'])
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('전체');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // preset + custom 재료가 모두 비워지면 이전 추천 결과 자동 초기화
  useEffect(() => {
    if (picked.length === 0 && customIngredients.length === 0) {
      setResults([]);
      setMessageText('');
      setErrorMessage('');
    }
  }, [picked, customIngredients]);

  const togglePick = (id) => {
    setPicked(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const addCustomIngredient = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (customIngredients.includes(trimmed)) return; // 중복 방지
    setCustomIngredients(prev => [...prev, trimmed]);
  };

  const removeCustomIngredient = (name) => {
    setCustomIngredients(prev => prev.filter(n => n !== name));
  };

  const clearAllIngredients = () => {
    setPicked([]);
    setCustomIngredients([]);
  };

  // 추천 요청: preset 재료(ID)는 이름으로 변환, custom 재료는 그대로 분리해서 전송
  // Spring DTO 구조: ingredients(표준) / extras(추가) / count(받을 개수) 로 분리
  const handleRecommend = async () => {
    setIsLoading(true);
    setResults([]);
    setMessageText('');
    setErrorMessage('');

    const presetNames = picked.map(id => {
      const item = INGREDIENTS.find(i => i.id === id);
      return item?.name || id;
    });

    // missingIngredients 계산용 보유 재료 집합 (preset + custom, 공백 정규화 후 exact match)
    const providedSet = new Set(
      [...presetNames, ...customIngredients].map(n => n.trim())
    );

    try {
      const data = await fetchFridgeRecommendation(presetNames, customIngredients, 2);
      const recs = (data.recommendations || []).map(rec => ({
        ...rec,
        missingIngredients: (rec.mainIngredients || []).filter(
          ing => !providedSet.has(ing.trim())
        ),
      }));
      setResults(recs);
      setMessageText(data.message || '');
    } catch (error) {
      console.error('냉장고 추천 실패:', error);
      setResults([]);
      setMessageText('');
      setErrorMessage('추천 요청 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="fridge-page">
        <div className="board">
          <FridgePanel
            picked={picked}
            onPick={togglePick}
            onAddCustom={addCustomIngredient}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            search={search} setSearch={setSearch}
            cat={cat} setCat={setCat}
          />
          <div className="chef-col">
            <ChefPanel
              picked={picked}
              setPicked={setPicked}
              customIngredients={customIngredients}
              onRemoveCustom={removeCustomIngredient}
              onClearAll={clearAllIngredients}
              isDragging={isDragging}
              onRecommend={handleRecommend}
              isLoading={isLoading}
            />
            <ResultsPanel
              isLoading={isLoading}
              results={results}
              messageText={messageText}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
