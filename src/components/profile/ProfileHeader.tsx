
import { Settings } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

const ProfileHeader = () => {
  return (
    <header className="bg-background border-b border-border px-6 py-4 sticky top-0 z-20 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="w-8 h-8 text-amber-600 mr-3" />
          <h1 className="text-2xl font-serif font-bold text-foreground">Profile Settings</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default ProfileHeader;
