
interface FormData {
  display_name: string;
  theme_preference: 'light' | 'dark' | 'auto';
  language_preference: 'en' | 'fr';
  writing_goal: number;
  notifications_enabled: boolean;
}

interface ProfileFormFieldsProps {
  formData: FormData;
  onInputChange: (field: string, value: any) => void;
}

const ProfileFormFields = ({ formData, onInputChange }: ProfileFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={formData.display_name}
          onChange={(e) => onInputChange('display_name', e.target.value)}
          className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Your display name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">
          Theme Preference
        </label>
        <select
          value={formData.theme_preference}
          onChange={(e) => onInputChange('theme_preference', e.target.value as 'light' | 'dark' | 'auto')}
          className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">
          Language Preference
        </label>
        <select
          value={formData.language_preference}
          onChange={(e) => onInputChange('language_preference', e.target.value as 'en' | 'fr')}
          className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-2">
          Daily Writing Goal (words)
        </label>
        <input
          type="number"
          value={formData.writing_goal}
          onChange={(e) => onInputChange('writing_goal', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          min="50"
          max="2000"
        />
      </div>

      <div className="md:col-span-2">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.notifications_enabled}
            onChange={(e) => onInputChange('notifications_enabled', e.target.checked)}
            className="w-5 h-5 text-amber-600 border-input rounded focus:ring-amber-500 bg-background"
          />
          <span className="text-sm font-medium text-card-foreground">
            Enable notifications for writing reminders
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProfileFormFields;
