
import { Home, Settings, HelpCircle, BookOpen, X, Book } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/use-mobile";

interface AppSidebarProps {
  onClose?: () => void;
}

const AppSidebar = ({ onClose }: AppSidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigation = [
    {
      name: "Journal",
      href: "/",
      icon: BookOpen,
      current: location.pathname === "/"
    },
    {
      name: "Vocabulary",
      href: "/vocabulary",
      icon: Book,
      current: location.pathname === "/vocabulary"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings"
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
      current: location.pathname === "/help"
    }
  ];

  const handleNavClick = () => {
    if (onClose && isMobile) {
      onClose();
    }
  };

  return (
    <div className="w-64 sm:w-72 lg:w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 h-screen flex flex-col shadow-xl">
      {/* Mobile-optimized Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              French Journal
            </span>
          </div>
          
          {/* Mobile close button */}
          {onClose && isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Your French learning companion
        </p>
      </div>

      {/* Mobile-optimized Navigation */}
      <nav className="flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 touch-manipulation",
                "hover:scale-105 active:scale-95",
                item.current
                  ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-200/50 shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile-friendly Footer */}
      <div className="p-4 sm:p-6 border-t border-gray-200/50 bg-gray-50/50">
        <div className="text-xs sm:text-sm text-gray-500 text-center">
          Practice French daily 🇫🇷
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
