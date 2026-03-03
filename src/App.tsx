import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HeroSection from './components/home/HeroSection';
import RatesSection from './components/home/RatesSection';
import FeaturesSection from './components/home/FeaturesSection';
import SecuritySection from './components/home/SecuritySection';
import FAQSection from './components/home/FAQSection';
import DashboardLayout from './layouts/DashboardLayout';
import ConnectPage from './pages/Connect';
import DashboardPage from './pages/Dashboard';
import RegisterPage from './pages/Register';
import RegisterSuccessPage from './pages/RegisterSuccess';
import QRPage from './pages/dashboard/QR';
import PayPage from './pages/dashboard/Pay';
import TransactionsPage from './pages/dashboard/Transactions';
import AnalyticsPage from './pages/dashboard/Analytics';
import SavingsPage from './pages/dashboard/Savings';
import LendingPage from './pages/dashboard/Lending';
import IdentityPage from './pages/dashboard/Identity';
import VoicePage from './pages/dashboard/Voice';
import Footer from './components/Footer';
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
      <div className="min-h-screen bg-primary text-primary transition-colors duration-300">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/success" element={<RegisterSuccessPage />} />
          <Route path="/pay" element={<PayPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="qr" element={<QRPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="savings" element={<SavingsPage />} />
            <Route path="lending" element={<LendingPage />} />
            <Route path="identity" element={<IdentityPage />} />
            <Route path="voice" element={<VoicePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar newestOnTop closeOnClick />
        {isHomePage && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;
