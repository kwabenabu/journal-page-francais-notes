import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { FloatingActionButton } from "../components/ui/floating-action-button";
import { useIsMobile } from "../hooks/use-mobile";

interface VocabularyWord {
  id: string;
  french_word: string;
  english_translation: string;
  part_of_speech: string | null;
  example_sentence: string | null;
  created_at: string;
}

const Vocabulary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    french_word: "",
    english_translation: "",
    part_of_speech: "",
    example_sentence: ""
  });

  useEffect(() => {
    if (user) {
      fetchVocabularyWords();
    }
  }, [user]);

  const fetchVocabularyWords = async () => {
    try {
      const { data, error } = await supabase
        .from("vocabulary_words")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVocabularyWords(data || []);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      toast({
        title: "Error",
        description: "Failed to load vocabulary words",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.french_word.trim() || !formData.english_translation.trim()) {
      toast({
        title: "Error",
        description: "French word and English translation are required",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingWord) {
        // Update existing word
        const { error } = await supabase
          .from("vocabulary_words")
          .update({
            french_word: formData.french_word.trim(),
            english_translation: formData.english_translation.trim(),
            part_of_speech: formData.part_of_speech.trim() || null,
            example_sentence: formData.example_sentence.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingWord.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Vocabulary word updated successfully"
        });
      } else {
        // Create new word
        const { error } = await supabase
          .from("vocabulary_words")
          .insert({
            user_id: user?.id,
            french_word: formData.french_word.trim(),
            english_translation: formData.english_translation.trim(),
            part_of_speech: formData.part_of_speech.trim() || null,
            example_sentence: formData.example_sentence.trim() || null
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Vocabulary word added successfully"
        });
      }

      // Reset form and close dialog
      setFormData({
        french_word: "",
        english_translation: "",
        part_of_speech: "",
        example_sentence: ""
      });
      setIsAddDialogOpen(false);
      setEditingWord(null);
      
      // Refresh the list
      fetchVocabularyWords();
    } catch (error) {
      console.error("Error saving vocabulary word:", error);
      toast({
        title: "Error",
        description: "Failed to save vocabulary word",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (word: VocabularyWord) => {
    setEditingWord(word);
    setFormData({
      french_word: word.french_word,
      english_translation: word.english_translation,
      part_of_speech: word.part_of_speech || "",
      example_sentence: word.example_sentence || ""
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vocabulary word?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("vocabulary_words")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Vocabulary word deleted successfully"
      });
      
      fetchVocabularyWords();
    } catch (error) {
      console.error("Error deleting vocabulary word:", error);
      toast({
        title: "Error",
        description: "Failed to delete vocabulary word",
        variant: "destructive"
      });
    }
  };

  const filteredWords = vocabularyWords.filter(word =>
    word.french_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.english_translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (word.part_of_speech && word.part_of_speech.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingWord(null);
    setFormData({
      french_word: "",
      english_translation: "",
      part_of_speech: "",
      example_sentence: ""
    });
  };

  if (!user) {
    return null;
  }

  // Mobile-first Add Button
  const addButton = isMobile ? null : (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 touch-manipulation">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Word</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {editingWord ? "Edit Vocabulary Word" : "Add New Vocabulary Word"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {editingWord ? "Update the vocabulary word details below." : "Add a new French word to your vocabulary list."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="french_word" className="block text-sm font-medium text-gray-700 mb-1">
              French Word *
            </label>
            <Input
              id="french_word"
              value={formData.french_word}
              onChange={(e) => setFormData({ ...formData, french_word: e.target.value })}
              placeholder="e.g., bonjour"
              required
              className="touch-manipulation"
            />
          </div>
          
          <div>
            <label htmlFor="english_translation" className="block text-sm font-medium text-gray-700 mb-1">
              English Translation *
            </label>
            <Input
              id="english_translation"
              value={formData.english_translation}
              onChange={(e) => setFormData({ ...formData, english_translation: e.target.value })}
              placeholder="e.g., hello"
              required
              className="touch-manipulation"
            />
          </div>
          
          <div>
            <label htmlFor="part_of_speech" className="block text-sm font-medium text-gray-700 mb-1">
              Part of Speech
            </label>
            <Input
              id="part_of_speech"
              value={formData.part_of_speech}
              onChange={(e) => setFormData({ ...formData, part_of_speech: e.target.value })}
              placeholder="e.g., noun, verb, adjective"
              className="touch-manipulation"
            />
          </div>
          
          <div>
            <label htmlFor="example_sentence" className="block text-sm font-medium text-gray-700 mb-1">
              Example Sentence
            </label>
            <Textarea
              id="example_sentence"
              value={formData.example_sentence}
              onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
              placeholder="e.g., Bonjour, comment allez-vous?"
              rows={3}
              className="touch-manipulation resize-none"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleDialogClose} className="touch-manipulation">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 touch-manipulation">
              {editingWord ? "Update Word" : "Add Word"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <AppLayout title="Vocabulary" rightElement={addButton}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Mobile-optimized Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Search vocabulary words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 text-base sm:text-sm touch-manipulation h-12 sm:h-10"
            />
          </div>
        </div>

        {/* Mobile-responsive Vocabulary Grid */}
        {loading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-500 text-sm sm:text-base">Loading vocabulary words...</div>
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-gray-500 mb-4 text-base sm:text-lg">
              {searchTerm ? "No vocabulary words match your search." : "No vocabulary words yet."}
            </div>
            {!searchTerm && (
              <p className="text-sm text-gray-400 mb-6">
                Start building your French vocabulary by adding new words!
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredWords.map((word) => (
              <Card key={word.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] touch-manipulation">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl text-blue-700 mb-1 break-words">
                        {word.french_word}
                      </CardTitle>
                      <CardDescription className="text-base sm:text-lg text-gray-700 break-words">
                        {word.english_translation}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1 ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(word)}
                        className="text-gray-500 hover:text-blue-600 p-2 touch-manipulation"
                        aria-label="Edit word"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(word.id)}
                        className="text-gray-500 hover:text-red-600 p-2 touch-manipulation"
                        aria-label="Delete word"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {(word.part_of_speech || word.example_sentence) && (
                  <CardContent className="pt-0">
                    {word.part_of_speech && (
                      <Badge variant="secondary" className="mb-3 text-xs font-medium">
                        {word.part_of_speech}
                      </Badge>
                    )}
                    
                    {word.example_sentence && (
                      <p className="text-sm text-gray-600 italic break-words leading-relaxed">
                        "{word.example_sentence}"
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Mobile Stats */}
        <div className="mt-8 sm:mt-12 text-center text-sm text-gray-500">
          {filteredWords.length > 0 && (
            <p>
              {searchTerm ? (
                <>Showing {filteredWords.length} of {vocabularyWords.length} vocabulary words</>
              ) : (
                <>Total vocabulary words: {vocabularyWords.length}</>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <FloatingActionButton
              icon={Plus}
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              position="bottom-right"
              size="lg"
            />
          </DialogTrigger>
          <DialogContent className="mx-4 max-h-[90vh] overflow-y-auto w-[calc(100vw-2rem)] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {editingWord ? "Edit Vocabulary Word" : "Add New Word"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editingWord ? "Update the vocabulary word details below." : "Add a new French word to your vocabulary list."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="mobile_french_word" className="block text-sm font-medium text-gray-700 mb-2">
                  French Word *
                </label>
                <Input
                  id="mobile_french_word"
                  value={formData.french_word}
                  onChange={(e) => setFormData({ ...formData, french_word: e.target.value })}
                  placeholder="e.g., bonjour"
                  required
                  className="touch-manipulation h-12 text-base"
                />
              </div>
              
              <div>
                <label htmlFor="mobile_english_translation" className="block text-sm font-medium text-gray-700 mb-2">
                  English Translation *
                </label>
                <Input
                  id="mobile_english_translation"
                  value={formData.english_translation}
                  onChange={(e) => setFormData({ ...formData, english_translation: e.target.value })}
                  placeholder="e.g., hello"
                  required
                  className="touch-manipulation h-12 text-base"
                />
              </div>
              
              <div>
                <label htmlFor="mobile_part_of_speech" className="block text-sm font-medium text-gray-700 mb-2">
                  Part of Speech
                </label>
                <Input
                  id="mobile_part_of_speech"
                  value={formData.part_of_speech}
                  onChange={(e) => setFormData({ ...formData, part_of_speech: e.target.value })}
                  placeholder="e.g., noun, verb, adjective"
                  className="touch-manipulation h-12 text-base"
                />
              </div>
              
              <div>
                <label htmlFor="mobile_example_sentence" className="block text-sm font-medium text-gray-700 mb-2">
                  Example Sentence
                </label>
                <Textarea
                  id="mobile_example_sentence"
                  value={formData.example_sentence}
                  onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
                  placeholder="e.g., Bonjour, comment allez-vous?"
                  rows={4}
                  className="touch-manipulation resize-none text-base"
                />
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleDialogClose} 
                  className="touch-manipulation h-12 sm:h-10 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 touch-manipulation h-12 sm:h-10 w-full sm:w-auto"
                >
                  {editingWord ? "Update Word" : "Add Word"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
};

export default Vocabulary;
