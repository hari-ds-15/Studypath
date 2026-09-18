import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BackgroundMesh from '../components/animations/BackgroundMesh';
import FloatingAiAssistant from '../components/common/FloatingAiAssistant';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#12100E] text-stone-900 dark:text-stone-100 flex relative overflow-x-hidden transition-colors duration-200">
      {/* Clean Ambient Background */}
      <BackgroundMesh />

      {/* Floating AI Assistant Widget (Available on all pages) */}
      <FloatingAiAssistant />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-200 z-10
          ${isCollapsed ? 'md:ml-[72px]' : 'md:ml-[250px]'}
        `}
      >
        <Navbar
          isCollapsed={isCollapsed}
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Generous top padding (pt-24 sm:pt-28) to prevent navbar from overlapping content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
