import { create } from 'zustand';
import { User } from './types';

export interface CartItem {
  id: string;
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
  selectedSkill: { name: string; seller: string; price: number; initials: string; color: string } | null;
  selectedProduct: { title: string; seller: string; price: number; initials: string; color: string } | null;
  cart: CartItem[];
  setPage: (page: string) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  setUserRole: (role: 'buyer' | 'seller') => void;
  login: (user: User) => void;
  logout: () => void;
  selectSkillForPayment: (skill: { name: string; seller: string; price: number; initials: string; color: string }) => void;
  selectProductForPayment: (product: { title: string; seller: string; price: number; initials: string; color: string }) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  activePage: 'home',
  authMode: 'signup',
  userRole: 'buyer',
  selectedSkill: null,
  selectedProduct: null,
  cart: [],
  setPage: (page) => set({ activePage: page }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setUserRole: (role) => set({ userRole: role }),
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, activePage: 'home' }),
  selectSkillForPayment: (skill) => set({ selectedSkill: skill, selectedProduct: null, activePage: 'payment' }),
  selectProductForPayment: (product) => set({ selectedProduct: product, selectedSkill: null, activePage: 'payment' }),
  addToCart: (item) => set((state) => {
    if (state.cart.find(c => c.id === item.id)) return state;
    return { cart: [...state.cart, item] };
  }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(c => c.id !== id) })),
  clearCart: () => set({ cart: [] }),
}));
