import { useState } from 'react';
import FridgePanel from './FridgePanel';
import ChefPanel from './ChefPanel';
import ResultsPanel from './ResultsPanel';
import { scoreRecipes } from './data';
import Layout from '../../shared/components/layout/Layout';

export default function FridgePage({ loadingMs = 1800 }) {
  const [picked, setPicked] = useState([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('전체');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const togglePick = (id) => {
    setPicked(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      if (next.length === 0) setResults([]);
      return next;
    });
  };

  const handleRecommend = () => {
    setIsLoading(true);
    setResults([]);
    const ms = Math.max(300, loadingMs);
    setTimeout(() => {
      setResults(scoreRecipes(picked));
      setIsLoading(false);
    }, ms);
  };

  return (
    <Layout>
      <div className="fridge-page">
        <div className="board">
          <FridgePanel
            picked={picked}
            onPick={togglePick}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            search={search} setSearch={setSearch}
            cat={cat} setCat={setCat}
          />
          <div className="chef-col">
            <ChefPanel
              picked={picked}
              setPicked={setPicked}
              isDragging={isDragging}
              onRecommend={handleRecommend}
              isLoading={isLoading}
            />
            <ResultsPanel
              picked={picked}
              isLoading={isLoading}
              results={results}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
