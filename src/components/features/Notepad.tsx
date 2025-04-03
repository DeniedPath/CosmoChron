"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Book, Save, Trash2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useNotes } from '@/hooks/useNotes';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Notepad = () => {
  const { notes, addNote, updateNote, deleteNote, activeNote, setActiveNote } = useNotes();
  const [noteContent, setNoteContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Update noteContent when activeNote changes
  useEffect(() => {
    if (activeNote) {
      setNoteContent(activeNote.content);
    } else {
      setNoteContent('');
    }
  }, [activeNote]);

  const handleSave = useCallback(() => {
    if (activeNote) {
      updateNote(activeNote.id, noteContent);
    } else {
      addNote(noteContent);
    }
  }, [activeNote, noteContent, addNote, updateNote]);

  const handleNewNote = useCallback(() => {
    setActiveNote(null);
    setNoteContent('');
  }, [setActiveNote]);

  const handleNoteSelect = useCallback((note: Note) => {
    setActiveNote(note);
  }, [setActiveNote]);

  const handleDelete = useCallback(() => {
    if (activeNote) {
      deleteNote(activeNote.id);
      setActiveNote(null);
      setNoteContent('');
    }
  }, [activeNote, deleteNote, setActiveNote]);

  // Create a formatted note count string
  const getNoteCountText = useCallback(() => {
    if (notes.length === 0) {
      return 'Click to add notes';
    }
    return `${notes.length} note${notes.length !== 1 ? 's' : ''} saved`;
  }, [notes.length]);

  // Prevent the Popover from auto-closing when clicking inside
  const handlePopoverInteraction = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      // Only allow state changes from outside interactions
      if (!open || !isOpen) {
        setIsOpen(open);
      }
    }}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center justify-start w-full rounded-lg px-3 py-2 bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white/70 text-left"
        >
          <Book className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <span className="block font-medium">Cosmic Notes</span>
            <span className="block text-xs text-cosmic-white/50 truncate">
              {getNoteCountText()}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side="left" 
        className="w-[350px] md:w-[450px] p-0 bg-cosmic-dark border border-cosmic-highlight/20 backdrop-blur-md"
        onClick={handlePopoverInteraction}
      >
        <Card className="border-0 bg-transparent shadow-none text-cosmic-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b border-cosmic-highlight/20">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-cosmic-highlight" />
              <h3 className="font-medium">Cosmic Notes</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full bg-cosmic-blue/10 hover:bg-cosmic-blue/20 text-cosmic-white/70"
                onClick={handleNewNote}
              >
                <span className="text-lg">+</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full bg-cosmic-blue/10 hover:bg-cosmic-blue/20 text-cosmic-white/70"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-2 border-r border-cosmic-highlight/10 pr-3">
              <p className="text-xs text-cosmic-white/50 mb-2">Your Notes</p>
              {notes.length === 0 ? (
                <p className="text-xs italic text-cosmic-white/30">No notes yet</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {notes.map((note) => (
                    <button 
                      key={note.id}
                      onClick={() => handleNoteSelect(note)}
                      className={`w-full text-left p-2 rounded cursor-pointer text-sm transition-colors truncate
                        ${activeNote?.id === note.id 
                          ? "bg-cosmic-purple/40 text-cosmic-white" 
                          : "hover:bg-cosmic-blue/20 text-cosmic-white/70"
                        }`}
                    >
                      {note.content.substring(0, 24)}
                      {note.content.length > 24 ? "..." : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <textarea 
                className="w-full h-[200px] px-3 py-2 bg-cosmic-blue/10 border border-cosmic-highlight/20 
                          rounded-md text-cosmic-white resize-none focus:outline-none focus:ring-1 
                          focus:ring-cosmic-highlight/40"
                placeholder="Write your cosmic thoughts here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-2 border-t border-cosmic-highlight/20 flex justify-between">
            {activeNote && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white"
                onClick={handleSave}
                disabled={!noteContent.trim()}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Note
              </Button>
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default Notepad;
