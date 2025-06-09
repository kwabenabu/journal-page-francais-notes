
import { useEffect, useState } from "react";

interface AccessibilityHelperProps {
  children: React.ReactNode;
}

const AccessibilityHelper = ({ children }: AccessibilityHelperProps) => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Global announcement function
  useEffect(() => {
    const announce = (message: string) => {
      setAnnouncements(prev => [...prev, message]);
      // Remove announcement after it's been read
      setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 1000);
    };

    // Make announce function globally available
    (window as any).announceToScreenReader = announce;

    return () => {
      delete (window as any).announceToScreenReader;
    };
  }, []);

  // Focus management for better keyboard navigation
  useEffect(() => {
    const handleRouteChange = () => {
      // Announce page changes
      const pageTitle = document.title;
      if (pageTitle && (window as any).announceToScreenReader) {
        (window as any).announceToScreenReader(`Navigated to ${pageTitle}`);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <>
      {children}
      
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      {/* Skip links for keyboard navigation */}
      <div className="sr-only focus:not-sr-only">
        <a 
          href="#main-content"
          className="absolute top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
      </div>
    </>
  );
};

export default AccessibilityHelper;
