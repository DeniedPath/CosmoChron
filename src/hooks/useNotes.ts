
import { useState, useEffect } from 'react';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('spaceTimer_notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing notes from localStorage:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('spaceTimer_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setActiveNote(newNote);
    return newNote;
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { 
              ...note, 
              content, 
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    );
    
    if (activeNote && activeNote.id === id) {
      setActiveNote(prev => prev ? { 
        ...prev, 
        content, 
        updatedAt: new Date().toISOString() 
      } : null);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
    }
  };

  return {
    notes,
    activeNote,
    setActiveNote,
    addNote,
    updateNote,
    deleteNote
  };
};
