import { useState, useEffect } from "react";
import { User, Save, Settings, AlertCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { profileService, UserProfile } from "../services/profileService";
import { toast } from "sonner";

const ProfileSettings = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    theme_preference: 'auto' as 'light' | 'dark' | 'auto',
    language_preference: 'en' as 'en' | 'fr',
    writing_goal: 300,
    notifications_enabled: true
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading profile...");
      
      const { data, error } = await profileService.getProfile();
      
      if (error) {
        console.error("Error loading profile:", error);
        setError("Failed to load profile settings. Please try refreshing the page.");
        toast.error("Failed to load profile settings");
      } else if (data) {
        console.log("Profile loaded successfully:", data);
        setProfile(data);
        setFormData({
          display_name: data.display_name || '',
          theme_preference: data.theme_preference || 'auto',
          language_preference: data.language_preference || 'en',
          writing_goal: data.writing_goal || 300,
          notifications_enabled: data.notifications_enabled !== false
        });
        
        // If we just created a profile, show a success message
        if (!profile) {
          toast.success("Profile created successfully!");
        }
      } else {
        console.warn("No profile data returned");
        setError("Profile not found. Please try refreshing the page.");
      }
    } catch (error) {
      console.error("Unexpected error loading profile:", error);
      setError("An unexpected error occurred while loading your profile.");
      toast.error("Failed to load profile settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) {
      toast.error("Profile not loaded. Please refresh and try again.");
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      console.log("Saving profile data:", formData);
      const { data, error } = await profileService.updateProfile(formData);
      
      if (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile settings. Please try again.");
        toast.error("Failed to update profile settings");
      } else if (data) {
        setProfile(data);
        toast.success("Profile settings updated successfully!");
        console.log("Profile updated successfully:", data);
      }
    } catch (error) {
      console.error("Unexpected error updating profile:", error);
      setError("An unexpected error occurred while saving your profile.");
      toast.error("Failed to update profile settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRetry = () => {
    loadProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen chrome-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen chrome-gradient flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen chrome-gradient">
      <div className="relative z-10 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center">
            <Settings className="w-8 h-8 text-amber-600 mr-3" />
            <h1 className="text-2xl font-serif font-bold text-gray-800">Profile Settings</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleRetry}
                  className="text-red-600 hover:text-red-800 underline mt-1 text-sm"
                >
                  Try refreshing the data
                </button>
              </div>
            </div>
          )}

          <div className="chrome-metallic rounded-lg p-8 shadow-lg">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Preference
                </label>
                <select
                  value={formData.theme_preference}
                  onChange={(e) => handleInputChange('theme_preference', e.target.value as 'light' | 'dark' | 'auto')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="auto">Auto</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language Preference
                </label>
                <select
                  value={formData.language_preference}
                  onChange={(e) => handleInputChange('language_preference', e.target.value as 'en' | 'fr')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Writing Goal (words)
                </label>
                <input
                  type="number"
                  value={formData.writing_goal}
                  onChange={(e) => handleInputChange('writing_goal', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="50"
                  max="2000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications_enabled}
                    onChange={(e) => handleInputChange('notifications_enabled', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Enable notifications for writing reminders
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
