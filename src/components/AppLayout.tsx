
import { ReactNode, useState } from "react";
import { Settings, Menu, X } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  rightElement?: ReactNode;
}

const AppLayout = ({ children, title, rightElement }: AppLayoutProps) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex w-full">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:transform-none
      `}>
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Mobile-First Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden touch-manipulation"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Mobile-optimized right element */}
            {rightElement && (
              <div className="flex items-center">
                {rightElement}
              </div>
            )}
            
            {/* Desktop-only app name */}
            <span className="text-sm text-gray-600 hidden xl:block">French Journal</span>
            
            <ThemeToggle />
            
            {/* Mobile-friendly settings icon */}
            <Button variant="ghost" size="sm" className="p-2 touch-manipulation">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
            
            {user && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Main Content with mobile padding */}
        <main className="flex-1 overflow-auto w-full">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
