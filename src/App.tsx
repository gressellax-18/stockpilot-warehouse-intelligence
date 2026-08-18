import React from 'react';
import { WarehouseProvider, useWarehouse } from './context/WarehouseContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenter } from './components/CommandCenter';
import { OrdersView } from './components/OrdersView';
import { InventoryView } from './components/InventoryView';
import { PickingView } from './components/PickingView';
import { PackingAndQCView } from './components/PackingAndQCView';
import { ExceptionsView } from './components/ExceptionsView';
import { ShipmentsView } from './components/ShipmentsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SimulatorView } from './components/SimulatorView';
import { CustomerFeedbackView } from './components/CustomerFeedbackView';
import { WarehouseMapView } from './components/WarehouseMapView';
import { DecisionLogView } from './components/DecisionLogView';
import { OrderDetailDrawer } from './components/OrderDetailDrawer';
import { NewOrderModal } from './components/NewOrderModal';
import { PilotAiDrawer } from './components/PilotAiDrawer';
import { DemoController } from './components/DemoController';

const MainContent: React.FC = () => {
  const { currentView, presentationMode } = useWarehouse();

  const renderView = () => {
    switch (currentView) {
      case 'command_center':
        return <CommandCenter />;
      case 'orders':
        return <OrdersView />;
      case 'inventory':
        return <InventoryView />;
      case 'picking':
        return <PickingView />;
      case 'packing':
        return <PackingAndQCView />;
      case 'exceptions':
        return <ExceptionsView />;
      case 'shipments':
        return <ShipmentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'simulator':
        return <SimulatorView />;
      case 'feedback':
        return <CustomerFeedbackView />;
      case 'map':
        return <WarehouseMapView />;
      case 'decision_log':
        return <DecisionLogView />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F5EF] text-[#202923] font-sans antialiased">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Viewport */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all ${
            presentationMode ? 'max-w-7xl mx-auto w-full' : ''
          }`}
        >
          {renderView()}
        </main>
      </div>

      {/* Global Drawers & Modals */}
      <OrderDetailDrawer />
      <NewOrderModal />
      <PilotAiDrawer />
      <DemoController />
    </div>
  );
};

export default function App() {
  return (
    <WarehouseProvider>
      <MainContent />
    </WarehouseProvider>
  );
}
