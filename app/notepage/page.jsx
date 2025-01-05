"use client";
import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Note from '@/app/components/Note';
import Modal from '@/app/components/Modal'; // Import Modal component
import DeleteDialog from '@/app/components/DeleteDialog'; // Import DeleteDialog component
import Popup from '@/app/components/Popup';
import '@/app/NotePage/styles.css';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: '', backgroundColor: '' });

  // Fetch notes from the API on page load
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    };
    fetchNotes();
  }, []);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setNewNote(note);
    setOpenModal(true);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setOpenModal(false);
  };

  const resetError = () => {
    setNewNote({ title: '', description: '' });
  };

  const handleUpdate = async () => {
    if (!newNote.title || !newNote.description) {
      setPopup({ open: true, message: 'No info inputted', backgroundColor: 'red' });
      return;
    }

    const res = await fetch(`/api/notes/${selectedNote.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    });

    if (res.ok) {
      const updatedNote = await res.json();
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );
      closeModal();
      setPopup({ open: true, message: 'Note updated successfully', backgroundColor: 'green' });
    } else {
      // Handle error
    }
  };

  const handleSave = async () => {

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    });

    if (res.ok) {
      const addedNote = await res.json();
      setNotes((prevNotes) => [addedNote, ...prevNotes]);
      closeModal();
      setPopup({ open: true, message: 'Note pasted successfully', backgroundColor: 'green' });
    }
  };

  const handleDeleteNote = async () => {
    const res = await fetch(`/api/notes/${selectedNote.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleted: true }),
    });

    if (res.ok) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== selectedNote.id));
      setShowDeleteDialog(false);
      setSelectedNote(null);
      setPopup({ open: true, message: 'Note deleted successfully', backgroundColor: 'green' });
    } 
  };

  const closePopup = () => setPopup({ open: false});

  return (
    <div>
      <Header setNotes={setNotes} setPopup={setPopup} />
      <div
        className={`max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 mt-10 rounded-lg shadow-md ${
          isDragging ? 'dragging-container' : ''
        }`}
      >
        {notes.length === 0 ? (
          <p className="text-[#D1D7E0]">No notes available.</p>
        ) : (
          notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              description={note.description}
              timestamp={note.updatedAt || note.createdAt}
              onClick={() => handleNoteClick(note)}
              setIsDragging={setIsDragging}
              setShowDeleteDialog={setShowDeleteDialog}
              setSelectedNote={setSelectedNote}
            />
          ))
        )}
      </div>

      {selectedNote && (
        <Modal
          open={openModal}
          handleClose={closeModal}
          resetError={resetError}
          setNewNote={setNewNote}
          handleSave={handleUpdate}
          note={newNote}
          isEdit={true}
        />
      )}

      <DeleteDialog
        open={showDeleteDialog}
        handleClose={() => setShowDeleteDialog(false)}
        handleDelete={handleDeleteNote}
      />

      <Popup
        open={popup.open}
        message={popup.message}
        backgroundColor={popup.backgroundColor}
        handleClose={closePopup}
      />
    </div>
  );
}
