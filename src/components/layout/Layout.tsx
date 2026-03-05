// src/components/layout/Layout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { HelpModal } from './HelpModal';
import { useState, useEffect } from 'react';

export function Layout() {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Map routes to view IDs for the Header
  const getViewId = (pathname: string): string => {
    const path = pathname.split('/')[1] || 'dashboard';
    return path || 'dashboard';
  };

  const activeView = getViewId(location.pathname);

  // Imagen de fondo local
  const bgImage = '/fondo/florian-wehde-iVW7mZPwd4g-unsplash.jpg';

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden bg-black">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Dark Overlay to make text readable */}
      <div className="absolute inset-0 z-0 bg-black/60" />

      {/* Mobile Sidebar Overlay */}
      <div
        className={`mobile-sidebar-overlay md:hidden ${isMobileSidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      />

      {/* Main Content */}
      <div className="relative z-10 flex w-full h-screen">
        <Sidebar
          activeView={activeView}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={toggleSidebar}
        />
        <div className="flex-1 flex flex-col relative h-full w-full">
          <div className="ml-0 md:ml-64 flex flex-col flex-1 h-full relative">
            <Header onMenuClick={toggleSidebar} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      {/* Help Modal Button */}
      <HelpModal />
    </div>
  );
}