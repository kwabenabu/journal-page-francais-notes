
import { User, Save, AlertCircle } from "lucide-react";
import { UserProfile } from "../../services/profileService";
import ProfileFormFields from "./ProfileFormFields";

interface FormData {
  display_name: string;
  theme_preference: 'light' | 'dark' | 'auto';
  language_preference: 'en' | 'fr';
  writing_goal: number;
  notifications_enabled: boolean;
}

interface ProfileFormProps {
  profile: UserProfile;
  formData: FormData;
  saving: boolean;
  error: string | null;
  onInputChange: (field: string, value: any) => void;
  onSave: () => void;
  onRetry: () => void;
}

const ProfileForm = ({ 
  profile, 
  formData, 
  saving, 
  error, 
  onInputChange, 
  onSave, 
  onRetry 
}: ProfileFormProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-destructive mr-3 flex-shrink-0" />
          <div>
            <p className="text-destructive">{error}</p>
            <button
              onClick={onRetry}
              className="text-destructive hover:text-destructive/80 underline mt-1 text-sm"
            >
              Try refreshing the data
            </button>
          </div>
        </div>
      )}

      <div className="chrome-metallic rounded-lg p-8 shadow-lg border border-border">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Personal Information</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        <ProfileFormFields formData={formData} onInputChange={onInputChange} />

        <div className="mt-8 flex justify-end">
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-muted disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
