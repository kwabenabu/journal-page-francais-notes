
import { createContext, useContext, useState } from "react";

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth page
    'auth.title': 'My Journal',
    'auth.loginSubtitle': 'Sign in to your journal',
    'auth.signupSubtitle': 'Create your account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.noAccount': "Don't have an account? Create one",
    'auth.hasAccount': 'Already have an account? Sign in',
    'auth.checkEmail': 'Check your email to confirm your registration!',
    'auth.emailInUse': 'This email is already in use. Try signing in.',
    'auth.invalidCredentials': 'Invalid email or password.',
    
    // Journal interface
    'journal.title': 'My Journal',
    'journal.welcome': 'Welcome',
    'journal.newEntry': 'New Entry',
    'journal.myEntries': 'My Entries',
    'journal.editEntry': 'Edit Entry',
    'journal.newEntryTitle': 'New Entry',
    'journal.savedAt': 'Saved at',
    'journal.save': 'Save',
    'journal.saving': 'Saving...',
    'journal.delete': 'Delete',
    'journal.noEntries': 'No entries yet. Create your first entry!',
    'journal.placeholder': 'Start writing your journal entry here...',
    'journal.instructions': 'Write in French or English. Highlight a word to see its translation.',
    'journal.characters': 'characters',
  },
  fr: {
    // Auth page
    'auth.title': 'Mon Journal',
    'auth.loginSubtitle': 'Connectez-vous à votre journal',
    'auth.signupSubtitle': 'Créez votre compte',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.emailPlaceholder': 'votre@email.com',
    'auth.passwordPlaceholder': '••••••••',
    'auth.signIn': 'Se connecter',
    'auth.signUp': "S'inscrire",
    'auth.noAccount': 'Pas de compte ? Créez-en un',
    'auth.hasAccount': 'Déjà un compte ? Connectez-vous',
    'auth.checkEmail': 'Vérifiez votre email pour confirmer votre inscription !',
    'auth.emailInUse': 'Cet email est déjà utilisé. Essayez de vous connecter.',
    'auth.invalidCredentials': 'Email ou mot de passe incorrect.',
    
    // Journal interface
    'journal.title': 'Mon Journal',
    'journal.welcome': 'Bienvenue',
    'journal.newEntry': 'Nouvelle entrée',
    'journal.myEntries': 'Mes entrées',
    'journal.editEntry': "Modifier l'entrée",
    'journal.newEntryTitle': 'Nouvelle entrée',
    'journal.savedAt': 'Sauvegardé à',
    'journal.save': 'Sauvegarder',
    'journal.saving': 'Sauvegarde...',
    'journal.delete': 'Supprimer',
    'journal.noEntries': 'Aucune entrée encore. Créez votre première entrée !',
    'journal.placeholder': 'Commencez à écrire votre entrée de journal ici...',
    'journal.instructions': 'Écrivez en français ou en anglais. Surlignez un mot pour voir sa traduction.',
    'journal.characters': 'caractères',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
