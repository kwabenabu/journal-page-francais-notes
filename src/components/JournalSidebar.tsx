
import { useState, useEffect } from "react";
import { JournalEntry } from "../services/journalService";
import { Category } from "../services/categoryService";
import SearchBar from "./SearchBar";
import CategoryManager from "./CategoryManager";
import SidebarHeader from "./sidebar/SidebarHeader";
import EntryTabs from "./sidebar/EntryTabs";

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

  return (
    <div className="h-full flex flex-col">
      <SidebarHeader onNewEntry={onNewEntry} />

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

      {/* Entry Tabs */}
      <EntryTabs
        filteredEntries={filteredEntries}
        filteredDrafts={filteredDrafts}
        currentEntry={currentEntry}
        onLoadEntry={onLoadEntry}
        onDeleteEntry={onDeleteEntry}
      />
    </div>
  );
};

export default JournalSidebar;
