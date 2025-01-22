"use client";

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Note from '@/app/components/Note';
import Modal from '@/app/components/Modal';
import DeleteDialog from '@/app/components/DeleteDialog';
import Popup from '@/app/components/Popup';
import Loader from '@/app/components/Loader';
import Image from 'next/image';
import filter2 from '../icons/filter2.png';
import Filter from '@/app/components/Filter';
import '@/app/styles/notepage.css';

const getTokenFromCookies = () => {
  const name = 'jwt=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: '', backgroundColor: '' });
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState({ startDate: '', endDate: '' });

  const filterActive = filterDate.startDate || filterDate.endDate;

  useEffect(() => {
    const fetchNotes = async () => {
      const token = getTokenFromCookies();
      if (!token) {
        setPopup({ open: true, message: 'Session expired. Redirecting...', backgroundColor: 'red' });
        setTimeout(() => window.location.href = '/', 2000);
        return;
      }

      try {
        const res = await fetch(`/api/notes?startDate=${filterDate.startDate}&endDate=${filterDate.endDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        } else if (res.status === 401) {
          setPopup({ open: true, message: 'Session expired. Redirecting...', backgroundColor: 'red' });
          setTimeout(() => window.location.href = '/', 1000);
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [filterDate]);

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

    const token = getTokenFromCookies();

    const res = await fetch(`/api/notes/${selectedNote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    });

    if (res.ok) {
      const updatedNote = await res.json();
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );
      closeModal();
      setPopup({ open: true, message: 'Note updated successfully', backgroundColor: 'green' });
    } else if (res.status === 401 || res.status === 403) {
      document.cookie = 'jwt=; path=/; max-age=0';
      setPopup({ open: true, message: 'Session expired. Please log in again.', backgroundColor: 'red' });
      setTimeout(() => window.location.href = '/', 2000);
    } else {
      console.error('Failed to update note:', res.status);
    }
  };

  const handleSave = async () => {
    const token = getTokenFromCookies();

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    });

    if (res.ok) {
      const addedNote = await res.json();
      setNotes((prevNotes) => [addedNote, ...prevNotes]);
      setPopup({ open: true, message: 'Note pasted successfully', backgroundColor: 'green' });
      setLoading(true); // Set loading state to true

      // Reset filter and fetch all notes
      setFilterDate({ startDate: '', endDate: '' });
      await fetchNotes(); // Ensure fetchNotes is called after updating the state

      setLoading(false); // Set loading state to false
      closeModal();
    } else {
      console.error('Failed to save note:', res.status);
    }
  };

  const handleDeleteNote = async () => {
    const token = getTokenFromCookies();

    const res = await fetch(`/api/notes/${selectedNote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deleted: true }),
    });

    if (res.ok) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== selectedNote.id));
      setShowDeleteDialog(false);
      setSelectedNote(null);
      setPopup({ open: true, message: 'Note deleted successfully', backgroundColor: 'green' });
    } else if (res.status === 401 || res.status === 403) {
      document.cookie = 'jwt=; path=/; max-age=0';
      setPopup({ open: true, message: 'Session expired. Please log in again.', backgroundColor: 'red' });
      setTimeout(() => window.location.href = '/', 2000);
    } else {
      console.error('Failed to delete note:', res.status);
    }
  };

  const closePopup = () => setPopup({ open: false });

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);

  const handleApplyFilter = async ({ startDate, endDate }) => {
    setFilterDate({ startDate, endDate });
    return new Promise((resolve) => {
      setTimeout(() => {
        handleCloseFilterModal();
        resolve();
      }, 500); // Simulate a delay
    });
  };

  const handleResetFilter = async () => {
    setFilterDate({ startDate: '', endDate: '' });
    return new Promise((resolve) => {
      setTimeout(() => {
        handleCloseFilterModal();
        resolve();
      }, 500); // Simulate a delay
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Header setNotes={setNotes} setPopup={setPopup} filterActive={filterActive} />

      <div
        className={`max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
          p-6 mt-10 rounded-lg shadow-md ${isDragging ? 'dragging-container' : ''}`}
        style={{ position: 'relative' }}
      >
        {(notes.length > 0 || filterDate.startDate || filterDate.endDate) && (
          <div className="filter-container">
            <Image
              src={filter2}
              alt="filterIcon"
              className="filter-icon"
              width={30}
              onClick={handleOpenFilterModal} // Open filter modal on click
            />
          </div>
        )}

        {(filterDate.startDate || filterDate.endDate) && notes.length === 0 ? (
          <p className="text-[#D1D7E0] pl-8">No notes for this date range.</p>
        ) : notes.length === 0 && !filterDate.startDate && !filterDate.endDate ? (
          <p className="text-[#D1D7E0]">No notes available.</p>
        ) : (
          notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              description={note.description}
              timestamp={note.createdAt}
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

      <Filter
        open={isFilterModalOpen}
        handleClose={handleCloseFilterModal}
        handleApplyFilter={handleApplyFilter}
        handleResetFilter={handleResetFilter}
      />
    </div>
  );
}
