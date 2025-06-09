
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
    if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const renderEntryCard = (entry: JournalEntry, index: number, isDraft: boolean = false) => (
    <div
      key={entry.id}
      className={`
        p-5 
        rounded-xl 
        border-2
        cursor-pointer 
        transition-all 
        duration-300
        hover:scale-[1.02] 
        hover:shadow-lg
        focus:scale-[1.02] 
        focus:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        min-h-[140px]
        animate-fade-in
        ${
          currentEntry?.id === entry.id
            ? "bg-blue-50 border-blue-300 shadow-lg"
            : "border-gray-200 bg-white hover:bg-gray-50"
        }
        ${isDraft ? "border-l-4 border-l-orange-400" : ""}
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600 font-medium">
            {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
          </div>
          {isDraft && (
            <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
              <Edit className="w-3 h-3 mr-1" />
              Draft
            </Badge>
          )}
        </div>
        {entry.french_accuracy_score !== null && entry.french_accuracy_score !== undefined && (
          <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 ${getScoreColor(entry.french_accuracy_score)}`}>
            <Star className="w-3 h-3" />
            <span>{entry.french_accuracy_score}</span>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-800 mb-4 leading-relaxed line-clamp-3">
        {entry.content.length > 150 ? `${entry.content.substring(0, 150)}...` : entry.content}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {entry.content.length} characters
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteEntry(entry.id);
          }}
          className="
            text-rose-500 
            hover:text-white
            hover:bg-rose-500
            focus:text-white
            focus:bg-rose-500
            text-xs 
            transition-all
            duration-200
            px-3
            py-1.5
            rounded-lg
            border
            border-rose-200
            hover:border-rose-500
            focus:border-rose-500
            focus:outline-none
            focus:ring-2
            focus:ring-rose-500
            focus:ring-offset-1
            flex
            items-center
            space-x-1
          "
        >
          <Trash2 className="w-3 h-3" />
          <span>{t('journal.delete')}</span>
        </button>
      </div>
    </div>
  );

  const renderEmptyState = (isDraft: boolean = false) => (
    <div className="text-gray-500 text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {isDraft ? <Edit className="w-8 h-8 text-gray-400" /> : <FileText className="w-8 h-8 text-gray-400" />}
      </div>
      <p className="text-lg font-serif font-bold">
        {isDraft ? "No drafts found" : t('journal.noEntries')}
      </p>
      <p className="text-sm mt-2">
        {isDraft 
          ? "Your draft entries will appear here" 
          : "Start writing your first entry!"
        }
      </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-xl font-serif font-bold text-gray-800">
          {t('journal.myEntries')}
        </h2>
        <button
          onClick={onNewEntry}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center space-x-1"
          title="New Entry"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search your entries..."
        />
      </div>

      {/* Category Manager */}
      <div className="mb-4">
        <CategoryManager 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Tabs for Entries and Drafts */}
      <Tabs defaultValue="entries" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="entries" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Published</span>
            {filteredEntries.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {filteredEntries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Drafts</span>
            {filteredDrafts.length > 0 && (
              <Badge variant="outline" className="ml-1 text-orange-600 border-orange-300">
                {filteredDrafts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="flex-1 mt-0">
          <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
            {filteredEntries.map((entry, index) => renderEntryCard(entry, index, false))}
            {filteredEntries.length === 0 && renderEmptyState(false)}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="flex-1 mt-0">
          <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
            {filteredDrafts.map((draft, index) => renderEntryCard(draft, index, true))}
            {filteredDrafts.length === 0 && renderEmptyState(true)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalSidebar;
