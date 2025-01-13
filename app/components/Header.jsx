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

export default function Header({ setNotes, setPopup }) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [isGarbageHovered, setIsGarbageHovered] = useState(false);
  const [loading, setLoading] = useState(false); // General loading state for saving notes
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New state for logout loading
  const [isAutomaticLogout, setIsAutomaticLogout] = useState(false); // Track automatic logout state
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
    setLoading(true); // Set loading for saving notes
    const token = getTokenFromCookies();

    if (!token) {
      // Token missing or invalid
      setPopup({ open: true, message: 'Token is missing or expired. Logging out...', backgroundColor: 'red' });
      logout(true); // Pass `true` to indicate automatic logout
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
          // Handle unauthorized status (token expired or invalid)
          if (res.status === 401) {
            setPopup({ open: true, message: 'Session expired. Please log in again.', backgroundColor: 'red' });
            logout(true); // Call with `true` for automatic logout
          } else {
            setPopup({ open: true, message: 'Failed to update note.', backgroundColor: 'red' });
          }
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
          // Handle unauthorized status (token expired or invalid)
          if (res.status === 401) {
            setPopup({ open: true, message: 'Session expired. Please log in again.', backgroundColor: 'red' });
            logout(true); // Call with `true` for automatic logout
          } else {
            setPopup({ open: true, message: 'Failed to save note.', backgroundColor: 'red' });
          }
        }
      }
    } catch (error) {
      // Gracefully handle expected errors without logging to the console
      console.log('Error during save operation:', error);  // Only log if necessary
      setPopup({ open: true, message: 'An error occurred while saving the note.', backgroundColor: 'red' });
    } finally {
      setLoading(false); // Reset loading state after saving note
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

  const handleLogout = async (isAutomatic = false) => {
    setIsLoggingOut(true); // Set loading to true when logging out
    setIsAutomaticLogout(isAutomatic); // Track if logout is automatic

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
        if (!isAutomatic) {
        }
      } else {
        setPopup({ open: true, message: 'Failed to log out', backgroundColor: 'red' });
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
      setPopup({ open: true, message: 'An error occurred during logout', backgroundColor: 'red' });
    } finally {
      setIsLoggingOut(false); // Set loading back to false after logout process completes
    }
  };

  const logout = (isAutomatic = false) => {
    // Log the user out automatically if the token is missing or invalid
    handleLogout(isAutomatic); // Call the logout function that removes the cookie and redirects
  };

  return (
    <div className="w-full">
      {/* Show loader only when logging out */}
      {isLoggingOut && <Loader />}

      {!isLoggingOut && (
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
              onClick={() => handleLogout(false)} // Pass false to indicate manual logout
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
