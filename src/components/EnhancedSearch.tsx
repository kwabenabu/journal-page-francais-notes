
import { useState, useRef, useEffect } from "react";
import { Search, X, Filter, Calendar, Star } from "lucide-react";
import { JournalEntry } from "../services/journalService";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface SearchFilter {
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  minScore?: number;
  hasReview?: boolean;
  isDraft?: boolean;
}

interface EnhancedSearchProps {
  entries: JournalEntry[];
  drafts: JournalEntry[];
  onSearch: (results: JournalEntry[]) => void;
  onFilterChange?: (filter: SearchFilter) => void;
  placeholder?: string;
  className?: string;
}

const EnhancedSearch = ({ 
  entries, 
  drafts, 
  onSearch, 
  onFilterChange,
  placeholder = "Search entries... (Press / to focus)",
  className = "" 
}: EnhancedSearchProps) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<SearchFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement instanceof HTMLInputElement || 
                             activeElement instanceof HTMLTextAreaElement;
        
        if (!isInputFocused) {
          e.preventDefault();
          inputRef.current?.focus();
          setIsExpanded(true);
        }
      }
      
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setIsExpanded(false);
        handleClear();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performSearch = (searchQuery: string, searchFilter: SearchFilter) => {
    const allEntries = [...entries, ...drafts];
    
    if (!searchQuery.trim() && Object.keys(searchFilter).length === 0) {
      onSearch(allEntries);
      return;
    }

    let results = allEntries;

    // Text search
    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      results = results.filter(entry => {
        const content = entry.content.toLowerCase();
        return terms.every(term => content.includes(term));
      });
    }

    // Apply filters
    if (searchFilter.dateRange?.start) {
      results = results.filter(entry => 
        new Date(entry.created_at) >= searchFilter.dateRange!.start!
      );
    }

    if (searchFilter.dateRange?.end) {
      results = results.filter(entry => 
        new Date(entry.created_at) <= searchFilter.dateRange!.end!
      );
    }

    if (searchFilter.minScore !== undefined) {
      results = results.filter(entry => 
        entry.french_accuracy_score !== null && 
        entry.french_accuracy_score !== undefined &&
        entry.french_accuracy_score >= searchFilter.minScore!
      );
    }

    if (searchFilter.hasReview !== undefined) {
      results = results.filter(entry => 
        searchFilter.hasReview ? entry.language_feedback : !entry.language_feedback
      );
    }

    if (searchFilter.isDraft !== undefined) {
      results = results.filter(entry => 
        !!entry.is_draft === searchFilter.isDraft
      );
    }

    // Sort by relevance (exact matches first, then by date)
    if (searchQuery.trim()) {
      results.sort((a, b) => {
        const aExact = a.content.toLowerCase().includes(searchQuery.toLowerCase());
        const bExact = b.content.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
    }

    onSearch(results);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, filter);
  };

  const handleClear = () => {
    setQuery("");
    setFilter({});
    onSearch([...entries, ...drafts]);
    onFilterChange?.({});
  };

  const handleFilterChange = (newFilter: SearchFilter) => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
    performSearch(query, newFilter);
  };

  const activeFilterCount = Object.values(filter).filter(v => v !== undefined && v !== null).length;

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`
        relative transition-all duration-300 ease-out
        ${isExpanded ? 'scale-[1.02] shadow-lg' : 'hover:scale-[1.01] hover:shadow-md'}
      `}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
          placeholder={placeholder}
          className="
            w-full 
            pl-10 
            pr-20 
            py-3 
            border-2 
            border-gray-200/60 
            rounded-xl 
            focus:outline-none 
            focus:ring-3 
            focus:ring-blue-500/30 
            focus:border-blue-400
            transition-all 
            duration-300
            bg-white/80
            backdrop-blur-sm
            hover:bg-white/90
            focus:bg-white
            placeholder:text-gray-400
          "
          aria-label="Search entries"
          aria-describedby="search-help"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="relative p-1 hover:bg-gray-100"
                aria-label="Search filters"
              >
                <Filter className="w-4 h-4 text-gray-400" />
                {activeFilterCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-blue-500 text-white"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Search Filters</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Entry Type</label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={filter.isDraft === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange({ 
                          ...filter, 
                          isDraft: filter.isDraft === false ? undefined : false 
                        })}
                      >
                        Published
                      </Button>
                      <Button
                        type="button"
                        variant={filter.isDraft === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange({ 
                          ...filter, 
                          isDraft: filter.isDraft === true ? undefined : true 
                        })}
                      >
                        Drafts
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Review Status</label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={filter.hasReview === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange({ 
                          ...filter, 
                          hasReview: filter.hasReview === true ? undefined : true 
                        })}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Reviewed
                      </Button>
                      <Button
                        type="button"
                        variant={filter.hasReview === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange({ 
                          ...filter, 
                          hasReview: filter.hasReview === false ? undefined : false 
                        })}
                      >
                        Unreviewed
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Minimum Score</label>
                    <select
                      value={filter.minScore || ''}
                      onChange={(e) => handleFilterChange({ 
                        ...filter, 
                        minScore: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="">Any score</option>
                      <option value="80">80+ (Excellent)</option>
                      <option value="60">60+ (Good)</option>
                      <option value="40">40+ (Needs work)</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleFilterChange({});
                    setShowFilters(false);
                  }}
                  className="w-full"
                >
                  Clear filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {(query || activeFilterCount > 0) && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div id="search-help" className="sr-only">
        Use / to quickly focus search, Escape to clear
      </div>
    </form>
  );
};

export default EnhancedSearch;
