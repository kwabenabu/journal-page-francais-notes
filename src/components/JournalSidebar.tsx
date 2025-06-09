
import { useState, useEffect } from "react";
import { JournalEntry } from "../services/journalService";
import { Category } from "../services/categoryService";
import { useLanguage } from "../contexts/LanguageContext";
import { Star, Trash2, Plus, FileText, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import SearchBar from "./SearchBar";
import CategoryManager from "./CategoryManager";

interface JournalSidebarProps {
  entries: JournalEntry[];
  drafts: JournalEntry[];
  currentEntry: JournalEntry | null;
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntry: () => void;
  onSearch?: (query: string) => void;
}

const JournalSidebar = ({ 
  entries, 
  drafts,
  currentEntry, 
  onLoadEntry, 
  onDeleteEntry, 
  onNewEntry,
  onSearch
}: JournalSidebarProps) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>(entries);
  const [filteredDrafts, setFilteredDrafts] = useState<JournalEntry[]>(drafts);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim()) {
      // Filter entries based on search query
      const filtered = entries.filter(entry => 
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
      
      // Filter drafts based on search query
      const filteredDraftResults = drafts.filter(draft => 
        draft.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrafts(filteredDraftResults);
    } else {
      setFilteredEntries(entries);
      setFilteredDrafts(drafts);
    }
  }, [entries, drafts, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    // TODO: Filter entries by category when category-entry associations are loaded
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-100 border-emerald-200";
    if (score >= 60) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-rose-700 bg-rose-100 border-rose-200";
  };

  const renderEntryCard = (entry: JournalEntry, index: number, isDraft: boolean = false) => (
    <div
      key={entry.id}
      className={`
        glass-card
        p-6 
        rounded-2xl 
        cursor-pointer 
        transition-all 
        duration-500
        hover-lift
        focus:outline-none
        focus:ring-3
        focus:ring-blue-500/30
        focus:ring-offset-2
        min-h-[160px]
        animate-fade-in
        group
        ${
          currentEntry?.id === entry.id
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg ring-2 ring-blue-200"
            : "hover:bg-gradient-to-br hover:from-white hover:to-gray-50"
        }
        ${isDraft ? "border-l-4 border-l-orange-400 bg-gradient-to-br from-orange-50 to-amber-50" : ""}
      `}
      onClick={() => onLoadEntry(entry)}
      tabIndex={0}
      role="button"
      style={{ animationDelay: `${index * 100}ms` }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onLoadEntry(entry);
        }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600 font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/60">
            {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
          </div>
          {isDraft && (
            <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-100/80 backdrop-blur-sm">
              <Edit className="w-3 h-3 mr-1" />
              Draft
            </Badge>
          )}
        </div>
        {entry.french_accuracy_score !== null && entry.french_accuracy_score !== undefined && (
          <div className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 backdrop-blur-sm ${getScoreColor(entry.french_accuracy_score)}`}>
            <Star className="w-4 h-4" />
            <span className="font-semibold">{entry.french_accuracy_score}</span>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-800 mb-5 leading-relaxed line-clamp-3 group-hover:text-gray-900 transition-colors duration-300">
        {entry.content.length > 150 ? `${entry.content.substring(0, 150)}...` : entry.content}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-100/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50">
          {entry.content.length} characters
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteEntry(entry.id);
          }}
          className="
            interactive-button
            text-rose-600 
            hover:text-white
            hover:bg-gradient-to-r
            hover:from-rose-500
            hover:to-rose-600
            focus:text-white
            focus:bg-gradient-to-r
            focus:from-rose-500
            focus:to-rose-600
            text-xs 
            transition-all
            duration-300
            px-4
            py-2
            rounded-xl
            border-2
            border-rose-200
            hover:border-rose-500
            focus:border-rose-500
            focus:outline-none
            focus:ring-2
            focus:ring-rose-500/30
            focus:ring-offset-1
            flex
            items-center
            space-x-2
            backdrop-blur-sm
            bg-white/80
            hover:shadow-lg
            hover:scale-105
            active:scale-95
          "
        >
          <Trash2 className="w-3 h-3" />
          <span className="font-medium">{t('journal.delete')}</span>
        </button>
      </div>
    </div>
  );

  const renderEmptyState = (isDraft: boolean = false) => (
    <div className="text-gray-500 text-center py-16 animate-fade-in">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
        {isDraft ? <Edit className="w-10 h-10 text-gray-400" /> : <FileText className="w-10 h-10 text-gray-400" />}
      </div>
      <p className="text-xl font-serif font-bold text-gray-700 mb-2">
        {isDraft ? "No drafts found" : t('journal.noEntries')}
      </p>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        {isDraft 
          ? "Your draft entries will appear here as you write" 
          : "Start writing your first entry to see it here!"
        }
      </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/60">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-1">
            {t('journal.myEntries')}
          </h2>
          <p className="text-sm text-gray-600">Manage your writing journey</p>
        </div>
        <button
          onClick={onNewEntry}
          className="
            interactive-button
            bg-gradient-to-r 
            from-blue-600 
            to-indigo-600 
            hover:from-blue-700 
            hover:to-indigo-700 
            text-white 
            p-3 
            rounded-xl 
            transition-all
            duration-300
            flex 
            items-center 
            space-x-2
            shadow-lg
            hover:shadow-xl
            hover:scale-105
            active:scale-95
            focus:outline-none
            focus:ring-3
            focus:ring-blue-500/30
            focus:ring-offset-2
          "
          title="Create New Entry"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search your entries..."
        />
      </div>

      {/* Category Manager */}
      <div className="mb-6">
        <CategoryManager 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Tabs for Entries and Drafts */}
      <Tabs defaultValue="entries" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/80 backdrop-blur-sm p-1 rounded-xl">
          <TabsTrigger 
            value="entries" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-300"
          >
            <FileText className="w-4 h-4" />
            <span className="font-medium">Published</span>
            {filteredEntries.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 border-blue-200">
                {filteredEntries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="drafts" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-300"
          >
            <Edit className="w-4 h-4" />
            <span className="font-medium">Drafts</span>
            {filteredDrafts.length > 0 && (
              <Badge variant="outline" className="ml-1 text-orange-700 border-orange-300 bg-orange-100">
                {filteredDrafts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="flex-1 mt-0">
          <div className="space-y-4 max-h-[calc(100vh-28rem)] overflow-y-auto pr-2 scroll-smooth">
            {filteredEntries.map((entry, index) => renderEntryCard(entry, index, false))}
            {filteredEntries.length === 0 && renderEmptyState(false)}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="flex-1 mt-0">
          <div className="space-y-4 max-h-[calc(100vh-28rem)] overflow-y-auto pr-2 scroll-smooth">
            {filteredDrafts.map((draft, index) => renderEntryCard(draft, index, true))}
            {filteredDrafts.length === 0 && renderEmptyState(true)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalSidebar;
