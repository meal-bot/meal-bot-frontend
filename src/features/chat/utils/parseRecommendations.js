// 파이썬 서버 응답의 마크다운 테이블에서 상위 3개 레시피를 추출
// 추후 Python이 구조화 JSON을 반환하면 이 파일 전체 삭제 예정
export function parseRecommendations(text) {
  const results = [];
  // | rank | recipe_id | name | category | cooking_way | 형식 파싱
  const rowRegex = /\|\s*(\d+)\s*\|\s*\d+\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|/g;
  let match;
  while ((match = rowRegex.exec(text)) !== null) {
    const rank = parseInt(match[1]);
    if (rank >= 1 && rank <= 3) {
      results.push({
        rank,
        name: match[2].trim(),
        category: match[3].trim(),
        cookingWay: match[4].trim(),
      });
    }
  }
  return results.sort((a, b) => a.rank - b.rank);
}
