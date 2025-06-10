
import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  rightElement?: ReactNode;
}

const AppLayout = ({ children, title, rightElement }: AppLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">French Journal</span>
            <ThemeToggle />
            <Settings className="w-5 h-5 text-muted-foreground" />
            {user && (
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {rightElement}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
