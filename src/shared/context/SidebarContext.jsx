import { useState } from 'react';
import { SidebarContext } from './sidebarContextValue';

// NOTE: 현재 사이드바는 MainPage에서만 사용 중.
// 만약 이 상태가 유지된다면 Context는 과도한 설계이므로,
// SidebarProvider/useSidebar를 제거하고 MainPage의 useState(false)로 대체할 것.
export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}
