import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AgeStore {
  isVerified: boolean;
  isModalOpen: boolean;
  pendingAction: (() => void) | null;
  verifyAge: () => void;
  declineAge: () => void;
  requireVerification: (action?: () => void) => void;
  closeModal: () => void;
}

export const useAgeStore = create<AgeStore>()(
  persist(
    (set) => ({
      isVerified: false,
      isModalOpen: false,
      pendingAction: null,
      verifyAge: () => {
        set((state) => {
          if (state.pendingAction) {
            setTimeout(() => {
              if (state.pendingAction) state.pendingAction();
            }, 0);
          }
          return { isVerified: true, isModalOpen: false, pendingAction: null };
        });
      },
      declineAge: () => set({ isModalOpen: false, pendingAction: null }),
      requireVerification: (action) => set((state) => {
        if (state.isVerified) {
          if (action) action();
          return state;
        }
        return { isModalOpen: true, pendingAction: action || null };
      }),
      closeModal: () => set({ isModalOpen: false, pendingAction: null }),
    }),
    {
      name: 'age-verification-storage',
      partialize: (state) => ({ isVerified: state.isVerified }),
    }
  )
);

