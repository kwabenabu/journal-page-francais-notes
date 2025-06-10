
import React, { useState } from "react";
import { JournalEntry } from "../services/journalService";
import { useLanguage } from "../contexts/LanguageContext";
import { ScrollArea } from "./ui/scroll-area";
import SidebarHeader from "./sidebar/SidebarHeader";
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
    <div className="h-full flex flex-col" role="complementary" aria-label="Journal sidebar">
      <div className="flex-shrink-0">
        <SidebarHeader onNewEntry={onNewEntry} />
        
        <div className="mb-6 px-4">
          <EnhancedSearch
            entries={entries}
            drafts={drafts}
            onSearch={handleSearchResults}
            placeholder="Search entries... (Press / to focus)"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 px-4">
        <ScrollArea className="h-full">
          <div className="pr-4">
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
    </div>
  );
};

export default JournalSidebar;
