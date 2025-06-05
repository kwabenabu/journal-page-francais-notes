
import { useState, useEffect } from "react";
import JournalHeader from "../components/JournalHeader";
import JournalEntry from "../components/JournalEntry";
import EntryForm from "../components/EntryForm";

interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
}

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      // Add some sample entries for demonstration
      const sampleEntries: Entry[] = [
        {
          id: '1',
          title: 'Première journée à Paris',
          content: 'Aujourd\'hui, j\'ai découvert les magnifiques rues pavées de Montmartre. L\'atmosphère était magique avec les artistes qui peignaient sur la place du Tertre. J\'ai pris un café dans un petit bistrot et j\'ai observé la vie parisienne. Les gens semblaient si élégants et décontractés à la fois. Cette ville a vraiment quelque chose de spécial qui me touche profondément.',
          date: '2024-06-04'
        },
        {
          id: '2',
          title: 'Réflexions sur l\'amitié',
          content: 'Ce soir, j\'ai eu une longue conversation avec Marie. Nous avons parlé de nos rêves, de nos peurs, et de ce qui nous rend vraiment heureux. C\'est incroyable comme certaines personnes peuvent entrer dans notre vie et la transformer complètement. L\'amitié véritable est un trésor rare.',
          date: '2024-06-03'
        }
      ];
      setEntries(sampleEntries);
      localStorage.setItem('journalEntries', JSON.stringify(sampleEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const handleNewEntry = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEditEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setEditingEntry(entry);
      setShowForm(true);
    }
  };

  const handleSaveEntry = (title: string, content: string) => {
    if (editingEntry) {
      // Update existing entry
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, title, content }
          : entry
      ));
    } else {
      // Create new entry
      const newEntry: Entry = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString().split('T')[0]
      };
      setEntries([newEntry, ...entries]);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-yellow-25">
      <JournalHeader onNewEntry={handleNewEntry} />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-amber-100">
              <h3 className="text-xl font-serif text-gray-600 mb-4">
                Votre journal est vide
              </h3>
              <p className="text-gray-500 mb-6">
                Commencez votre voyage d'écriture en créant votre première entrée.
              </p>
              <button
                onClick={handleNewEntry}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Écrire ma première entrée
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-gray-800">
                Mes entrées ({entries.length})
              </h2>
            </div>
            
            <div className="grid gap-6">
              {entries.map(entry => (
                <JournalEntry
                  key={entry.id}
                  id={entry.id}
                  title={entry.title}
                  content={entry.content}
                  date={entry.date}
                  onEdit={handleEditEntry}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <EntryForm
          onSave={handleSaveEntry}
          onCancel={handleCancel}
          initialTitle={editingEntry?.title}
          initialContent={editingEntry?.content}
          isEditing={!!editingEntry}
        />
      )}
    </div>
  );
};

export default Index;
