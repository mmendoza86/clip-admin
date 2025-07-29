// pages/dashboard.tsx
import { useState } from 'react';
import ClientesSection from '../components/ClientesSection';
import DepositosSection from '../components/DepositosSection';
import PagosSection from '../components/PagosSection';
import Sidebar from '../components/layout/sidebar';
import ContentWrapper from '../components/layout/ContentWrapper';


const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('clientes');


  const renderContent = () => {
    switch (selectedSection) {
      case 'clientes':
        return <ClientesSection />;
      case 'depositos':
        return <DepositosSection />;
      case 'pagos':
        return <PagosSection />;
      default:
        return "Agregar componente para la sección " + selectedSection;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      
      <Sidebar
        onNavigate={(url) => {
          const route = url.split('/').pop();
          if (route) setSelectedSection(route);
        }}
        selectedSection={selectedSection}
        title="Admin CLIP"
      />


      {/* Main Content */}
      <ContentWrapper title={selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}>
        {renderContent()}
      </ContentWrapper>
    </div>
  );
};

export default Dashboard;
