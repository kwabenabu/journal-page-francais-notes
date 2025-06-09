export interface LocalDraft {
  id: string;
  content: string;
  lastModified: string;
  serverId?: string; // If the draft has been saved to server
}

export const localStorageService = {
  DRAFT_KEY: 'journal_draft',
  DRAFTS_KEY: 'journal_drafts',

  saveDraft(content: string, serverId?: string): string {
    const draftId = serverId || `local_${Date.now()}`;
    const draft: LocalDraft = {
      id: draftId,
      content,
      lastModified: new Date().toISOString(),
      serverId
    };

    // Save current draft
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));

    // Also add to drafts list for recovery
    const drafts = this.getAllDrafts();
    const existingIndex = drafts.findIndex(d => d.id === draftId);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.unshift(draft);
    }

    // Keep only last 10 drafts
    if (drafts.length > 10) {
      drafts.splice(10);
    }

    localStorage.setItem(this.DRAFTS_KEY, JSON.stringify(drafts));
    console.log('Draft saved locally:', { draftId, contentLength: content.length });
    
    return draftId;
  },

  getCurrentDraft(): LocalDraft | null {
    try {
      const draftStr = localStorage.getItem(this.DRAFT_KEY);
      return draftStr ? JSON.parse(draftStr) : null;
    } catch (error) {
      console.error('Error loading current draft:', error);
      return null;
    }
  },

  getAllDrafts(): LocalDraft[] {
    try {
      const draftsStr = localStorage.getItem(this.DRAFTS_KEY);
      return draftsStr ? JSON.parse(draftsStr) : [];
    } catch (error) {
      console.error('Error loading drafts:', error);
      return [];
    }
  },

  clearCurrentDraft(): void {
    localStorage.removeItem(this.DRAFT_KEY);
    console.log('Current draft cleared from local storage');
  },

  clearAllDrafts(): void {
    localStorage.removeItem(this.DRAFT_KEY);
    localStorage.removeItem(this.DRAFTS_KEY);
    console.log('All drafts cleared from local storage');
  },

  removeDraft(draftId: string): void {
    const drafts = this.getAllDrafts().filter(d => d.id !== draftId);
    localStorage.setItem(this.DRAFTS_KEY, JSON.stringify(drafts));
    
    // If this was the current draft, clear it too
    const currentDraft = this.getCurrentDraft();
    if (currentDraft && currentDraft.id === draftId) {
      this.clearCurrentDraft();
    }
    
    console.log('Draft removed:', draftId);
  }
};
