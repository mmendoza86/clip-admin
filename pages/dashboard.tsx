// pages/dashboard.tsx
import { useState } from 'react';
import ClientesSection from '../components/ClientesSection';
import DepositosSection from '../components/DepositosSection';
import PagosSection from '../components/PagosSection';
import Sidebar from '../components/layout/sidebar';
import ContentWrapper from '../components/layout/ContentWrapper';
import HistorialSection from '../components/reportes/HistorialReportes';
import ConciliacionSection from '@/components/ConciliacionSection';
import { Menu } from 'lucide-react'; // o cualquier ícono

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('clientes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // móvil

  const handleNavigate = (url: string) => {
    const route = url.split('/').pop();
    if (route) {
      setSelectedSection(route);
      setIsSidebarOpen(false); // cerrar sidebar en móvil
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'clientes':
        return <ClientesSection />;
      case 'depositos':
        return <DepositosSection />;
      case 'transacciones':
        return <PagosSection />;
      case 'historial':
        return <HistorialSection />;
      case 'conciliaciones':
        return <ConciliacionSection />;
      default:
        return `Agregar componente para la sección ${selectedSection}`;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        onNavigate={handleNavigate}
        selectedSection={selectedSection}
        title="Admin CLIP"
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Botón menú hamburguesa solo en móviles */}
      <button
        className="absolute top-4 left-4 z-50 p-2 md:hidden bg-white rounded shadow"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="w-5 h-5 text-black" />
      </button>

      {/* Main content */}
      <div className="flex-1 ml-0">
        <ContentWrapper 
          title={selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}>
          {renderContent()}
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Dashboard;
