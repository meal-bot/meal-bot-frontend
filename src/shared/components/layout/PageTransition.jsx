import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_ORDER = ['/main', '/fridge', '/calendar', '/inbody'];
let previousRouteIndex = null;

function getRouteIndex(pathname) {
  if (pathname === '/main') return 0;
  return ROUTE_ORDER.findIndex((route) => route !== '/main' && pathname.startsWith(route));
}

export default function PageTransition({ children }) {
  const location = useLocation();
  const currentIndex = getRouteIndex(location.pathname);

  const direction = useMemo(() => {
    if (currentIndex < 0 || previousRouteIndex == null || previousRouteIndex < 0) return 0;
    if (currentIndex === previousRouteIndex) return 0;
    return currentIndex > previousRouteIndex ? 1 : -1;
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex >= 0) previousRouteIndex = currentIndex;
  }, [currentIndex]);

  const directionClass =
    direction > 0
      ? 'page-shared-axis-forward'
      : direction < 0
        ? 'page-shared-axis-backward'
        : 'page-shared-axis-neutral';

  return (
    <div key={location.pathname} className={`page-shared-axis ${directionClass}`}>
      {children}
    </div>
  );
}
