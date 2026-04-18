import { create } from 'zustand';
import { User } from './types';

export interface CartItem {
  id: string; // listing id
  name: string;
  seller: string;
  price: number;
  initials: string;
  color: string;
  type: 'skill' | 'product';
}

interface AppState {
  currentUser: User | null;
  activePage: string;
  authMode: 'login' | 'signup';
  userRole: 'buyer' | 'seller';
  cart: CartItem[];
  setPage: (page: string) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  setUserRole: (role: 'buyer' | 'seller') => void;
  login: (user: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  activePage: 'home',
  authMode: 'signup',
  userRole: 'buyer',
  cart: [],
  setPage: (page) => set({ activePage: page }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setUserRole: (role) => set({ userRole: role }),
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, activePage: 'home', cart: [] }),
  addToCart: (item) => set((state) => {
    if (state.cart.find(c => c.id === item.id)) return state;
    return { cart: [...state.cart, item] };
  }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(c => c.id !== id) })),
  clearCart: () => set({ cart: [] }),
}));
