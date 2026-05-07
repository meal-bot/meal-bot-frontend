import { useContext } from 'react';
import { SidebarContext } from './sidebarContextValue';

export function useSidebar() {
  return useContext(SidebarContext);
}
