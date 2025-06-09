
import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Trash2, RotateCcw } from "lucide-react";
import { localStorageService, LocalDraft } from "../services/localStorageService";
import { Button } from "./ui/button";

interface DraftRecoveryProps {
  onRecoverDraft: (content: string, serverId?: string) => void;
  onDismiss: () => void;
}

const DraftRecovery = ({ onRecoverDraft, onDismiss }: DraftRecoveryProps) => {
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const allDrafts = localStorageService.getAllDrafts();
    // Filter out empty drafts and sort by last modified
    const validDrafts = allDrafts
      .filter(draft => draft.content.trim().length > 0)
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    setDrafts(validDrafts);
  }, []);

  const handleRecoverDraft = (draft: LocalDraft) => {
    onRecoverDraft(draft.content, draft.serverId);
    onDismiss();
  };

  const handleDeleteDraft = (draftId: string) => {
    localStorageService.removeDraft(draftId);
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  const formatLastModified = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (drafts.length === 0) {
    return null;
  }

  const displayedDrafts = showAll ? drafts : drafts.slice(0, 3);

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800 mb-2">
            Unsaved drafts found
          </h3>
          <p className="text-sm text-amber-700 mb-3">
            We found {drafts.length} unsaved draft{drafts.length !== 1 ? 's' : ''} in your local storage. 
            Would you like to recover any of them?
          </p>
          
          <div className="space-y-2 mb-3">
            {displayedDrafts.map((draft) => (
              <div key={draft.id} className="flex items-center justify-between p-2 bg-white rounded border border-amber-200">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">
                    {draft.content.substring(0, 60)}
                    {draft.content.length > 60 ? '...' : ''}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatLastModified(draft.lastModified)}
                    </span>
                    {draft.serverId && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Auto-saved
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRecoverDraft(draft)}
                    className="text-xs h-7 px-2"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Recover
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {drafts.length > 3 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs text-amber-700 hover:text-amber-800"
                >
                  {showAll ? 'Show less' : `Show all ${drafts.length} drafts`}
                </Button>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="text-xs text-amber-700 hover:text-amber-800"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftRecovery;
