"use client"; // Required for client-side rendering

import { useState } from 'react';
import Image from 'next/image';
import garbageClose from '../icons/garbageClose.png';
import garbageOpen from '../icons/garbageOpen.png';
import Modal from '@/app/components/Modal';
import Loader from '@/app/components/Loader'; // Import the loader component
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const getTokenFromCookies = () => {
  const name = 'jwt=';
  console.log('document.cookie:', document.cookie); // Debugging statement
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      console.log('JWT Token Found:', c.substring(name.length, c.length)); // Debugging statement
      return c.substring(name.length, c.length);
    }
  }
  console.log('JWT Token Not Found'); // Debugging statement
  return '';
};

export default function Header({ setNotes, setPopup }) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [isGarbageHovered, setIsGarbageHovered] = useState(false);
  const [loading, setLoading] = useState(false); // Add a loading state
  const router = useRouter(); // Initialize useRouter for navigation

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
    setLoading(true);
    const token = getTokenFromCookies();
  
    if (!token) {
      console.error('Token is missing');
      setPopup({ open: true, message: 'Token is missing', backgroundColor: 'red' });
      setLoading(false);
      return;
    }
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    try {
      if (isEdit) {
        const res = await fetch(`/api/notes/${selectedNote.id}`, {
          method: 'PUT',
          headers,
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
          console.error('Failed to update note:', res.status);
        }
      } else {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers,
          body: JSON.stringify(newNote),
        });
  
        if (res.ok) {
          const addedNote = await res.json();
          setNotes((prevNotes) => [addedNote, ...prevNotes]);
          setPopup({ open: true, message: 'Note pasted successfully', backgroundColor: 'green' });
          handleClose();
        } else {
          console.error('Failed to save note:', res.status);
        }
      }
    } catch (error) {
      console.error('Error during save operation:', error);
    } finally {
      setLoading(false);
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // Remove JWT token from cookies
        document.cookie = 'jwt=; Path=/; Max-Age=0';
        // Redirect to the home page after successful logout
        router.push('/');
        setPopup({ open: true, message: 'Logged out successfully', backgroundColor: 'green' });
      } else {
        setPopup({ open: true, message: 'Failed to log out', backgroundColor: 'red' });
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
      setPopup({ open: true, message: 'An error occurred during logout', backgroundColor: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="blurred-background">
          <Loader />
        </div>
      )}
      {!loading && (
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

            {/* Logout button */}
            <button
              className="text-sm pt-1 text-[#D1D7E0] animate__animated animate__fadeIn hover:text-neutral-100"
              onClick={handleLogout}
            >
              Logout?
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
      )}

      {!loading && (
        <>
          <hr className="w-full border-t-2 border-gray-400 my-4" />

          <Modal
            open={open}
            handleClose={handleClose}
            setNewNote={setNewNote}
            handleSave={handleSave}
            note={newNote}
            isEdit={isEdit}
          />
        </>
      )}
    </div>
  );
}
