// Scalable client-side global state store placeholder
// Can be integrated with Zustand, Redux Toolkit, or React Context.

export interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

// Initial state placeholder
export const initialUIState: UIState = {
  sidebarOpen: false,
  setSidebarOpen: () => {},
  activeModal: null,
  setActiveModal: () => {},
};
