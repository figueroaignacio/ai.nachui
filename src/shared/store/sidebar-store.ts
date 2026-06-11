import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean; // For desktop
  isMobileOpen: boolean; // For mobile drawer
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isMobileOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setSidebarOpen: (open) => set({ isOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setMobileSidebarOpen: (open) => set({ isMobileOpen: open }),
}));
