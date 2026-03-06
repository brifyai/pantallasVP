import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { BrandIntelligence } from './pages/BrandIntelligence';
import { ScreenPerformance } from './pages/ScreenPerformance';
import { GeoIntelligence } from './pages/GeoIntelligence';
import { SalesIntelligence } from './pages/SalesIntelligence';
import { TimeMachine } from './pages/TimeMachine';
import { Settings } from './pages/Settings';
import { Team } from './pages/Team';
import { Insights } from './pages/Insights';
import { AdminMarcas } from './pages/AdminMarcas';
import { AdminVendedores } from './pages/AdminVendedores';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="brand" element={<BrandIntelligence />} />
          <Route path="screen" element={<ScreenPerformance />} />
          <Route path="geo" element={<GeoIntelligence />} />
          <Route path="sales" element={<SalesIntelligence />} />
          <Route path="time" element={<TimeMachine />} />
          <Route path="team" element={<Team />} />
          <Route path="insights" element={<Insights />} />
          <Route path="admin/marcas" element={<AdminMarcas />} />
          <Route path="admin/vendedores" element={<AdminVendedores />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
