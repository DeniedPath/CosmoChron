import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Trash, FileText } from 'lucide-react';
import { getNotes, saveNotes, Notes } from '@/utils/storageUtils';

interface NotepadProps {
  isVisible: boolean;
  onClose: () => void;
}

const Notepad: React.FC<NotepadProps> = ({ isVisible, onClose }) => {
  const [notes, setNotes] = useState<Notes>({ items: [] });
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    setNotes(getNotes());
  }, []);
  
  useEffect(() => {
    if (notes.items.length > 0) {
      saveNotes(notes);
    }
  }, [notes]);
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = {
        items: [
          {
            id: `note-${Date.now()}`,
            content: newNote,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          ...notes.items,
        ],
      };
      
      setNotes(updatedNotes);
      setNewNote('');
      setIsAdding(false);
      saveNotes(updatedNotes);
    }
  };
  
  const handleDeleteNote = (id: string) => {
    const updatedNotes = {
      items: notes.items.filter(note => note.id !== id),
    };
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-cosmic-dark/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-auto cosmic-card">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-medium flex items-center">
            <FileText className="w-5 h-5 mr-2" /> Notepad
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          {isAdding ? (
            <div className="mb-4 bg-cosmic-deep p-4 rounded-xl border border-white/10">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type your thoughts here..."
                className="cosmic-input w-full h-28 resize-none mb-2"
                autoFocus
              />
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewNote('');
                  }}
                  className="cosmic-button-secondary px-3 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="cosmic-button px-3 py-1 flex items-center"
                  disabled={!newNote.trim()}
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full cosmic-button-secondary p-3 mb-4 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Note
            </button>
          )}
          
          {notes.items.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No notes yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.items.map((note) => (
                <div 
                  key={note.id}
                  className="bg-cosmic-deep p-4 rounded-xl border border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-white/60">
                      {formatDate(note.createdAt)}
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notepad;
