
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { profileService, UserProfile } from "../services/profileService";
import { useTheme } from "./ThemeProvider";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { User } from "lucide-react";

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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={loadProfile} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <Card>
        <CardContent className="p-8">
          {/* Personal Information Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">kwabspam@gmail.com</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="Enter your display name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="theme">Theme Preference</Label>
                <Select 
                  value={formData.theme_preference} 
                  onValueChange={(value) => handleInputChange('theme_preference', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language Preference</Label>
                <Select 
                  value={formData.language_preference} 
                  onValueChange={(value) => handleInputChange('language_preference', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="writing_goal">Daily Writing Goal (words)</Label>
                <Select 
                  value={formData.writing_goal.toString()} 
                  onValueChange={(value) => handleInputChange('writing_goal', parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable notifications for writing reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Get daily reminders to maintain your writing streak
                </p>
              </div>
              <Switch
                checked={formData.notifications_enabled}
                onCheckedChange={(checked) => handleInputChange('notifications_enabled', checked)}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
