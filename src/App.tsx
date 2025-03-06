import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initDB } from './lib/db';
import { isAuthenticated } from './lib/auth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import MachinesPage from './pages/MachinesPage';
import CollectionsPage from './pages/CollectionsPage';
import ExpensesPage from './pages/ExpensesPage';
import InstallationsPage from './pages/InstallationsPage';
import SparePartsPage from './pages/SparePartsPage';
import MaintenancePage from './pages/MaintenancePage';
import PaymentsPage from './pages/PaymentsPage';
import AnalysisPage from './pages/AnalysisPage';
import RoutesPage from './pages/RoutesPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import './index.css';

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initDB();
      setDbInitialized(true);
    };
    initialize();
  }, []);

  if (!dbInitialized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="machines" element={<MachinesPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="installations" element={<InstallationsPage />} />
          <Route path="spare-parts" element={<SparePartsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
