export const getToken = () => localStorage.getItem('token');
export const getName = () => localStorage.getItem('name');

export const setToken = (token) => localStorage.setItem('token', token);
export const setName = (name) => localStorage.setItem('name', name);

export const isLoggedIn = () => !!localStorage.getItem('token');

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
};

export const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
};

export const loginWithKakao = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
};

export const decodeJWT = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch {
    return null;
  }
};
