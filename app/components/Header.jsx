"use client"; // Required for client-side rendering

import { useState, useRef } from 'react';
import Image from 'next/image';
import garbageClose from '../icons/garbageClose.png';
import garbageOpen from '../icons/garbageOpen.png';
import Modal from '@/app/components/Modal';

export default function Header({ setNotes, setPopup }) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [isGarbageHovered, setIsGarbageHovered] = useState(false);

  const handleOpen = (note = null) => {
    if (note) {
      setSelectedNote(note);
      setNewNote(note);
      setIsEdit(true);
    } else {
      setNewNote({ title: '', description: '' });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewNote({ title: '', description: '' }); // Reset new note fields on modal close
  };

  const handleSave = async () => {
    if (isEdit) {
      const res = await fetch(`/api/notes/${selectedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newNote.title,
          description: newNote.description,
        }),
      });

      if (res.ok) {
        const updatedNote = await res.json();
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
        );
        setPopup({ open: true, message: 'Note updated successfully', backgroundColor: 'green' });
        handleClose();
      } else {
        // Handle error (show a message or alert)
      }
    } else {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (res.ok) {
        const addedNote = await res.json();
        setNotes((prevNotes) => [addedNote, ...prevNotes]);
        setPopup({ open: true, message: 'Note pasted successfully', backgroundColor: 'green' });
        handleClose();
      } else {
        // Handle error (show a message or alert)
      }
    }
  };

  const handleDragOverGarbage = (e) => {
    e.preventDefault();
    setIsGarbageHovered(true);
  };

  const handleDragLeaveGarbage = () => {
    setIsGarbageHovered(false);
  };

  const handleDropOnGarbage = (e) => {
    e.preventDefault();
    setIsGarbageHovered(false);
    // Trigger deletion logic here
  };

  return (

    <div className="w-full">
  <div className="header-container flex justify-between items-center w-full px-6">
    <div className="flex flex-col items-center text-center w-full">
      <h1 className="font-bold text-xl text-paragraph-color md:text-5xl pt-7 pb-2 text-[#D1D7E0] animate__animated animate__slideInRight">
        STICK IT
      </h1>

      {/* Add note button */}
      <button
        className="pt-2 text-lg text-[#D1D7E0] animate__animated animate__fadeIn hover:text-neutral-100 mb-2"
        onClick={() => handleOpen()}
      >
        Add note
      </button>

      {/* Exit button */}
      <button
        className="text-lg pt-1 text-[#D1D7E0] animate__animated animate__fadeIn hover:text-neutral-100"
      >
        Exit?
      </button>
    </div>

    {/* Garbage container */}
    <div
      className="garbage-container pt-7"
      onDragOver={handleDragOverGarbage}
      onDragLeave={handleDragLeaveGarbage}
      onDrop={handleDropOnGarbage}
      style={{
        width: '150px',
        height: '150px',
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderColor: isGarbageHovered ? '#D1D7E0' : 'transparent',
        borderRadius: '10px',
        transition: 'border-color 0.2s ease-in-out',
      }}
    >
      <Image
        src={isGarbageHovered ? garbageOpen : garbageClose}
        alt="garbageIcon"
        className="garbage-size"
        width={100}
        height={100}
      />
    </div>
  </div>

  <hr className="w-full border-t-2 border-gray-400 my-4" />

  <Modal
    open={open}
    handleClose={handleClose}
    setNewNote={setNewNote}
    handleSave={handleSave}
    note={newNote}
    isEdit={isEdit}
  />
</div>


  );
}
