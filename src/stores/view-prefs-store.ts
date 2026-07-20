"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safe-storage";

/**
 * Preferências de VISUALIZAÇÃO do usuário, persistidas no navegador. Ex.: o
 * toggle "mostrar concluídos" precisa sobreviver a navegar e voltar — antes era
 * useState local e resetava toda vez. Por padrão esconde concluídos (menos
 * poluição); o usuário liga e a escolha fica salva.
 */
interface ViewPrefsStore {
  showDoneModules: boolean;
  showDoneTasks: boolean;
  showDoneProjects: boolean;
  setShowDoneModules: (v: boolean) => void;
  setShowDoneTasks: (v: boolean) => void;
  setShowDoneProjects: (v: boolean) => void;
}

export const useViewPrefs = create<ViewPrefsStore>()(
  persist(
    (set) => ({
      showDoneModules: false,
      showDoneTasks: false,
      showDoneProjects: false,
      setShowDoneModules: (v) => set({ showDoneModules: v }),
      setShowDoneTasks: (v) => set({ showDoneTasks: v }),
      setShowDoneProjects: (v) => set({ showDoneProjects: v }),
    }),
    { name: "devflow-view-prefs", storage: createJSONStorage(() => safeLocalStorage) },
  ),
);
