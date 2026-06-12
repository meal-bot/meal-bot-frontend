export const USE_MOCKS =
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_MOCKS === 'true';

export const MOCK_SCENARIO = import.meta.env.VITE_MOCK_SCENARIO || 'success';

export function getMockScenario(group, fallback = 'success') {
  return group?.[MOCK_SCENARIO] ?? group?.[fallback];
}
