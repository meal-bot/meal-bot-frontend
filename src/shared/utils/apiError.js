const DEFAULT_MESSAGE = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';

export function getApiErrorMessage(error, fallback = DEFAULT_MESSAGE) {
  if (!error) return fallback;

  if (error.isNetworkError || !error.response) {
    return '서버에 연결하지 못했습니다. 네트워크 또는 서버 상태를 확인해 주세요.';
  }

  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  return fallback;
}

export function isAuthError(error) {
  return [401, 403].includes(error?.response?.status);
}
