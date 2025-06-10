
import { AlertCircle } from "lucide-react";

interface ProfileErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ProfileErrorState = ({ error, onRetry }: ProfileErrorStateProps) => {
  return (
    <div className="min-h-screen chrome-gradient flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg text-center border border-border">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-card-foreground mb-2">Unable to Load Profile</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ProfileErrorState;
