
import { useState } from "react";
import { HelpCircle, BookOpen, Lightbulb, Key, Users, MessageCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const HelpTutorial = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('getting-started');

  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'features', label: 'Features', icon: Lightbulb },
    { id: 'shortcuts', label: 'Shortcuts', icon: Key },
    { id: 'tips', label: 'Writing Tips', icon: Users },
    { id: 'faq', label: 'FAQ', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen chrome-gradient">
      <div className="relative z-10 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center">
            <HelpCircle className="w-8 h-8 text-amber-600 mr-3" />
            <h1 className="text-2xl font-serif font-bold text-gray-800">Help & Tutorial</h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="chrome-metallic rounded-lg p-4 shadow-lg">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="chrome-metallic rounded-lg p-8 shadow-lg">
                {activeTab === 'getting-started' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Getting Started</h2>
                    <div className="space-y-6">
                      <div className="border-l-4 border-amber-500 pl-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Welcome to French Journal!</h3>
                        <p className="text-gray-600 mb-4">
                          This application is designed to help you practice and improve your French writing skills. 
                          Here's how to get started:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                          <li>Create your first journal entry by clicking "New Entry"</li>
                          <li>Write in French or mix French and English as you learn</li>
                          <li>Select any text to get instant translations</li>
                          <li>Use the French review feature to get feedback on your writing</li>
                          <li>Track your progress in the Dashboard</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Features Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Real-time Translation</h3>
                        <p className="text-gray-600">
                          Select any word or phrase to get instant translations between French and English. 
                          Double-click for quick selection.
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">French Review</h3>
                        <p className="text-gray-600">
                          Get AI-powered feedback on your French writing, including grammar corrections 
                          and accuracy scores.
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress Tracking</h3>
                        <p className="text-gray-600">
                          Monitor your writing streak, word count, and accuracy improvements 
                          in the Dashboard.
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Auto-save</h3>
                        <p className="text-gray-600">
                          Your entries are automatically saved as you type, so you never 
                          lose your progress.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shortcuts' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Keyboard Shortcuts</h2>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Translate selected text</span>
                          <kbd className="px-3 py-1 bg-gray-100 rounded text-sm font-mono border">Ctrl + T</kbd>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Save current entry</span>
                          <kbd className="px-3 py-1 bg-gray-100 rounded text-sm font-mono border">Ctrl + S</kbd>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Create new entry</span>
                          <kbd className="px-3 py-1 bg-gray-100 rounded text-sm font-mono border">Ctrl + N</kbd>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Quick word selection</span>
                          <kbd className="px-3 py-1 bg-gray-100 rounded text-sm font-mono border">Double-click</kbd>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Writing Tips</h2>
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Start Simple</h3>
                        <p className="text-blue-700">
                          Begin with short sentences and familiar vocabulary. Don't worry about perfection – 
                          the goal is to practice and build confidence.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-green-800 mb-3">🎯 Focus on Daily Practice</h3>
                        <p className="text-green-700">
                          Consistency is key! Try to write at least a few sentences every day. 
                          Set a realistic daily word goal in your profile settings.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                        <h3 className="text-lg font-semibold text-purple-800 mb-3">📖 Use Real-life Topics</h3>
                        <p className="text-purple-700">
                          Write about your day, your interests, or current events. 
                          This makes the practice more engaging and memorable.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                        <h3 className="text-lg font-semibold text-amber-800 mb-3">🔄 Review and Revise</h3>
                        <p className="text-amber-700">
                          Use the French review feature to get feedback, then try rewriting 
                          your entry incorporating the suggestions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          How accurate are the translations?
                        </h3>
                        <p className="text-gray-600">
                          The translation service provides contextual translations that are generally accurate 
                          for common words and phrases. For complex sentences, consider the translation as a helpful 
                          guide rather than a perfect substitute.
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Is my writing data private?
                        </h3>
                        <p className="text-gray-600">
                          Yes, your journal entries are private and only accessible to you. 
                          We use secure authentication and your data is protected.
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Can I export my entries?
                        </h3>
                        <p className="text-gray-600">
                          Currently, you can copy and paste your entries manually. 
                          We're working on adding export functionality in a future update.
                        </p>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          What if I encounter an error?
                        </h3>
                        <p className="text-gray-600">
                          If you experience any issues, try refreshing the page. 
                          Your work is automatically saved, so you won't lose your progress.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpTutorial;
