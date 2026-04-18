import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/lib/store";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AuthListener = () => {
  const { login, logout, setPage } = useAppStore();

  useEffect(() => {
    const hydrate = async (session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']) => {
      if (!session?.user) { logout(); return; }
      const meta = session.user.user_metadata;
      // Defer profile fetch to avoid deadlocks inside auth callback
      setTimeout(async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        login({
          name: profile?.display_name || meta?.full_name || meta?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (profile?.role as 'buyer' | 'seller') || 'buyer',
        });
      }, 0);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      hydrate(session);
      if (event === 'SIGNED_IN') setPage('dashboard');
    });

    supabase.auth.getSession().then(({ data: { session } }) => hydrate(session));

    return () => subscription.unsubscribe();
  }, [login, logout, setPage]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthListener />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
