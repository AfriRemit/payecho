import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { DashboardSidebarProvider } from './contexts/DashboardSidebarContext';
import Header from './components/Header';
import HeroSection from './components/home/HeroSection';
import RatesSection from './components/home/RatesSection';
import FeaturesSection from './components/home/FeaturesSection';
import SecuritySection from './components/home/SecuritySection';
import FAQSection from './components/home/FAQSection';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/Dashboard';
import RegisterPage from './pages/Register';
import RegisterSuccessPage from './pages/RegisterSuccess';
import ProductsPage from './pages/Products';
import AboutPage from './pages/About';
import FeaturesPage from './pages/FeaturesPage';
import ContactPage from './pages/Contact';
import WhitepaperPage from './pages/resources/Whitepaper';
import SmartTokenPage from './pages/resources/SmartToken';
import BlockchainExplorerPage from './pages/resources/BlockchainExplorer';
import CryptoAPIPage from './pages/resources/CryptoAPI';
import InterestPage from './pages/resources/Interest';
import QRPage from './pages/dashboard/QR';
import PayPage from './pages/dashboard/Pay';
import ScanPage from './pages/Scan';
import TransactionsPage from './pages/dashboard/Transactions';
import AnalyticsPage from './pages/dashboard/Analytics';
import SavingsPage from './pages/dashboard/Savings';
import LendingPage from './pages/dashboard/Lending';
import IdentityPage from './pages/dashboard/Identity';
import VoicePage from './pages/dashboard/Voice';
import StakingPage from './pages/dashboard/Staking';
import ProfilePage from './pages/dashboard/Profile';
import Footer from './components/Footer';
import { PostLoginRedirect } from './components/PostLoginRedirect';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const Home = () => (
    <main>
      <HeroSection />
      <RatesSection />
      <FeaturesSection />
      <SecuritySection />
      <FAQSection />
    </main>
  );

  return (
    <ThemeProvider>
      <OnboardingProvider>
        <div className="payecho-app min-h-screen bg-primary text-primary transition-colors duration-300">
          <DashboardSidebarProvider>
            <PostLoginRedirect />
            <Header />
            <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/resources/whitepaper" element={<WhitepaperPage />} />
            <Route path="/resources/smart-token" element={<SmartTokenPage />} />
            <Route path="/resources/explorer" element={<BlockchainExplorerPage />} />
            <Route path="/resources/crypto-api" element={<CryptoAPIPage />} />
            <Route path="/resources/interest" element={<InterestPage />} />

            <Route path="/connect" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/success" element={<RegisterSuccessPage />} />
            <Route path="/pay" element={<PayPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/transactions" element={
              <div className="min-h-screen bg-primary">
                <main className="flex-1 pt-14 min-h-screen">
                  <div className="px-4 sm:px-6 pt-3 pb-6 md:pt-4 md:pb-8 max-w-6xl mx-auto">
                    <TransactionsPage />
                  </div>
                </main>
              </div>
            } />
            {/* Public community staking page: wallet connect only, no auth/onboarding required */}
            <Route
              path="/staking"
              element={
                <div className="min-h-screen bg-primary">
                  <main className="flex-1 pt-14 min-h-screen">
                    <div className="px-4 sm:px-6 pt-3 pb-6 md:pt-4 md:pb-8 max-w-6xl mx-auto">
                      <StakingPage />
                    </div>
                  </main>
                </div>
              }
            />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="qr" element={<QRPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="savings" element={<SavingsPage />} />
              <Route path="lending" element={<LendingPage />} />
              <Route path="identity" element={<IdentityPage />} />
              <Route path="voice" element={<VoicePage />} />
              <Route path="staking" element={<StakingPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={4000} hideProgressBar newestOnTop closeOnClick />
            {isHomePage && <Footer />}
          </DashboardSidebarProvider>
        </div>
      </OnboardingProvider>
    </ThemeProvider>
  );
}

export default App;
