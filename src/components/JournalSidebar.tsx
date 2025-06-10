
import React, { useState } from "react";
import { JournalEntry } from "../services/journalService";
import { useLanguage } from "../contexts/LanguageContext";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { FileText, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import EntryTabs from "./sidebar/EntryTabs";
import EnhancedSearch from "./EnhancedSearch";

interface JournalSidebarProps {
  entries: JournalEntry[];
  drafts: JournalEntry[];
  currentEntry: JournalEntry | null;
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntry: () => void;
  onSearch: (query: string) => void;
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
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [filteredDrafts, setFilteredDrafts] = useState(drafts);

  const handleSearchResults = (results: JournalEntry[]) => {
    const publishedResults = results.filter(entry => !entry.is_draft);
    const draftResults = results.filter(entry => entry.is_draft);
    
    setFilteredEntries(publishedResults);
    setFilteredDrafts(draftResults);
  };

  // Update filtered results when entries or drafts change
  React.useEffect(() => {
    setFilteredEntries(entries);
  }, [entries]);

  React.useEffect(() => {
    setFilteredDrafts(drafts);
  }, [drafts]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mes entrées</h2>
          <Button 
            onClick={onNewEntry}
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Manage your writing journey</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <EnhancedSearch
          entries={entries}
          drafts={drafts}
          onSearch={handleSearchResults}
          placeholder="Search entries..."
          className="w-full"
        />
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <EntryTabs
            filteredEntries={filteredEntries}
            filteredDrafts={filteredDrafts}
            currentEntry={currentEntry}
            onLoadEntry={onLoadEntry}
            onDeleteEntry={onDeleteEntry}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default JournalSidebar;
