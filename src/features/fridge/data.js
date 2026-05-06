// Ingredient + recipe data for FridgePage
export const INGREDIENTS = [
  // 채소
  { id: 'tomato',    name: '토마토',     glyph: '🍅', cat: '채소' },
  { id: 'lettuce',   name: '양상추',     glyph: '🥬', cat: '채소' },
  { id: 'onion',     name: '양파',       glyph: '🧅', cat: '채소' },
  { id: 'garlic',    name: '마늘',       glyph: '🧄', cat: '채소' },
  { id: 'carrot',    name: '당근',       glyph: '🥕', cat: '채소' },
  { id: 'potato',    name: '감자',       glyph: '🥔', cat: '채소' },
  { id: 'pepper',    name: '파프리카',   glyph: '🫑', cat: '채소' },
  { id: 'mushroom',  name: '버섯',       glyph: '🍄', cat: '채소' },
  { id: 'cucumber',  name: '오이',       glyph: '🥒', cat: '채소' },
  { id: 'avocado',   name: '아보카도',   glyph: '🥑', cat: '채소' },

  // 단백질
  { id: 'chicken',   name: '닭가슴살',   glyph: '🍗', cat: '단백질' },
  { id: 'beef',      name: '소고기',     glyph: '🥩', cat: '단백질' },
  { id: 'salmon',    name: '연어',       glyph: '🐟', cat: '단백질' },
  { id: 'shrimp',    name: '새우',       glyph: '🍤', cat: '단백질' },
  { id: 'egg',       name: '계란',       glyph: '🥚', cat: '단백질' },
  { id: 'tofu',      name: '두부',       glyph: '🧈', cat: '단백질' },

  // 유제품
  { id: 'milk',      name: '우유',       glyph: '🥛', cat: '유제품' },
  { id: 'cheese',    name: '치즈',       glyph: '🧀', cat: '유제품' },
  { id: 'butter',    name: '버터',       glyph: '🧈', cat: '유제품' },
  { id: 'yogurt',    name: '요거트',     glyph: '🥣', cat: '유제품' },

  // 곡물
  { id: 'rice',      name: '쌀',         glyph: '🍚', cat: '곡물' },
  { id: 'pasta',     name: '파스타',     glyph: '🍝', cat: '곡물' },
  { id: 'bread',     name: '식빵',       glyph: '🍞', cat: '곡물' },
  { id: 'noodle',    name: '면',         glyph: '🍜', cat: '곡물' },
  { id: 'oat',       name: '귀리',       glyph: '🌾', cat: '곡물' },

  // 기타
  { id: 'oliveoil',  name: '올리브유',   glyph: '🫒', cat: '기타' },
  { id: 'lemon',     name: '레몬',       glyph: '🍋', cat: '기타' },
  { id: 'chili',     name: '고추',       glyph: '🌶️', cat: '기타' },
  { id: 'basil',     name: '바질',       glyph: '🌿', cat: '기타' },
  { id: 'honey',     name: '꿀',         glyph: '🍯', cat: '기타' },
];

export const CATS = ['전체', '채소', '단백질', '유제품', '곡물', '기타'];

export const RECIPES = [
  { id: 'r1', name: '토마토 바질 파스타',     kicker: 'CLASSIC ITALIAN', img: 'pasta', time: 18, kcal: 480, level: '쉬움',
    needs: ['tomato', 'pasta'], extra: ['basil', 'oliveoil', 'garlic'] },
  { id: 'r2', name: '연어 아보카도 포케볼',   kicker: 'POWER BOWL',      img: 'bowl',  time: 15, kcal: 520, level: '쉬움',
    needs: ['salmon', 'avocado'], extra: ['rice', 'cucumber'] },
  { id: 'r3', name: '치킨 시저 샐러드',       kicker: 'LIGHT LUNCH',     img: 'salad', time: 20, kcal: 410, level: '쉬움',
    needs: ['chicken', 'lettuce'], extra: ['cheese', 'lemon'] },
  { id: 'r4', name: '계란 토마토 볶음',       kicker: 'HOME COMFORT',    img: 'bowl',  time: 10, kcal: 320, level: '아주 쉬움',
    needs: ['egg', 'tomato'], extra: ['onion'] },
  { id: 'r5', name: '버섯 크림 리조또',       kicker: 'COZY DINNER',     img: 'bowl',  time: 28, kcal: 580, level: '보통',
    needs: ['mushroom', 'rice'], extra: ['butter', 'cheese', 'garlic'] },
  { id: 'r6', name: '두부 야채 타코',         kicker: 'PLANT BASED',     img: 'taco',  time: 22, kcal: 390, level: '보통',
    needs: ['tofu'], extra: ['pepper', 'onion', 'avocado'] },
  { id: 'r7', name: '새우 마늘 알리오올리오', kicker: 'WEEKNIGHT',       img: 'pasta', time: 16, kcal: 510, level: '쉬움',
    needs: ['shrimp', 'pasta'], extra: ['garlic', 'oliveoil', 'chili'] },
  { id: 'r8', name: '감자 양파 수프',         kicker: 'SLOW WARMTH',     img: 'soup',  time: 35, kcal: 280, level: '보통',
    needs: ['potato', 'onion'], extra: ['butter', 'milk'] },
  { id: 'r9', name: '토마토 양상추 샐러드',   kicker: 'FRESH START',     img: 'salad', time: 8,  kcal: 180, level: '아주 쉬움',
    needs: ['tomato', 'lettuce'], extra: ['oliveoil', 'lemon'] },
];

export function scoreRecipes(picked) {
  const scored = RECIPES
    .map(r => {
      const need = r.needs.filter(n => picked.includes(n)).length;
      const extra = (r.extra || []).filter(n => picked.includes(n)).length;
      return { r, score: need * 10 + extra, need };
    })
    .filter(s => s.need > 0)
    .sort((a, b) => b.score - a.score);
  const top = scored.slice(0, scored.length >= 3 ? 3 : 2).map(s => s.r);
  if (top.length === 0) return RECIPES.slice(0, 2);
  return top;
}
