
import { FileText, Edit } from "lucide-react";
import { JournalEntry } from "../../services/journalService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import EntryCard from "./EntryCard";
import EmptyState from "./EmptyState";

interface EntryTabsProps {
  filteredEntries: JournalEntry[];
  filteredDrafts: JournalEntry[];
  currentEntry: JournalEntry | null;
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const EntryTabs = ({
  filteredEntries,
  filteredDrafts,
  currentEntry,
  onLoadEntry,
  onDeleteEntry
}: EntryTabsProps) => {
  return (
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
          {filteredEntries.map((entry, index) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              index={index}
              isDraft={false}
              isSelected={currentEntry?.id === entry.id}
              onLoadEntry={onLoadEntry}
              onDeleteEntry={onDeleteEntry}
            />
          ))}
          {filteredEntries.length === 0 && <EmptyState isDraft={false} />}
        </div>
      </TabsContent>

      <TabsContent value="drafts" className="flex-1 mt-0">
        <div className="space-y-4 max-h-[calc(100vh-28rem)] overflow-y-auto pr-2 scroll-smooth">
          {filteredDrafts.map((draft, index) => (
            <EntryCard
              key={draft.id}
              entry={draft}
              index={index}
              isDraft={true}
              isSelected={currentEntry?.id === draft.id}
              onLoadEntry={onLoadEntry}
              onDeleteEntry={onDeleteEntry}
            />
          ))}
          {filteredDrafts.length === 0 && <EmptyState isDraft={true} />}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EntryTabs;
