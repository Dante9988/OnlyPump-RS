import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import { WaitlistModalProvider } from "@/contexts/WaitlistModalContext";
import { SolanaWalletProvider } from "@/contexts/WalletProvider";
import { OnlypumpAuthProvider } from "@/contexts/OnlypumpAuthContext";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import WaitlistModal from "@/components/waitlist/WaitlistModal";
import Index from "./pages/Index";
// import Auth from "./pages/Auth"; // OLD: Supabase auth removed
import Explore from "./pages/Explore";
import ForCreators from "./pages/ForCreators";
import ForFans from "./pages/ForFans";
import Live from "./pages/Live";
import Dashboard from "./pages/Dashboard";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorPortfolio from "./pages/CreatorPortfolio";
import CreatorClubs from "./pages/CreatorClubs";
import ClubDetail from "./pages/ClubDetail";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Risk from "./pages/Risk";
import NotFound from "./pages/NotFound";
// OLD presale system (Supabase-based) - commented out:
// import Talents from "./pages/Talents";
// import TalentSignup from "./pages/TalentSignup";
// import TalentDashboard from "./pages/TalentDashboard";
// import TalentDetail from "./pages/TalentDetail";
// import PresaleCreate from "./pages/PresaleCreate";
// import LaunchServices from "./pages/LaunchServices";
import PhantomGuide from "./pages/PhantomGuide";
import BogdanProfile from "./pages/BogdanProfile";
import TransactionsDemo from "./pages/TransactionsDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolanaWalletProvider>
      <OnlypumpAuthProvider>
        <UserRoleProvider>
          <TooltipProvider>
            <WaitlistModalProvider>
              <Toaster />
              <Sonner />
              <WaitlistModal />
              <BrowserRouter>
                <div className="min-h-screen bg-gradient-dark">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* <Route path="/auth" element={<Auth />} /> */} {/* OLD: Supabase auth */}
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/for-creators" element={<ForCreators />} />
                    <Route path="/for-fans" element={<ForFans />} />
                    <Route path="/live" element={<Live />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clubs" element={<CreatorClubs />} />
                    <Route path="/club/:clubId" element={<ClubDetail />} />
                    <Route path="/creator/:handle" element={<CreatorProfile />} />
                    <Route path="/creator/:slug/portfolio" element={<CreatorPortfolio />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/risk" element={<Risk />} />
                    {/* OLD presale system (Supabase) - commented out: */}
                    {/* <Route path="/talents" element={<Talents />} /> */}
                    {/* <Route path="/talent/signup" element={<TalentSignup />} /> */}
                    {/* <Route path="/talent/create-presale" element={<PresaleCreate />} /> */}
                    {/* <Route path="/talent/dashboard" element={<TalentDashboard />} /> */}
                    {/* <Route path="/talent/:handle" element={<TalentDetail />} /> */}
                    <Route path="/phantom-guide" element={<PhantomGuide />} />
                    <Route path="/bogdan" element={<BogdanProfile />} />
                    <Route path="/transactions-demo" element={<TransactionsDemo />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </WaitlistModalProvider>
          </TooltipProvider>
        </UserRoleProvider>
      </OnlypumpAuthProvider>
    </SolanaWalletProvider>
  </QueryClientProvider>
);

export default App;
