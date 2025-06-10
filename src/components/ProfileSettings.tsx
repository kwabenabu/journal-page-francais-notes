
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { profileService, UserProfile } from "../services/profileService";
import { useTheme } from "./ThemeProvider";
import { toast } from "sonner";
import ProfileLoadingState from "./profile/ProfileLoadingState";
import ProfileErrorState from "./profile/ProfileErrorState";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileForm from "./profile/ProfileForm";

const ProfileSettings = () => {
  const { t } = useLanguage();
  const { setTheme } = useTheme();
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

  // Sync theme with profile preference
  useEffect(() => {
    if (profile?.theme_preference) {
      const themeMapping = { auto: "system", light: "light", dark: "dark" } as const;
      setTheme(themeMapping[profile.theme_preference]);
    }
  }, [profile?.theme_preference, setTheme]);

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
    return <ProfileLoadingState />;
  }

  if (error && !profile) {
    return <ProfileErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen chrome-gradient">
      <div className="relative z-10 min-h-screen">
        <ProfileHeader />
        <ProfileForm
          profile={profile!}
          formData={formData}
          saving={saving}
          error={error}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
};

export default ProfileSettings;
